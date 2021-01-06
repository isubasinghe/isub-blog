---
title: A Scheme Interpreter in Haskell
path: interpreter
description: A barebones scheme interpreter in haskell, which run on browsers thanks to some hacky code
date: null
---
## A simple scheme interpreter in Haskell

### Try it out below (its sort of incomplete at the moment however)
Try out 
```scheme
(define (factorial x) (if (= x 1) 1 (* x (factorial (- x 1)))))
(factorial 10)
```
<Interpreter>
</Interpreter>

#### How was this achieved?
This was fairly simple to achieve actually, thanks to the insane amount of work being put into the WASM ecosystem 
(binaryen) and the engineering at [Tweag I/O](https://www.tweag.io/)


The source code for this interpreter is actually in **Haskell**.
The parser is implemented through [Megaparsec](https://hackage.haskell.org/package/megaparsec)
The grammar is quite easy to parse since it is LL(1), this means no backtracking and as a result parsing is O(n).

The evaluation is done in almost the same way as the book [Write Yourself a Scheme in 48 Hours](https://en.wikibooks.org/wiki/Write_Yourself_a_Scheme_in_48_Hours)
but with some increases in efficiency, that is I am using `containers` for `Data.Map` and `text` for `Data.Text`

I compiled this with [Asterius](https://github.com/tweag/asterius). 
This wasn't a completely easy migration, however. I was using stack with hpack instead of cabal by itself.
This means that I have a cabal file that I can look at and copy. The reason it wasnt completely seamless was because I had some additional configuration to do
in my wasm build. 


#### Caveats
* The pattern matching my Haskell code isn't exhaustive, so you may run into a run time exception. I will fix this later.
* No supports for doubles atm, however it is trivial to implement.


#### Future Plans
I have picked up the book `Scheme 9 from Empty Space` and `The Garbage Collection Handbook: The Art of Automatic Memory Management`, so I am interested 
in writing a Scheme 9 interpreter with a more complex garbage collector (which could also run on the web, thanks to emscripten). Something that interests me at the moment is 
low latency garbage collection (this typically means low throughput, which in my opinion is not as big of a problem).