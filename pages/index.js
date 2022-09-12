import React from "react";
import Head from "next/head";

import Nav from "../components/nav";

const Home = () => (
  <div className="container">
    <Head>
      <title>Home</title>
      <meta
        name="description"
        content="Isitha Subasinghe's blogging platform and portfolio. You can find about my skills, projects and blogs here."
      />
    </Head>
    <Nav />
    <h1>Isitha's Home Page</h1>

    <h2>Hey I am Isitha,</h2>
    <p>
      I love computers and hacking around with them, I have been programming
      since I was in primary school.
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
    <p><strong>This following section is mainly aimed at recruiters so they can develop an understanding of what I am like as a programmer and what values I bring into their engineering organisation.</strong></p>
    <h3>Programming Languages - Preferred Languages in Bold</h3>
    I generally prefer languages with strong types, as this makes programming easier for me. Being able to write programs with properties that can be 
    verified at compile time is a huge help. C++ (I should elaborate more here) and C do not exactly fall into this category but I still like these languages for perhaps more sentimental reasons.
    <ul>
      <li><strong>C++</strong></li>
      <li><strong>C</strong></li>
      <li><strong>Haskell</strong></li>
      <li><strong>OCaml</strong></li>
      <li>Python</li>
      <li>Go</li>
      <li>Java</li>
      <li><strong>Rust</strong></li>
      <li>JavaScript</li>
      <li>TypeScript</li>
      <li>x86-64 Assembly </li>
      <li>RISC-V Assembly </li>
    </ul>
    <h3>Programming languages I am learning</h3>
    <ul>
      <li>Idris - Dependant types for formal verifcation is neat</li>
      <li>Racket - So much hype including comments such as "god wrote the universe in lisp"</li>
    </ul>
    <h3>Other</h3>
    <ul>
      <li>TLA+ - Proving distributed systems is important</li>
      <li>PlusCal - Attempting to learn since TLA+ is difficult </li>
      <li>Dafny - formal verification </li>
    </ul>

  </div>
);

export default Home;
