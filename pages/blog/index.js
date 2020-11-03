import Head from "next/head";
import Nav from "../../components/nav";

const Blog = ({ files }) => {
  return (
    <>
      <Head>
        <title>Isitha's Blogs</title>
      </Head>
      <h1>Blogs</h1>
      <Nav />
    </>
  );
};

export default Blog;
