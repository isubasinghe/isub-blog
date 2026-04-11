---
title: Why not OOP?
path: why-not-oop
description: Why OOP has a lot of problems
date: 2021-4-3
---

## TL;DR 
Languages like Java/C# leave little for the compiler to prove regarding the "well-definedness" of a program, this in turn leaves 
the programmer to dynamically verify more properties of their code, I would also like to argue that current OOP languages worsen the challenges of this task by the programmer. 
OOP doesn't necessarily have to be bad, I think that these issues can be fixed by a more restricitve type system. 

**WARNING**

This is a bit of a rambling, **please feel free to ignore**, I don't think 
I have captured my thoughts elegantly. This could also be due to my experiences with existing Java codebases at Government, which has really put a bad taste in my mouth. 
I have heard good things about other OOP languages, such as Common Lisp (CLOS), so this may very well be Java centric. 

## Why not OOP?

I understand that this a very controversial opinion but hear me out, maybe I am
wrong regarding this. But these are my personal frustrations with OOP and my
personal experiences with OOP. Perhaps I am entirely wrong on this, perhaps I am
blaming OOP where I should really be blaming Programmers.

Important thing to note here: When I am talking about OOP I'm really talking
about the popular implementations of OOP like Java/C# and not Smalltalk.

Another note: I may be wrong about C#, I have made an assumption here that it is
essentially Java with nicer syntax, based upon the comments I have heard from
developers.


### What is dataflow?

Your program at a very abstract level, is something that takes in data and
outputs data. By dataflow I am talking about the steps data takes from the
moment it enters a program to the moment it leaves the program. It is
essentially how data flows through the control flow graph (CFG) of your program.

This is important to note, because my reasons for disliking OOP largely revolve
around dataflow.

### Why not OOP?

Object Oriented Programming revolves around how to structure entities. functions
that change these entities are bundled together with the entity but they really
are <a href="https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html" target="_blank" rel="noreferrer noopener">second class citizens.</a>

But the important thing to note here is that how you structure **entities**
**isn't** really **the hardest problem** in programming, in fact in my
experience it has almost always been the easiest thing to do, but it may well be
that I have not worked in a complex enough codebase yet.

#### What is the hard problem in software engineering?

In my opinion the hardest problem in software engineering is managing your
control flow graph from getting too complex. This is important because it is the
biggest thing that impacts readability. If your data jumps too much around your
CFG, then your code likely is hard to understand. The tools that OOP provide,
help with abstraction at the cost of your CFG complexity. With OOP you usually
have references to the objects you want to mutate, this means your CFG
can look incredibly complex, it is essentialy a denser graph than what it could
have been with FP for example.

#### Mutable state 

OOP as it is presented in languages today such as Java and C# encourage too much
mutable state, mutable state can get increasingly hard to manage. I think this
is especially true when concurrent mutation of state is introduced, it becomes
incredibly hard to juggle all the possible state mutations in your head. 

Let's talk about concurrent modification and verifying that code is free of memory errors. 
Here a programmer needs to keep track of every variable that is capable of being modified if they want to **gurantee** that code is free of memory errors, in a complex 
CFG, the programmer might need to keep track of an exponentially growing number of variable states, this has been my biggest problem 
with working on OOP codebases. I have often encountered complex CFGs, since there is no way to know if a variable will be modified later on in the code or not, every single variable under every 
single object reachable from some starting point needs to be tracked to ensure they are not concurrently modified. I quickly run out of the capability to keep to track of such a large state space. 
This hasn't generally been a problem in procedural languages for me, since the state space usually doesn't grow at such a rapid pace and I generally can keep track of all the variables that I need to. 

There are better solutions to concurrent modification that I think are more simple. 
Haskell for example with STM really shines here, Rust as well, excels here, both present
excellent solutions for our problem. Once again this can be
blamed on the programmer, but a good paradigm should stop yourself from shooting
yourself in the foot.

#### OOP doesn't necessarily need to be bad.

This may be surprising given that I have wrote quite a bit on how OOP is awful
and you should never use it. I don't think OOP necessarily forces bad code, I
simply think that the current popular implementations of OOP are bad. In my
opinion something like Smalltalk is still better in some ways than Java/C#, ~~in
fact the inventor of OOP, Alan Kay stated that the big idea with OOP is message passing,~~(Hillel Wayne refutes that Kay made this claim) something both languages don't really focus on.

Besides this, I don't believe that there can't exist an OOP language that avoids
some of the issues that I have talked about above. I personally think a more
expressive type system is the key to a good modern OOP language.

Rust is one language that solved the problem C/C++ has through an advanced type
system, I genuinely think that an advanced type system could also solve the
issues that I have outlined above.

I really like <a href="https://adam.nels.onl/blog/an-oo-languge-for-the-20s/" target="_blank" rel="noreferrer noopener">this</a>.
What Adam argues for makes sense, I do really love some of his points. I think
for me the most important features are:

- No nulls
- No unsafe casts
- Generics
- Immutability by default
- No exceptions
- Pattern matching

What is better than OOP?

Procedural Programming has its own problems but OOP isn't immune from these
issues either, this is why in my opinion Procedural Programming can be better
than OOP, simply because it reduces the amount of issues a language has.

Functional Programming can be better than both Procedural Programming and OOP in
my opinion simply because it controls very explicitly the complexity of your
control flow graph. Your data flows through the CFG in a very linear fashion. 
It isn't perfect, it can be awkward or even impossible to model some
imperative datastructures here, and even when there are escape hatches, they are
often awkward to use.

#### Conclusion

I hope everyone was able to agree or disagree without too much frustration or
anger and that this is somewhat easy to understand but I don't entirely think
I've organised my thoughts very well. 

Please check the resources section below, I think these authors have outlined
these issues better than I have.

#### Resources

- <a href="https://dpc.pw/the-faster-you-unlearn-oop-the-better-for-you-and-your-software" target="_blank" rel="noreferrer noopener">https://dpc.pw/the-faster-you-unlearn-oop-the-better-for-you-and-your-software</a>
- <a href="https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html" target="_blank" rel="noreferrer noopener">https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html</a>
- <a href="https://adam.nels.onl/blog/an-oo-languge-for-the-20s/" target="_blank" rel="noreferrer noopener">https://adam.nels.onl/blog/an-oo-languge-for-the-20s/</a>
