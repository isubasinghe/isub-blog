---
title: Lets Prove Leftpad in Lean
path: lets-prove-leftpad-lean
description: Proving the notorious leftpad algorithm in the Lean theorem prover
date: 2023-9-11
---

# What is leftpad?
Leftpad is a trivial algorithm that does exactly what it's name suggests, 
it pads a string by n characters. The function signature for this would be:

## Haskell
```haskell
leftpad :: String -> Char -> Int -> String
```
## C
```c
char *leftpad(char *s, char c, int n);
```

## Rust
```rust
fn (leftpad: String, c: char, n: u64) -> String 
```

For example `leftpad("Hello", 'a', 4)` would result in the string `aaaaHello`.

# What is Lean?
Lean is a theorem prover and also a functional language, this means that you 
can write code that can be proved to adhere to some specification. With Lean, 
you don't _need_ to test your code, **you can prove it**. 

Proofs are a much stronger guarantee of correctness than testing, to quote Edsger Dijkstra,
"Program testing can be used to show the presence of bugs, but never to show their
absence!". 

# Setting up Lean
You can use [elan](https://github.com/leanprover/elan) to download and setup Lean.
Elan is like a `rustup` or `ghcup` tool for Lean.

Details on this will be omitted for brevity, but they are available on GitHub.

# Starting a new lean project
After the install of elan, you should have the `lake` command available, 
you can use this to create a new Lean project. You can think of the `lake` tool 
like `cargo` or `stack`, it will allow us to build and create new Lean projects.

Enter the command `lake new leftpad` to get a Project created.

# Setting up your editor
A crucial aspect of interactive theorem provers is that they are actually interactive!!
Lean will not be interactive until you setup your editor, the easiest way to do this 
is to use the VSCode extension for Lean, alternatively have a look at my nvim config 
[here](https://github.com/isubasinghe/dotfiles).


# The Algorithm
We are going to be a bit more generic here, and allow for the padding of a generic List instead of Strings.

```lean
def leftpad (l: List α) (a: α) (n: Nat) : List α := (List.replicate n a) ++ l
```

## Writing the Spec
To write the specification for this leftpad algorithm we should ask ourselves `what does it mean for the leftpad algorithm to be correct?`. 
The way I came to think about this specification is to look at the structure of the return value, in this structure there are two strings.
One string is the repeated value and the other is the original string, this means that if we drop the n values, we should get the original string
and if we take the first n values we should get only the repeated values. These two together gives us the correctness condition for the leftpad
algorithm.


### Drop Function
```lean
def drop (l: List α) (n: Nat): Option (List α) := 
  if n == 0 then 
    some l 
  else 
    match l with 
    | [] => none 
    | _::xs => drop xs (n-1)
```


### Proving that dropping the padded characters results in the original string
```lean
theorem drop_leftpad_eq_orig (l: List α) (a: α) (n: Nat): drop (leftpad l a n) n = l := by
  induction n with
  | zero => 
    simp
    rw [leftpad]
    simp
    unfold drop
    simp
  | succ z iz => 
    rw [<-Nat.add_one]
    rw [<-iz]
    rfl
```
g### Proving that the n values are all replicated padding characters
```lean
theorem drop_leftpad_eq_orig (l: List α) (a: α) (n: Nat): drop (leftpad l a n) n = l := by
  induction n with
  | zero => 
    simp
    rw [leftpad]
    simp
    unfold drop
    simp
  | succ z iz => 
    rw [<-Nat.add_one]
    rw [<-iz]
    rfl
```

### How do we know that these two functions adequately capture the 'specification' of leftpad?
Generally we cannot do such a thing, coming up with the 'correct' specification requires some
human creativity. 
This also means that there is still a possibility of error, an incorrect
'specification' will lead to a proof of an irrelevant program.

Proofs help us add trustworthiness between the specification and the program at play.

It's important to note that this notion of specification is also captured in testing,
albeit less precisely, meaning that verification is **strictly** better than testing.

