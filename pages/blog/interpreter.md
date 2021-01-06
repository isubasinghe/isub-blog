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