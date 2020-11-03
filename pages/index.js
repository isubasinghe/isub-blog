import React from "react";
import Head from "next/head";

import Nav from "../components/nav";

const Home = () => (
  <div className="container">
    <Head>
      <title>Home</title>
    </Head>
    <h1>Isitha's Home Page</h1>
    <Nav />

    <h2>Hey I am Isitha Subasinghe</h2>
    <p>
      I love computers and hacking around with them, I have been programming
      since I was in primary school.
    </p>
    <p>
      I started with Pascal and have dealt with 14 languages at the time of
      writing this. I am driven by the desire to learn concepts not frameworks.
    </p>
    <p>
      I have knowledge in LLVM IR, Compilers, Search Engine implementation,
      frontend web development, backend web development, I have even written my
      own FreeBSD kernel modules. My hope is to continue to adding to this
      knowledge.
    </p>
    <p>
      My main interest at the moment are large scale distributed systems and
      programming language implementation.
    </p>

    <h3>Programming Languages</h3>
    <ul>
      <li>C++</li>
      <li>C</li>
      <li>Haskell</li>
      <li>Python</li>
      <li>Go</li>
      <li>Java</li>
      <li>C#</li>
      <li>JavaScript</li>
      <li>TypeScript</li>
      <li>Lua (Past)</li>
      <li>Matlab (Past)</li>
      <li>x86-64 (To a certain extent) </li>
    </ul>
    <h3>Planning to learn</h3>
    <ul>
      <li>Racket</li>
      <li>Idris</li>
      <li>Erlang</li>
      <li>Prolog</li>
      <li>Rust</li>
      <li>Ada</li>
      <li>Hamler</li>
    </ul>
  </div>
);

export default Home;
