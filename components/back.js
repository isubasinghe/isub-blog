import Link from "next/link";

const Back = ({ url }) => {
  return (
    <Link href={url}>
      <a>{"<"}</a>
    </Link>
  );
};

export default Back;
