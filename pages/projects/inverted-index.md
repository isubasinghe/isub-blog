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
