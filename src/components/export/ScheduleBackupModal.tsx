'use client'

import React, { useState } from 'react'
import {
  Clock,
  Calendar,
  Zap,
  Save,
  Settings,
  Mail,
  Cloud,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Plus,
  Bell,
  Shield,
  Archive
} from 'lucide-react'
import { Expense } from '@/types'

interface ScheduleBackupModalProps {
  expenses: Expense[]
  onClose: () => void
}

interface BackupSchedule {
  id: string
  name: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  time: string
  destination: string[]
  format: string
  enabled: boolean
  lastRun: string
  nextRun: string
  status: 'active' | 'paused' | 'failed'
}

export default function ScheduleBackupModal({ expenses, onClose }: ScheduleBackupModalProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing')
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly' as const,
    time: '09:00',
    destinations: [] as string[],
    format: 'pdf',
    notifications: true,
    retention: '12' // months
  })

  const existingSchedules: BackupSchedule[] = [
    {
      id: '1',
      name: 'Weekly Tax Backup',
      frequency: 'weekly',
      time: '09:00',
      destination: ['Google Drive', 'Email'],
      format: 'PDF + Excel',
      enabled: true,
      lastRun: '3 days ago',
      nextRun: 'Tomorrow 9:00 AM',
      status: 'active'
    },
    {
      id: '2',
      name: 'Monthly Financial Report',
      frequency: 'monthly',
      time: '08:00',
      destination: ['Dropbox', 'Slack'],
      format: 'PDF',
      enabled: true,
      lastRun: '2 weeks ago',
      nextRun: 'Dec 1, 2024 8:00 AM',
      status: 'active'
    },
    {
      id: '3',
      name: 'Daily Expense Sync',
      frequency: 'daily',
      time: '18:00',
      destination: ['Google Sheets'],
      format: 'CSV',
      enabled: false,
      lastRun: '1 week ago',
      nextRun: 'Paused',
      status: 'paused'
    }
  ]

  const destinationOptions = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Send to specified email addresses' },
    { id: 'gdrive', name: 'Google Drive', icon: Cloud, description: 'Save to Google Drive folder' },
    { id: 'dropbox', name: 'Dropbox', icon: Archive, description: 'Upload to Dropbox' },
    { id: 'sheets', name: 'Google Sheets', icon: '📊', description: 'Sync to Google Sheets' },
    { id: 'slack', name: 'Slack', icon: '💬', description: 'Post to Slack channel' },
    { id: 'onedrive', name: 'OneDrive', icon: Cloud, description: 'Save to OneDrive' }
  ]

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', size: '~2MB' },
    { value: 'excel', label: 'Excel Spreadsheet', size: '~1MB' },
    { value: 'csv', label: 'CSV Data', size: '~100KB' },
    { value: 'json', label: 'JSON Export', size: '~150KB' },
    { value: 'combined', label: 'PDF + Excel', size: '~3MB' }
  ]

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day at specified time' },
    { value: 'weekly', label: 'Weekly', description: 'Every week on selected day' },
    { value: 'monthly', label: 'Monthly', description: 'Monthly on selected date' },
    { value: 'custom', label: 'Custom', description: 'Set custom intervals' }
  ]

  const handleDestinationToggle = (destinationId: string) => {
    setNewSchedule(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destinationId)
        ? prev.destinations.filter(d => d !== destinationId)
        : [...prev.destinations, destinationId]
    }))
  }

  const handleCreateSchedule = () => {
    // Simulate creating schedule
    alert('Backup schedule created successfully!')
    setActiveTab('existing')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'paused': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Automated Backups</h3>
                <p className="text-orange-100 text-sm">Schedule recurring exports and backups</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('existing')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'existing'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Existing Schedules ({existingSchedules.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Create New Schedule
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {activeTab === 'existing' ? (
            <div>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Active</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {existingSchedules.filter(s => s.status === 'active').length}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Paused</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">
                    {existingSchedules.filter(s => s.status === 'paused').length}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Total Backups</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">47</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Next Run</span>
                  </div>
                  <p className="text-sm font-bold text-purple-700">Tomorrow 9:00 AM</p>
                </div>
              </div>

              {/* Existing Schedules */}
              <div className="space-y-4">
                {existingSchedules.map((schedule) => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          schedule.status === 'active' ? 'bg-green-100' :
                          schedule.status === 'paused' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          <Calendar className={`h-5 w-5 ${
                            schedule.status === 'active' ? 'text-green-600' :
                            schedule.status === 'paused' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                          <p className="text-sm text-gray-600">
                            {schedule.frequency} at {schedule.time} • {schedule.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-sm ${getStatusColor(schedule.status)}`}>
                          {getStatusIcon(schedule.status)}
                          {schedule.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Destinations</p>
                        <div className="flex flex-wrap gap-1">
                          {schedule.destination.map((dest, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Last Run</p>
                        <p className="text-sm text-gray-600">{schedule.lastRun}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Next Run</p>
                        <p className="text-sm text-gray-600">{schedule.nextRun}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Frequency: {schedule.frequency}</span>
                        <span>•</span>
                        <span>Time: {schedule.time}</span>
                      </div>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        schedule.enabled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                        {schedule.enabled ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Create New Schedule */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule Name
                      </label>
                      <input
                        type="text"
                        value={newSchedule.name}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Weekly Tax Backup"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frequency
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {frequencyOptions.map((option) => (
                      <label key={option.value} className="relative">
                        <input
                          type="radio"
                          name="frequency"
                          value={option.value}
                          checked={newSchedule.frequency === option.value}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                          className="sr-only peer"
                        />
                        <div className="border border-gray-300 rounded-lg p-3 cursor-pointer peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:bg-gray-50">
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-600">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Destinations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Backup Destinations
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {destinationOptions.map((destination) => (
                      <label key={destination.id} className="relative">
                        <input
                          type="checkbox"
                          checked={newSchedule.destinations.includes(destination.id)}
                          onChange={() => handleDestinationToggle(destination.id)}
                          className="sr-only peer"
                        />
                        <div className="border border-gray-300 rounded-lg p-4 cursor-pointer peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            {typeof destination.icon === 'string' ? (
                              <span className="text-xl">{destination.icon}</span>
                            ) : (
                              <destination.icon className="h-5 w-5 text-gray-600" />
                            )}
                            <span className="font-medium text-gray-900">{destination.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">{destination.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Export Format
                  </label>
                  <select
                    value={newSchedule.format}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {formatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.size})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Options */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newSchedule.notifications}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Send notifications on successful backups
                      </span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retention Period
                      </label>
                      <select
                        value={newSchedule.retention}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, retention: e.target.value }))}
                        className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                        <option value="forever">Forever</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">How long to keep backup files</p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Schedule Preview
                  </h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {newSchedule.name || 'Untitled Schedule'}</p>
                    <p><strong>Frequency:</strong> {frequencyOptions.find(f => f.value === newSchedule.frequency)?.label} at {newSchedule.time}</p>
                    <p><strong>Destinations:</strong> {
                      newSchedule.destinations.length > 0
                        ? newSchedule.destinations.map(d => destinationOptions.find(opt => opt.id === d)?.name).join(', ')
                        : 'None selected'
                    }</p>
                    <p><strong>Format:</strong> {formatOptions.find(f => f.value === newSchedule.format)?.label}</p>
                    <p><strong>Data:</strong> {expenses.length} expenses</p>
                  </div>
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
                <span>All backups are encrypted and secure</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('existing')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSchedule}
                  disabled={!newSchedule.name || newSchedule.destinations.length === 0}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Create Schedule
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="h-4 w-4" />
                New Schedule
              </button>
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