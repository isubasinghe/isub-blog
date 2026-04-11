---
title: Fast intercore IPC - Part 1
path: fast-intercore-ipc-part-1
description: Discovery how the L4 fast IPC works
date: 2022-6-26
---

# Fast Intercore IPC (L4 style IPC) - Part 1

`Note that this article has not been written yet but I thought that it was good to at least put the resources out there. I will update this when my exams are done :)`

## Introduction to Microkernels
Most likely you are reading this off your Linux/OSX/Windows device, these OSes use monolithic kernels under the hood(yes I am aware people claim OSX is "hybrid" since it was based on Mach), in these systems 
the various drivers and memory management is part of the kernel. Microkernels are quite different from this approach, they delegate most of the functionality to user space processes, in fact the Microkernel mantra is"if it can be done in user space, it should be done in user space". 

As you can imagine, the microkernel approach can require a lot more IPC calls than the traditional monolithic approach as a result, this means that if IPC is slow the entire system will also be slow as a result. When the Mach microkernel was released, it unfortunately set back the interest in microkernels as a result of its subpar performance characteristics, and it is one likely reason as to why we don't see any major operating systems using microkernels.
While there was significant effort to fix the performance issues, the most notable effort was by Jochen Liedtke 

## Register based trasnfer
TODO

## Direct Transfer by Temporary Mapping 
TODO


### Further Improvement 
As you can see, the TLB introduces a lot of headaches for us when performing direct transfer as described above. 
There is a better solution to this problem than what L4 introduces in my opinion. Given that we perform TLB flushes 


## References 
  * [Improving IPC by kernel design](https://dl.acm.org/doi/pdf/10.1145/168619.168633)
  * [L4 Microkernels: The Lessons from 20 Years of Research and Deployment](https://trustworthy.systems/publications/nicta_full_text/8988.pdf)
