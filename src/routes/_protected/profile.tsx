import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/use-auth'
import {
  User,
  Mail,
  Camera,
  Save,
  X,
  Edit3,
  Shield,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export const Route = createFileRoute('/_protected/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      // TODO: Implement profile update via Appwrite
      // For now, simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setSaveError('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    })
    setIsEditing(false)
    setSaveError(null)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Your Profile
          </h1>
          <p style={{ color: 'var(--foreground-muted)' }}>
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-400">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-400">{saveError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Banner */}
          <div
            className="h-32 relative"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            <button
              className="absolute bottom-3 right-3 p-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
              }}
              title="Change banner (coming soon)"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Avatar Section */}
          <div className="px-6 -mt-12 relative z-10">
            <div className="relative inline-block">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 0 0 4px var(--card)',
                  background: 'var(--background-secondary)',
                }}
              >
                {currentUser.name ? (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: 'white',
                    }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ color: 'var(--foreground-muted)' }}
                  >
                    <User size={40} />
                  </div>
                )}
              </div>
              <button
                className="absolute -bottom-1 -right-1 p-1.5 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                }}
                title="Change avatar (coming soon)"
              >
                <Camera size={14} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 pt-4 space-y-6">
            {/* Edit Toggle */}
            <div className="flex justify-end">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: 'var(--background-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground-muted)',
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                    }}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User
                      size={18}
                      style={{ color: 'var(--foreground-muted)' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all disabled:opacity-60"
                    style={{
                      background: 'var(--background-secondary)',
                      border: `1px solid ${isEditing ? 'var(--primary)' : 'var(--border)'}`,
                      color: 'var(--foreground)',
                    }}
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail
                      size={18}
                      style={{ color: 'var(--foreground-muted)' }}
                    />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl outline-none opacity-60 cursor-not-allowed"
                    style={{
                      background: 'var(--background-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                    }}
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div
              className="p-4 rounded-xl space-y-3"
              style={{
                background: 'var(--background-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <h3
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: 'var(--foreground)' }}
              >
                <Shield size={16} style={{ color: 'var(--primary)' }} />
                Account Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2" style={{ color: 'var(--foreground-muted)' }}>
                  <Calendar size={14} />
                  <span>Member since: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--foreground-muted)' }}>
                  <Mail size={14} />
                  <span>Account ID: {currentUser.$id?.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
