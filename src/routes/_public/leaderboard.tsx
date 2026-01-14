/**
 * Leaderboard Page
 * Shows top users ranked by score, views, clicks, etc.
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getLeaderboardFn } from '@/server/functions/users'
import {
  Trophy,
  Eye,
  Link as LinkIcon,
  Users,
  Crown,
  Medal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Star,
} from 'lucide-react'

export const Route = createFileRoute('/_public/leaderboard')({
  component: LeaderboardPage,
})

type SortBy = 'score' | 'profileViews' | 'totalLinkClicks' | 'followers'

function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>('score')
  const [page, setPage] = useState(0)
  const limit = 20

  const getLeaderboard = useServerFn(getLeaderboardFn)

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', sortBy, page],
    queryFn: () => getLeaderboard({ data: { sortBy, limit, offset: page * limit } }),
  })

  const sortOptions: { value: SortBy; label: string; icon: React.ReactNode }[] = [
    { value: 'score', label: 'Score', icon: <Trophy size={16} /> },
    { value: 'profileViews', label: 'Views', icon: <Eye size={16} /> },
    { value: 'totalLinkClicks', label: 'Clicks', icon: <LinkIcon size={16} /> },
    { value: 'followers', label: 'Followers', icon: <Users size={16} /> },
  ]

  const getStatValue = (item: NonNullable<typeof data>['users'][0]) => {
    switch (sortBy) {
      case 'score': return item.stats?.score || 0
      case 'profileViews': return item.stats?.profileViews || 0
      case 'totalLinkClicks': return item.stats?.totalLinkClicks || 0
      case 'followers': return item.stats?.followers || 0
      default: return 0
    }
  }

  // Get top 3 users for podium
  const topThree = data?.users?.slice(0, 3) || []
  const restUsers = data?.users?.slice(3) || []

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'var(--accent)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              boxShadow: '0 10px 40px rgba(var(--primary-rgb, 99, 102, 241), 0.3)',
            }}
          >
            <Trophy size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: 'var(--foreground)' }}>
            Leaderboard
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
            Top creators ranked by activity and engagement
          </p>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => { setSortBy(option.value); setPage(0) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: sortBy === option.value 
                  ? 'linear-gradient(135deg, var(--primary), var(--accent))' 
                  : 'var(--card)',
                color: sortBy === option.value ? 'white' : 'var(--foreground)',
                border: sortBy === option.value ? 'none' : '1px solid var(--border)',
                boxShadow: sortBy === option.value 
                  ? '0 4px 20px rgba(var(--primary-rgb, 99, 102, 241), 0.3)' 
                  : 'none',
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--primary)' }} />
            <p style={{ color: 'var(--foreground-muted)' }}>Loading rankings...</p>
          </div>
        ) : data?.users && data.users.length > 0 ? (
          <>
            {/* Top 3 Podium */}
            {page === 0 && topThree.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto"
              >
                {/* 2nd Place */}
                {topThree[1] && (
                  <Link
                    to="/$username"
                    params={{ username: topThree[1].user.username }}
                    className="order-1 mt-8"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="relative p-5 rounded-2xl text-center"
                      style={{ 
                        background: 'var(--card)', 
                        border: '2px solid rgba(192, 192, 192, 0.3)',
                      }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(192, 192, 192, 0.2)' }}>
                          <Medal size={18} style={{ color: '#C0C0C0' }} />
                        </div>
                      </div>
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl font-bold"
                        style={{
                          background: topThree[1].profile?.avatar
                            ? `url(${topThree[1].profile.avatar}) center/cover`
                            : `linear-gradient(135deg, ${topThree[1].profile?.accentColor || '#C0C0C0'}, var(--accent))`,
                          color: 'white',
                        }}
                      >
                        {!topThree[1].profile?.avatar && (topThree[1].user.name?.[0] || topThree[1].user.username?.[0] || 'U').toUpperCase()}
                      </div>
                      <p className="font-bold truncate" style={{ color: 'var(--foreground)' }}>
                        {topThree[1].user.name || topThree[1].user.username}
                      </p>
                      <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>
                        @{topThree[1].user.username}
                      </p>
                      <div className="text-lg font-bold" style={{ color: '#C0C0C0' }}>
                        {getStatValue(topThree[1]).toLocaleString()}
                      </div>
                    </motion.div>
                  </Link>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <Link
                    to="/$username"
                    params={{ username: topThree[0].user.username }}
                    className="order-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="relative p-6 rounded-2xl text-center"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))', 
                        border: '2px solid rgba(255, 215, 0, 0.4)',
                        boxShadow: '0 10px 40px rgba(255, 215, 0, 0.15)',
                      }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <motion.div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Crown size={22} className="text-white" />
                        </motion.div>
                      </div>
                      <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-bold ring-4 ring-yellow-500/30"
                        style={{
                          background: topThree[0].profile?.avatar
                            ? `url(${topThree[0].profile.avatar}) center/cover`
                            : `linear-gradient(135deg, #FFD700, var(--accent))`,
                          color: 'white',
                        }}
                      >
                        {!topThree[0].profile?.avatar && (topThree[0].user.name?.[0] || topThree[0].user.username?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <p className="font-bold truncate" style={{ color: 'var(--foreground)' }}>
                          {topThree[0].user.name || topThree[0].user.username}
                        </p>
                        {topThree[0].user.role === 'owner' && (
                          <Star size={14} fill="#FFD700" style={{ color: '#FFD700' }} />
                        )}
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>
                        @{topThree[0].user.username}
                      </p>
                      <div className="text-2xl font-black" style={{ color: '#FFD700' }}>
                        {getStatValue(topThree[0]).toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Flame size={14} style={{ color: '#FF6B35' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
                          #1 Creator
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <Link
                    to="/$username"
                    params={{ username: topThree[2].user.username }}
                    className="order-3 mt-12"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="relative p-5 rounded-2xl text-center"
                      style={{ 
                        background: 'var(--card)', 
                        border: '2px solid rgba(205, 127, 50, 0.3)',
                      }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(205, 127, 50, 0.2)' }}>
                          <Award size={18} style={{ color: '#CD7F32' }} />
                        </div>
                      </div>
                      <div
                        className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-lg font-bold"
                        style={{
                          background: topThree[2].profile?.avatar
                            ? `url(${topThree[2].profile.avatar}) center/cover`
                            : `linear-gradient(135deg, ${topThree[2].profile?.accentColor || '#CD7F32'}, var(--accent))`,
                          color: 'white',
                        }}
                      >
                        {!topThree[2].profile?.avatar && (topThree[2].user.name?.[0] || topThree[2].user.username?.[0] || 'U').toUpperCase()}
                      </div>
                      <p className="font-bold truncate text-sm" style={{ color: 'var(--foreground)' }}>
                        {topThree[2].user.name || topThree[2].user.username}
                      </p>
                      <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>
                        @{topThree[2].user.username}
                      </p>
                      <div className="text-lg font-bold" style={{ color: '#CD7F32' }}>
                        {getStatValue(topThree[2]).toLocaleString()}
                      </div>
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            )}

            {/* Rest of Users */}
            {(page > 0 ? data.users : restUsers).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {(page > 0 ? data.users : restUsers).map((item, index) => {
                    const rank = page > 0 ? page * limit + index + 1 : index + 4

                    return (
                      <Link
                        key={item.user.id}
                        to="/$username"
                        params={{ username: item.user.username }}
                        className="flex items-center gap-4 p-4 transition-all hover:bg-white/5"
                      >
                        {/* Rank */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                          style={{
                            background: 'var(--background-secondary)',
                            color: 'var(--foreground-muted)',
                          }}
                        >
                          #{rank}
                        </div>

                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                          style={{
                            background: item.profile?.avatar
                              ? `url(${item.profile.avatar}) center/cover`
                              : `linear-gradient(135deg, ${item.profile?.accentColor || 'var(--primary)'}, var(--accent))`,
                            color: 'white',
                          }}
                        >
                          {!item.profile?.avatar && (item.user.name?.[0] || item.user.username?.[0] || 'U').toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                              {item.user.name || item.user.username}
                            </span>
                            {item.user.role === 'owner' && (
                              <Crown size={14} style={{ color: '#FFD700' }} />
                            )}
                          </div>
                          <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                            @{item.user.username}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                              {getStatValue(item).toLocaleString()}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                              {sortOptions.find(o => o.value === sortBy)?.label}
                            </div>
                          </div>
                          <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {data.total > limit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="px-4 py-2 rounded-lg" style={{ background: 'var(--background-secondary)', color: 'var(--foreground-muted)' }}>
                  {page + 1} / {Math.ceil(data.total / limit)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * limit >= data.total}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Sparkles size={56} className="mx-auto mb-4" style={{ color: 'var(--primary)' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              No creators yet
            </h3>
            <p className="mb-6" style={{ color: 'var(--foreground-muted)' }}>
              Be the first to join and claim the #1 spot!
            </p>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
              }}
            >
              <Trophy size={18} />
              Join Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
