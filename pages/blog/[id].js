import hydrate from "next-mdx-remote/hydrate";
import Head from "next/head";

import Back from "../../components/back";
import Highlight from "../../components/highlight";
import Interpreter from "../../components/interpreter";

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
      Interpreter,
      Head,
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
    paths: [
      "/blog/e-pi-i",
      "/blog/interpreter",
      "/blog/either-monad-rust",
      "/blog/branchless-programming",
      // "/blog/writing-a-search-engine-p1"
    ],
    fallback: false,
  };
}

const BlogPost = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {
    components: {
      pre: Highlight,
      Interpreter,
      Head,
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
        <script src="/ischeme-wasm.js"></script>
      </Head>
      <Back url="/blog" />
      {frontMatter.date && 
        <>
          <style>{
            `.date {
              margin-top: 20px;
              text-decoration: underline;
              display: flex;
              justify-content: flex-end;
            }`
            }</style>
          <div className="date">Published Date: {frontMatter.date}</div>
        </>
      }
      {content}
      <style>{`
        a {
          font-size: 1rem;
        }
        `}</style>
    </>
  );
};

export default BlogPost;
