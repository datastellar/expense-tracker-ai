# Plan: Expense Tracker AI → Personal Finance Management App

## Context

User punya project expense-tracker-ai yang saat ini adalah simple localStorage-based expense tracker. Tujuan baru: rebuild dari scratch jadi **personal finance management app** yang bisa:

1. **MVP**: Import e-statement Bank Mandiri (.xlsx dari Livin'), auto-kategorisasi (rule-based + Gemini API), simpan ke Supabase
2. **Phase 2**: Multi-bank (BCA, Jenius, Jago, BRI), split transactions, transfer detection with purpose tagging
3. **Phase 3**: Cash vs accrual accounting, utang/piutang, full financial reports (income statement, cash flow, balance sheet)

Target: jadi produk publik. User akan share sample e-statement Mandiri nanti untuk finalize parsing logic.

---

## MVP Scope (Phase 1)

### Features
1. **Auth**: Email + password via Supabase Auth
2. **Bank Statement Import**: Upload .xlsx Mandiri → parse → preview → import
3. **Auto-categorization**: Rule-based keyword matching + Gemini API fallback
4. **Expense Dashboard**: List, filter, summary stats, basic charts
5. **Manual expense entry**: Tambah expense manual (fallback)

### Non-goals untuk MVP
- Multi-bank (Phase 2)
- Split transactions (Phase 2)
- Accrual accounting (Phase 3)
- Financial reports (Phase 3)

---

## Tech Stack

| Layer | Tech | Reason |
|-------|------|--------|
| Framework | Next.js 14 (App Router) | Existing, SSR + API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Existing, rapid UI |
| Database | Supabase (PostgreSQL) | Auth + DB + Realtime, free tier |
| Auth | Supabase Auth | Built-in, email/password |
| XLSX parsing | `xlsx` (SheetJS) | Most popular, client-side capable |
| AI categorization | Gemini API (`@google/generative-ai`) | User's choice |
| Charts | Recharts | Existing |
| Icons | Lucide React | Existing |
| Forms | React Hook Form | Existing |
| Date utils | date-fns | Existing |

---

## Data Model (Supabase Schema)

### `profiles` table
```sql
id          UUID PRIMARY KEY REFERENCES auth.users(id)
email       TEXT NOT NULL
full_name   TEXT
gemini_api_key TEXT  -- encrypted, for AI categorization
created_at  TIMESTAMPTZ DEFAULT now()
```

### `bank_accounts` table
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID REFERENCES profiles(id)
bank_name   TEXT NOT NULL  -- 'mandiri', 'bca', etc.
account_name TEXT          -- e.g. "Mandiri Tabungan"
account_number TEXT        -- last 4 digits only (privacy)
created_at  TIMESTAMPTZ DEFAULT now()
```

### `transactions` table (replaces `expenses`)
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES profiles(id)
bank_account_id UUID REFERENCES bank_accounts(id)
type            TEXT NOT NULL  -- 'debit' | 'credit'
amount          NUMERIC(15,2) NOT NULL
category        TEXT          -- 'Food' | 'Transportation' | ... | 'Transfer' | 'Income' | 'Other'
description     TEXT NOT NULL -- raw description from bank
notes           TEXT          -- user's own notes
date            DATE NOT NULL
is_transfer     BOOLEAN DEFAULT false
categorized_by  TEXT          -- 'rule' | 'ai' | 'manual'
import_batch_id UUID          -- group transactions from same import
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

### `import_batches` table
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES profiles(id)
bank_account_id UUID REFERENCES bank_accounts(id)
file_name       TEXT NOT NULL
row_count       INTEGER
imported_at     TIMESTAMPTZ DEFAULT now()
```

### `category_rules` table (user-customizable rules)
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID REFERENCES profiles(id)
keyword     TEXT NOT NULL     -- e.g. "GRAB", "GOFOOD"
category    TEXT NOT NULL     -- target category
priority    INTEGER DEFAULT 0 -- higher = checked first
created_at  TIMESTAMPTZ DEFAULT now()
```

### Row Level Security
- All tables have RLS enabled
- Policies: users can only CRUD their own data (`auth.uid() = user_id`)

---

## File Structure (New)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout + Supabase provider
│   ├── page.tsx                      # Landing / redirect to dashboard
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Auth-protected layout
│   │   ├── page.tsx                  # Main dashboard
│   │   ├── import/page.tsx           # Import e-statement flow
│   │   ├── transactions/page.tsx     # All transactions list
│   │   └── settings/page.tsx         # API key, account management
│   └── api/
│       └── categorize/route.ts       # Proxy for Gemini API (hides key server-side)
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx
│   ├── dashboard/
│   │   ├── StatCards.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   └── SpendingChart.tsx
│   ├── import/
│   │   ├── FileUpload.tsx            # Drag & drop xlsx upload
│   │   ├── ImportPreview.tsx         # Review parsed transactions before saving
│   │   └── CategoryEditor.tsx        # Inline category editing in preview
│   ├── transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx       # Manual add/edit
│   │   └── TransactionFilters.tsx
│   └── ui/
│       ├── Modal.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client (for API routes)
│   │   └── middleware.ts             # Auth middleware
│   ├── parsers/
│   │   ├── types.ts                  # ParsedTransaction interface
│   │   ├── base-parser.ts            # Abstract base class
│   │   └── mandiri-parser.ts         # Mandiri-specific xlsx parsing
│   ├── categorizer/
│   │   ├── rule-engine.ts            # Keyword-based categorizer
│   │   ├── gemini-categorizer.ts     # Gemini API fallback
│   │   ├── transfer-detector.ts      # Detect inter-bank transfers
│   │   └── default-rules.ts          # Built-in categorization rules
│   └── utils/
│       ├── format.ts                 # Currency, date formatting
│       └── analytics.ts             # Summary calculations
├── hooks/
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   └── useBankAccounts.ts
├── types/
│   └── index.ts                      # All TypeScript types
└── middleware.ts                      # Next.js middleware for auth redirect
```

---

## Implementation Order

### Step 1: Project Setup & Auth
- Clean existing files (keep config: next.config.js, tailwind.config.ts, tsconfig.json, postcss)
- Install new deps: `@supabase/supabase-js`, `@supabase/ssr`, `xlsx`, `@google/generative-ai`
- Setup Supabase project (user provides URL + anon key)
- Create DB schema (SQL migration)
- Implement auth pages (login/register)
- Setup middleware for auth protection

### Step 2: Core UI Shell
- Dashboard layout (auth-protected)
- Navigation / sidebar
- Basic stat cards (empty state)
- Settings page (Gemini API key input, bank account management)

### Step 3: Bank Statement Parser
- Create parser architecture (base class + Mandiri implementation)
- Mandiri xlsx parser (will finalize when user shares sample file)
- ParsedTransaction → preview data flow
- File upload component (drag & drop)

### Step 4: Categorization Engine
- Default rules (Indonesian merchants: Grab, GoFood, Tokopedia, Shopee, PLN, Telkomsel, etc.)
- Rule engine with keyword matching
- Transfer detector (keywords: "TRANSFER", "TRF", "TRSF", etc.)
- Gemini API integration for uncertain transactions
- Category editor UI in import preview

### Step 5: Import Flow UI
- Upload → Parse → Preview → Edit categories → Confirm → Save to Supabase
- Import batch tracking
- Duplicate detection (same date + amount + description = potential duplicate)

### Step 6: Transaction Management
- Transaction list with filters (date, category, bank account)
- Manual add/edit transaction
- Delete transaction
- Dashboard stats (total spending, monthly, category breakdown)
- Basic charts (reuse Recharts patterns)

---

## Categorization Rules (Built-in Defaults)

```typescript
// Indonesian merchant/keyword mapping
const DEFAULT_RULES = [
  // Food & Beverage
  { keywords: ['GOFOOD', 'GRABFOOD', 'SHOPEEFOOD', 'KFC', 'MCD', 'STARBUCKS', 'CHATIME', 'HOKBEN'], category: 'Food' },
  
  // Transportation
  { keywords: ['GRAB', 'GOJEK', 'GORIDE', 'GRABCAR', 'TRANSJAKARTA', 'KAI', 'MRT', 'LRT', 'TRAVELOKA'], category: 'Transportation' },
  
  // Shopping
  { keywords: ['TOKOPEDIA', 'SHOPEE', 'LAZADA', 'BLIBLI', 'UNIQLO', 'ZARA', 'H&M'], category: 'Shopping' },
  
  // Bills
  { keywords: ['PLN', 'TELKOMSEL', 'XL', 'INDOSAT', 'WIFI', 'INTERNET', 'BPJS', 'PAM', 'PGN'], category: 'Bills' },
  
  // Entertainment
  { keywords: ['NETFLIX', 'SPOTIFY', 'YOUTUBE', 'DISNEY', 'CINEMA', 'CGV', 'XXI'], category: 'Entertainment' },
  
  // Healthcare
  { keywords: ['APOTEK', 'FARMASI', 'KIMIA FARMA', 'HALODOC', 'ALODOKTER', 'RS ', 'RUMAH SAKIT'], category: 'Healthcare' },
  
  // Transfers
  { keywords: ['TRANSFER KE', 'TRF KE', 'TRSF', 'TRANSFER DARI', 'PEMINDAHBUKUAN'], category: 'Transfer' },
]
```

---

## Gemini API Integration

- User stores Gemini API key in settings (saved to `profiles.gemini_api_key`)
- When rule engine can't categorize → batch uncategorized transactions → send to Gemini
- Prompt: send transaction description + available categories → get category suggestion
- API call goes through Next.js API route (`/api/categorize`) to keep key server-side
- Fallback: if no API key or API fails → mark as 'Other', user categorizes manually

---

## Verification Plan

1. **Auth**: Register → login → logout → protected routes redirect
2. **Import flow**: Upload sample Mandiri xlsx → verify parsing → check preview table → edit categories → save → verify in Supabase
3. **Categorization**: Verify rule-based catches known merchants → verify Gemini API categorizes unknowns → verify transfer detection
4. **Dashboard**: After import, stats show correct totals → charts render → filters work
5. **Manual CRUD**: Add transaction manually → edit → delete → verify in list
6. **Duplicate detection**: Import same file twice → should warn about duplicates

---

## Pending Items (Need User Input)

1. **Sample Mandiri e-statement** — user will upload later, needed to finalize `mandiri-parser.ts`
2. **Supabase project credentials** — user needs to create Supabase project and share URL + anon key
3. **Gemini API key** — user provides their own key via settings page
