'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface JournalEntry {
  id: string
  transcript: string
  primary_mood: string
  mood_score: number
  emotions: string[]
  sentiment: string
  insight: string
  created_at: string
}

export default function Profile() {
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [bannerImage, setBannerImage] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  
  const profileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || '')
      setBio(user.user_metadata?.bio || '')
      setProfilePicture(user.user_metadata?.profile_picture || '')
      setBannerImage(user.user_metadata?.banner_image || '')
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    if (!user) return
    
    setLoadingEntries(true)
    try {
      const response = await fetch(`/api/journal?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(Array.isArray(data) ? data : [])
      } else {
        setEntries([])
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
      setEntries([])
    } finally {
      setLoadingEntries(false)
    }
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingProfile(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-profile-${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Failed to upload image. Please try again.')
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfilePicture(publicUrl)

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_picture: publicUrl }
      })

      if (updateError) {
        console.error('Update error:', updateError)
        alert('Image uploaded but failed to save. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingBanner(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-banner-${Date.now()}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Failed to upload banner. Please try again.')
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setBannerImage(publicUrl)

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { banner_image: publicUrl }
      })

      if (updateError) {
        console.error('Update error:', updateError)
        alert('Banner uploaded but failed to save. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading banner:', error)
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      await supabase.auth.updateUser({
        data: {
          username,
          bio,
          profile_picture: profilePicture,
          banner_image: bannerImage
        }
      })

      setIsEditMode(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = () => {
    if (username) return username.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  const getMoodEmoji = (mood: string) => {
    // Return mood text instead of emoji
    return mood.charAt(0).toUpperCase() + mood.slice(1)
  }

  const getMoodColor = (mood: string) => {
    const colorMap: { [key: string]: string } = {
      joyful: '#48BB78',
      calm: '#4299E1',
      anxious: '#ED8936',
      sad: '#9F7AEA',
      angry: '#F56565',
      excited: '#ED64A6',
      grateful: '#38B2AC',
      hopeful: '#ECC94B',
      frustrated: '#FC8181',
      content: '#68D391'
    }
    return colorMap[mood.toLowerCase()] || '#A0AEC0'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      paddingBottom: '60px'
    }}>
      {/* Profile Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Compact Profile Header */}
        <div style={{
          position: 'relative',
          marginBottom: '40px'
        }}>
          {/* Banner */}
          <div
            onClick={() => isEditMode && bannerInputRef.current?.click()}
            style={{
              width: '100%',
              height: '200px',
              background: bannerImage 
                ? `url(${bannerImage}) center/cover` 
                : 'linear-gradient(135deg, #1a3a2e 0%, #0d1f17 100%)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              cursor: isEditMode ? 'pointer' : 'default',
              zIndex: 1
            }}
          >
            {uploadingBanner && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                Uploading...
              </div>
            )}
            {isEditMode && !uploadingBanner && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-family-satoshi)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Change Banner
              </div>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Profile Info Row */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '20px',
            marginTop: '-50px',
            paddingLeft: '40px',
            paddingRight: '40px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Profile Picture */}
            <div
              onClick={() => isEditMode && profileInputRef.current?.click()}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: profilePicture 
                  ? `url(${profilePicture}) center/cover` 
                  : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)',
                border: '5px solid var(--background)',
                cursor: isEditMode ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '42px',
                fontWeight: '600',
                color: '#ffffff',
                fontFamily: 'var(--font-family-satoshi)',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                zIndex: 3
              }}
            >
              {!profilePicture && getInitials()}
              {uploadingProfile && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  Loading...
                </div>
              )}
              {isEditMode && !uploadingProfile && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Name and Stats */}
            <div style={{
              flex: 1,
              paddingBottom: '16px'
            }}>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => {
                if (isEditMode) {
                  handleSave()
                } else {
                  setIsEditMode(true)
                }
              }}
              disabled={isSaving}
              style={{
                padding: '10px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-family-satoshi)',
                transition: 'all 0.2s ease',
                height: 'fit-content',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 3
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = 'var(--background)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Cancel Button for Edit Mode */}
          {isEditMode && (
            <div style={{
              marginTop: '16px',
              paddingLeft: '40px',
              paddingRight: '40px'
            }}>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setUsername(user?.user_metadata?.username || '')
                  setBio(user?.user_metadata?.bio || '')
                  setProfilePicture(user?.user_metadata?.profile_picture || '')
                  setBannerImage(user?.user_metadata?.banner_image || '')
                }}
                style={{
                  padding: '8px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-satoshi)',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Journal History */}
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            paddingLeft: '4px'
          }}>
            Journal Entries
          </h2>

          {loadingEntries ? (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                Loading entries...
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                fontWeight: '600',
                color: 'var(--text-secondary)'
              }}>
                Journal
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                No journal entries yet
              </h3>
              <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                Start recording your first voice journal entry
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {Array.isArray(entries) && entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '32px' }}>
                        {getMoodEmoji(entry.primary_mood)}
                      </span>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: getMoodColor(entry.primary_mood),
                          textTransform: 'capitalize',
                          fontFamily: 'var(--font-family-satoshi)'
                        }}>
                          {entry.primary_mood}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-family-satoshi)'
                        }}>
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      {entry.mood_score}/10
                    </div>
                  </div>

                  {/* Transcript */}
                  <div style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}>
                    {entry.transcript}
                  </div>

                  {/* Emotions */}
                  {entry.emotions && entry.emotions.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '12px'
                    }}>
                      {entry.emotions.map((emotion, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--background)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Insight */}
                  {entry.insight && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      "{entry.insight}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
