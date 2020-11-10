import TeX from "@matejmazur/react-katex";
import HighlightPrism, { defaultProps } from "prism-react-renderer";
import github from "prism-react-renderer/themes/github";

const Highlight = ({
  children: {
    props: { className: parentClassName, children },
  },
}) => {
  const language = parentClassName.replace(/language-/, "") || "";
  const newProps = defaultProps;
  newProps.theme = github;

  return language === "latex" ? (
    <TeX block>{children}</TeX>
  ) : (
    <HighlightPrism {...newProps} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style }}>
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
