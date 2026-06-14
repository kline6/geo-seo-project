import ReactMarkdown from 'react-markdown'

interface Props {
  content: string
}

export default function MarkdownPreview({ content }: Props) {
  // Strip frontmatter
  let clean = content
  if (clean.startsWith('---')) {
    const end = clean.indexOf('---', 3)
    if (end !== -1) clean = clean.slice(end + 3).trim()
  }

  return (
    <div className="prose prose-sm max-w-none overflow-y-auto p-4 dark:prose-invert
      prose-headings:text-gray-900 dark:prose-headings:text-gray-100
      prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-a:text-primary-600 prose-strong:text-gray-800 dark:prose-strong:text-gray-200
      prose-table:text-sm prose-th:bg-gray-50 dark:prose-th:bg-gray-800
      prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 dark:prose-blockquote:bg-primary-900/20
      prose-code:text-primary-600 prose-code:bg-primary-50 dark:prose-code:bg-primary-900/30">
      <ReactMarkdown>{clean}</ReactMarkdown>
    </div>
  )
}