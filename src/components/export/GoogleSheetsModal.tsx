'use client'

import React, { useState } from 'react'
import {
  RefreshCw,
  CheckCircle,
  Settings,
  ExternalLink,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  Sync,
  AlertTriangle,
  Clock,
  Users,
  Shield
} from 'lucide-react'
import { Expense } from '@/types'

interface GoogleSheetsModalProps {
  expenses: Expense[]
  onClose: () => void
}

export default function GoogleSheetsModal({ expenses, onClose }: GoogleSheetsModalProps) {
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)
  const [activeSheet, setActiveSheet] = useState('ExpenseTracker2024')
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState('realtime')

  const sheets = [
    {
      name: 'ExpenseTracker2024',
      url: 'https://docs.google.com/spreadsheets/d/abc123/edit',
      lastSync: '2 minutes ago',
      status: 'synced',
      rows: 1247
    },
    {
      name: 'TaxDocuments2024',
      url: 'https://docs.google.com/spreadsheets/d/def456/edit',
      lastSync: '1 hour ago',
      status: 'pending',
      rows: 892
    },
    {
      name: 'BusinessExpenses',
      url: 'https://docs.google.com/spreadsheets/d/ghi789/edit',
      lastSync: 'Never',
      status: 'new',
      rows: 0
    }
  ]

  const syncOptions = [
    { value: 'realtime', label: 'Real-time', description: 'Sync immediately when expenses change' },
    { value: 'hourly', label: 'Every Hour', description: 'Sync every hour automatically' },
    { value: 'daily', label: 'Daily', description: 'Sync once per day at 9:00 AM' },
    { value: 'manual', label: 'Manual Only', description: 'Sync only when manually triggered' }
  ]

  const handleSync = async () => {
    setSyncing(true)
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setSyncing(false)
    setSynced(true)

    // Reset after showing success
    setTimeout(() => setSynced(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Google Sheets Integration</h3>
                <p className="text-green-100 text-sm">Sync your expenses to Google Sheets in real-time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
              disabled={syncing}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Ready to Sync</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{expenses.length}</p>
              <p className="text-xs text-green-600">Expenses</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Value</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-blue-600">Amount</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Sync className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Sync Status</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">✓</p>
              <p className="text-xs text-purple-600">Connected</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Last Sync</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">2m</p>
              <p className="text-xs text-orange-600">ago</p>
            </div>
          </div>

          {/* Sync Status */}
          {syncing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h4 className="font-medium text-blue-900">Syncing to Google Sheets...</h4>
                  <p className="text-sm text-blue-700">Uploading {expenses.length} expenses to "{activeSheet}"</p>
                </div>
              </div>
            </div>
          )}

          {synced && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Sync Completed Successfully!</h4>
                  <p className="text-sm text-green-700">{expenses.length} expenses synced to Google Sheets</p>
                </div>
              </div>
            </div>
          )}

          {/* Connected Sheets */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connected Spreadsheets</h4>
            <div className="space-y-3">
              {sheets.map((sheet, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    activeSheet === sheet.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSheet(sheet.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        sheet.status === 'synced' ? 'bg-green-500' :
                        sheet.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{sheet.name}</h5>
                        <p className="text-sm text-gray-600">
                          {sheet.rows} rows • Last sync: {sheet.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        sheet.status === 'synced' ? 'bg-green-100 text-green-700' :
                        sheet.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {sheet.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(sheet.url, '_blank')
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Settings */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sync Settings</h4>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-medium text-gray-900">Auto-Sync</h5>
                  <p className="text-sm text-gray-600">Automatically sync changes to Google Sheets</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {autoSync && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Frequency
                  </label>
                  <select
                    value={syncFrequency}
                    onChange={(e) => setSyncFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {syncOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {syncOptions.find(opt => opt.value === syncFrequency)?.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sheet Configuration Preview */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sheet Configuration</h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h5 className="font-medium text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Preview: {activeSheet}
                </h5>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Date</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Description</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Category</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.slice(0, 3).map((expense, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-600">{expense.date}</td>
                          <td className="py-2 px-3 text-gray-900">{expense.description}</td>
                          <td className="py-2 px-3 text-gray-600">{expense.category}</td>
                          <td className="py-2 px-3 text-gray-900">{formatCurrency(expense.amount)}</td>
                          <td className="py-2 px-3">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Synced
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={5} className="py-2 px-3 text-center text-gray-500 text-sm">
                          ... and {expenses.length - 3} more rows
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Permissions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Security & Permissions</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Read/Write access to your selected Google Sheets</li>
                  <li>• Data is encrypted in transit using TLS 1.3</li>
                  <li>• You can revoke access anytime from your Google Account</li>
                  <li>• We never store your Google credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Advanced Settings
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Share Sheet
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={syncing}
            >
              Close
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}