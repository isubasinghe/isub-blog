import hydrate from "next-mdx-remote/hydrate";
import Head from "next/head";
import HighlightPrism, { defaultProps } from "prism-react-renderer";
import github from "prism-react-renderer/themes/github";
import TeX from "@matejmazur/react-katex";
import Back from "../../components/back";

const Highlight = ({
  children: {
    props: { className, children },
  },
}) => {
  const language = className.replace(/language-/, "") || "";
  const newProps = defaultProps;
  newProps.theme = github;

  if (language === "latex") {
    return (
      <>
        <TeX block>{children}</TeX>
      </>
    );
  }
  return (
    <HighlightPrism {...newProps} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style }}>
          {tokens.map((line, index) => {
            const lineProps = getLineProps({ line, key: index });
            return (
              <div key={index} {...lineProps}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </HighlightPrism>
  );
};

export async function getStaticProps({ params }) {
  const matter = require("gray-matter");
  const { readFile } = require("fs").promises;
  const rehypePrism = require("@mapbox/rehype-prism");
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
