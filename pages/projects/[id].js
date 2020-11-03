import Head from "next/head";
import hydrate from "next-mdx-remote/hydrate";

export async function getStaticProps({ params }) {
  const matter = require("gray-matter");
  const { readFile } = require("fs").promises;
  const renderToString = require("next-mdx-remote/render-to-string");

  const { content, data } = matter(
    await readFile(`./pages/projects/${params.id}.md`, "utf8")
  );

  const mdxSource = await renderToString(content);

  return {
    props: {
      mdxSource,
      frontMatter: data,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: ["/projects/inverted-index"],
    fallback: false,
  };
}

const Project = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {});
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      {content}
    </>
  );
};

export default Project;