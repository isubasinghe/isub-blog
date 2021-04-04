import { useContext } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "theme-ui";
import { context }  from "../theme";

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  
  render() {
    
    let theme = useContext(context);
    return (
        <Html lang="en">
          <Head>
            <link rel="dns-prefetch" href="https://wiki.isub.dev" />
            <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
	    
            <ThemeProvider theme={theme} />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>    
    );
  }
}

export default CustomDocument;
