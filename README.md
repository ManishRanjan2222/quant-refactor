# Advanced Trading Calculator

A professional, production-ready trading calculator application refactored from the original single-page HTML implementation by **Manish Ranjan**. This modernized version preserves **100% mathematical parity** with the original while providing a clean, maintainable React architecture.

## 🎯 Project Goals

- ✅ **Preserve All Formulas**: Every mathematical formula is preserved exactly as in the original
- ✅ **Modular Architecture**: Clean separation of concerns with isolated pure functions
- ✅ **Professional UI/UX**: Modern, responsive design with excellent accessibility
- ✅ **Automated Testing**: Parity tests verify outputs match original calculations
- ✅ **Production Ready**: Well-documented, maintainable, and deployment-ready code

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   ├── TradingCalculator.tsx    # Main calculator UI component
│   └── ui/                      # Reusable UI components (shadcn)
├── pages/
│   ├── Index.tsx                # Main application page
│   ├── ParityTest.tsx           # Automated parity testing suite
│   └── Documentation.tsx        # Complete documentation
├── utils/
│   └── tradingMath.ts          # Pure mathematical functions (PRESERVE_FORMULA)
└── index.css                    # Design system and styles
```

## 🧮 Mathematical Formulas

All formulas are preserved exactly from the original implementation:

### Core Calculations

**Divisor:**
```
baseRatio = (l + m) / (m - f)
divisor = baseRatio^(nTrades-1) * (1 + ((m-f)*t)/100) - (((m-f)*t)/100)
```

**Loss Percentage (p):**
```
p = (l + f) * t
```

**Profit Percentage (q):**
```
q = (m - f) * t
```

**Initial Trade:**
```
currentTrade = initialAmount / divisor
```

**Win Result:**
```
result = currentTrade * (q / 100)
nextTrade = finalAmount / divisor
```

**Loss Result:**
```
result = -currentTrade * (p / 100)
nextTrade = winBaseline + (lossAccumulator * (p / q))
```

## 🧪 Testing

The application includes an automated parity test suite accessible at `/tests`.

### Running Tests

1. Navigate to the application
2. Click "Parity Tests" in the top-right navigation
3. Click "Run All Tests" to execute the test suite

### Test Coverage

- ✅ Divisor calculation accuracy
- ✅ P (loss percentage) calculation
- ✅ Q (profit percentage) calculation
- ✅ Initial trade amount calculation
- ✅ Win result calculation
- ✅ Loss result calculation
- ✅ Multiple parameter combinations

All tests verify numeric precision within 0.0001 tolerance.

## 📖 Documentation

Complete documentation is available in the application at `/docs`, including:

- Architecture overview
- Mathematical formulas with explanations
- Parameter descriptions
- Feature list
- Testing methodology

## 🎨 Features

- **Real-time Calculations**: All values update instantly as parameters change
- **Undo/Redo Support**: Complete history management for all trade operations
- **Trade Simulation**: Simulate multiple winning trades up to any serial number
- **Statistics Dashboard**: Track total trades, wins, losses, and percentages
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Accessible**: WCAG-friendly with semantic HTML and proper ARIA attributes

## 🔧 Configuration

### Parameters

| Parameter | Symbol | Description | Default |
|-----------|--------|-------------|---------|
| Initial Amount | - | Starting capital | 6500 |
| 1st Win after n Trade | n | Trades until first win | 7 |
| Loss % Captured | l | Loss percentage per trade | 0.5 |
| Profit % Captured | m | Profit percentage per trade | 0.8 |
| Leverage | t | Trading leverage multiplier | 50 |
| Fee+GST | f | Combined fees and GST | 0.12 |

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Deploy to Lovable

1. Open [Lovable](https://lovable.dev/projects/4af475ab-c7a5-4bb0-875d-85f82e0407af)
2. Click Share → Publish
3. Your app will be live!

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the instructions

## 🛠️ Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation

## ✨ Key Improvements Over Original

1. **Modular Code**: Separated UI from business logic
2. **Type Safety**: Full TypeScript implementation
3. **Testing**: Automated parity tests
4. **Responsive**: Works perfectly on mobile and desktop
5. **Maintainable**: Clean code structure with documentation
6. **Accessible**: WCAG-compliant accessibility features
7. **Modern UI**: Professional trading dashboard aesthetic
8. **No Build Required**: Can run directly in browser (dev mode)

## 📝 Development Notes

### Formula Preservation

All mathematical functions in `src/utils/tradingMath.ts` are marked with `PRESERVE_FORMULA` comments. These functions must NOT be modified to maintain parity with the original calculator.

### Adding Test Vectors

To add new test cases, edit `src/pages/ParityTest.tsx` and add entries to the `testVectors` array.

## 🤝 Credits

**Original Calculator by: Manish Ranjan**

This refactored version maintains complete fidelity to the original mathematical implementation while providing modern development practices and user experience improvements.

## 📄 License

This project maintains the intellectual property of the original calculator formulas by Manish Ranjan.

## 🔗 Links

- [Lovable Project](https://lovable.dev/projects/4af475ab-c7a5-4bb0-875d-85f82e0407af)
- [Documentation](https://docs.lovable.dev/)

---

Built with ❤️ preserving the mathematical genius of the original calculator
