import type { ExpenseCategory } from '@/types'

export interface CategoryKeywordRule {
  keywords: string[]
  category: ExpenseCategory
}

export const DEFAULT_CATEGORY_RULES: CategoryKeywordRule[] = [
  // Food & Beverage
  {
    keywords: [
      'GOFOOD', 'GRABFOOD', 'SHOPEEFOOD', 'KFC', 'MCD', 'MCDONALDS',
      'STARBUCKS', 'CHATIME', 'HOKBEN', 'JCOFFEE', 'KOPI KENANGAN',
      'FORE COFFEE', 'PIZZA HUT', 'BURGER KING', 'WENDYS', 'DOMINOS',
      'RICHEESE', 'YOSHINOYA', 'MARUGAME', 'SUSHI', 'BAKMI',
      'RESTORAN', 'RESTAURANT', 'CAFE', 'WARUNG', 'MAKAN',
      'FOOD', 'KULINER', 'DAPUR',
    ],
    category: 'Food',
  },
  // Transportation
  {
    keywords: [
      'GRAB ', 'GOJEK', 'GORIDE', 'GOCAR', 'GRABCAR', 'GRABBIKE',
      'TRANSJAKARTA', 'KAI ACCESS', 'KERETA', 'MRT', 'LRT',
      'TRAVELOKA', 'TIKET.COM', 'TIKETCOM', 'PARKIR', 'PARKING',
      'BENSIN', 'PERTAMINA', 'SHELL', 'VIVO', 'BP ', 'SPBU',
      'TOL', 'E-TOLL', 'ETOLL', 'FLAZZ',
      'BLUEBIRD', 'BLUE BIRD', 'TAXI', 'ANGKOT',
      'LION AIR', 'GARUDA', 'CITILINK', 'AIRASIA', 'BATIK AIR',
    ],
    category: 'Transportation',
  },
  // Shopping
  {
    keywords: [
      'TOKOPEDIA', 'SHOPEE', 'LAZADA', 'BLIBLI', 'BUKALAPAK',
      'UNIQLO', 'ZARA', 'H&M', 'COTTON INK', 'MINISO',
      'INDOMARET', 'ALFAMART', 'ALFAMIDI', 'SUPERINDO', 'HYPERMART',
      'CARREFOUR', 'TRANSMART', 'GIANT', 'HERO', 'FARMERS',
      'ACE HARDWARE', 'IKEA', 'MR DIY', 'TOKO',
      'AMAZON', 'APPLE', 'SAMSUNG',
    ],
    category: 'Shopping',
  },
  // Bills & Utilities
  {
    keywords: [
      'PLN', 'LISTRIK', 'TELKOMSEL', 'TELKOM', 'XL', 'INDOSAT',
      'TRI ', '3 INDONESIA', 'SMARTFREN',
      'WIFI', 'INTERNET', 'INDIHOME', 'FIRSTMEDIA', 'BIZNET',
      'BPJS', 'ASURANSI', 'INSURANCE',
      'PAM', 'PDAM', 'AIR', 'PGN', 'GAS',
      'PAJAK', 'TAX', 'IURAN', 'CICILAN', 'ANGSURAN',
      'MORTGAGE', 'KPR', 'SEWA', 'RENT', 'KOST',
    ],
    category: 'Bills',
  },
  // Entertainment
  {
    keywords: [
      'NETFLIX', 'SPOTIFY', 'YOUTUBE', 'DISNEY', 'HBO', 'VIDIO',
      'CINEMA', 'CGV', 'XXI', 'CINEPOLIS', 'BIOSKOP',
      'STEAM', 'PLAYSTATION', 'XBOX', 'NINTENDO', 'GAME',
      'DUFAN', 'ANCOL', 'TRANS STUDIO', 'TAMAN MINI',
      'KARAOKE', 'HAPPY PUPPY', 'TIMEZONE',
      'APPLE MUSIC', 'JOOX', 'RESSO',
    ],
    category: 'Entertainment',
  },
  // Healthcare
  {
    keywords: [
      'APOTEK', 'FARMASI', 'KIMIA FARMA', 'K24', 'CENTURY',
      'HALODOC', 'ALODOKTER', 'KLIKDOKTER',
      'RS ', 'RSU', 'RUMAH SAKIT', 'HOSPITAL', 'KLINIK', 'CLINIC',
      'DOKTER', 'DOCTOR', 'LABORATORY', 'LAB ', 'PRODIA',
      'OPTIK', 'OPTIC', 'DENTAL', 'GIGI',
    ],
    category: 'Healthcare',
  },
]

// Transfer detection patterns
export const TRANSFER_PATTERNS: string[] = [
  'TRANSFER KE', 'TRANSFER DARI', 'TRF KE', 'TRF DARI',
  'TRSF ', 'PEMINDAHBUKUAN', 'OVERBOOKING', 'OB ',
  'SWITCHING CR', 'SWITCHING DB',
  'FLIP', 'DANA KE', 'DARI DANA',
  // Inter-bank transfer patterns
  'BI-FAST', 'BIFAST', 'SKN', 'RTGS', 'LLG',
  'KLIRING',
]
