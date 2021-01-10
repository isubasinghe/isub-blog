---
title: Writing a search engine - Part 1
path: writing-a-search-engine-p1
description: Writing a simple search engine from scratch
date: null
---

## Writing a search engine from scratch

### Introduction to the series

I have decided to document some of my learning from building my own search engine.
I will cover the basics you would need to build a simple search engine. 

There are some stuff I will not cover. 
I am building a general purpose search engine, much like ElasticSearch although far less complex, as a result I will not cover
web crawling, page rank etc.

### Topics

* Inverted Index
* Preprocessing (Stopwords, Stemming)
* Scoring - BM25
* Storage - FST
* Evaluation - KWay merge


### Topics that may come in the future
* Persistent storage - RocksDB or Sled
* Order preserving encoding of primitives
* Storing complex hierarchical data in a simple KV store
* Faceting



#### Resources
To be filled out