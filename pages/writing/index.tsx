import Head from "next/head";
import Nav from "../../components/nav";
import { Paper } from "./paper";


interface FileIndexer {
  files: string[];
}

export async function getStaticProps() {
  const { readFile } = require("fs").promises;

  let indexFile: FileIndexer = await readFile("./pages/writing/files.json", "utf8").then((data:string) => JSON.parse(data));

  const data: Paper[] = await Promise.all(indexFile.files.map((file) => readFile("./pages/writing/" + file, "utf8").then((data:string) => JSON.parse(data))));
  console.log(data);

  return {
    props: {
      papers: data
    },
  };
}


interface WritingProps {
  papers: Paper[] 
}

const Writing = ({ papers } : WritingProps) => {
  console.log(papers);
  return (  
    <>
      <Head>
        <title>Isitha's Projects</title>
        <meta
          name="description"
          content="Isitha Subasinghe's projects developed for fun and curiosity"
        />
      </Head>
      <h1>
        Research and Writings 
      </h1>
      <Nav/>
      <ul>
        {papers.map((paper) => {
          return (
            <li key={paper.name}>
              <p>
                {paper.reason && `${paper.reason}  --  --  --  `}{paper.name} {paper.grade && `  --  --  --  Grade: ${paper.grade}`}
              </p>
              <a href={paper.pdfurl} style={{fontSize: 12}}>
                Download PDF
              </a>
            </li>
          ) 
        })}
      </ul>
    </>
  )
}

export default Writing;
