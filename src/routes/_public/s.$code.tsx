/**
 * Short Link Redirect Route
 * Handles redirects for shortened URLs at /s/{code}
 */

import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { resolveShortLinkFn } from '@/server/functions/shortener'
import { ArrowLeft, LinkIcon } from 'lucide-react'

export const Route = createFileRoute('/_public/s/$code')({
  loader: async ({ params }) => {
    const result = await resolveShortLinkFn({ data: { code: params.code } })
    
    if (result?.targetUrl) {
      throw redirect({ href: result.targetUrl })
    }
    
    return { notFound: true }
  },
  component: ShortLinkNotFound,
})

function ShortLinkNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <LinkIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground-muted)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Link Not Found
        </h1>
        <p className="mb-6" style={{ color: 'var(--foreground-muted)' }}>
          This short link doesn't exist or has expired.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ background: 'var(--primary)', color: 'white' }}
        >
          <ArrowLeft size={16} />
          Go Home
        </Link>
      </div>
    </div>
  )
}
