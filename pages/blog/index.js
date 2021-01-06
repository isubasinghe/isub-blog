import Head from "next/head";
import Link from "next/link";
import Nav from "../../components/nav";

export async function getStaticProps() {
  const { readFile } = require("fs").promises;
  const { getFiles } = require("../../helpers/file");
  const matter = require("gray-matter");

  let files = await getFiles("./pages/blog");
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

const Blog = ({ links }) => {
  return (
    <>
      <Head>
        <title>Isitha's Blogs</title>
      </Head>
      <h1>Blogs</h1>
      <Nav />
      <h2 />
      <h3 />
      <h4>My thoughts, experiments, ideas and tutorials</h4>
      <ul>
        {links &&
          links.map((link) => {
            return (
              <li key={link.path}>
                <Link href={`/blog/${link.path}`}>
                  <a>{link.title}</a>
                </Link>
                <style jsx>{`
                  a {
                    font-size: 1rem;
                  }
                  li {
                    font-size: 1rem;
                  }
                  li:not(:last-child) {
                    margin-bottom: 1rem;
                  }
                `}</style>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default Blog;
