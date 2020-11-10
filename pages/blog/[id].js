import hydrate from "next-mdx-remote/hydrate";
import Head from "next/head";
import Highlight from "../../components/highlight";
import Back from "../../components/back";

export async function getStaticProps({ params }) {
  const matter = require("gray-matter");
  const { readFile } = require("fs").promises;
  const renderToString = require("next-mdx-remote/render-to-string");

  const { content, data } = matter(
    await readFile(`./pages/blog/${params.id}.md`, "utf8")
  );

  const mdxSource = await renderToString(content, {
    components: {
      pre: Highlight,
    },
  });

  return {
    props: {
      mdxSource,
      frontMatter: data,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: ["/blog/e-pi-i"],
    fallback: false,
  };
}

const BlogPost = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {
    components: {
      pre: Highlight,
    },
  });
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        <meta
          name="description"
          content={
            frontMatter.description ??
            `Isitha Subasinghe ${frontMatter.title} programming project`
          }
        />
      </Head>
      <Back url="/blog" />
      {content}
    </>
  );
};

export default BlogPost;
