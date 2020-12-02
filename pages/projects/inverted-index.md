---
path: inverted-index
title: Inverted Index
description: Building a search engine in C++
date: null
---

## Inverted Index

<hr />
I am currently building a search engine in C++.
I was very interested in learning how search engines work after my undergrad Design of Algorithms course
where we implemented a top K algorithm that obtained the top K search results from an inverted index.

<hr /> 
I implemented a finite state automata to store words, due to the natural compression present in such a datastructure.
But I recently have read a paper on `Adaptive Radix Trees`, and it was obvious that this is a much more efficient data structure,
in terms of storage space.

I am interested in adding RocksDB as a persistent backend to this implementation.

Following this I would love to introduce a concensus layer, Raft most likely, to introduce sharding in this system.

I really need to clean the code up as well, its quite disgusting at the moment.

<hr />

My main concern about this project at the moment however, is efficient fuzzy search.
Obviously generating all words with edit distance `n` is not a viable solution.

<hr />
I'm looking forward to getting stuck into this project after exams are over.

<hr />
**UPDATE: 2/12/2020**


I have started rewriting the search engine in Rust. 
So far I have added quite a lot more functionality when compared to the C++ implementation. 

* Supports prefix encoding along with suffix encoding thanks to the finite state transducer library by BurntSushi
* Supports persisted data, using spacejam's sled database
* Support for inserts while in operation at a low cost
* Support for re-indexing while in operation
* Support stemming for 17 languages
* Supports unicode text tokenisation
* Supports BM25 for scoring
* Supports a Web API
* Supports (soon) gRPC
* Coming soon: faceting
* Coming eventually (hopefully) Clustering, Concensus, etc. for a distributed search engine


<p>
The system is extremely fast at writes according to my benchmarks.It doesn't favour concurrency however, 
I will most likely expose a channel that the Inverted Index can read write jobs from. I think this 
will reduce thread contention and improve performance by a significant margin. 

I was able to achieve on average 15ms for an insertion of 148KB. 
Including all deserialization and serialization costs, the average insertion jumped to about 50ms for this document. 
The most important criteria was thread contention, when concurrency increased the time increased significantly. 

</p>