'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertDialog, Avatar } from 'radix-ui'

// Constants
import {
  lifeStageOptions,
  stressLevelOptions,
  wellnessFocusOptions,
  currentSupportOptions,
  confidenceLabels,
  workLifeBalanceOptions,
  socialConnectionOptions,
} from './constants'

// Hooks
import { useClickOutside } from './hooks/useClickOutside'

// Layout Components
import { TopNav, ThemeToggle, FrameOutlines, Brand, ActivePage } from './components/layout'

// Profile Components
import { ProfileButton, ProfileDropdown, CreateButton } from './components/profile'

// Home Components
import { HomeCarousel, WellnessFocus } from './components/home'

// Insights Components
import { MoodTrendsCard, ReflectionCard, PatternInsightsCard, WeeklyPulseCard } from './components/insights'

// Overlay Components
import { CardChatOverlay } from './components/overlays'

// UI Components
import PeekNav from './components/ui/PeekNav'
import EmptyChats from './components/ui/EmptyChats'
import ChatPanel from './components/ui/ChatPanel'
import { SelectionGrid, ScrollPicker, RankedList, HexagonGauge } from './components/onboarding'

// Styles
import styles from './page.module.css'
import chatStyles from './styles/chat.module.css'
import profileStyles from './styles/profile.module.css'
import uiStyles from './styles/ui.module.css'

