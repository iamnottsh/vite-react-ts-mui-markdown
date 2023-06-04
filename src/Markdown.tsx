import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function Markdown({source, prefix = ''}: { source: string, prefix?: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false,
                }],
                [remarkToc, {
                    heading: '目录',
                    prefix,
                }],
                remarkMath,
            ]}
            remarkRehypeOptions={{
                clobberPrefix: prefix,
                footnoteLabel: '脚注',
                footnoteBackLabel: '回到正文',
            }}
            rehypePlugins={[
                () => tree => {
                    const handler = (node: any) => {
                        if (node.properties?.id === 'footnote-label') delete node.properties.id
                        node.children?.forEach(handler)
                    }
                    tree.children.forEach(handler)
                    return tree
                },
                rehypeKatex,
                rehypeRaw,
                [rehypeSlug, {
                    prefix,
                }],
                [rehypeAutolinkHeadings, {
                    content: {type: 'text', value: '¶'},
                }],
                [rehypeHighlight, {
                    ignoreMissing: true,
                }],
            ]}
        >
            {source}
        </ReactMarkdown>
    )
}
