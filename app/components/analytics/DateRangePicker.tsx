'use client'

import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import type { DateRangePreset } from '@/app/hooks/useDateRange'

interface DateRangePickerProps {
  preset: DateRangePreset
  onPresetChange: (preset: DateRangePreset) => void
  customRange?: { start: Date; end: Date } | null
  onCustomRangeChange: (range: { start: Date; end: Date }) => void
}

export default function DateRangePicker({
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange
}: DateRangePickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date | null>(customRange?.start || null)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(customRange?.end || null)

  const presets: { value: DateRangePreset; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ]

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      onCustomRangeChange({ start: tempStartDate, end: tempEndDate })
      setShowCustomPicker(false)
    }
  }

  const handlePresetClick = (value: DateRangePreset) => {
    if (value === 'custom') {
      setShowCustomPicker(!showCustomPicker)
    } else {
      onPresetChange(value)
      setShowCustomPicker(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePresetClick(p.value)}
            style={{
              background: preset === p.value ? 'var(--accent-primary)' : 'transparent',
              color: preset === p.value ? '#FFFFFF' : 'var(--text-primary)',
              border: `1px solid ${preset === p.value ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-family-satoshi)'
            }}
            onMouseEnter={(e) => {
              if (preset !== p.value) {
                e.currentTarget.style.background = 'var(--accent-muted)'
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (preset !== p.value) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }
            }}
          >
            {p.label}
          </button>
        ))}
        
        <button
          onClick={() => handlePresetClick('custom')}
          style={{
            background: preset === 'custom' ? 'var(--accent-primary)' : 'transparent',
            color: preset === 'custom' ? '#FFFFFF' : 'var(--text-primary)',
            border: `1px solid ${preset === 'custom' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-family-satoshi)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (preset !== 'custom') {
              e.currentTarget.style.background = 'var(--accent-muted)'
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
            }
          }}
          onMouseLeave={(e) => {
            if (preset !== 'custom') {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }
          }}
        >
          Custom
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {showCustomPicker && (
        <div style={{
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          animation: 'slideDown 0.3s ease-in-out'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Start Date
              </label>
              <ReactDatePicker
                selected={tempStartDate}
                onChange={(date) => setTempStartDate(date)}
                maxDate={tempEndDate || undefined}
                dateFormat="MMM d, yyyy"
                className="custom-datepicker"
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                End Date
              </label>
              <ReactDatePicker
                selected={tempEndDate}
                onChange={(date) => setTempEndDate(date)}
                minDate={tempStartDate || undefined}
                maxDate={new Date()}
                dateFormat="MMM d, yyyy"
                className="custom-datepicker"
              />
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                setShowCustomPicker(false)
                setTempStartDate(customRange?.start || null)
                setTempEndDate(customRange?.end || null)
              }}
              style={{
                background: 'transparent',
                color: '#A0AEC0',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleApplyCustomRange}
              disabled={!tempStartDate || !tempEndDate}
              style={{
                background: tempStartDate && tempEndDate ? '#8B2F2F' : '#A0AEC0',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: tempStartDate && tempEndDate ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease-in-out',
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-datepicker {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-family: 'Satoshi', sans-serif;
          font-size: 14px;
          color: #2D3748;
          background: #F7FAFC;
          outline: none;
          transition: all 0.3s ease-in-out;
        }

        .custom-datepicker:focus {
          border-color: #1a3a2e;
          background: white;
        }

        .react-datepicker {
          font-family: 'Satoshi', sans-serif;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .react-datepicker__header {
          background-color: #F7FAFC;
          border-bottom: 1px solid #E2E8F0;
          border-radius: 12px 12px 0 0;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #2D3748;
          font-weight: 600;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: #1a3a2e !important;
          color: white !important;
        }

        .react-datepicker__day:hover {
          background-color: #F7FAFC;
          border-radius: 6px;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #1a3a2e;
          color: white;
        }
      `}</style>
    </div>
  )
}
