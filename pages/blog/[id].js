import hydrate from "next-mdx-remote/hydrate";
import Head from "next/head";
import Highlight from "../../components/highlight";
import Interpreter from "../../components/interpreter";
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
    paths: ["/blog/e-pi-i", "/blog/interpreter"],
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
      {content}
      <style>{
        `
        a {
          font-size: 1rem;
        }
        `  
      }</style>
    </>
  );
};

export default BlogPost;
