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
    <h1>Isitha's Home Page</h1>
    <Nav />

    <h2>Hey I am Isitha Subasinghe</h2>
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
    <h3>Programming Languages</h3>
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
      <li>x86-64 (To a certain extent) </li>
    </ul>
  </div>
);

export default Home;
