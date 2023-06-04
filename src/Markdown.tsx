import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export default function Markdown({source, toc, prefix}: { source: string, toc: string, prefix?: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false,
                }],
                [remarkToc, {
                    heading: toc,
                    prefix,
                }],
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
