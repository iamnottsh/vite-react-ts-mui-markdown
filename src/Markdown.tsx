import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {defaultSchema} from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import {useEffect} from "react";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import {Base64} from "js-base64";

function onHashChanged() {
    let hash: string
    try {
        hash = decodeURIComponent(location.hash.slice(1)).toLowerCase()
    } catch {
        return
    }
    const name = `user-content-${hash}`
    const target = document.getElementById(name) || document.querySelector(`[name="${name}"]`)
    if (target) requestAnimationFrame(() => {
        target.scrollIntoView()
    })
}

window.addEventListener('hashchange', onHashChanged)

document.addEventListener(
    'click',
    (event) => {
        if (
            event.target &&
            event.target instanceof HTMLAnchorElement &&
            event.target.href === location.href &&
            location.hash.length > 1
        ) requestAnimationFrame(() => {
            if (!event.defaultPrevented) onHashChanged()
        })
    },
    false
)

export default function Markdown({source, clobberPrefix}: { source: string, clobberPrefix?: string }) {
    useEffect(onHashChanged, [])
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false,
                }],
                () => tree => {
                    const visitor = (node: any) => {
                        if (['footnoteReference', 'footnoteDefinition'].includes(node.type)) {
                            node.identifier = Base64.encodeURI(node.identifier)
                        }
                        node.children?.forEach(visitor)
                    }
                    visitor(tree)
                    return tree
                },
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
                [rehypeSanitize, {
                    ...defaultSchema,
                    attributes: {
                        ...defaultSchema.attributes,
                        code: [
                            ...(defaultSchema.attributes?.code ?? []),
                            ['className', /^language-/]
                        ]
                    },
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
