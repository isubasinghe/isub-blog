import Head from "next/head";
import Link from "next/link";
import Nav from "../../components/nav";


const Wiki = () => {
  return (
    <>
      <Head>
        <title>Isitha's Wikiw</title>
        <meta
          name="description"
          content="Isitha Subasinghe's knowledge wikipedia"
        />
      </Head>
      <h1>Projects</h1>
      <Nav />
    </>
  );
};

export default Wiki;
