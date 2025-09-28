'use client'

import React, { useState } from 'react'
import {
  Cloud,
  HardDrive,
  Wifi,
  WifiOff,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Upload,
  Download,
  Folder,
  Shield,
  Zap,
  Clock,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Key,
  Users
} from 'lucide-react'

interface CloudStorageModalProps {
  onClose: () => void
}

interface CloudProvider {
  id: string
  name: string
  icon: string
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  lastSync?: string
  totalFiles: number
  usedSpace: string
  totalSpace: string
  autoSync: boolean
  syncPath: string
  permissions: string[]
}

interface SyncActivity {
  id: string
  provider: string
  action: 'upload' | 'download' | 'sync' | 'delete'
  fileName: string
  status: 'completed' | 'failed' | 'in_progress'
  timestamp: string
  size?: string
}

export default function CloudStorageModal({ onClose }: CloudStorageModalProps) {
  const [activeTab, setActiveTab] = useState<'providers' | 'activity' | 'settings'>('providers')
  const [showAddProvider, setShowAddProvider] = useState(false)

  const cloudProviders: CloudProvider[] = [
    {
      id: 'gdrive',
      name: 'Google Drive',
      icon: '🔗',
      status: 'connected',
      lastSync: '2024-12-15T16:30:00Z',
      totalFiles: 47,
      usedSpace: '2.3 GB',
      totalSpace: '15 GB',
      autoSync: true,
      syncPath: '/ExpenseTracker/Exports',
      permissions: ['read', 'write', 'create_folders']
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      status: 'connected',
      lastSync: '2024-12-15T14:20:00Z',
      totalFiles: 32,
      usedSpace: '1.8 GB',
      totalSpace: '2 GB',
      autoSync: true,
      syncPath: '/Apps/ExpenseTracker',
      permissions: ['read', 'write']
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      status: 'disconnected',
      totalFiles: 0,
      usedSpace: '0 GB',
      totalSpace: '5 GB',
      autoSync: false,
      syncPath: '/ExpenseReports',
      permissions: []
    },
    {
      id: 'icloud',
      name: 'iCloud Drive',
      icon: '🍎',
      status: 'syncing',
      lastSync: '2024-12-15T15:45:00Z',
      totalFiles: 28,
      usedSpace: '1.2 GB',
      totalSpace: '50 GB',
      autoSync: true,
      syncPath: '/Documents/Expenses',
      permissions: ['read', 'write']
    },
    {
      id: 's3',
      name: 'Amazon S3',
      icon: '🪣',
      status: 'error',
      lastSync: '2024-12-14T09:15:00Z',
      totalFiles: 156,
      usedSpace: '5.7 GB',
      totalSpace: 'Unlimited',
      autoSync: false,
      syncPath: '/expense-tracker-bucket/exports',
      permissions: ['read', 'write', 'delete']
    }
  ]

  const availableProviders = [
    { id: 'box', name: 'Box', icon: '📁', description: 'Enterprise cloud storage' },
    { id: 'mega', name: 'MEGA', icon: '🔐', description: 'Encrypted cloud storage' },
    { id: 'pcloud', name: 'pCloud', icon: '☁️', description: 'Secure cloud storage' },
    { id: 'nextcloud', name: 'Nextcloud', icon: '🌐', description: 'Self-hosted solution' }
  ]

  const syncActivity: SyncActivity[] = [
    {
      id: '1',
      provider: 'Google Drive',
      action: 'upload',
      fileName: 'Monthly_Report_Dec_2024.pdf',
      status: 'completed',
      timestamp: '2024-12-15T16:30:00Z',
      size: '2.3 MB'
    },
    {
      id: '2',
      provider: 'Dropbox',
      action: 'sync',
      fileName: 'Tax_Summary_2024.xlsx',
      status: 'completed',
      timestamp: '2024-12-15T14:20:00Z',
      size: '1.8 MB'
    },
    {
      id: '3',
      provider: 'iCloud Drive',
      action: 'upload',
      fileName: 'Category_Analysis_Q4.pdf',
      status: 'in_progress',
      timestamp: '2024-12-15T15:45:00Z',
      size: '3.1 MB'
    },
    {
      id: '4',
      provider: 'Amazon S3',
      action: 'upload',
      fileName: 'Weekly_Backup.csv',
      status: 'failed',
      timestamp: '2024-12-14T09:15:00Z',
      size: '450 KB'
    },
    {
      id: '5',
      provider: 'Google Drive',
      action: 'delete',
      fileName: 'Old_Report_Nov.pdf',
      status: 'completed',
      timestamp: '2024-12-14T11:30:00Z'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'syncing': return 'text-blue-600'
      case 'disconnected': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5" />
      case 'syncing': return <RefreshCw className="h-5 w-5 animate-spin" />
      case 'disconnected': return <WifiOff className="h-5 w-5" />
      case 'error': return <AlertTriangle className="h-5 w-5" />
      default: return <Cloud className="h-5 w-5" />
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload': return <Upload className="h-4 w-4" />
      case 'download': return <Download className="h-4 w-4" />
      case 'sync': return <RefreshCw className="h-4 w-4" />
      case 'delete': return <Trash2 className="h-4 w-4" />
      default: return <Cloud className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.ceil(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const calculateUsagePercentage = (used: string, total: string) => {
    if (total === 'Unlimited') return 0
    const usedNum = parseFloat(used.replace(/[^\d.]/g, ''))
    const totalNum = parseFloat(total.replace(/[^\d.]/g, ''))
    return Math.round((usedNum / totalNum) * 100)
  }

  const handleConnect = (providerId: string) => {
    alert(`Connecting to ${availableProviders.find(p => p.id === providerId)?.name}...`)
    setShowAddProvider(false)
  }

  const handleDisconnect = (providerId: string) => {
    const provider = cloudProviders.find(p => p.id === providerId)
    if (provider && confirm(`Disconnect from ${provider.name}?`)) {
      alert(`Disconnected from ${provider.name}`)
    }
  }

  const handleSync = (providerId: string) => {
    const provider = cloudProviders.find(p => p.id === providerId)
    if (provider) {
      alert(`Starting sync with ${provider.name}...`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Cloud Storage</h3>
                <p className="text-blue-100 text-sm">Manage your cloud storage connections and sync settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'providers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cloud Providers ({cloudProviders.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sync Activity
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'providers' && (
            <div>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Connected</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {cloudProviders.filter(p => p.status === 'connected').length}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Total Files</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {cloudProviders.reduce((sum, p) => sum + p.totalFiles, 0)}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Auto-Sync</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">
                    {cloudProviders.filter(p => p.autoSync).length}
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Last Sync</span>
                  </div>
                  <p className="text-sm font-bold text-orange-700">2m ago</p>
                </div>
              </div>

              {/* Connected Providers */}
              <div className="space-y-4 mb-6">
                {cloudProviders.map((provider) => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{provider.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {provider.name}
                            <div className={`flex items-center gap-1 ${getStatusColor(provider.status)}`}>
                              {getStatusIcon(provider.status)}
                              <span className="text-sm font-medium capitalize">{provider.status}</span>
                            </div>
                          </h4>
                          <p className="text-sm text-gray-600">{provider.syncPath}</p>
                          {provider.lastSync && (
                            <p className="text-xs text-gray-500">Last sync: {formatDate(provider.lastSync)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {provider.status === 'connected' && (
                          <button
                            onClick={() => handleSync(provider.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Sync now"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDisconnect(provider.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Files Stored</p>
                        <p className="text-lg font-bold text-gray-900">{provider.totalFiles}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Storage Used</p>
                        <p className="text-lg font-bold text-gray-900">{provider.usedSpace}</p>
                        {provider.totalSpace !== 'Unlimited' && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${calculateUsagePercentage(provider.usedSpace, provider.totalSpace)}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Auto-Sync</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${provider.autoSync ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm text-gray-600">{provider.autoSync ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.permissions.map((perm, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Provider */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {!showAddProvider ? (
                  <div>
                    <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Add Cloud Provider</h4>
                    <p className="text-gray-600 mb-4">Connect additional cloud storage services</p>
                    <button
                      onClick={() => setShowAddProvider(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add Provider
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Select a Provider</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {availableProviders.map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => handleConnect(provider.id)}
                          className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="text-2xl mb-2">{provider.icon}</div>
                          <h5 className="font-medium text-gray-900">{provider.name}</h5>
                          <p className="text-xs text-gray-600">{provider.description}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowAddProvider(false)}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              {/* Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Upload className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-900">Uploads</p>
                  <p className="text-xl font-bold text-blue-700">
                    {syncActivity.filter(a => a.action === 'upload').length}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <Download className="h-5 w-5 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-900">Downloads</p>
                  <p className="text-xl font-bold text-green-700">
                    {syncActivity.filter(a => a.action === 'download').length}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <RefreshCw className="h-5 w-5 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-purple-900">Syncs</p>
                  <p className="text-xl font-bold text-purple-700">
                    {syncActivity.filter(a => a.action === 'sync').length}
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <CheckCircle className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-orange-900">Completed</p>
                  <p className="text-xl font-bold text-orange-700">
                    {syncActivity.filter(a => a.status === 'completed').length}
                  </p>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600 mb-2" />
                  <p className="text-sm font-medium text-red-900">Failed</p>
                  <p className="text-xl font-bold text-red-700">
                    {syncActivity.filter(a => a.status === 'failed').length}
                  </p>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3">
                {syncActivity.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'completed' ? 'bg-green-100' :
                          activity.status === 'failed' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {getActionIcon(activity.action)}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{activity.fileName}</h5>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{activity.provider}</span>
                            <span>{activity.action}</span>
                            {activity.size && <span>{activity.size}</span>}
                            <span>{formatDate(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activity.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {activity.status === 'in_progress' ? 'In Progress' : activity.status}
                        </span>
                        {activity.status === 'failed' && (
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Global Settings */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Global Sync Settings</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Sync Frequency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Real-time</option>
                        <option>Every 15 minutes</option>
                        <option>Every hour</option>
                        <option>Daily</option>
                        <option>Manual only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conflict Resolution
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Keep newest version</option>
                        <option>Ask me each time</option>
                        <option>Create duplicate</option>
                        <option>Keep cloud version</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Enable automatic backup scheduling</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Compress files before uploading</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Sync only on Wi-Fi</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Send notifications for sync events</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Security & Privacy</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-yellow-900 mb-1">Encryption Settings</h5>
                      <p className="text-sm text-yellow-700">All data is encrypted in transit and at rest using AES-256 encryption.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Enable end-to-end encryption</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Require two-factor authentication</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Log all sync activities</span>
                  </label>
                </div>
              </div>

              {/* Storage Management */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Storage Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-delete old exports after
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Never</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>6 months</option>
                      <option>1 year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum file size
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>10 MB</option>
                      <option>25 MB</option>
                      <option>50 MB</option>
                      <option>100 MB</option>
                      <option>No limit</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{cloudProviders.filter(p => p.status === 'connected').length} providers connected</span>
            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              View Usage Stats
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