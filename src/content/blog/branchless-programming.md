---
title: Branchless Programming
path: branchless-programming
description: A quick introduction to branchless programming
date: 2021-3-5
---

## A quick introduction to branchless programming

**Note:** Modern compiler's are quite smart, it is likely this technique might
reduce performance. In order to ensure performance, please use a tool to view
your assembly output and compare the performance of a naive version and the
optimised version.

### What is branchless programming?

Branchless programming is the art of writing programs that minimise the use of
`jmp` instructions.

### Why is this important?

Modern CPUs follow a pipeline architecture. Meaning that it can run a sequence
of instructions simultaneously. The CPU will not know what instruction to
execute following a jump instruction. There are mitigations to this issue,
namely branch predictors but if the prediction is wrong all the work done is
discarded, this is obvisouly bad for performance, since we need to start over
again.

Have a look <a href="https://stackoverflow.com/questions/9820319/why-is-a-cpu-branch-instruction-slow" target="_blank" rel="noreferrer noopener">here</a>
for more information.

If we directly map if statements to assembly, we see `jmp` statements, it isn't
just if statements that cause `jmp` statements to be used, but they are the most
frequent. Here is a small example.

**Note**: Instead of mapping into `x86`, I decided to make up a tiny instruction
set as I think this should make it more obvious.

#### C

```c
if(x >= 0) {
    do_something();
}
```

#### Assembler

Small note, this is a made up assembly language.

Assume the variable `x` is loaded to register `r0` and the constant 0 is loaded
to register `r1`.

The instruction `geq` is used in this format `geq <src> <v1> <v2>`.

The instruction `jmp_true` is used in this format `jmp_true <register> <label>`.

```nasm

; Comparision happens here
geq r2 r0 r1
jmp_true r2 .false_condition

; True Condition starts here
call do_something

; False Condition
.false_condition

```

There are two cases that I believe make use of branchless programming.

- Cryptography (I am not entirely sure about this)
- High performance code

#### Cryptography

The claims I have seen online are that branchless code prevent information
leaks. This makes sense as information is leaked through timing attacks. I did
find <a target="_blank" rel="noreferrer noopener" href="https://crypto.stackexchange.com/questions/30630/branchless-aes-implementation">this.</a>
What they have written about makes sense, please note however that this is AES
specific, I did not know this before now but apparently the AES instruction set
increases the resistance to side channel attacks, I would imagine other
cryptographic protocols are maybe more vulnerable to side channel attacks, so
branchless programming would likely be criticial there.

### A tiny (inefficient) example

I can't think of a better example than what whatsacreel (linked below) has. I
think that example is small and shows branchless programming minimalistically.

#### Branched version

```c
int min(int a, int b) {
    return a < b ? a : b;
}
```

#### Branchless version

```c
int min(int a, int b) {
    return a*(a<b) + b*(b<=a);
}
```

**Note:** More examples are available <a target="_blank" rel="noreferrer noopener" href="https://hbfs.wordpress.com/2008/08/05/branchless-equivalents-of-simple-functions/">here.</a>

### Resources

- <a target="_blank" rel="noreferrer noopener" href="https://www.agner.org/optimize/">Agner
  Fog</a>
- <a target="_blank" rel="noreferrer noopener" href="https://www.youtube.com/watch?v=bVJ-mWWL7cE">What's
  a Creel</a>
- <a target="_blank" rel="noreferrer noopener" href="https://stackoverflow.com/questions/9820319/why-is-a-cpu-branch-instruction-slow">Stackoverflow -
  Why is a CPU branch slow </a>
- <a target="_blank" rel="noreferrer noopener" href="https://johnysswlab.com/how-branches-influence-the-performance-of-your-code-and-what-can-you-do-about-it/">Johny's
  Software Lab - How branches influence the performance of your code and what
  can you do about it?</a>
- <a target="_blank" rel="noreferrer noopener" href="https://www.bfilipek.com/2017/05/curius-case-of-branch-performance.html#summary">Bartek's
  coding blog - Curious case of branch performance </a>
- <a target="_blank" rel="noreferrer noopener" href="https://hbfs.wordpress.com/2008/08/05/branchless-equivalents-of-simple-functions/">Harder,
  Better, Faster, Stronger - Branchless Equivalents of Simple Functions</a>
