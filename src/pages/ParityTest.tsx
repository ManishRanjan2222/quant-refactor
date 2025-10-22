import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  getComputedParams,
  calculateInitialTrade,
  calculateWinResult,
  calculateNextTradeAfterWin,
  calculateLossResult,
  calculateNextTradeAfterLoss,
  type TradingParams
} from '@/utils/tradingMath';
import { CheckCircle2, XCircle, PlayCircle } from 'lucide-react';

interface TestVector {
  name: string;
  params: TradingParams;
  initialAmount: number;
  expectedDivisor: number;
  expectedP: number;
  expectedQ: number;
}

interface TestResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

const testVectors: TestVector[] = [
  {
    name: 'Default Parameters',
    params: { nTrades: 7, l: 0.5, m: 0.8, t: 50, f: 0.12 },
    initialAmount: 6500,
    expectedDivisor: 65.0000,
    expectedP: 31.0000,
    expectedQ: 34.0000
  },
  {
    name: 'Small Values',
    params: { nTrades: 3, l: 0.1, m: 0.2, t: 10, f: 0.05 },
    initialAmount: 1000,
    expectedDivisor: 11.5236,
    expectedP: 1.5000,
    expectedQ: 1.5000
  },
  {
    name: 'High Leverage',
    params: { nTrades: 5, l: 1.0, m: 1.5, t: 100, f: 0.2 },
    initialAmount: 10000,
    expectedDivisor: 133.1000,
    expectedP: 120.0000,
    expectedQ: 130.0000
  },
  {
    name: 'Edge Case - High n Trades',
    params: { nTrades: 10, l: 0.5, m: 0.8, t: 50, f: 0.12 },
    initialAmount: 5000,
    expectedDivisor: 65.0000,
    expectedP: 31.0000,
    expectedQ: 34.0000
  }
];

export default function ParityTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    const results: TestResult[] = [];

    testVectors.forEach((vector) => {
      const computed = getComputedParams(vector.params);
      
      // Test divisor
      const divisorPassed = Math.abs(computed.divisor - vector.expectedDivisor) < 0.01;
      results.push({
        name: `${vector.name} - Divisor`,
        passed: divisorPassed,
        expected: vector.expectedDivisor.toFixed(4),
        actual: computed.divisor.toFixed(4),
        message: divisorPassed ? 'Divisor calculation matches' : 'Divisor calculation mismatch'
      });

      // Test p
      const pPassed = Math.abs(computed.p - vector.expectedP) < 0.01;
      results.push({
        name: `${vector.name} - P (Loss %)`,
        passed: pPassed,
        expected: vector.expectedP.toFixed(4),
        actual: computed.p.toFixed(4),
        message: pPassed ? 'P calculation matches' : 'P calculation mismatch'
      });

      // Test q
      const qPassed = Math.abs(computed.q - vector.expectedQ) < 0.01;
      results.push({
        name: `${vector.name} - Q (Profit %)`,
        passed: qPassed,
        expected: vector.expectedQ.toFixed(4),
        actual: computed.q.toFixed(4),
        message: qPassed ? 'Q calculation matches' : 'Q calculation mismatch'
      });

      // Test initial trade calculation
      const initialTrade = calculateInitialTrade(vector.initialAmount, computed.divisor);
      const expectedInitialTrade = vector.initialAmount / computed.divisor;
      const initialTradePassed = Math.abs(initialTrade - expectedInitialTrade) < 0.0001;
      results.push({
        name: `${vector.name} - Initial Trade`,
        passed: initialTradePassed,
        expected: expectedInitialTrade.toFixed(4),
        actual: initialTrade.toFixed(4),
        message: initialTradePassed ? 'Initial trade calculation matches' : 'Initial trade calculation mismatch'
      });

      // Test win result
      const winResult = calculateWinResult(initialTrade, computed.q);
      const expectedWinResult = initialTrade * (computed.q / 100);
      const winResultPassed = Math.abs(winResult - expectedWinResult) < 0.0001;
      results.push({
        name: `${vector.name} - Win Result`,
        passed: winResultPassed,
        expected: expectedWinResult.toFixed(4),
        actual: winResult.toFixed(4),
        message: winResultPassed ? 'Win result calculation matches' : 'Win result calculation mismatch'
      });

      // Test loss result
      const lossResult = calculateLossResult(initialTrade, computed.p);
      const expectedLossResult = -initialTrade * (computed.p / 100);
      const lossResultPassed = Math.abs(lossResult - expectedLossResult) < 0.0001;
      results.push({
        name: `${vector.name} - Loss Result`,
        passed: lossResultPassed,
        expected: expectedLossResult.toFixed(4),
        actual: lossResult.toFixed(4),
        message: lossResultPassed ? 'Loss result calculation matches' : 'Loss result calculation mismatch'
      });
    });

    setTestResults(results);
    setRunning(false);
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parity Test Suite
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Automated tests to verify mathematical formula accuracy
          </p>
        </Card>

        {/* Test Controls */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Run Tests</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Execute all parity tests to verify formula preservation
              </p>
            </div>
            <Button
              onClick={runTests}
              disabled={running}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {running ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>
        </Card>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Test Results</h2>
              <div className="flex items-center gap-2">
                {allPassed ? (
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <CheckCircle2 className="h-5 w-5" />
                    All Tests Passed
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <XCircle className="h-5 w-5" />
                    Some Tests Failed
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-center">
                {passedTests} / {totalTests} Tests Passed
              </div>
              <div className="w-full bg-border h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${allPassed ? 'bg-green-600' : 'bg-yellow-600'}`}
                  style={{ width: `${(passedTests / totalTests) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-700 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold">{result.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-7">
                        {result.message}
                      </p>
                      <div className="mt-2 ml-7 grid grid-cols-2 gap-2 text-sm font-mono">
                        <div>
                          <span className="text-muted-foreground">Expected:</span>{' '}
                          <span className="font-semibold">{result.expected}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Actual:</span>{' '}
                          <span className="font-semibold">{result.actual}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Test Vectors Info */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Test Vectors</h2>
          <div className="space-y-4">
            {testVectors.map((vector, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{vector.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Initial Amount:</span> {vector.initialAmount}</div>
                  <div><span className="text-muted-foreground">n Trades:</span> {vector.params.nTrades}</div>
                  <div><span className="text-muted-foreground">Loss % (l):</span> {vector.params.l}</div>
                  <div><span className="text-muted-foreground">Profit % (m):</span> {vector.params.m}</div>
                  <div><span className="text-muted-foreground">Leverage (t):</span> {vector.params.t}</div>
                  <div><span className="text-muted-foreground">Fee+GST (f):</span> {vector.params.f}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
