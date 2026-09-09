---
title: Building efficient verifiers
path: building-efficient-verifiers
description: How to efficiently encode program logic into SMT
date: 2026-9-9
---

## How to efficiently encode program logic into SMT
This is a bloggified version of my last Monday talk at [Trustworthy Systems](https://trustworthy.systems/).

What is a `Monday talk` you might ask, well Gernot cares deeply about building the skills of his students and employees,
this doesn't extend to just technical skills but also soft skills.

These Monday talks are a way to increase the ability of technical nerds like to me to present to a competent but general computer science
educated public. This is what one would do if they were representing a seL4 project at a conference, so it has more uses than just 
personal development.

## A bit about me
I worked on [Verus](https://github.com/verus-lang/verus) and then later on, I worked on [Gordian](https://github.com/au-ts/gordian).
During both projects, I gained some insight on how to best encode program logic in a way that was more easily dealt by a SMT solver.
Some of this insight was gained through mistakes we made during the development of Gordian and through the experiences using [Dafny](https://dafny.org/).

## What are SMT solvers?
SMT solvers are fundementally just a set of "theories" implemented on top of a SAT solver to offer automation
of more expressive formulas than just boolean logic.

These formulas are represented in first order logic, you can obviously restrict yourself to just propositional logic (more on that later).
But SMT solvers are interesting because they have use in formal verification, program synthesis, optimisation problems and more.

## Why is thought about encoding important?
When you initially approach the problem of encoding program logic in SMT, you maybe tempted to reach for the hammer
and brute force yourself a solution that at least looks correct logically, the issue you will run into may not be
"Is my encoding correct?" first but rather "Why is my program verification so damn slow?"

The unfortunate truth is that designing SMT frontends is more of an art than a science.
Performance is dependent on many variables such as:
  * The solver in use (Z3, CVC5, YICES and many many more).
  * Solver version (yes going from 4.0.3 to 4.0.4 may render your proof unworkable to the solver).
  * Hardware
  * Theories used

The sad part is that in order for you to truly understand the best encoding, you must understand the solver you are targetting.
When I worked on Verus, we explictly targetted Z3, when I worked on Gordian we had much better performance using CVC5 if I remember correctly.

In my opinion, I would say the landscape demonstrated a high degree of correlation between successful tools and 
relationships with Microsoft/Z3.

## Warning
These are at the end of the day, my person experiences working with Z3.
Like any opinion, they are almost certainly not universally applicable.


## Key Ideas
 * Be careful about theory combination.
 * Avoid non-linear arithemtic.
 * Be careful with BitVectors.
 * Handle quantifiers with care.
 * Keep your encoding simple and precise.
 * When in doubt, look at what others have done.

## What impacts SMT performance?

### Theory combination
As I previously briefly mentioned, an SMT solver allows for a set of theories that sit on top of the foundational SAT layer,
these theories may be for example: integers, arrays, bitvectos, quantifiers and more. 

The issue here is that theory combination is not some graceful process that takes deep care on how each theory is implemented.
These solvers rely upon abstract methods/frameworks to perform theory combination, including relying upon the underlying SAT engine
to infer information about theory combination. 

If we go back to what I stated previously that we should keep the underlying formulas simple and **precise**, I hope you can see
how this theory combination violates that principle. 

This is infact a key reason why to the two theories of BitVectors and Arrays perform so differently on solvers.

### Non-linear arithmetic
This is a source of incompleteness (if you remember [Godel's incompleteness theorem](https://www.youtube.com/watch?v=O4ndIDcDSGc), 
this is due to the fact that the decision procedure for NLA on integers is undecidable.
As I mentioned before, theory combination plays a particularly nasty part here, making debugging much much harder.

The reason that this theory is costly is because SMT solvers typically tend to have decision procedures that
attempt to solve these theories through brute force. An example is a technique known as bit blasting,
this if not bounded somehow via assertions can result in the solver attempting to search the entire (infinite) search space.

As mentioned before, one technique that may help you when you encounter NLA is to throw known bounds into your the domain of your integers.

For example, if the program guarantees that `x` and `y` are between 0 and 100, include those bounds in SMT-LIB:

```smtlib
(set-logic QF_NIA)
(declare-const x Int)
(declare-const y Int)
(assert (= (* x y) 42)) ; Multiplying two variables is non-linear.
(assert (and (<= 0 x) (<= x 100) (<= 0 y) (<= y 100)))
(check-sat) ; sat
```

### BitVectors
The theory of BitVectors are sometimes used to represent finite domain integers that lie upon a contiguous space,
conceptually you can think of BitVectos in the same way that you think about n-bit words on a computer.

The issue with BitVectors is that Z3 handles the translation from BV to SAT through bit blasting, an incredibly expensive
process since it turns a n-bit word to n booleans. 

So you might think that it may be the case that you should avoid BitVectors altogether, but this is not the case!
The reason is because certain operations such as all the bitwise operators, division and modulo are only available to BV.
How do we get the advantages of integer theory but still encode bitwise operators?
The solution is simple and that is to use the two theories in unison.

We can achieve this through the use of uninterpreted functions in SMT theory.
These are functions that are as the name suggests, uninterpreted and have no body, you can only derive facts from them.
This is best demonstrated through an example.

Say we want to prove that `1 | 0 == 1` for 32-bit integers. We can prove this in BV land,
then use what we learnt as a fact about our uninterpreted function in integer land:

```smtlib
(declare-fun bitwise-or (Int Int) Int)

; Prove the bitwise fact by checking its negation.
(push 1)
(define-fun a () (_ BitVec 32) (_ bv1 32))
(define-fun b () (_ BitVec 32) (_ bv0 32))
(assert (not (= (bvor a b) (_ bv1 32))))
(check-sat) ; unsat: the bitwise fact holds.
(pop 1)

; After the proof succeeds, the frontend adds the fact in integer land.
(assert (= (bitwise-or 1 0) 1))

; Use that fact in an integer arithmetic proof.
(push 1)
(assert (not (= (+ (bitwise-or 1 0) 1) 2)))
(check-sat) ; unsat
(pop 1)
```

Once Z3 gives us `unsat` for the first query, our frontend can add the fact about `bitwise-or` to the integer proof.
We have done the bitwise work in BV land, so the rest of the proof can just use what we learnt.

Here we are using `bitwise-or` to stand for unsigned 32-bit OR. If we needed any assumptions to prove the BV part,
we would also need those assumptions in integer land when we use the result.

One thing that a keen reader might wonder would be how commutativty works when you write these bitvector lemmas,
the answer is simple, it doesn't! 
This technique as shown here is obviously restrictive but in practice it works well enough for most programs.
At the end of the day, choosing your encoding is really all just a matter of how to encode in such a way that it is general enough
while being performant.

This however does put "creative burden" on the proof engineer, typically something only interactive theorem provers do.

### Quantifiers
Quantifiers are helpful and **needed** to express most non-trivial proofs, especially over an infinite domain for example.
But this is also a great way to introduce incompleteness.

Quantifier instantiation is done via syntactic pattern matching, this means if the solver or the proof engineer
chooses a bad trigger, it may not instantiate at all or worse could trigger other quanitfiers in a loop.

Even when the underlying quantified problem is decidable, a poor choice of triggers can prevent the solver from finding the proof.

```rust
proof fn trigger_forever()
    requires
        forall|x: nat, y: nat| f(x + 1, 2 * y)
            && f(2 * x, y + x) || f(y, x)
                ==> #[trigger] f(x, y),
    ensures
        forall|x: nat, y: nat| x > 2318 && y < 100
            ==> f(x, y),
{
}
```

Nothing will prevent you from shooting yourself in the foot here, but we can at least avoid having to manually specify most triggers.
My advice is to **always** require triggers at the most abstract level of your specification. Your frontend should infer them
at the highest level of abstraction it can, while it still has the structure of the specification to work with.

SMT solvers can infer triggers, but by that point they are working with the lower level encoding of your program.
As I mentioned before, we want to keep our encoding **precise**, and making these decisions after we have lost that higher level structure
works against that. Choosing triggers earlier gives us more control over when we want our quantifiers to instantiate.

You should also provide profiling tooling that can analyse SMT logs and help debug these "matching loops".
When a proof starts triggering quantifiers in a loop, the proof engineer needs a way to see which instantiations are causing it
and which triggers to look at.
Use this [tool](https://github.com/isubasinghe/smt-profiler) I ripped off Verus.
