---
title: Learning Paxos
path: learning-paxos
description: Learning Paxos through simpler principles
date: 2021-4-30
---

## Learning Paxos through simpler principles

When I started getting into distributed systems, I was first interested on consensus algorithms, namely Raft. 
I had heard of Paxos but was quite intimidated by the difficulty of the algorithm, even John Ousterhour, Diego Ongaro's supervisor for 
the Raft consensus algorithm at Stanford had a hard time understanding it for a while. 

But I think I understand Paxos now, and I wanted to write a post how I came to understand this algorithm. 
What really helped for me here, was my understanding of Raft and Total Order Multicast/Broadcast. I want to demonstrate that this incredibly 
difficult algorithm can be understood with some effort if one delves into the problem and understands the problem at its core, then we can draw 
parallels from Raft and TO-multicast to help understand Paxos. 

### Before we start
You can skip this section, but I think its important to note some important thing about distributed systems before I start.

#### The Impossibility Result
Consensus in an asynchronous system with one process failure is impossible. I may cover the FLP some other time but tbh there are so many great tutorials out there, have a look at them, I will link
them below. The crux of why its impossible boils down to the fact that it is impossible to distinguish a failed process from a really slow process. 


### Multicast/Broadcast
Multicast is quite simple, it is essentially the act of sending a message to a group of processes. Broadcast is a more specific version of a multicast, where there is simply only one 
group and every process in the system belongs to this group. 

#### Types of multicast/broadcast
  * FIFO Ordered {multicast, broadcast}
  * Causal Ordered {multicast, broadcast}
  * Total Ordered {multicast, broadcast}

We only need to look at totally ordered messages for now. I will be referring to the general multicast instead of writing {multicast, broadcast} everytime. 

#### Total Order Multicast
Total Order Multicast is quite simple, it just means that if a message m was delivered before message m' in a process, 
every single process will also deliver message m before message m'.

The important reason to mention total order multicast is that total order multicast and consensus have an equivalence. 
Solving the total order multicast problem is equivalent to solving consensus. When you solve the total ordering problem, you are 
essentially coming into a consensus about the ordering of messages. 


### Raft
