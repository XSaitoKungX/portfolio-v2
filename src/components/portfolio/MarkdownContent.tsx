import { parseMarkdown } from '@/lib/markdown'
import { motion } from 'motion/react'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({
  content,
  className = '',
}: MarkdownContentProps) {
  const html = parseMarkdown(content)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--foreground)',
      }}
    />
  )
}

// CSS styles for markdown content - Modern anime-inspired design
export const markdownStyles = `
.markdown-content {
    line-height: 1.9;
    font-size: 1.0625rem;
}

/* Headings with gradient accent */
.markdown-content .md-h1 {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    color: var(--foreground);
    line-height: 1.2;
    position: relative;
    padding-bottom: 0.75rem;
}

.markdown-content .md-h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    border-radius: 2px;
}

.markdown-content .md-h2 {
    font-family: var(--font-display);
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 2.25rem;
    margin-bottom: 1rem;
    color: var(--foreground);
    line-height: 1.3;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.markdown-content .md-h2::before {
    content: '';
    width: 4px;
    height: 1.5rem;
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 2px;
    flex-shrink: 0;
}

.markdown-content .md-h3 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--foreground);
    line-height: 1.4;
}

.markdown-content .md-h4 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--foreground);
}

.markdown-content .md-p {
    margin-bottom: 1.5rem;
    color: var(--foreground-muted);
}

/* Fancy blockquote with glow */
.markdown-content .md-blockquote {
    position: relative;
    border-left: 4px solid;
    border-image: linear-gradient(180deg, var(--primary), var(--accent)) 1;
    padding: 1.25rem 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--foreground-muted);
    background: var(--background-secondary);
    border-radius: 0 1rem 1rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.markdown-content .md-blockquote::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 15px;
    font-size: 4rem;
    font-family: Georgia, serif;
    color: var(--primary);
    opacity: 0.3;
    line-height: 1;
}

.markdown-content .md-ul,
.markdown-content .md-ol {
    margin: 1.25rem 0;
    padding-left: 1.75rem;
}

.markdown-content .md-li,
.markdown-content .md-li-ordered {
    margin-bottom: 0.625rem;
    color: var(--foreground-muted);
    position: relative;
}

.markdown-content .md-ul .md-li::marker {
    color: var(--primary);
}

/* Animated links */
.markdown-content .md-link {
    color: var(--primary);
    text-decoration: none;
    position: relative;
    font-weight: 500;
    transition: all 0.3s ease;
}

.markdown-content .md-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    transition: width 0.3s ease;
}

.markdown-content .md-link:hover {
    color: var(--accent);
}

.markdown-content .md-link:hover::after {
    width: 100%;
}

/* Modern code blocks with glow */
.markdown-content .code-block {
    position: relative;
    background: var(--background-secondary);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
    margin: 2rem 0;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.7;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.markdown-content .code-block::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    border-radius: 1rem 1rem 0 0;
}

.markdown-content .code-block code {
    color: var(--foreground);
}

/* Inline code with accent */
.markdown-content .inline-code {
    background: linear-gradient(135deg, var(--background-secondary), var(--background));
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.85em;
    color: var(--primary);
    font-weight: 500;
}

/* Gradient horizontal rule */
.markdown-content .md-hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent);
    margin: 3rem 0;
    border-radius: 1px;
}

/* Image with shadow and hover effect */
.markdown-content .md-image {
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
    margin: 2rem 0;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.markdown-content .md-image:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

/* Modern table design */
.markdown-content .md-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2rem 0;
    font-size: 0.9rem;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.markdown-content .md-table th,
.markdown-content .md-table td {
    padding: 1rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

.markdown-content .md-table th {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    font-weight: 600;
    color: var(--primary-foreground);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
}

.markdown-content .md-table td {
    background: var(--card);
    color: var(--foreground-muted);
}

.markdown-content .md-table tr:last-child td {
    border-bottom: none;
}

.markdown-content .md-table tr:hover td {
    background: var(--background-secondary);
}

.markdown-content strong {
    color: var(--foreground);
    font-weight: 700;
}

.markdown-content em {
    font-style: italic;
    color: var(--foreground-muted);
}

/* Selection styling */
.markdown-content ::selection {
    background: var(--primary);
    color: var(--primary-foreground);
}
`
