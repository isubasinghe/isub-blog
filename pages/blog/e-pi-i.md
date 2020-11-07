---
title: Proof of e^(pi*i) = -1
path: e-pi-i
description: A simple proof to prove that the eulers number to the power of (pi * sqrt(-1) = -1)
date: null
---
## A simple proof that e^(pi*i) = -1

#### I'll be honest, I only wrote this to test how well KaTex works
But  this proof is quite neat, its something I learnt in high school and has stuck with me since. 

<p/>

I remember being curious as to how three numbers, Euler's number, pi and i, two which are transcendental and one being imaginary
could give -1.

```latex
Proof\enspace of\enspace{e}^{\pi*i} = -1
\\
z=\cos{\theta} + i*\sin{\theta}
\\
\frac{dz}{d\theta}=-\sin{\theta} + i*\cos{\theta}
\\
\frac{dz}{d\theta}=i(i*\sin{\theta} + \cos{\theta})
\\
\frac{dz}{d\theta}=i*z
\\
\int{\frac{1}{z}}{dz} = \int{i*\theta}{d\theta}
\\
\log_e{z}=i*\theta + c
\\
e^{i*\theta + c} = z
\\
z=\cos{\theta} + i*\sin{\theta}
\\
When\enspace \theta=0 \enspace z=1 \enspace so \enspace the \enspace constant \enspace is \enspace 0
\\
\dot{.\hspace{.075in}.}\hspace{.5in} e^{i*\theta} = z
\\
\dot{.\hspace{.075in}.}\hspace{.5in} \cos{\theta} + i*\sin{\theta}=e^{i*\theta}
\\
When \enspace \theta=\pi
\\
-1 + i*0 = e^{i*\pi}
\\
e^{i*\pi} = -1 
```

#### Opinions on KaTex
It is pretty mediocre, I think perhaps compiling my LaTex into a png
might have been a better idea. 
KaTex misses a lot of functions, and of course, you cannot import any existing LaTex packages.

<p />

Initially, I was thinking of doing a post on Lattices and ordering but I was limited by KaTex. 

<p />
Perhaps this post will come eventually still. I am interested in writing about compiler optimisations (data flow analysis) and concensus algorithms, 
both of which rely on lattices. I largely want to do this to improve my own confidence on these two topics. 