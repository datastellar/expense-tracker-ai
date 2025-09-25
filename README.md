# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- ✅ **Add Expenses** - Track your spending with detailed expense entries
- ✅ **View & Filter** - Browse expenses with advanced search and filtering
- ✅ **Edit & Delete** - Modify or remove existing expenses
- ✅ **Categories** - Organize expenses into predefined categories (Food, Transportation, Entertainment, Shopping, Bills, Other)
- ✅ **Date Management** - Track expenses by date with calendar picker

### Analytics & Insights
- ✅ **Dashboard** - Overview of spending patterns and key metrics
- ✅ **Visual Charts** - Interactive charts showing spending trends and category breakdowns
- ✅ **Monthly Summaries** - Track current month vs total spending
- ✅ **Category Analysis** - Detailed breakdown of spending by category

### Data Management
- ✅ **Local Storage** - All data persisted locally in your browser
- ✅ **Export Options** - Export data to CSV or JSON formats
- ✅ **Form Validation** - Comprehensive validation for all user inputs
- ✅ **Error Handling** - Graceful error handling with user feedback

### User Experience
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Professional UI** - Clean, modern interface with intuitive navigation
- ✅ **Loading States** - Smooth loading indicators throughout the app
- ✅ **Accessibility** - Keyboard navigation and screen reader friendly

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management with validation
- **Recharts** - Interactive charts and data visualization
- **date-fns** - Date manipulation and formatting
- **Lucide React** - Beautiful, customizable icons

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the source code
   cd expense-tracker-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Usage Guide

### Adding Expenses
1. Fill out the expense form on the right side (or use the "Add Expense" button on mobile)
2. Enter the amount, select a category, add a description, and choose a date
3. Click "Add Expense" to save

### Viewing and Managing Expenses
- All expenses appear in the main list, sorted by date (newest first)
- Use the "Filters" button to search by description, filter by category, or date range
- Click the edit icon to modify an expense
- Click the trash icon to delete an expense (confirmation required)

### Analytics
- The dashboard shows key metrics: total spending, monthly spending, expense count, and top category
- Category breakdown shows spending distribution with visual progress bars
- Toggle "Charts" to see detailed visual analytics including:
  - Monthly spending trend
  - Category distribution pie chart
  - Category comparison bar chart
  - Monthly expense count

### Exporting Data
- Click the "Export" button in the header
- Choose between CSV or JSON format
- File will be downloaded with current date in filename

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles and Tailwind utilities
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Main application page
├── components/            # Reusable React components
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   └── ui/               # UI utility components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
    ├── storage.ts        # localStorage operations
    ├── format.ts         # Formatting utilities
    ├── analytics.ts      # Analytics calculations
    └── export.ts         # Data export functions
```

## Key Features Explained

### Data Persistence
- All data is stored in your browser's localStorage
- No server required - works completely offline
- Data persists between sessions
- Easy to backup by exporting to JSON

### Form Validation
- Amount must be positive and reasonable
- Description required (2-100 characters)
- Date cannot be in the future
- Real-time validation feedback

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface on mobile
- Optimized for both portrait and landscape orientations

### Performance
- Optimized React components with proper memoization
- Efficient data filtering and sorting
- Lazy loading of chart components
- Production-ready build optimization

## Browser Compatibility

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Contributing

This is a demo application. To extend functionality:

1. **Database Integration** - Replace localStorage with a proper database
2. **User Authentication** - Add user accounts and data synchronization
3. **Budgeting** - Add budget creation and tracking
4. **Receipt Scanning** - OCR integration for receipt processing
5. **Multi-currency** - Support for different currencies

## License

This project is for educational and demonstration purposes.

---

## Support

For questions or issues:
1. Check the browser console for any error messages
2. Ensure you're using a modern browser
3. Clear browser data if experiencing issues with localStorage
4. Verify all dependencies are properly installed

**Happy expense tracking!** 💰📊