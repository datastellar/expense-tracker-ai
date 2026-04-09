'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return <Loader2 className="animate-spin text-blue-600" size={size} />
}
