import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function Markdown({source, clobberPrefix}: { source: string, clobberPrefix?: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false,
                }],
                // () => tree => {
                //     const visitor = (node: any) => {
                //         if (['footnoteReference', 'footnoteDefinition'].includes(node.type)) {
                //             node.identifier = Base64.encodeURI(node.identifier)
                //         }
                //         node.children?.forEach(visitor)
                //     }
                //     visitor(tree)
                //     return tree
                // },
                [remarkToc, {
                    heading: '目录'
                }],
            ]}
            remarkRehypeOptions={{
                clobberPrefix: clobberPrefix,
                footnoteLabel: '脚注',
                footnoteBackLabel: '返回正文',
            }}
            rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                    content: {type: 'text', value: '¶'}
                }],
                [rehypeHighlight, {
                    ignoreMissing: true
                }],
            ]}
        >
            {source}
        </ReactMarkdown>
    )
}
