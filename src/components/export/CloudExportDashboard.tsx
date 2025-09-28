'use client'

import React, { useState } from 'react'
import {
  Cloud,
  Mail,
  Share2,
  Clock,
  Download,
  Settings,
  FileText,
  BarChart3,
  Calendar,
  Zap,
  Link,
  QrCode,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react'
import { Expense } from '@/types'
import EmailExportModal from './EmailExportModal'
import GoogleSheetsModal from './GoogleSheetsModal'
import ExportTemplatesModal from './ExportTemplatesModal'
import ScheduleBackupModal from './ScheduleBackupModal'
import ExportHistoryModal from './ExportHistoryModal'
import ShareExportModal from './ShareExportModal'
import CloudStorageModal from './CloudStorageModal'

interface CloudExportDashboardProps {
  expenses: Expense[]
  onClose: () => void
}

export default function CloudExportDashboard({ expenses, onClose }: CloudExportDashboardProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const cloudServices = [
    { name: 'Google Sheets', status: 'connected', icon: '📊', color: 'text-green-600' },
    { name: 'Dropbox', status: 'connected', icon: '📦', color: 'text-blue-600' },
    { name: 'OneDrive', status: 'disconnected', icon: '☁️', color: 'text-gray-400' },
    { name: 'iCloud', status: 'syncing', icon: '🍎', color: 'text-yellow-600' }
  ]

  const recentExports = [
    { id: 1, name: 'Monthly Report - December', type: 'PDF', service: 'Email', timestamp: '2 hours ago', status: 'sent' },
    { id: 2, name: 'Tax Summary 2024', type: 'Excel', service: 'Google Sheets', timestamp: '1 day ago', status: 'synced' },
    { id: 3, name: 'Category Analysis', type: 'CSV', service: 'Dropbox', timestamp: '3 days ago', status: 'backed up' }
  ]

  const exportTemplates = [
    { name: 'Tax Report', description: 'Detailed breakdown for tax filing', icon: FileText, usage: 'High' },
    { name: 'Monthly Summary', description: 'Comprehensive monthly overview', icon: Calendar, usage: 'Medium' },
    { name: 'Category Analysis', description: 'Spending patterns by category', icon: BarChart3, usage: 'Medium' },
    { name: 'Business Expenses', description: 'Professional expense tracking', icon: Globe, usage: 'Low' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Cloud Export Hub</h2>
                <p className="text-blue-100">Connect, Share, and Sync Your Financial Data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Expenses</p>
                  <p className="text-xl font-bold text-blue-900">{expenses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 text-white rounded-lg">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Cloud Backups</p>
                  <p className="text-xl font-bold text-green-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 text-white rounded-lg">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Shared Reports</p>
                  <p className="text-xl font-bold text-purple-900">5</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 text-white rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Auto Exports</p>
                  <p className="text-xl font-bold text-orange-900">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Email Export */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Export</h3>
                    <p className="text-sm text-gray-600">Send reports directly to email</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('email')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Last sent: 2 hours ago</span>
              </div>
            </div>

            {/* Google Sheets */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Google Sheets</h3>
                    <p className="text-sm text-gray-600">Sync to live spreadsheet</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('sheets')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sync Now
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-sync enabled</span>
              </div>
            </div>

            {/* Share & Collaborate */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Share & Collaborate</h3>
                    <p className="text-sm text-gray-600">Generate shareable links & QR codes</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('share')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Link
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Link className="h-4 w-4" />
                  <span>3 active links</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <QrCode className="h-4 w-4" />
                  <span>QR code ready</span>
                </div>
              </div>
            </div>

            {/* Schedule Backups */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Auto Backup</h3>
                    <p className="text-sm text-gray-600">Schedule recurring exports</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('schedule')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Schedule
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Zap className="h-4 w-4 text-orange-500" />
                <span>Next backup: Tomorrow 9:00 AM</span>
              </div>
            </div>
          </div>

          {/* Export Templates */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Templates</h3>
              <button
                onClick={() => setActiveModal('templates')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Templates →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exportTemplates.map((template, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <template.icon className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.usage === 'High' ? 'bg-green-100 text-green-700' :
                      template.usage === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {template.usage} Usage
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveModal('history')}
              className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Export History</span>
            </button>

            <button
              onClick={() => setActiveModal('storage')}
              className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Cloud className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Cloud Storage</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Export Settings</span>
            </button>
          </div>

          {/* Cloud Services Status */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Connected Services
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cloudServices.map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{service.icon}</span>
                    <div className={`h-2 w-2 rounded-full ${
                      service.status === 'connected' ? 'bg-green-500' :
                      service.status === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                      'bg-gray-400'
                    }`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className={`text-xs capitalize ${service.color}`}>{service.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'email' && (
          <EmailExportModal
            expenses={expenses}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'sheets' && (
          <GoogleSheetsModal
            expenses={expenses}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'templates' && (
          <ExportTemplatesModal
            expenses={expenses}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'schedule' && (
          <ScheduleBackupModal
            expenses={expenses}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'history' && (
          <ExportHistoryModal
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'share' && (
          <ShareExportModal
            expenses={expenses}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'storage' && (
          <CloudStorageModal
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  )
}