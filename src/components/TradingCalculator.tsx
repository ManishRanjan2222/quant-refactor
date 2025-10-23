import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getComputedParams, 
  calculateInitialTrade,
  calculateWinResult,
  calculateNextTradeAfterWin,
  calculateLossResult,
  calculateNextTradeAfterLoss,
  calculateChange,
  calculateStats,
  type TradingParams,
  type ComputedParams
} from '@/utils/tradingMath';
import { Undo2, Redo2 } from 'lucide-react';
import { useFirebaseSync } from '@/hooks/useFirebaseSync';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface TradeRow {
  sl: number;
  tradeAmount: number;
  result: string | number;
  total: number;
  finalAmount: number;
}

interface CalculatorState {
  initialAmount: number;
  params: TradingParams;
  totalResult: number;
  currentTrade: number;
  winBaseline: number;
  lossAccumulator: number;
  tradeCount: number;
  rows: TradeRow[];
}

export default function TradingCalculator() {
  const navigate = useNavigate();
  const { hasActiveSubscription } = useSubscription();
  const [params, setParams] = useState<TradingParams>({
    nTrades: 7,
    l: 0.5,
    m: 0.8,
    t: 50,
    f: 0.12
  });

  const [initialAmount, setInitialAmount] = useState(6500);
  const [showSerial, setShowSerial] = useState<number | ''>('');
  const [computed, setComputed] = useState<ComputedParams>({ divisor: 0, p: 0, q: 0 });
  
  const [totalResult, setTotalResult] = useState(0);
  const [currentTrade, setCurrentTrade] = useState(0);
  const [winBaseline, setWinBaseline] = useState(0);
  const [lossAccumulator, setLossAccumulator] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);
  const [rows, setRows] = useState<TradeRow[]>([]);
  
  const [historyStack, setHistoryStack] = useState<CalculatorState[]>([]);
  const [redoStack, setRedoStack] = useState<CalculatorState[]>([]);
  const [initialized, setInitialized] = useState(false);

  const { saveProgress, loadProgress } = useFirebaseSync();

  // Load saved progress on mount
  useEffect(() => {
    const loadSaved = async () => {
      const saved = await loadProgress();
      if (saved) {
        setInitialAmount(saved.initialAmount);
        setParams({ nTrades: saved.nTrades, l: saved.l, m: saved.m, t: saved.t, f: saved.f });
        setTotalResult(saved.totalResult);
        setCurrentTrade(saved.currentTrade);
        setWinBaseline(saved.winBaseline);
        setLossAccumulator(saved.lossAccumulator);
        setTradeCount(saved.tradeCount);
        setRows(saved.rows);
        setHistoryStack(saved.history || []);
        setRedoStack(saved.redoStack || []);
        if (saved.rows.length > 0) setInitialized(true);
        toast.success('Progress loaded from cloud');
      }
    };
    loadSaved();
  }, [loadProgress]);

  // Auto-save whenever state changes
  useEffect(() => {
    if (initialized) {
      const timeoutId = setTimeout(() => {
        saveProgress({
          initialAmount,
          nTrades: params.nTrades,
          l: params.l,
          m: params.m,
          t: params.t,
          f: params.f,
          totalResult,
          currentTrade,
          winBaseline,
          lossAccumulator,
          tradeCount,
          rows,
          history: historyStack,
          redoStack
        });
      }, 1000); // Debounce saves by 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [initialized, initialAmount, params, totalResult, currentTrade, winBaseline, lossAccumulator, tradeCount, rows, historyStack, redoStack, saveProgress]);

  // Update computed params whenever inputs change
  useEffect(() => {
    setComputed(getComputedParams(params));
  }, [params]);

  const getCurrentState = (): CalculatorState => ({
    initialAmount,
    params: { ...params },
    totalResult,
    currentTrade,
    winBaseline,
    lossAccumulator,
    tradeCount,
    rows: JSON.parse(JSON.stringify(rows))
  });

  const restoreState = (state: CalculatorState) => {
    setInitialAmount(state.initialAmount);
    setParams({ ...state.params });
    setTotalResult(state.totalResult);
    setCurrentTrade(state.currentTrade);
    setWinBaseline(state.winBaseline);
    setLossAccumulator(state.lossAccumulator);
    setTradeCount(state.tradeCount);
    setRows(JSON.parse(JSON.stringify(state.rows)));
  };

  const saveState = () => {
    const state = getCurrentState();
    setHistoryStack([...historyStack, state]);
    setRedoStack([]);
  };

  const initialize = () => {
    if (!hasActiveSubscription) {
      toast.error('Subscription required', {
        description: 'Please subscribe to use the calculator',
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/upgrade'),
        },
      });
      return;
    }

    if (isNaN(initialAmount) || initialAmount <= 0) {
      alert('Please enter a valid positive Initial Amount.');
      return;
    }

    const computedParams = getComputedParams(params);
    setComputed(computedParams);

    const newTotalResult = 0;
    const newLossAccumulator = 0;
    const newTradeCount = 1;
    const newCurrentTrade = calculateInitialTrade(initialAmount, computedParams.divisor);
    const newWinBaseline = newCurrentTrade;

    const newRows: TradeRow[] = [{
      sl: newTradeCount,
      tradeAmount: newCurrentTrade,
      result: '-',
      total: newTotalResult,
      finalAmount: initialAmount
    }];

    setTotalResult(newTotalResult);
    setLossAccumulator(newLossAccumulator);
    setTradeCount(newTradeCount);
    setCurrentTrade(newCurrentTrade);
    setWinBaseline(newWinBaseline);
    setRows(newRows);
    setHistoryStack([]);
    setRedoStack([]);
    setInitialized(true);

    // Save initial state
    setTimeout(() => saveState(), 0);
  };

  const handleTrade = (type: 'win' | 'loss') => {
    const computedParams = getComputedParams(params);
    
    let result = 0;
    const newTradeCount = tradeCount + 1;
    let newTotalResult = totalResult;
    let newCurrentTrade = currentTrade;
    let newWinBaseline = winBaseline;
    let newLossAccumulator = lossAccumulator;

    if (type === 'win') {
      result = calculateWinResult(currentTrade, computedParams.q);
      newTotalResult += result;
      const finalAmount = initialAmount + newTotalResult;
      const nextTrade = calculateNextTradeAfterWin(finalAmount, computedParams.divisor);

      const updatedRows = [...rows];
      updatedRows[updatedRows.length - 1] = {
        ...updatedRows[updatedRows.length - 1],
        result: parseFloat(result.toFixed(4)),
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      };

      updatedRows.push({
        sl: newTradeCount,
        tradeAmount: nextTrade,
        result: '-',
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      });

      newWinBaseline = nextTrade;
      newLossAccumulator = 0;
      newCurrentTrade = nextTrade;
      setRows(updatedRows);
    } else if (type === 'loss') {
      result = calculateLossResult(currentTrade, computedParams.p);
      newTotalResult += result;
      const finalAmount = initialAmount + newTotalResult;

      newLossAccumulator += currentTrade;
      const nextTrade = calculateNextTradeAfterLoss(
        winBaseline,
        newLossAccumulator,
        computedParams.p,
        computedParams.q
      );

      const updatedRows = [...rows];
      updatedRows[updatedRows.length - 1] = {
        ...updatedRows[updatedRows.length - 1],
        result: parseFloat(result.toFixed(4)),
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      };

      updatedRows.push({
        sl: newTradeCount,
        tradeAmount: nextTrade,
        result: '-',
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      });

      newCurrentTrade = nextTrade;
      setRows(updatedRows);
    }

    setTotalResult(newTotalResult);
    setTradeCount(newTradeCount);
    setCurrentTrade(newCurrentTrade);
    setWinBaseline(newWinBaseline);
    setLossAccumulator(newLossAccumulator);
    
    setTimeout(() => saveState(), 0);
  };

  const showTrades = () => {
    if (showSerial === '' || showSerial < 1) {
      alert('Please enter a valid serial number.');
      return;
    }

    if (isNaN(initialAmount) || initialAmount <= 0) {
      alert('Invalid initial amount');
      return;
    }

    const computedParams = getComputedParams(params);
    
    let newTotalResult = 0;
    let newLossAccumulator = 0;
    let newTradeCount = 1;
    let newCurrentTrade = calculateInitialTrade(initialAmount, computedParams.divisor);
    let newWinBaseline = newCurrentTrade;

    const newRows: TradeRow[] = [{
      sl: newTradeCount,
      tradeAmount: newCurrentTrade,
      result: '-',
      total: newTotalResult,
      finalAmount: initialAmount
    }];

    for (let i = 2; i <= showSerial; i++) {
      newTradeCount = i;
      const result = calculateWinResult(newCurrentTrade, computedParams.q);
      newTotalResult += result;
      const finalAmount = initialAmount + newTotalResult;
      const nextTrade = calculateNextTradeAfterWin(finalAmount, computedParams.divisor);

      newRows[newRows.length - 1] = {
        ...newRows[newRows.length - 1],
        result: parseFloat(result.toFixed(4)),
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      };

      newRows.push({
        sl: newTradeCount,
        tradeAmount: nextTrade,
        result: '-',
        total: parseFloat(newTotalResult.toFixed(4)),
        finalAmount: parseFloat(finalAmount.toFixed(4))
      });

      newWinBaseline = nextTrade;
      newLossAccumulator = 0;
      newCurrentTrade = nextTrade;
    }

    setTotalResult(newTotalResult);
    setLossAccumulator(newLossAccumulator);
    setTradeCount(newTradeCount);
    setCurrentTrade(newCurrentTrade);
    setWinBaseline(newWinBaseline);
    setRows(newRows);
    setHistoryStack([]);
    setRedoStack([]);
    setInitialized(true);

    setTimeout(() => saveState(), 0);
  };

  const undoAction = () => {
    if (historyStack.length > 1) {
      const newHistoryStack = [...historyStack];
      const currentState = newHistoryStack.pop()!;
      const prevState = newHistoryStack[newHistoryStack.length - 1];
      
      setHistoryStack(newHistoryStack);
      setRedoStack([...redoStack, currentState]);
      restoreState(prevState);
    }
  };

  const redoAction = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const state = newRedoStack.pop()!;
      
      setHistoryStack([...historyStack, state]);
      setRedoStack(newRedoStack);
      restoreState(state);
    }
  };

  const change = rows.length > 0 ? calculateChange(rows[rows.length - 1].finalAmount, initialAmount) : { percent: 0, amount: 0 };
  const stats = calculateStats(rows);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Trading Calculator
          </h1>
          <p className="text-center text-muted-foreground mt-2">by Manish Ranjan</p>
        </Card>

        {/* Parameter Inputs */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Trading Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialAmount">Initial Amount</Label>
              <Input
                id="initialAmount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nTrades">1st Win after n Trade (n)</Label>
              <Input
                id="nTrades"
                type="number"
                value={params.nTrades}
                onChange={(e) => setParams({ ...params, nTrades: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lossBooked">Loss % Captured (l)</Label>
              <Input
                id="lossBooked"
                type="number"
                step="0.01"
                value={params.l}
                onChange={(e) => setParams({ ...params, l: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profitBooked">Profit % Captured (m)</Label>
              <Input
                id="profitBooked"
                type="number"
                step="0.01"
                value={params.m}
                onChange={(e) => setParams({ ...params, m: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage (t)</Label>
              <Input
                id="leverage"
                type="number"
                value={params.t}
                onChange={(e) => setParams({ ...params, t: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeGST">Fee+GST (f)</Label>
              <Input
                id="feeGST"
                type="number"
                step="0.01"
                value={params.f}
                onChange={(e) => setParams({ ...params, f: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        {/* Computed Values */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Computed Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Divisor</Label>
              <div className="text-lg font-bold text-foreground bg-muted p-3 rounded-md">
                {computed.divisor.toFixed(4)}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Loss % Each Trade incl. Fees (p)</Label>
              <div className="text-lg font-bold text-foreground bg-muted p-3 rounded-md">
                {computed.p.toFixed(4)}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Profit % Each Trade excl. Fees (q)</Label>
              <div className="text-lg font-bold text-foreground bg-muted p-3 rounded-md">
                {computed.q.toFixed(4)}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Change (%/Amount)</Label>
              <div className={`text-lg font-bold p-3 rounded-md ${
                change.percent > 0 ? 'bg-green-100 text-green-700' : 
                change.percent < 0 ? 'bg-red-100 text-red-700' : 
                'bg-muted text-foreground'
              }`}>
                {change.percent.toFixed(2)}% / {change.amount.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>

        {/* Simulation */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Simulation</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="showSerial">Show trades up to Serial No</Label>
              <Input
                id="showSerial"
                type="number"
                value={showSerial}
                onChange={(e) => setShowSerial(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="e.g. 10"
                className="bg-background"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={showTrades} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                Show
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Total Trades</Label>
              <div className="text-2xl font-bold text-foreground bg-muted p-3 rounded-md text-center">
                {stats.total}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Wins</Label>
              <div className="text-2xl font-bold text-green-700 bg-green-100 p-3 rounded-md text-center">
                {stats.wins} ({stats.winPercent.toFixed(2)}%)
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Losses</Label>
              <div className="text-2xl font-bold text-red-700 bg-red-100 p-3 rounded-md text-center">
                {stats.losses} ({stats.lossPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={initialize}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            >
              Initialize
            </Button>
            <Button 
              onClick={() => handleTrade('win')}
              disabled={!initialized}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 disabled:opacity-50"
            >
              Win
            </Button>
            <Button 
              onClick={() => handleTrade('loss')}
              disabled={!initialized}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 disabled:opacity-50"
            >
              Loss
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={undoAction}
                disabled={historyStack.length <= 1}
                variant="outline"
                size="icon"
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={redoAction}
                disabled={redoStack.length === 0}
                variant="outline"
                size="icon"
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Trading Table */}
        {rows.length > 0 && (
          <Card className="p-6 bg-white/80 backdrop-blur border-none shadow-lg overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Trade History</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-center font-semibold">Sl. No.</th>
                    <th className="border border-border p-3 text-center font-semibold">Trade Amount (Aₙ)</th>
                    <th className="border border-border p-3 text-center font-semibold">Loss/Win Result</th>
                    <th className="border border-border p-3 text-center font-semibold">Total Loss/Win</th>
                    <th className="border border-border p-3 text-center font-semibold">Final Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.sl} className="hover:bg-muted/50 transition-colors">
                      <td className="border border-border p-3 text-center">{row.sl}</td>
                      <td className="border border-border p-3 text-center font-mono">
                        {typeof row.tradeAmount === 'number' ? row.tradeAmount.toFixed(4) : row.tradeAmount}
                      </td>
                      <td className={`border border-border p-3 text-center font-mono font-semibold ${
                        typeof row.result === 'number' && row.result > 0 ? 'text-green-700' :
                        typeof row.result === 'number' && row.result < 0 ? 'text-red-700' :
                        ''
                      }`}>
                        {row.result}
                      </td>
                      <td className="border border-border p-3 text-center font-mono">
                        {typeof row.total === 'number' ? row.total.toFixed(4) : row.total}
                      </td>
                      <td className="border border-border p-3 text-center font-mono font-semibold">
                        {typeof row.finalAmount === 'number' ? row.finalAmount.toFixed(4) : row.finalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className="border border-border p-3 text-center italic bg-muted/50 text-sm text-muted-foreground">
                      © Manish Ranjan
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
