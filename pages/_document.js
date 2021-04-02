import Document, {Head, Html, Main, NextScript} from "next/document";
import {ThemeProvider} from "theme-ui";

import theme from "../theme";

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {...initialProps};
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Html lang="en">
          <Head>
            <link rel="dns-prefetch" href="https://wiki.isub.dev" />
            <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script> 
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>    
      </ThemeProvider>
    );
  }
}

export default CustomDocument;
