'use client'

import { ReactNode } from 'react'
import styles from './Table.module.css'

interface TableProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'striped'
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

interface TableRowProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  selected?: boolean
}

interface TableCellProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  className?: string
}

interface TableHeadProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  sortable?: boolean
  onSort?: () => void
  sortDirection?: 'asc' | 'desc' | null
  className?: string
}

// Main Table Component
export function Table({ children, className, variant = 'default' }: TableProps) {
  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={`${styles.table} ${styles[variant]}`}>
        {children}
      </table>
    </div>
  )
}

// Table Header
function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={`${styles.thead} ${className || ''}`}>
      {children}
    </thead>
  )
}

// Table Body
function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={`${styles.tbody} ${className || ''}`}>
      {children}
    </tbody>
  )
}

// Table Row
function TableRow({ children, onClick, className, selected }: TableRowProps) {
  return (
    <tr 
      className={`${styles.row} ${onClick ? styles.clickable : ''} ${selected ? styles.selected : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// Table Head Cell
function TableHead({ 
  children, 
  align = 'left', 
  width, 
  sortable, 
  onSort, 
  sortDirection,
  className 
}: TableHeadProps) {
  return (
    <th 
      className={`${styles.th} ${styles[`align-${align}`]} ${sortable ? styles.sortable : ''} ${className || ''}`}
      style={{ width }}
      onClick={sortable ? onSort : undefined}
    >
      <div className={styles.thContent}>
        {children}
        {sortable && (
          <span className={styles.sortIcon}>
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  )
}

// Table Cell
function TableCell({ children, align = 'left', width, className }: TableCellProps) {
  return (
    <td 
      className={`${styles.td} ${styles[`align-${align}`]} ${className || ''}`}
      style={{ width }}
    >
      {children}
    </td>
  )
}

// Attach compound components
Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell

// Export for convenience
export { TableHeader, TableBody, TableRow, TableHead, TableCell }








