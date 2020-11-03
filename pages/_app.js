import "../styles.css";
import Nav from "../components/nav";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Component {...pageProps} />
      <style jsx>{`
        .container {
          max-width: 45rem;
          margin: 0 auto;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
