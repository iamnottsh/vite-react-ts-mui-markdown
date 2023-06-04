import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {defaultSchema} from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

export default function Markdown({source}: { source: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false
                }],
            ]}
            rehypePlugins={[
                rehypeRaw,
                [rehypeSanitize, {
                    ...defaultSchema,
                    attributes: {
                        ...defaultSchema.attributes,
                        code: [
                            ...(defaultSchema.attributes?.code ?? []),
                            ['className', /^language-/]
                        ]
                    },
                    clobber: defaultSchema.clobber?.filter(value => value !== 'id'),
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
