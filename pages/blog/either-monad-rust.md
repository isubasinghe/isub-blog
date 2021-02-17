---
title: Either Monad in Rust
path: either-monad-rust
description: Either Monad in Rust
date: null
---

## Implementing the Either monad in Rust
I've started to really enjoy writing Rust, I think having an advanced enough type system really helps mitigate errors and 
helps ensure that code is correct. I love Haskell for this exact reason, I truly believe that it helps developers ensure that code is correct. 

<hr /> 

Out of curiousity, I wanted to know If I could have something like the Either monad in Rust, turns out that I can!. 
The idea behind this is based off something called <a href="https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf"> Lightweight Higher Kinded Types</a> , I will possibly talk about this sometime later as I expand on this post. 
Additionally please visit <a href="https://github.com/JasonShin/fp-core.rs"> fp-core.rs </a> for more information.
It is about 2am right now, so I want to get the code out of the way ASAP. 

<hr />
And here you have it, the Either monad. 

```rust
pub trait HKT<A, B> {
    type URI;
    type Target;
}
```

```rust
pub trait Functor<A, B>: HKT<A, B> {
    fn fmap<F>(self, f: F) -> <Self as HKT<A, B>>::Target
        where F: FnOnce(A) -> B;
}
```

```rust
pub trait Chain<A, B>: HKT<A, B> {
    fn chain<F>(self, f: F) -> <Self as HKT<A, B>>::Target
        where F: FnOnce(A) -> <Self as HKT<A, B>>::Target;
}
```

```rust
pub trait HKT3<A, B, C> {
    type Target2;
}
```

```rust
trait Apply<A, F, B> : Functor<A, B> + HKT3<A, F, B>
    where F: FnOnce(A) -> B,
{
    fn ap(self, f: <Self as HKT3<A, F, B>>::Target2) -> 
        <Self as HKT<A, B>>::Target;
}
```

```rust

trait Pure<A>: HKT<A, A> {
    fn of(self) -> <Self as HKT<A, A>>::Target;
}
```

<hr />
Here is the actual data structure for our Either monad
<hr />

```rust
pub enum Either<L, R> {
    Left(L), 
    Right(R)
}
```

<hr />
And now for the implementation 
<hr />


```rust
impl<L, R> Either<L, R> {

    fn unwrap(self) -> R {
        match self {
            Either::Left(l) => panic!("left value"),
            Either::Right(r) => r
        }
    }
}

impl <C, A, B> HKT<A, B> for Either<C, A> {
    type URI = Self;
    type Target = Either<C, B>;
}

impl <C, A, B> Functor<A, B> for Either<C, A> {
    fn fmap<F>(self, f: F) -> <Self as HKT<A, B>>::Target
        where F: FnOnce(A) -> B {
            match self {
                Either::Left(x) => Either::Left(x), 
                Either::Right(x) => Either::Right(f(x))
            }
        }
}

impl<C, A, B> Chain<A, B> for Either<C, A> {
    fn chain<F>(self, f: F) -> Self::Target
        where F: FnOnce(A) -> <Self as HKT<A, B>>::Target {
            match self {
                Either::Left(x) => Either::Left(x), 
                Either::Right(x) => f(x)
            }
    }
}

impl <D, A, B, C> HKT3<A, B, C> for Either<D, A> {
    type Target2 = Either<D, B>;
}

impl<C, A, F, B> Apply<A, F, B> for Either<C, A>
    where F: FnOnce(A) -> B,
{
    fn ap(self, f: Self::Target2) -> Self::Target {
        
        match self {
            Either::Left(l) => Either::Left(l), 
            Either::Right(r) => f.fmap(|z| z(r))
        }
    }
}
```