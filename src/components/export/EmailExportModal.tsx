'use client'

import React, { useState } from 'react'
import { Mail, Send, FileText, Calendar, Users, Clock, CheckCircle } from 'lucide-react'
import { Expense } from '@/types'

interface EmailExportModalProps {
  expenses: Expense[]
  onClose: () => void
}

export default function EmailExportModal({ expenses, onClose }: EmailExportModalProps) {
  const [recipients, setRecipients] = useState([''])
  const [subject, setSubject] = useState('Expense Report - ' + new Date().toLocaleDateString())
  const [message, setMessage] = useState(`Hi there,

Please find attached your expense report for the period ending ${new Date().toLocaleDateString()}.

This report includes ${expenses.length} expenses with detailed breakdowns and analysis.

Best regards,
Expense Tracker AI`)
  const [format, setFormat] = useState('pdf')
  const [schedule, setSchedule] = useState('now')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeReceipts, setIncludeReceipts] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const addRecipient = () => {
    setRecipients([...recipients, ''])
  }

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
  }

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const handleSend = async () => {
    setSending(true)
    // Simulate sending process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSending(false)
    setSent(true)

    // Auto close after success
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Sent Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your expense report has been sent to {recipients.filter(r => r.trim()).length} recipient(s).
          </p>
          <div className="text-sm text-gray-500">
            Closing automatically...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Email Export</h3>
                <p className="text-blue-100 text-sm">Send your expense report via email</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              disabled={sending}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Recipients */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients
            </label>
            {recipients.map((recipient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeRecipient(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 border border-gray-300 rounded-lg hover:bg-red-50"
                  disabled={recipients.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addRecipient}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add another recipient
            </button>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
                <option value="json">JSON Data</option>
              </select>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Schedule
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="now">Send Now</option>
                <option value="later">Schedule for Later</option>
                <option value="recurring">Set Up Recurring</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Export
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Charts and Visualizations</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeReceipts}
                  onChange={(e) => setIncludeReceipts(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Receipt Images (Pro Feature)</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Email Preview
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>To:</strong> {recipients.filter(r => r.trim()).join(', ') || 'No recipients'}</p>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>Format:</strong> {format.toUpperCase()}</p>
              <p><strong>Expenses:</strong> {expenses.length} items</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-900">{expenses.length}</p>
              <p className="text-xs text-blue-600">Expenses</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <Calendar className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-900">
                {expenses.length > 0 ? Math.ceil((new Date().getTime() - new Date(Math.min(...expenses.map(e => new Date(e.date).getTime()))).getTime()) / (1000 * 3600 * 24)) : 0}
              </p>
              <p className="text-xs text-green-600">Days</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-purple-900">{recipients.filter(r => r.trim()).length}</p>
              <p className="text-xs text-purple-600">Recipients</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Estimated delivery: Immediately</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || recipients.filter(r => r.trim()).length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}