export default function MainPage() {
  // UI State
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>('home')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [cardOverlayOpen, setCardOverlayOpen] = useState(false)
  const [selectedWellnessItem, setSelectedWellnessItem] = useState<{ type: string; text?: string; description?: string } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Wellness Profile State
  const [lifeStage, setLifeStage] = useState<string | null>(null)
  const [sleepAverage, setSleepAverage] = useState(7)
  const [stressLevel, setStressLevel] = useState<string | null>(null)
  const [wellnessFocus, setWellnessFocus] = useState<{ id: string; priority: number }[]>([])
  const [currentSupport, setCurrentSupport] = useState<string | null>(null)
  const [wellnessConfidence, setWellnessConfidence] = useState(3)
  const [workLifeBalance, setWorkLifeBalance] = useState<string | null>(null)
  const [socialConnection, setSocialConnection] = useState<string | null>(null)

  // User Settings State
  const [firstName, setFirstName] = useState('Can')
  const [lastName, setLastName] = useState('Pham')
  const [email, setEmail] = useState('alexyeu25@gmail.com')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [country, setCountry] = useState('United States')
  const [language, setLanguage] = useState('')
  const [timezone, setTimezone] = useState('')

  // Refs
  const profileButtonRef = useRef<HTMLDivElement | null>(null)
  const profileDropdownRef = useRef<HTMLDivElement | null>(null)
  const plusButtonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Hide global components on main page
  useEffect(() => {
    document.body.classList.add('blank-page-active')
    return () => document.body.classList.remove('blank-page-active')
  }, [])

  // Click outside handlers
  const closeOverlay = useCallback(() => setOverlayOpen(false), [])
  const closeProfileDropdown = useCallback(() => setProfileDropdownOpen(false), [])

  useClickOutside([panelRef, profileButtonRef], closeOverlay, overlayOpen)
  useClickOutside([profileDropdownRef, profileButtonRef], closeProfileDropdown, profileDropdownOpen)

  // Navigation handlers
  const handleNavigate = useCallback((page: ActivePage) => {
    setActivePage(page)
    if (page !== 'chat') setChatOpen(false)
  }, [])


  return (
    <div
      className={`${styles.mainContainer} ${overlayOpen ? styles.panelOpen : ''}`}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      {/* Layout Components */}
      <FrameOutlines activePage={activePage} chatOpen={chatOpen} />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      <Brand />
      <TopNav activePage={activePage} onNavigate={handleNavigate} />

      {/* Profile Components */}
      <ProfileButton
        ref={profileButtonRef}
        firstName={firstName}
        isOpen={profileDropdownOpen}
        onClick={() => setProfileDropdownOpen((s) => !s)}
      />

      <CreateButton ref={plusButtonRef} onClick={() => setNavOpen(true)} />

      {/* Peek Navigation */}
      <PeekNav
        open={navOpen}
        onClose={() => setNavOpen(false)}
        outsideRefs={[profileButtonRef, plusButtonRef]}
        onAddJournal={() => setChatOpen(true)}
        onManagePlan={() => {
          setOverlayOpen(true)
          setEditingField('managePlan')
        }}
      />

      {/* Profile Dropdown */}
      <AnimatePresence>
        {profileDropdownOpen && (
          <ProfileDropdown
            ref={profileDropdownRef}
            isOpen={profileDropdownOpen}
            firstName={firstName}
            lastName={lastName}
            email={email}
            onProfile={() => {
              setProfileDropdownOpen(false)
              setOverlayOpen(true)
            }}
            onSettings={() => {
              setProfileDropdownOpen(false)
              setOverlayOpen(true)
              setEditingField('settings')
            }}
            onSignOut={() => {
              // TODO: Implement sign out
            }}
          />
        )}
      </AnimatePresence>

      {/* Panel Backdrop */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className={styles.panelBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setOverlayOpen(false)}
            aria-hidden={!overlayOpen}
          />
        )}
      </AnimatePresence>

      {/* Profile Panel (Sliding) */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className={profileStyles.profileOverlay}
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Profile panel"
            initial={{ width: 0 }}
            animate={{ width: '33%' }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.9 }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div 
              className={profileStyles.profileMenu} 
              role="menu" 
              aria-label="Profile menu"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.1, duration: 0.25, ease: 'easeOut' }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.12, ease: 'easeIn' }
              }}
            >
              <AnimatePresence mode="wait">
                {!editingField ? (
                  <motion.div
                    key="main"
                    className={profileStyles.profileContent}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <h2 className={styles.panelTitle}>Here&apos;s everything we know about you so far</h2>
                      <p className={styles.panelSubtitle}>
                        We use this information to provide you with the most personalized wellness guidance.
                      </p>
                    </div>

                    <div
                      className={profileStyles.profileCard}
                      role="button"
                      onClick={() => setEditingField('settings')}
                    >
                      <Avatar.Root className={profileStyles.profileAvatar}>
                        <Avatar.Fallback className={uiStyles.avatarFallbackLarge}>
                          {firstName.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div className={profileStyles.profileCardMeta}>
                        <div className={profileStyles.profileCardSubtitle}>Settings, personal info, and more</div>
                        <div className={profileStyles.profileName}>
                          {firstName} {lastName}
                        </div>
                      </div>
                      <div className={styles.chevronRight}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    <div>
                      <div className={styles.sectionTitle}>Saved memories</div>
                      <div className={styles.savedBox}>No saved memories yet</div>
                    </div>

                    <div>
                      <div className={styles.sectionTitle}>Wellness information</div>
                      <div className={styles.infoList}>
                        <InfoCard
                          label="Life stage"
                          value={lifeStageOptions.find((o) => o.id === lifeStage)?.label || 'Not set'}
                          onClick={() => setEditingField('lifeStage')}
                        />
                        <InfoCard
                          label="Sleep average"
                          value={`${sleepAverage} hrs/night`}
                          onClick={() => setEditingField('sleepAverage')}
                        />
                        <InfoCard
                          label="Current stress"
                          value={stressLevelOptions.find((o) => o.id === stressLevel)?.label || 'Not set'}
                          onClick={() => setEditingField('stressLevel')}
                        />

                        <div
                          className={styles.infoCard}
                          role="button"
                          tabIndex={0}
                          onClick={() => setEditingField('wellnessFocus')}
                        >
                          <div className={styles.infoLabel}>Wellness focus</div>
                          <div className={styles.rankedPreview}>
                            {wellnessFocus
                              .sort((a, b) => a.priority - b.priority)
                              .map((item) => (
                                <div key={item.id} className={styles.rankedPreviewItem}>
                                  <span className={styles.rankedPreviewLabel}>
                                    {wellnessFocusOptions.find((o) => o.id === item.id)?.label}
                                  </span>
                                  <span className={styles.rankedPreviewNumber}>{item.priority}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <InfoCard
                          label="Current support"
                          value={currentSupportOptions.find((o) => o.id === currentSupport)?.label || 'Not set'}
                          onClick={() => setEditingField('currentSupport')}
                        />
                        <InfoCard
                          label="Wellness confidence"
                          value={confidenceLabels[wellnessConfidence - 1]}
                          onClick={() => setEditingField('wellnessConfidence')}
                        />
                        <InfoCard
                          label="Work-life balance"
                          value={workLifeBalanceOptions.find((o) => o.id === workLifeBalance)?.label || 'Not set'}
                          onClick={() => setEditingField('workLifeBalance')}
                        />
                        <InfoCard
                          label="Social connection"
                          value={socialConnectionOptions.find((o) => o.id === socialConnection)?.label || 'Not set'}
                          onClick={() => setEditingField('socialConnection')}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    className={profileStyles.profileEditPage}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={profileStyles.profileEditHeader}>
                      <button
                        className={profileStyles.profileEditBackBtn}
                        onClick={() => setEditingField(null)}
                        aria-label="Go back"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <h2 className={profileStyles.profileEditTitle}>
                        {editingField === 'lifeStage' && 'What is your life stage?'}
                        {editingField === 'sleepAverage' && 'How much do you sleep?'}
                        {editingField === 'stressLevel' && 'What is your stress level?'}
                        {editingField === 'wellnessFocus' && 'What is your wellness focus?'}
                        {editingField === 'currentSupport' && 'What support do you have?'}
                        {editingField === 'wellnessConfidence' && 'How confident are you?'}
                        {editingField === 'workLifeBalance' && 'How is your work-life balance?'}
                        {editingField === 'socialConnection' && 'How connected do you feel?'}
                        {editingField === 'settings' && 'Settings'}
                      </h2>
                    </div>

                    <div className={profileStyles.profileEditBody}>
                      {editingField === 'lifeStage' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>Select your current life stage</p>
                          <SelectionGrid options={lifeStageOptions} selected={lifeStage} onChange={setLifeStage} />
                        </>
                      )}

                      {editingField === 'sleepAverage' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>How many hours do you sleep on average?</p>
                          <ScrollPicker
                            value={sleepAverage}
                            onChange={setSleepAverage}
                            min={4}
                            max={12}
                            unit="hrs/night"
                          />
                        </>
                      )}

                      {editingField === 'stressLevel' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>What is your current stress level?</p>
                          <SelectionGrid
                            options={stressLevelOptions}
                            selected={stressLevel}
                            onChange={setStressLevel}
                          />
                        </>
                      )}

                      {editingField === 'wellnessFocus' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>
                            Choose up to 3 focus areas. Your goals help us prioritize recommendations and create a
                            plan that aligns with what matters most.
                          </p>
                          <RankedList
                            options={wellnessFocusOptions}
                            selected={wellnessFocus}
                            onChange={setWellnessFocus}
                            maxSelections={3}
                          />
                        </>
                      )}

                      {editingField === 'currentSupport' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>What support do you currently have?</p>
                          <SelectionGrid
                            options={currentSupportOptions}
                            selected={currentSupport}
                            onChange={setCurrentSupport}
                          />
                        </>
                      )}

                      {editingField === 'wellnessConfidence' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>
                            How confident are you in managing your wellness?
                          </p>
                          <HexagonGauge
                            value={wellnessConfidence}
                            onChange={setWellnessConfidence}
                            labels={confidenceLabels}
                            min={1}
                            max={5}
                          />
                        </>
                      )}

                      {editingField === 'workLifeBalance' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>
                            Your work-life balance affects stress levels, energy, and overall wellbeing.
                          </p>
                          <SelectionGrid
                            options={workLifeBalanceOptions}
                            selected={workLifeBalance}
                            onChange={setWorkLifeBalance}
                          />
                        </>
                      )}

                      {editingField === 'socialConnection' && (
                        <>
                          <p className={profileStyles.profileEditDescription}>
                            Social connections are vital for mental health and emotional support.
                          </p>
                          <SelectionGrid
                            options={socialConnectionOptions}
                            selected={socialConnection}
                            onChange={setSocialConnection}
                          />
                        </>
                      )}

                      {editingField === 'settings' && (
                        <SettingsForm
                          firstName={firstName}
                          lastName={lastName}
                          email={email}
                          phoneNumber={phoneNumber}
                          country={country}
                          language={language}
                          timezone={timezone}
                          onFirstNameChange={setFirstName}
                          onLastNameChange={setLastName}
                          onPhoneNumberChange={setPhoneNumber}
                          onCountryChange={setCountry}
                          onLanguageChange={setLanguage}
                          onTimezoneChange={setTimezone}
                        />
                      )}
                    </div>

                    <div className={profileStyles.profileEditFooter}>
                      <button className={profileStyles.profileEditSaveBtn} onClick={() => setEditingField(null)}>
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className={styles.pageContent}>
        {/* Home Page */}
        <AnimatePresence>
          {activePage === 'home' && (
            <motion.div
              className={styles.homeContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className={styles.dateDisplay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </motion.div>

              <HomeCarousel
                firstName={firstName}
                onAskQuestion={() => {
                  setActivePage('chat')
                  setChatOpen(true)
                }}
                onSeeInsights={() => setActivePage('insights')}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ width: '100%', maxWidth: '1248px' }}
              >
                <WellnessFocus />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Page */}
        {activePage === 'chat' && (
          <div className={styles.chatContentArea}>
            <EmptyChats onStart={() => setChatOpen(true)} visible={!chatOpen} />
          </div>
        )}

        {/* Insights Page */}
        {activePage === 'insights' && (
          <motion.div
            className={styles.insightsContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MoodTrendsCard 
              onAskClick={() => {
                setActivePage('chat')
                setChatOpen(true)
              }} 
            />
            <ReflectionCard 
              onJournalClick={() => {
                setActivePage('chat')
                setChatOpen(true)
              }} 
            />
            <PatternInsightsCard 
              onExploreClick={() => {
                setActivePage('chat')
                setChatOpen(true)
              }} 
            />
            <WeeklyPulseCard 
              onDetailsClick={() => {
                setActivePage('chat')
                setChatOpen(true)
              }} 
            />
          </motion.div>
        )}
      </div>

      {/* Chat Panel Backdrop */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className={chatStyles.chatBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Expand Button */}
      {activePage === 'chat' && !chatOpen && (
        <button
          className={chatStyles.chatExpandBtn}
          onClick={() => setChatOpen(true)}
          aria-label="Expand chat panel"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.05005 13.5C2.05005 13.7485 2.25152 13.95 2.50005 13.95C2.74858 13.95 2.95005 13.7485 2.95005 13.5L2.95005 1.49995C2.95005 1.25142 2.74858 1.04995 2.50005 1.04995C2.25152 1.04995 2.05005 1.25142 2.05005 1.49995L2.05005 13.5ZM8.4317 11.0681C8.60743 11.2439 8.89236 11.2439 9.06809 11.0681C9.24383 10.8924 9.24383 10.6075 9.06809 10.4317L6.58629 7.94993L14.5 7.94993C14.7485 7.94993 14.95 7.74846 14.95 7.49993C14.95 7.2514 14.7485 7.04993 14.5 7.04993L6.58629 7.04993L9.06809 4.56813C9.24383 4.39239 9.24383 4.10746 9.06809 3.93173C8.89236 3.75599 8.60743 3.75599 8.4317 3.93173L5.1817 7.18173C5.00596 7.35746 5.00596 7.64239 5.1817 7.81812L8.4317 11.0681Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>{chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}</AnimatePresence>

      {/* Card Chat Overlay */}
      <CardChatOverlay
        isOpen={cardOverlayOpen}
        onClose={() => {
          setCardOverlayOpen(false)
          setSelectedWellnessItem(null)
        }}
        type={selectedWellnessItem?.type === 'task' ? 'task' : 'reflection'}
        title={selectedWellnessItem?.text}
        description={selectedWellnessItem?.description}
      />
    </div>
  )
}

// ========== Helper Components ==========

interface InfoCardProps {
  label: string
  value: string
  onClick: () => void
}

function InfoCard({ label, value, onClick }: InfoCardProps) {
  return (
    <div className={styles.infoCard} role="button" tabIndex={0} onClick={onClick}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  )
}

interface SettingsFormProps {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
  language: string
  timezone: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onTimezoneChange: (value: string) => void
}

function SettingsForm({
  firstName,
  lastName,
  email,
  phoneNumber,
  country,
  language,
  timezone,
  onFirstNameChange,
  onLastNameChange,
  onPhoneNumberChange,
  onCountryChange,
  onLanguageChange,
  onTimezoneChange,
}: SettingsFormProps) {
  return (
    <div className={styles.settingsForm}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>First name</label>
        <input
          type="text"
          className={styles.formInput}
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Last name</label>
        <input
          type="text"
          className={styles.formInput}
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email</label>
        <input type="email" className={styles.formInputDisabled} value={email} disabled />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Phone Number</label>
        <input
          type="tel"
          className={styles.formInput}
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="+1 (555) 555-5555"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Country</label>
        <select className={styles.formSelect} value={country} onChange={(e) => onCountryChange(e.target.value)}>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Japan">Japan</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Language</label>
        <select className={styles.formSelect} value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="">Select language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Timezone</label>
        <select className={styles.formSelect} value={timezone} onChange={(e) => onTimezoneChange(e.target.value)}>
          <option value="">Select timezone</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
      </div>

      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className={styles.deleteAccountLink}>Delete account</button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={uiStyles.alertDialogOverlay} />
          <AlertDialog.Content className={uiStyles.alertDialogContent}>
            <AlertDialog.Title className={uiStyles.alertDialogTitle}>Delete Account</AlertDialog.Title>
            <AlertDialog.Description className={uiStyles.alertDialogDescription}>
              Are you sure you want to delete your account? This action cannot be undone. All your data, including
              journal entries and wellness information, will be permanently removed.
            </AlertDialog.Description>
            <div className={uiStyles.alertDialogActions}>
              <AlertDialog.Cancel asChild>
                <button className={uiStyles.alertDialogCancel}>Cancel</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button className={uiStyles.alertDialogDelete}>Yes, delete my account</button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <div className={styles.settingsFooterLinks}>
        <span>Sign out</span>
        <span className={styles.footerDivider}>|</span>
        <span>support@pulse.app</span>
      </div>
    </div>
  )
}
