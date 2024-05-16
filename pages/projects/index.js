import Head from "next/head";
import Link from "next/link";

import Nav from "../../components/nav";

export async function getStaticProps() {
  const { readFile } = require("fs").promises;
  const { getFiles } = require("../../helpers/file");
  const matter = require("gray-matter");

  let files = await getFiles("./pages/projects");
  files = files.filter((fname) => {
    const ext = fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
    return ext === "md" || ext === "mdx";
  });

  const metadata = (
    await Promise.all(
      files.map((file) =>
        readFile(file, "utf8").then((content) => matter(content).data)
      )
    )
  ).filter((doc) => doc.path !== null && doc.title !== null);

  return {
    props: {
      links: metadata,
    },
  };
}

const Projects = ({ links }) => {
  return <>
    <Head>
      <title>Isitha's Projects</title>
      <meta
        name="description"
        content="Isitha Subasinghe's projects developed for fun and curiosity"
      />
    </Head>
    <h1>Projects</h1>
    <Nav />
    <h2 />
    <h3 />
    <h4>A list of projects I have worked on in my spare time</h4>
    <ul>
      {links &&
        links.map((link) => {
          return (
            <li key={link.path}>
              <Link href={`/projects/${link.path}`} legacyBehavior>
                <a>{link.title}</a>
              </Link>
              <style jsx>{`
                a {
                  font-size: 1rem;
                }
              `}</style>
            </li>
          );
        })}
    </ul>
  </>;
};

export default Projects;
