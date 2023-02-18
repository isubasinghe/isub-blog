---
title: Writing a microkernel in Rust - Part 1
path: writing-microkernel-p1
description: 
date: 2023-2-18
---

# Writing a microkernel in Rust: Part 1

## Introduction
While there are many tutorials on building operating systems, there are none on building microkernels. 
This is somewhat of an ambitious attempt to fill that gap. We will implement a simple microkernel with extremely fast IPC, not being 
shy to resort to assembly code if we must. The platform we will be targetting is the RISC-V virt platform on QEMU. RISC-V and a virtual platform should keep things simple enough for us. If we get time, we can also cover
porting this code to support other platforms as well. 


## RISC-V Linker Relaxation
Please read more about this [here](https://www.sifive.com/blog/all-aboard-part-3-linker-relaxation-in-riscv-toolchain). We will disable this by 
the following code, we also set the global pointer to something we defined in our [linker](https://github.com/isubasinghe/ukernel/tree/main/src/lds/virt.ld):
```asm 
; boot.S file
.option push
.option norelax
	la		gp, _global_pointer
.option pop
```

## Starting up our HART
In RISC-V cores are referred to as HART, in our boot file we will setup HART 0 and put the rest of the HARTs to sleep.
```asm 
# SATP should be zero, but let's make sure. Each HART has its own
# SATP register.
csrw	satp, zero # Any hardware threads (hart) that are not bootstrapping
# need to wait for an IPI
csrr	t0, mhartid
bnez	t0, 4f 
```

## Resources 
  * https://riscv.org/technical/specifications/
  * https://www.lurklurk.org/linkers/linkers.html
  * https://github.com/isubasinghe/ukernel
