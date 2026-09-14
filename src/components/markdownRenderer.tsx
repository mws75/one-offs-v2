import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { IoIosCopy } from "react-icons/io";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const notify = () => {
  alert("Copied to clipboard");
};

// Math uses $$...$$ only (inline or on its own lines) so dollar amounts in
// finance posts aren't parsed as math.
// output: "html" skips KaTeX's hidden MathML copy, which html2canvas would
// otherwise draw a second time in PDF exports.
export const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      className="prose-md prose
               w-full max-w-none
               prose-p:w-11/12
               prose-code:text-base
               prose-pre:w-full
               prose-pre:overflow-x-auto
               prose-pre:bg-codeGrey
               prose-li:w-11/12"
      remarkPlugins={[[remarkMath, { singleDollarTextMath: false }]]}
      rehypePlugins={[[rehypeKatex, { output: "html", throwOnError: false }]]}
      children={markdown}
      components={{
        code({ node, inline, className, children, style, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="relative">
              <button className="absolute right-0 top-0 flex flex-row p-2">
                <span>
                  <CopyToClipboard
                    text={String(children).replace(/\n$/, "")}
                    onCopy={() => notify()}
                  >
                    <IoIosCopy className="m-1 basis-1/4 text-lg hover:text-white" />
                  </CopyToClipboard>
                </span>
              </button>

              <div>
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};
