/**
 * Direct Username Route
 * Handles bio pages at eziox.link/{username}
 * This is a catch-all for usernames directly on the root
 */

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getPublicProfileFn } from '@/server/functions/users'
import { trackLinkClickFn } from '@/server/functions/links'
import { siteConfig } from '@/lib/site-config'
import {
  User,
  Eye,
  Link as LinkIcon,
  Users,
  ExternalLink,
  Crown,
  BadgeCheck,
  Loader2,
  MapPin,
  Globe,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

// Reserved paths that should not be treated as usernames
const RESERVED_PATHS = [
  'sign-in',
  'sign-up',
  'profile',
  'leaderboard',
  'archive',
  'about',
  'blog',
  'category',
  'tag',
  'rss',
  'sitemap',
  'api',
  'u',
  's',
]

export const Route = createFileRoute('/_public/$username')({
  beforeLoad: ({ params }) => {
    // Check if this is a reserved path
    if (RESERVED_PATHS.includes(params.username.toLowerCase())) {
      throw notFound()
    }
  },
  component: DirectUsernamePage,
})

function DirectUsernamePage() {
  const params = Route.useParams()
  const username = params.username as string
  const getProfile = useServerFn(getPublicProfileFn)
  const trackClick = useServerFn(trackLinkClickFn)

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['publicProfile', username],
    queryFn: () => getProfile({ data: { username } }),
  })

  const [clickedLink, setClickedLink] = useState<string | null>(null)

  const handleLinkClick = async (linkId: string, url: string) => {
    setClickedLink(linkId)
    await trackClick({ data: { linkId } })
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => setClickedLink(null), 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground-muted)' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            User Not Found
          </h1>
          <p className="mb-6" style={{ color: 'var(--foreground-muted)' }}>
            The user @{username} doesn't exist yet.
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

  // Type guard for profile data
  const profileData = profile.profile && 'bio' in profile.profile ? profile.profile : null
  const accentColor = profileData?.accentColor || 'var(--primary)'

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Banner */}
          {profileData?.banner && (
            <div
              className="w-full h-32 rounded-2xl mb-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${profileData.banner})` }}
            />
          )}

          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
            style={{
              background: profileData?.avatar
                ? `url(${profileData.avatar}) center/cover`
                : `linear-gradient(135deg, ${accentColor}, var(--accent))`,
              color: 'white',
              border: `4px solid ${accentColor}`,
            }}
          >
            {!profileData?.avatar && (profile.user.name?.[0] || profile.user.username?.[0] || 'U').toUpperCase()}
          </div>

          {/* Name & Username */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {profile.user.name || profile.user.username}
            </h1>
            {profile.user.role === 'owner' && (
              <Crown size={20} style={{ color: '#fbbf24' }} />
            )}
            {profileData?.badges?.includes('verified') && (
              <BadgeCheck size={20} style={{ color: accentColor }} />
            )}
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
            @{profile.user.username}
          </p>

          {/* Bio */}
          {profileData?.bio && (
            <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              {profileData.bio}
            </p>
          )}

          {/* Location & Website */}
          <div className="flex items-center justify-center gap-4 text-sm mb-4">
            {profileData?.location && (
              <span className="flex items-center gap-1" style={{ color: 'var(--foreground-muted)' }}>
                <MapPin size={14} />
                {profileData.location}
              </span>
            )}
            {profileData?.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
                style={{ color: accentColor }}
              >
                <Globe size={14} />
                Website
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1" style={{ color: 'var(--foreground-muted)' }}>
              <Eye size={14} />
              <span>{profile.stats?.profileViews || 0} views</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--foreground-muted)' }}>
              <LinkIcon size={14} />
              <span>{profile.stats?.totalLinkClicks || 0} clicks</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--foreground-muted)' }}>
              <Users size={14} />
              <span>{profile.stats?.followers || 0} followers</span>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links && profile.links.length > 0 ? (
            profile.links.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLinkClick(link.id, link.url)}
                disabled={clickedLink === link.id}
                className="w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: link.backgroundColor || 'var(--card)',
                  border: `1px solid ${link.backgroundColor || 'var(--border)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {link.icon && (
                      <span className="text-xl">{link.icon}</span>
                    )}
                    <div>
                      <p className="font-semibold" style={{ color: link.textColor || 'var(--foreground)' }}>
                        {link.title}
                      </p>
                      {link.description && (
                        <p className="text-sm" style={{ color: link.textColor ? `${link.textColor}99` : 'var(--foreground-muted)' }}>
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {clickedLink === link.id ? (
                    <Loader2 size={18} className="animate-spin" style={{ color: link.textColor || 'var(--foreground-muted)' }} />
                  ) : (
                    <ExternalLink size={18} style={{ color: link.textColor || 'var(--foreground-muted)' }} />
                  )}
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-8">
              <LinkIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--foreground-muted)' }} />
              <p style={{ color: 'var(--foreground-muted)' }}>No links yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm hover:underline"
            style={{ color: 'var(--foreground-muted)' }}
          >
            <Sparkles size={14} />
            Create your own {siteConfig.metadata.title} page
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
