import Link from "next/link";

const Back = ({ url }) => {
  return <>
    <Link href={url} legacyBehavior>
      <a>{"<"}</a>
    </Link>
    <style jsx>{`
      a {
        text-decoration: none;
      }
    `}</style>
  </>;
};

export default Back;
