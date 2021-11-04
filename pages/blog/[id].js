import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Head from "next/head";

import Back from "../../components/back";
import Highlight from "../../components/highlight";
import Interpreter from "../../components/interpreter";
import { getFiles } from "../../helpers/file"; 

const components = { pre: Highlight, Interpreter, Head };

export async function getStaticProps({ params }) {
  const matter = require("gray-matter");
  const { readFile } = require("fs").promises;
  const { content, data } = matter(
    await readFile(`./pages/blog/${params.id}.md`, "utf8")
  );

  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
}

export async function getStaticPaths() {
  const { readFile } = require("fs").promises;
  const matter = require("gray-matter");
  
  let paths = await getFiles("./pages/blog");
  paths = await Promise.all(paths.filter((fname) => {
    const ext = fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
    return ext === "md" || ext === "mdx";
  }).map(async (fname) => {
    return readFile(fname, "utf8").then(fileData => {
      const { data } = matter(fileData);
      return `/blog/${data.path}`;
    })
  }));
  return {
    paths, 
    fallback: false,
  };
}
const BlogPost = ({ source, frontMatter }) => {
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
      <MDXRemote {...source} components={components} />
      <style>{`
        a {
          font-size: 1rem;
        }
        `}</style>
    </>
  );
};

export default BlogPost;
