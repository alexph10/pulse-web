'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

export interface ManagedProfile {
  id: string
  owner_id: string
  display_name: string
  relationship: string | null
  avatar_color: string
  notes?: string | null
  created_at?: string
  isDefault?: boolean
}

interface ManagedProfilesContextValue {
  profiles: ManagedProfile[]
  activeProfileId: string
  activeProfile: ManagedProfile | null
  loadingProfiles: boolean
  addProfile: (payload: { displayName: string; relationship?: string }) => Promise<void>
  deleteProfile: (profileId: string) => Promise<void>
  refreshProfiles: () => Promise<void>
  setActiveProfileId: (profileId: string) => void
}

const ManagedProfilesContext = createContext<ManagedProfilesContextValue | undefined>(undefined)

export function ManagedProfilesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [managedProfiles, setManagedProfiles] = useState<ManagedProfile[]>([])
  const [activeProfileId, setActiveProfileId] = useState<string>('self')
  const [loadingProfiles, setLoadingProfiles] = useState(false)

  useEffect(() => {
    if (!user) {
      setManagedProfiles([])
      setActiveProfileId('self')
      return
    }
    refreshProfiles()
  }, [user])

  const refreshProfiles = async () => {
    if (!user) return
    setLoadingProfiles(true)
    const { data, error } = await supabase
      .from('managed_profiles')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setManagedProfiles(data)
    }
    setLoadingProfiles(false)
  }

  const addProfile = async (payload: { displayName: string; relationship?: string }) => {
    if (!user || !payload.displayName.trim()) return
    const avatarPalette = ['#c2593f', '#c67b22', '#814837', '#5d3e39']
    const avatar_color =
      avatarPalette[Math.floor(Math.random() * avatarPalette.length)]

    const { data, error } = await supabase
      .from('managed_profiles')
      .insert({
        owner_id: user.id,
        display_name: payload.displayName.trim(),
        relationship: payload.relationship?.trim() || null,
        avatar_color
      })
      .select()
      .single()

    if (!error && data) {
      setManagedProfiles((prev) => [...prev, data])
    }
  }

  const deleteProfile = async (profileId: string) => {
    if (!profileId || profileId === 'self') return
    await supabase.from('managed_profiles').delete().eq('id', profileId)
    setManagedProfiles((prev) => prev.filter((profile) => profile.id !== profileId))
    if (activeProfileId === profileId) {
      setActiveProfileId('self')
    }
  }

  const combinedProfiles = useMemo(() => {
    if (!user) return []
    const fallbackName =
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Me'

    const baseProfile: ManagedProfile = {
      id: 'self',
      owner_id: user.id,
      display_name: fallbackName,
      relationship: 'You',
      avatar_color: '#c2593f',
      isDefault: true
    }

    return [baseProfile, ...managedProfiles]
  }, [managedProfiles, user])

  useEffect(() => {
    if (!combinedProfiles.find((profile) => profile.id === activeProfileId)) {
      setActiveProfileId('self')
    }
  }, [combinedProfiles, activeProfileId])

  const activeProfile =
    combinedProfiles.find((profile) => profile.id === activeProfileId) || null

  const value: ManagedProfilesContextValue = {
    profiles: combinedProfiles,
    activeProfileId,
    activeProfile,
    loadingProfiles,
    addProfile,
    deleteProfile,
    refreshProfiles,
    setActiveProfileId
  }

  return (
    <ManagedProfilesContext.Provider value={value}>
      {children}
    </ManagedProfilesContext.Provider>
  )
}

export const useManagedProfiles = () => {
  const context = useContext(ManagedProfilesContext)
  if (!context) {
    throw new Error('useManagedProfiles must be used within ManagedProfilesProvider')
  }
  return context
}

