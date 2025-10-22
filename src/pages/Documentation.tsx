import { Card } from '@/components/ui/card';
import { Code2, FileText, TestTube, Layers } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Complete guide to the Advanced Trading Calculator
          </p>
        </Card>

        {/* Overview */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-muted-foreground">
              The Advanced Trading Calculator is a professional, production-ready implementation of the original 
              trading calculator by Manish Ranjan. This refactored version maintains 100% mathematical parity 
              with the original while providing a modern, maintainable React architecture.
            </p>
          </div>
        </Card>

        {/* Architecture */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <Layers className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Architecture</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Modular Structure</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code className="bg-background px-2 py-1 rounded">src/utils/tradingMath.ts</code> - Pure mathematical functions (PRESERVE_FORMULA)</li>
                <li><code className="bg-background px-2 py-1 rounded">src/components/TradingCalculator.tsx</code> - Main calculator UI component</li>
                <li><code className="bg-background px-2 py-1 rounded">src/pages/ParityTest.tsx</code> - Automated parity testing suite</li>
                <li><code className="bg-background px-2 py-1 rounded">src/pages/Documentation.tsx</code> - This documentation page</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Mathematical Formulas */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <Code2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Mathematical Formulas</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Core Calculations</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-1">Divisor Calculation</p>
                  <code className="block bg-background p-3 rounded text-xs overflow-x-auto">
                    baseRatio = (l + m) / (m - f)<br/>
                    divisor = baseRatio^(nTrades-1) * (1 + ((m-f)*t)/100) - (((m-f)*t)/100)
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Loss Percentage (p)</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    p = (l + f) * t
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Profit Percentage (q)</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    q = (m - f) * t
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Initial Trade Amount</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    currentTrade = initialAmount / divisor
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Win Result</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    result = currentTrade * (q / 100)
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Loss Result</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    result = -currentTrade * (p / 100)
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Next Trade After Win</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    nextTrade = finalAmount / divisor
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Next Trade After Loss</p>
                  <code className="block bg-background p-3 rounded text-xs">
                    nextTrade = winBaseline + (lossAccumulator * (p / q))
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Testing */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <TestTube className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Parity Testing</h2>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The calculator includes an automated parity test suite that verifies all mathematical 
              formulas produce identical results to the original implementation.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Test Vectors</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Multiple test scenarios with different parameter combinations:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Default Parameters (nTrades=7, l=0.5, m=0.8, t=50, f=0.12)</li>
                <li>Small Values (nTrades=3, l=0.1, m=0.2, t=10, f=0.05)</li>
                <li>High Leverage (nTrades=5, l=1.0, m=1.5, t=100, f=0.2)</li>
                <li>Edge Cases (High n Trades)</li>
              </ul>
            </div>
            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-800 font-semibold">
                ✓ All formulas are tested to ensure numeric precision within 0.0001 tolerance
              </p>
            </div>
          </div>
        </Card>

        {/* Parameters */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Parameters</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left font-semibold">Parameter</th>
                  <th className="border border-border p-3 text-left font-semibold">Symbol</th>
                  <th className="border border-border p-3 text-left font-semibold">Description</th>
                  <th className="border border-border p-3 text-left font-semibold">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Initial Amount</td>
                  <td className="border border-border p-3"><code>-</code></td>
                  <td className="border border-border p-3">Starting capital for trading</td>
                  <td className="border border-border p-3">6500</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">1st Win after n Trade</td>
                  <td className="border border-border p-3"><code>n</code></td>
                  <td className="border border-border p-3">Number of trades until first win</td>
                  <td className="border border-border p-3">7</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Loss % Captured</td>
                  <td className="border border-border p-3"><code>l</code></td>
                  <td className="border border-border p-3">Percentage of loss captured per trade</td>
                  <td className="border border-border p-3">0.5</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Profit % Captured</td>
                  <td className="border border-border p-3"><code>m</code></td>
                  <td className="border border-border p-3">Percentage of profit captured per trade</td>
                  <td className="border border-border p-3">0.8</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Leverage</td>
                  <td className="border border-border p-3"><code>t</code></td>
                  <td className="border border-border p-3">Trading leverage multiplier</td>
                  <td className="border border-border p-3">50</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Fee+GST</td>
                  <td className="border border-border p-3"><code>f</code></td>
                  <td className="border border-border p-3">Combined trading fees and GST</td>
                  <td className="border border-border p-3">0.12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Real-time Calculations</h3>
              <p className="text-sm text-muted-foreground">
                All computed values update instantly as parameters change
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Undo/Redo Support</h3>
              <p className="text-sm text-muted-foreground">
                Complete history management for trade operations
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Trade Simulation</h3>
              <p className="text-sm text-muted-foreground">
                Simulate multiple winning trades up to any serial number
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Statistics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track total trades, wins, losses, and percentages
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                Mobile-first design that works on all devices
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✓ Parity Tests</h3>
              <p className="text-sm text-muted-foreground">
                Automated tests ensure formula accuracy
              </p>
            </div>
          </div>
        </Card>

        {/* Credits */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg text-center">
          <p className="text-muted-foreground">
            Original Calculator by <span className="font-semibold text-foreground">Manish Ranjan</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Refactored and modernized while preserving all mathematical formulas
          </p>
        </Card>
      </div>
    </div>
  );
}
