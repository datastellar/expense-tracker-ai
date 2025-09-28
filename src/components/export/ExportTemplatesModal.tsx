'use client'

import React, { useState } from 'react'
import {
  FileText,
  Calendar,
  BarChart3,
  Globe,
  Download,
  Eye,
  Star,
  Clock,
  TrendingUp,
  PieChart,
  Receipt,
  Building,
  CreditCard,
  Tag,
  Filter,
  Search
} from 'lucide-react'
import { Expense } from '@/types'

interface ExportTemplatesModalProps {
  expenses: Expense[]
  onClose: () => void
}

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: string
  difficulty: 'Simple' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  features: string[]
  popular: boolean
  preview: string
  useCase: string
  format: string[]
}

export default function ExportTemplatesModal({ expenses, onClose }: ExportTemplatesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [generating, setGenerating] = useState(false)

  const templates: Template[] = [
    {
      id: 'tax-report',
      name: 'Tax Report 2024',
      description: 'Comprehensive tax-ready report with deductions and categories',
      icon: FileText,
      category: 'tax',
      difficulty: 'Advanced',
      estimatedTime: '3-5 min',
      features: ['Deductible categorization', 'IRS-compliant formatting', 'Receipt summaries', 'Quarterly breakdowns'],
      popular: true,
      preview: 'Professional PDF with expense summaries, deductible amounts, and supporting documentation',
      useCase: 'Perfect for tax filing and CPA consultations',
      format: ['PDF', 'Excel']
    },
    {
      id: 'monthly-summary',
      name: 'Monthly Summary',
      description: 'Detailed monthly financial overview with insights',
      icon: Calendar,
      category: 'reporting',
      difficulty: 'Simple',
      estimatedTime: '1-2 min',
      features: ['Monthly trends', 'Category breakdowns', 'Budget comparisons', 'Spending insights'],
      popular: true,
      preview: 'Clean monthly report with charts, category analysis, and trend indicators',
      useCase: 'Ideal for personal budgeting and monthly reviews',
      format: ['PDF', 'HTML', 'Excel']
    },
    {
      id: 'category-analysis',
      name: 'Category Analysis',
      description: 'Deep dive into spending patterns across categories',
      icon: BarChart3,
      category: 'analytics',
      difficulty: 'Intermediate',
      estimatedTime: '2-3 min',
      features: ['Category trends', 'Comparative analysis', 'Outlier detection', 'Forecasting'],
      popular: false,
      preview: 'Visual analytics report with charts, graphs, and data insights',
      useCase: 'Great for understanding spending habits and optimization',
      format: ['PDF', 'PowerPoint', 'HTML']
    },
    {
      id: 'business-expenses',
      name: 'Business Expenses',
      description: 'Professional expense tracking for business accounting',
      icon: Building,
      category: 'business',
      difficulty: 'Advanced',
      estimatedTime: '4-6 min',
      features: ['Business categories', 'Project allocation', 'Client billing', 'Compliance tracking'],
      popular: false,
      preview: 'Corporate-style report with project breakdowns and billing details',
      useCase: 'Essential for business accounting and client billing',
      format: ['Excel', 'CSV', 'QuickBooks']
    },
    {
      id: 'receipt-summary',
      name: 'Receipt Summary',
      description: 'Organized receipt compilation with digital copies',
      icon: Receipt,
      category: 'documentation',
      difficulty: 'Simple',
      estimatedTime: '2-3 min',
      features: ['Receipt images', 'Digital organization', 'Search functionality', 'Cloud backup'],
      popular: true,
      preview: 'Digital receipt book with searchable entries and backup copies',
      useCase: 'Perfect for record keeping and warranty tracking',
      format: ['PDF', 'ZIP', 'HTML']
    },
    {
      id: 'budget-tracker',
      name: 'Budget vs Actual',
      description: 'Compare planned budget against actual spending',
      icon: TrendingUp,
      category: 'budgeting',
      difficulty: 'Intermediate',
      estimatedTime: '2-4 min',
      features: ['Budget comparisons', 'Variance analysis', 'Goal tracking', 'Alerts'],
      popular: false,
      preview: 'Budget tracking report with variance analysis and goal progress',
      useCase: 'Ideal for budget management and financial planning',
      format: ['Excel', 'PDF', 'CSV']
    },
    {
      id: 'expense-dashboard',
      name: 'Executive Dashboard',
      description: 'High-level financial overview for executives',
      icon: PieChart,
      category: 'executive',
      difficulty: 'Advanced',
      estimatedTime: '3-5 min',
      features: ['KPI metrics', 'Executive summary', 'Trend analysis', 'Action items'],
      popular: false,
      preview: 'Executive-level dashboard with key metrics and strategic insights',
      useCase: 'Perfect for board meetings and executive reporting',
      format: ['PowerPoint', 'PDF', 'HTML']
    },
    {
      id: 'travel-expenses',
      name: 'Travel Expenses',
      description: 'Specialized report for travel and entertainment expenses',
      icon: Globe,
      category: 'travel',
      difficulty: 'Intermediate',
      estimatedTime: '2-3 min',
      features: ['Trip organization', 'Per diem tracking', 'Mileage calculation', 'Currency conversion'],
      popular: true,
      preview: 'Travel-focused report with trip breakdowns and reimbursement details',
      useCase: 'Essential for business travel reimbursements',
      format: ['PDF', 'Excel', 'CSV']
    }
  ]

  const categories = [
    { value: 'all', label: 'All Templates', count: templates.length },
    { value: 'tax', label: 'Tax & Compliance', count: templates.filter(t => t.category === 'tax').length },
    { value: 'reporting', label: 'Reports', count: templates.filter(t => t.category === 'reporting').length },
    { value: 'business', label: 'Business', count: templates.filter(t => t.category === 'business').length },
    { value: 'analytics', label: 'Analytics', count: templates.filter(t => t.category === 'analytics').length }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = category === 'all' || template.category === category
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleGenerate = async (template: Template, format: string) => {
    setGenerating(true)
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(false)

    // In a real app, this would trigger the download
    alert(`Generated ${template.name} in ${format} format!`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Simple': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (selectedTemplate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <selectedTemplate.icon className="h-6 w-6" />
                <div>
                  <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-purple-100 text-sm">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-white hover:text-purple-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Template Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-blue-900">Generation Time</p>
                <p className="text-lg font-bold text-blue-700">{selectedTemplate.estimatedTime}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <Tag className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-purple-900">Difficulty</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                  {selectedTemplate.difficulty}
                </span>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <FileText className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-sm font-medium text-green-900">Data Points</p>
                <p className="text-lg font-bold text-green-700">{expenses.length}</p>
              </div>
            </div>

            {/* Preview & Use Case */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Template Preview</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-gray-700">{selectedTemplate.preview}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-1">Use Case</h5>
                <p className="text-blue-700">{selectedTemplate.useCase}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Features Included</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTemplate.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Formats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedTemplate.format.map((format, index) => (
                  <button
                    key={index}
                    onClick={() => handleGenerate(selectedTemplate, format)}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    <span className="font-medium">{format}</span>
                  </button>
                ))}
              </div>
            </div>

            {generating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Generating Report...</h4>
                    <p className="text-sm text-blue-700">Processing {expenses.length} expenses</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-600 hover:text-gray-700 flex items-center gap-1"
            >
              ← Back to Templates
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Save as Favorite</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Export Templates</h3>
                <p className="text-purple-100 text-sm">Choose from professional report templates</p>
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

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Popular Templates */}
          {category === 'all' && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Popular Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.filter(t => t.popular).map((template) => (
                  <div
                    key={template.id}
                    className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <template.icon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                          <p className="text-sm text-gray-600">{template.estimatedTime}</p>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {category === 'all' ? 'All Templates' : categories.find(c => c.value === category)?.label}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTemplates.length} templates)
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <template.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{template.name}</h5>
                        <p className="text-sm text-gray-600">{template.estimatedTime}</p>
                      </div>
                    </div>
                    {template.popular && <Star className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {template.format.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No templates found</h4>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}