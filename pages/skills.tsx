import React from "react";
import Head from "next/head";

import Nav from "../components/nav";

const Skills = () => (
    <div className="container">
      <Head>
        <title>Skills</title>
        <meta
          name="description"
          content="A more descriptive overview of my skills"
        />
      </Head>
      <h1>Skills</h1>
      <Nav />
  
      <h2>Hey I am Isitha Subasinghe, you've discovered my hidden post. You must be a recruiter. </h2>
      <p>
        I think the main page does an ok job of outlining my interests and skill level but I wanted 
        to show recruiters the depth and variety of the programming that I have done. 
      </p>
      <p>
        I have knowledge in a wide variety of computer science topics, my aim is to keep adding 
        to this knowledge.
      </p>
      <p>
        My main interests at the moment are large scale distributed systems and
        programming language implementation.
      </p>
      <p>
        Most of the code I hack around with is open source, 
        you can have a look <a style={{fontSize:"16px"}} href="https://github.com/isubasinghe">here</a>
      </p>
      <hr />
      <p>I hope this is enough to show that I really am capable of learning whatever tech stack your company operates with, quite easily and quickly. My obsession with programming allows for this. </p>
      <hr />
      <h3>Programming Languages I have worked with throughout my life. I don't program in some of these anymore.</h3>
      <ul>
        <li>C++</li>
        <li>C</li>
        <li>Haskell</li>
        <li>Python</li>
        <li>Go</li>
        <li>Java</li>
        <li>Rust</li>
        <li>JavaScript</li>
        <li>TypeScript</li>
        <li>Matlab</li>
        <li>Pascal</li>
        <li>Visual Basic</li>
        <li>Lua</li>
        <li>SQL</li>
        <li>GraphQL</li>
        <li>C# - limited use only</li>
        <li>x86-64 - limited use only</li>
        <li>Racket - limited use only</li>
      </ul>

      <h4>Depth of C</h4>
      <ul>
        <li>Excellent understanding of memory.</li>
        <li>Good understanding of modern x86 architecture.</li>
        <li>Wrote a lock free linked list.</li>
        <li>Understanding of the non determinism of modern CPU architectures and how to force instruction execution order where needed.</li>
        <li>Fair understanding of how to write data structures that maximise use of cache. </li>
      </ul>

      <h4>Depth of C++</h4>
      <ul>
        <li>Wrote a userland driver in C that also worked with C++ for the pololou drv8835.</li>
        <li>Wrote a robot that displayed a real time video feed and was controllable over TCP. The video feed was a custom compression logic. 
          I sent JPEG encoded deltas of the images, this essentially allows for a much smaller data to be sent through the network. This is quite interesting mathematically, this is actually an advantage of using the fourier transform.</li>
        <li>Understanding of template programming.</li>
        <li>Used QT5 for GUI applications. </li>
        <li>Understanding of the different automatic memory management facilities and their weaknesses. I am referring to unqiue_ptr, shared_ptr and how memory leaks may occur if your data structures were cyclic. </li>
      </ul>

      <h4>Depth of JavaScript</h4>
      <ul>
        <li>Understanding of the event loop.</li>
        <li>Written performant JS code. </li>
        <li>Understanding of how to obtain extreme performance through technologies like the google closure compiler and tsickle.</li>
        <li>Understand interfacing Node.js into C++/Rust for greater performance where needed.</li>
        <li>Excellent understanding of OS specific functionality used by Node.js and their performance characteristics. I am referring to epoll, io_uring, kqueue and iocp here. In fact I have written a web server in pure C using epoll.</li>
      </ul>

      <h4>Depth of Haskell</h4>
      <ul>
        <li>Understand the basics such as monads, functors, applicatives</li>
        <li>Understand monad transformers. </li>
        <li>Written parsers for a programming language using parser combinators, also written a parser for JSON by writing a parser combinator from scratch.</li>
        <li>Understand higher kinded types and programming at the type level through extensions such as GADTS. </li>
        <li>Understand how to optimise generic Haskell for specific types. This is crucial for high performance Haskell. </li>
      </ul>

      <h4>Depth of Rust</h4>
      <ul>
        <li>Excellent understanding of async/await in rust, including knowledge of how to build one. </li>
        <li>A good understanding of the borrow checker and how to circumvent the fact that it is overly conservative. I am referring to run time borrow checking through RefCell here. </li>
        <li>A good understanding of networking libraries such as trpc, tonic, prost and LR(1) parser generators and config management. </li>
        <li>Wrote a Raft implementation. </li>
        <li> Wrote a small key value store using RocksDB. </li>
        <li>Working on a static information retrieval engine using Rust and RocksDB. </li>
      </ul>

      <h4>Depth of Distributed Systems</h4>
      <ul>
        <li>Understand the raft concensus algorithm.</li>
        <li>Understand the consequences of the FLP paper</li>
        <li>{"Understand how clocks fail and why {Lamport, Vector} clocks are important. "}</li>
      </ul>

      <h4>Other things</h4>
      <ul>
        <li>Wrote a little flappy bird clone called jumpy plane in Lua while still at high school. </li>
      </ul>

    </div>
  );

  export default Skills;