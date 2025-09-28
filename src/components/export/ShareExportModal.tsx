'use client'

import React, { useState } from 'react'
import {
  Share2,
  Link,
  QrCode,
  Copy,
  Mail,
  Users,
  Eye,
  EyeOff,
  Calendar,
  Shield,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  Globe,
  Key
} from 'lucide-react'
import { Expense } from '@/types'

interface ShareExportModalProps {
  expenses: Expense[]
  onClose: () => void
}

interface ShareLink {
  id: string
  name: string
  url: string
  password?: string
  expiresAt?: string
  viewCount: number
  downloadCount: number
  allowDownload: boolean
  allowPrint: boolean
  status: 'active' | 'expired' | 'disabled'
  createdAt: string
  lastAccessed?: string
}

export default function ShareExportModal({ expenses, onClose }: ShareExportModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [shareSettings, setShareSettings] = useState({
    name: '',
    format: 'pdf',
    template: 'monthly-summary',
    password: '',
    expiresIn: '7', // days
    allowDownload: true,
    allowPrint: true,
    requirePassword: false,
    trackViews: true
  })
  const [generatedLink, setGeneratedLink] = useState<string>('')
  const [qrCodeData, setQrCodeData] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const existingLinks: ShareLink[] = [
    {
      id: '1',
      name: 'Monthly Report - December',
      url: 'https://share.expensetracker.ai/report/abc123def456',
      password: 'secure123',
      expiresAt: '2024-12-29T23:59:59Z',
      viewCount: 12,
      downloadCount: 3,
      allowDownload: true,
      allowPrint: true,
      status: 'active',
      createdAt: '2024-12-15T10:30:00Z',
      lastAccessed: '2024-12-15T16:45:00Z'
    },
    {
      id: '2',
      name: 'Q4 Business Expenses',
      url: 'https://share.expensetracker.ai/report/ghi789jkl012',
      expiresAt: '2024-12-25T23:59:59Z',
      viewCount: 8,
      downloadCount: 2,
      allowDownload: false,
      allowPrint: true,
      status: 'active',
      createdAt: '2024-12-10T14:20:00Z',
      lastAccessed: '2024-12-14T09:15:00Z'
    },
    {
      id: '3',
      name: 'Tax Summary 2024',
      url: 'https://share.expensetracker.ai/report/mno345pqr678',
      viewCount: 25,
      downloadCount: 8,
      allowDownload: true,
      allowPrint: true,
      status: 'expired',
      createdAt: '2024-11-28T11:45:00Z',
      lastAccessed: '2024-12-05T13:20:00Z'
    }
  ]

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: '📄' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: '📊' },
    { value: 'html', label: 'Interactive Web View', icon: '🌐' },
    { value: 'dashboard', label: 'Live Dashboard', icon: '📈' }
  ]

  const templateOptions = [
    { value: 'monthly-summary', label: 'Monthly Summary', description: 'Complete overview with charts' },
    { value: 'category-analysis', label: 'Category Analysis', description: 'Detailed category breakdown' },
    { value: 'executive-summary', label: 'Executive Summary', description: 'High-level insights' },
    { value: 'detailed-report', label: 'Detailed Report', description: 'Full expense listing' }
  ]

  const expiryOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' },
    { value: '0', label: 'Never expires' }
  ]

  const handleGenerateLink = async () => {
    setGenerating(true)

    // Simulate link generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockLink = 'https://share.expensetracker.ai/report/xyz789abc123'
    setGeneratedLink(mockLink)
    setQrCodeData(mockLink)
    setGenerating(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generatedLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'expired': return 'text-red-600'
      case 'disabled': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'expired': return <AlertTriangle className="h-4 w-4" />
      case 'disabled': return <EyeOff className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateExpiryDate = (days: string) => {
    if (days === '0') return 'Never expires'
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + parseInt(days))
    return expiry.toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Share & Collaborate</h3>
                <p className="text-purple-100 text-sm">Create shareable links and QR codes for your reports</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Share Link
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'manage'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Links ({existingLinks.length})
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'create' ? (
            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share Name
                    </label>
                    <input
                      type="text"
                      value={shareSettings.name}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., December Expense Report"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <select
                      value={shareSettings.format}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {formatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Report Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templateOptions.map((template) => (
                    <label key={template.value} className="relative">
                      <input
                        type="radio"
                        name="template"
                        value={template.value}
                        checked={shareSettings.template === template.value}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, template: e.target.value }))}
                        className="sr-only peer"
                      />
                      <div className="border border-gray-300 rounded-lg p-3 cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:bg-gray-50">
                        <p className="font-medium text-gray-900">{template.label}</p>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security & Access */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Security & Access</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expires In
                      </label>
                      <select
                        value={shareSettings.expiresIn}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {expiryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires on: {calculateExpiryDate(shareSettings.expiresIn)}
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={shareSettings.requirePassword}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, requirePassword: e.target.checked }))}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Require Password</span>
                      </label>
                      {shareSettings.requirePassword && (
                        <input
                          type="text"
                          value={shareSettings.password}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={shareSettings.allowDownload}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Allow Download
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={shareSettings.allowPrint}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, allowPrint: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow Printing</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={shareSettings.trackViews}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, trackViews: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Track Views
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Share Preview
                </h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {shareSettings.name || 'Untitled Share'}</p>
                  <p><strong>Format:</strong> {formatOptions.find(f => f.value === shareSettings.format)?.label}</p>
                  <p><strong>Template:</strong> {templateOptions.find(t => t.value === shareSettings.template)?.label}</p>
                  <p><strong>Expires:</strong> {calculateExpiryDate(shareSettings.expiresIn)}</p>
                  <p><strong>Protected:</strong> {shareSettings.requirePassword ? 'Yes (Password required)' : 'No'}</p>
                  <p><strong>Records:</strong> {expenses.length} expenses</p>
                </div>
              </div>

              {/* Generated Link */}
              {generatedLink && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Share Link Generated
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          copied
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg border border-green-300 inline-block">
                          <QrCode className="h-24 w-24 text-gray-400 mx-auto" />
                        </div>
                        <p className="text-sm text-green-700 mt-2">QR Code for Mobile Access</p>
                      </div>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Mail className="h-4 w-4" />
                          Send via Email
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <Smartphone className="h-4 w-4" />
                          Send to Mobile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Existing Links Management */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Share Links</h4>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Active Links</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {existingLinks.filter(l => l.status === 'active').length}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total Views</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {existingLinks.reduce((sum, l) => sum + l.viewCount, 0)}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Downloads</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {existingLinks.reduce((sum, l) => sum + l.downloadCount, 0)}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Expired</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">
                      {existingLinks.filter(l => l.status === 'expired').length}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {existingLinks.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-medium text-gray-900 truncate">{link.name}</h5>
                            <div className={`flex items-center gap-1 ${getStatusColor(link.status)}`}>
                              {getStatusIcon(link.status)}
                              <span className="text-xs font-medium capitalize">{link.status}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="truncate">{link.url}</p>
                            <div className="flex items-center gap-4">
                              <span>{link.viewCount} views</span>
                              <span>{link.downloadCount} downloads</span>
                              <span>Created {formatDate(link.createdAt)}</span>
                              {link.lastAccessed && (
                                <span>Last accessed {formatDate(link.lastAccessed)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {link.password && (
                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                  <Key className="h-3 w-3" />
                                  Password Protected
                                </span>
                              )}
                              {link.allowDownload && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Download Enabled</span>
                              )}
                              {!link.allowPrint && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Print Disabled</span>
                              )}
                              {link.expiresAt && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  Expires {formatDate(link.expiresAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          {activeTab === 'create' ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>All shared links are encrypted and secure</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateLink}
                  disabled={generating || !shareSettings.name}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Generate Link
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{existingLinks.length} share links</span>
                <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export Analytics
                </button>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}