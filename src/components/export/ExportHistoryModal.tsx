'use client'

import React, { useState } from 'react'
import {
  Clock,
  Download,
  Eye,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  FileText,
  Mail,
  Share2,
  Cloud,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  Trash2
} from 'lucide-react'

interface ExportHistoryModalProps {
  onClose: () => void
}

interface ExportRecord {
  id: string
  name: string
  type: 'manual' | 'scheduled' | 'shared'
  format: string
  size: string
  status: 'completed' | 'failed' | 'pending' | 'expired'
  createdAt: string
  expiresAt?: string
  downloadUrl?: string
  destination: string[]
  records: number
  sharedWith?: string[]
  downloadCount: number
}

export default function ExportHistoryModal({ onClose }: ExportHistoryModalProps) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])

  const exportHistory: ExportRecord[] = [
    {
      id: '1',
      name: 'Monthly Report - December 2024',
      type: 'manual',
      format: 'PDF',
      size: '2.3 MB',
      status: 'completed',
      createdAt: '2024-12-15T14:30:00Z',
      expiresAt: '2024-12-29T14:30:00Z',
      downloadUrl: '#',
      destination: ['Download', 'Email'],
      records: 156,
      downloadCount: 3
    },
    {
      id: '2',
      name: 'Tax Summary 2024 (Auto)',
      type: 'scheduled',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed',
      createdAt: '2024-12-14T09:00:00Z',
      downloadUrl: '#',
      destination: ['Google Drive', 'Email'],
      records: 1247,
      downloadCount: 1
    },
    {
      id: '3',
      name: 'Category Analysis Q4',
      type: 'shared',
      format: 'PDF',
      size: '3.1 MB',
      status: 'completed',
      createdAt: '2024-12-13T16:45:00Z',
      expiresAt: '2024-12-27T16:45:00Z',
      downloadUrl: '#',
      destination: ['Shared Link'],
      records: 892,
      sharedWith: ['john@company.com', 'sarah@company.com'],
      downloadCount: 7
    },
    {
      id: '4',
      name: 'Weekly Backup',
      type: 'scheduled',
      format: 'CSV',
      size: '450 KB',
      status: 'failed',
      createdAt: '2024-12-12T09:00:00Z',
      destination: ['Dropbox'],
      records: 234,
      downloadCount: 0
    },
    {
      id: '5',
      name: 'Business Expenses November',
      type: 'manual',
      format: 'PDF + Excel',
      size: '4.2 MB',
      status: 'expired',
      createdAt: '2024-11-30T11:20:00Z',
      expiresAt: '2024-12-14T11:20:00Z',
      destination: ['Download'],
      records: 678,
      downloadCount: 2
    },
    {
      id: '6',
      name: 'Daily Sync',
      type: 'scheduled',
      format: 'JSON',
      size: '180 KB',
      status: 'pending',
      createdAt: '2024-12-15T18:00:00Z',
      destination: ['Google Sheets'],
      records: 45,
      downloadCount: 0
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Exports', count: exportHistory.length },
    { value: 'manual', label: 'Manual', count: exportHistory.filter(e => e.type === 'manual').length },
    { value: 'scheduled', label: 'Scheduled', count: exportHistory.filter(e => e.type === 'scheduled').length },
    { value: 'shared', label: 'Shared', count: exportHistory.filter(e => e.type === 'shared').length },
    { value: 'completed', label: 'Completed', count: exportHistory.filter(e => e.status === 'completed').length },
    { value: 'failed', label: 'Failed', count: exportHistory.filter(e => e.status === 'failed').length }
  ]

  const filteredHistory = exportHistory.filter(record => {
    const matchesFilter = filter === 'all' || record.type === filter || record.status === filter
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.format.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'expired': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full font-medium"
    switch (status) {
      case 'completed': return `${baseClasses} bg-green-100 text-green-700`
      case 'failed': return `${baseClasses} bg-red-100 text-red-700`
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-700`
      case 'expired': return `${baseClasses} bg-orange-100 text-orange-700`
      default: return `${baseClasses} bg-gray-100 text-gray-700`
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manual': return <Download className="h-4 w-4" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'shared': return <Share2 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const handleBulkDelete = () => {
    if (selectedRecords.length > 0) {
      alert(`Deleted ${selectedRecords.length} export record(s)`)
      setSelectedRecords([])
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Export History</h3>
                <p className="text-indigo-100 text-sm">View and manage your export records</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Exports</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{exportHistory.length}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {exportHistory.filter(e => e.status === 'completed').length}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Downloads</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {exportHistory.reduce((sum, e) => sum + e.downloadCount, 0)}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Shared</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {exportHistory.filter(e => e.type === 'shared').length}
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {exportHistory.filter(e => e.status === 'failed').length}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRecords.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRecords.length} record(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedRecords([])}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Export Records */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((record) => (
              <div
                key={record.id}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                  selectedRecords.includes(record.id) ? 'bg-blue-50 border-blue-300' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.type)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        record.type === 'manual' ? 'bg-blue-100 text-blue-700' :
                        record.type === 'scheduled' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {record.type}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{record.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{record.format} • {record.size}</span>
                        <span>{record.records} records</span>
                        <span>{formatDate(record.createdAt)}</span>
                        {record.downloadCount > 0 && (
                          <span>{record.downloadCount} downloads</span>
                        )}
                      </div>
                      {record.destination.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {record.destination.map((dest, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {dest}
                            </span>
                          ))}
                        </div>
                      )}
                      {record.sharedWith && record.sharedWith.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Shared with: </span>
                          <span className="text-xs text-gray-700">{record.sharedWith.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </div>
                    {record.status === 'completed' && record.downloadUrl && (
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        {record.type === 'shared' && (
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                    {record.status === 'failed' && (
                      <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {record.expiresAt && record.status !== 'expired' && (
                  <div className="mt-3 text-xs text-orange-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Expires on {new Date(record.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No exports found</h4>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredHistory.length} of {exportHistory.length} records</span>
            <button className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}