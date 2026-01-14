/**
 * Public User Profile Page
 * Linktree-style profile view at /u/username
 */

import { createFileRoute, Link } from '@tanstack/react-router'
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
  Calendar,
  Sparkles,
} from 'lucide-react'

export const Route = createFileRoute('/_public/u/$username')({
  component: PublicProfilePage,
})

function PublicProfilePage() {
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <User className="w-16 h-16" style={{ color: 'var(--foreground-muted)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          User not found
        </h1>
        <p style={{ color: 'var(--foreground-muted)' }}>
          @{username} doesn't exist or has a private profile.
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 rounded-xl font-medium transition-all"
          style={{
            background: 'var(--primary)',
            color: 'white',
          }}
        >
          Go Home
        </Link>
      </div>
    )
  }

  if (profile.profile && !profile.profile.isPublic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <User className="w-16 h-16" style={{ color: 'var(--foreground-muted)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Private Profile
        </h1>
        <p style={{ color: 'var(--foreground-muted)' }}>
          @{username} has set their profile to private.
        </p>
      </div>
    )
  }

  const isOwner = profile.user.role === 'owner'
  const accentColor = profile.profile?.accentColor || 'var(--primary)'

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Banner */}
          <div
            className="h-32 relative"
            style={{
              background: profile.profile?.banner
                ? `url(${profile.profile.banner}) center/cover`
                : `linear-gradient(135deg, ${accentColor}, var(--accent))`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Avatar & Info */}
          <div className="px-6 pb-6 -mt-12 relative">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4"
              style={{
                background: profile.profile?.avatar
                  ? `url(${profile.profile.avatar}) center/cover`
                  : `linear-gradient(135deg, ${accentColor}, var(--accent))`,
                border: '4px solid var(--card)',
                color: 'white',
              }}
            >
              {!profile.profile?.avatar && (profile.user.name?.[0] || profile.user.username?.[0] || 'U').toUpperCase()}
            </div>

            {/* Name & Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {profile.user.name || profile.user.username}
              </h1>
              {isOwner && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}
                >
                  <Crown size={10} />
                  Owner
                </span>
              )}
              {profile.profile?.badges?.includes('verified') && (
                <BadgeCheck size={20} style={{ color: accentColor }} />
              )}
            </div>

            {/* Username */}
            <p className="text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
              @{profile.user.username}
            </p>

            {/* Bio */}
            {profile.profile?.bio && (
              <p className="text-sm mb-4" style={{ color: 'var(--foreground)' }}>
                {profile.profile.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {profile.profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {profile.profile.location}
                </span>
              )}
              {profile.profile?.website && (
                <a
                  href={profile.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                  style={{ color: accentColor }}
                >
                  <Globe size={14} />
                  Website
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Joined {new Date(profile.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Stats */}
            {profile.stats && (
              <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Eye size={16} style={{ color: 'var(--foreground-muted)' }} />
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {profile.stats.profileViews?.toLocaleString() || 0}
                  </span>
                  <span style={{ color: 'var(--foreground-muted)' }}>views</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} style={{ color: 'var(--foreground-muted)' }} />
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {profile.stats.totalLinkClicks?.toLocaleString() || 0}
                  </span>
                  <span style={{ color: 'var(--foreground-muted)' }}>clicks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: 'var(--foreground-muted)' }} />
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {profile.stats.followers?.toLocaleString() || 0}
                  </span>
                  <span style={{ color: 'var(--foreground-muted)' }}>followers</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links?.map((link, index) => (
            <motion.button
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              style={{
                background: link.backgroundColor || 'var(--card)',
                border: '1px solid var(--border)',
                color: link.textColor || 'var(--foreground)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{link.title}</h3>
                  {link.description && (
                    <p className="text-sm mt-1 opacity-70">{link.description}</p>
                  )}
                </div>
                <ExternalLink
                  size={18}
                  className={`transition-transform ${clickedLink === link.id ? 'scale-125' : 'group-hover:translate-x-1'}`}
                  style={{ color: link.textColor || 'var(--foreground-muted)' }}
                />
              </div>
            </motion.button>
          ))}

          {(!profile.links || profile.links.length === 0) && (
            <div
              className="text-center py-8 rounded-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Sparkles size={32} className="mx-auto mb-2" style={{ color: 'var(--foreground-muted)' }} />
              <p style={{ color: 'var(--foreground-muted)' }}>No links yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="text-sm hover:underline"
            style={{ color: 'var(--foreground-muted)' }}
          >
            Create your own profile at {siteConfig.metadata.url}
          </Link>
        </div>
      </div>
    </div>
  )
}
