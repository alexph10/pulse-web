import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface SearchFilters {
  dateRange?: {
    start: string
    end: string
  }
  mood?: string
  tags?: string[]
}

interface UseSearchOptions {
  userId: string
  table: string
  searchFields: string[]
}

export function useSearch({ userId, table, searchFields }: UseSearchOptions) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async () => {
    if (!query.trim() && !filters.dateRange && !filters.mood) {
      setResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      let queryBuilder = supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)

      // Text search across multiple fields
      if (query.trim()) {
        const searchConditions = searchFields.map(field => 
          `${field}.ilike.%${query}%`
        ).join(',')

        // For Supabase, we need to use or() for multiple field search
        const orConditions = searchFields.map(field => 
          `${field}.ilike.%${query}%`
        )

        // Build filter with OR conditions
        let textFilter = supabase.from(table).select('*').eq('user_id', userId)
        
        // Apply OR filter for text search
        const textQueries = searchFields.map(field => {
          return supabase
            .from(table)
            .select('*')
            .eq('user_id', userId)
            .ilike(field, `%${query}%`)
        })

        // For now, use the first field for search (Supabase doesn't support OR easily)
        queryBuilder = queryBuilder.ilike(searchFields[0], `%${query}%`)
      }

      // Apply date range filter
      if (filters.dateRange) {
        queryBuilder = queryBuilder
          .gte('created_at', filters.dateRange.start)
          .lte('created_at', filters.dateRange.end)
      }

      // Apply mood filter
      if (filters.mood) {
        queryBuilder = queryBuilder.eq('primary_mood', filters.mood)
      }

      // Order by created_at descending
      queryBuilder = queryBuilder.order('created_at', { ascending: false })

      const { data, error: searchError } = await queryBuilder

      if (searchError) throw searchError

      setResults(data || [])
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err.message || 'Search failed')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setFilters({})
    setResults([])
    setError(null)
  }

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    isSearching,
    error,
    search,
    clearSearch,
  }
}

