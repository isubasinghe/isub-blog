import HighlightPrism, {defaultProps} from "prism-react-renderer";
import Prism from "prism-react-renderer/prism";
import github from "prism-react-renderer/themes/github";
const katex = require("katex");

(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-scheme");
require("prismjs/components/prism-rust");
require("prismjs/components/prism-haskell");
const Highlight = ({
  children : {
    props : {className : parentClassName, children},
  },
}) => {
  const language = parentClassName.replace(/language-/, "") || "";
  const newProps = defaultProps;
  newProps.theme = github;

  let katexCode = "";
  if (language === "latex") {
    katexCode = katex.renderToString(children, {
      throwOnError: false,
      displayMode: true,
    });
  }

  return language === "latex" ? (
    <>
      <div dangerouslySetInnerHTML={{ __html: katexCode }} />
    </>
  ) : (
    <HighlightPrism {...newProps} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, overflow: "auto" }}>
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

export default Highlight;
