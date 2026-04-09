'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  ArrowUpDown,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transaksi', icon: ArrowUpDown },
  { href: '/dashboard/import', label: 'Import', icon: Upload },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-lg">Finance Tracker</h1>
        <div className="w-6" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <SidebarContent
              pathname={pathname}
              profile={profile}
              onSignOut={handleSignOut}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 min-h-screen bg-white border-r fixed">
          <SidebarContent
            pathname={pathname}
            profile={profile}
            onSignOut={handleSignOut}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  profile,
  onSignOut,
  onClose,
}: {
  pathname: string
  profile: { full_name: string | null; email: string } | null
  onSignOut: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="font-bold text-xl text-gray-900">Finance Tracker</h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </div>
  )
}
