import React from "react";
import Link from "next/link";

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/projects">
          <a>Projects</a>
        </Link>
      </li>
      <li>
        <Link href="/blog">
          <a>Blog</a>
        </Link>
      </li>
      <li>
        <a href="https://isubasinghe.gitbook.io/isithas-wiki/">Wiki</a>
      </li>
    </ul>
    <style jsx>{`
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: flex-start;
      }
      nav > ul {
        padding: 4px 0px;
      }
      li {
        display: flex;
        padding: 6px 0px;
        padding-right: 1rem;
      }
      li:not(:first-child) {
        padding: 6px 1rem;
      }
      a {
        font-size: 1.25rem;
      }
    `}</style>
  </nav>
);

export default Nav;
