import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {defaultSchema} from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import {useEffect} from "react";

function hashchange() {
    /** @type {string|undefined} */
    let hash

    try {
        hash = decodeURIComponent(location.hash.slice(1)).toLowerCase()
    } catch {
        return
    }

    const name = 'user-content-' + hash
    const target =
        document.getElementById(name) || document.getElementsByName(name)[0]

    if (target) {
        setTimeout(() => {
            target.scrollIntoView()
        }, 0)
    }
}

window.addEventListener('hashchange', hashchange)

document.addEventListener(
    'click',
    (event) => {
        if (
            event.target &&
            event.target instanceof HTMLAnchorElement &&
            event.target.href === location.href &&
            location.hash.length > 1
        ) {
            setTimeout(() => {
                if (!event.defaultPrevented) {
                    hashchange()
                }
            })
        }
    },
    false
)

export default function Markdown({source}: { source: string }) {
    useEffect(hashchange, [])
    return (
        <ReactMarkdown
            remarkPlugins={[
                [remarkGfm, {
                    singleTilde: false,
                }],
            ]}
            remarkRehypeOptions={{
                clobberPrefix: 'clobber-',
                footnoteLabel: '脚注',
                footnoteBackLabel: '返回正文',
            }}
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
