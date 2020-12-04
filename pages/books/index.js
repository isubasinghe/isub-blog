import Head from "next/head";
import Nav from "../../components/nav";
import Back from "../../components/back";
const Books = () => {
  return (
    <>
      <Head>
        <title>Book List</title>
        <meta
          name="description"
          content="Books that I am currently reading, have read or wanting to read"
        />
      </Head>
      <h1>Books</h1>
      <Nav />
      <h2 />
      <h3 />
      <h4>Books that I am currently reading, have read or wanting to read</h4>
      <ul>
          <li>
              The Art of Multiprocessor Programming
          </li>
          <li>
            Compilers: Principles, Techniques, and Tools
          </li>
          <li>
              Compression and coding algorithms
          </li>
          <li>
              Designing Data-Intensive Applications
          </li>
          <li>
              Types and Programming Languages
          </li>
          <li>
              Introduction to Modern Cryptography
          </li>
          <li>
              Introduction to the Theory of Computation
          </li>
          <li>
              Database Internals
          </li>
          <li>
              Functional Programming Through Lamda Calculus
          </li>
          <li>
              Distributed Algorithms
          </li>
          <li>
              Modern Operating Systems
          </li>
          <li>
              The Garbage Collection Handbook
          </li>
          <li>
              Concrete Semantics
          </li>
          <li>
              Distributed Systems
          </li>
          <li>
              Purely functional data structures
          </li>
          <style jsx>{`
            li {
              font-size: 1rem;
            }
            li:not(:last-child) {
              margin-bottom: 1rem;
            }
          `}</style>
      </ul>
    </>
  );
};

export default Books;
