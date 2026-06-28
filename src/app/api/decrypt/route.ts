import { NextRequest, NextResponse } from 'next/server'
import { decrypt, isEncrypted } from 'officecrypto-tool'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const password = formData.get('password') as string | null

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Check if file is encrypted
    if (!isEncrypted(buffer)) {
      // Not encrypted, return as-is
      return new NextResponse(buffer, {
        headers: { 'Content-Type': 'application/octet-stream' },
      })
    }

    if (!password) {
      return NextResponse.json(
        { error: 'File ini password-protected. Masukkan password.' },
        { status: 400 }
      )
    }

    const decrypted = await decrypt(buffer, { password })

    return new NextResponse(new Uint8Array(decrypted), {
      headers: { 'Content-Type': 'application/octet-stream' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mendekripsi file'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
