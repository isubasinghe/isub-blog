import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import Head from "next/head";
import Back from "../../components/back";
import Highlight from "../../components/highlight";
import { getFiles, walkDir } from "../../helpers/file";

const components = { pre: Highlight };

export async function getStaticProps({ params }) {

}

export async function getStaticPaths() {
  let root = await walkDir("./pages/wiki", null);
}

const TreeView = ({ entries }) => {

}

 const Topic = () => {
 }


const Entry = () => {
  return (
    <> 
    </>
  );
}

export default Entry;
