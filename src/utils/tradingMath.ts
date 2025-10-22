/**
 * Trading Calculator Mathematics
 * 
 * CRITICAL: These formulas MUST NOT be modified to preserve parity with original calculator.
 * All functions are isolated pure functions that maintain exact numeric behavior.
 * 
 * Original calculator by: Manish Ranjan
 */

export interface TradingParams {
  nTrades: number;    // 1st Win after n Trade (n)
  l: number;          // Loss % Captured
  m: number;          // Profit % Captured
  t: number;          // Leverage
  f: number;          // Fee+GST
}

export interface ComputedParams {
  divisor: number;
  p: number;  // Loss % Each Trade incl. Fees
  q: number;  // Profit % Each Trade excl. Fees
}

/**
 * PRESERVE_FORMULA: Calculate divisor from trading parameters
 * Formula: divisor = baseRatio^(nTrades-1) * (1 + ((m-f)*t)/100) - (((m-f)*t)/100)
 * where baseRatio = (l + m) / (m - f)
 */
export function calculateDivisor(params: TradingParams): number {
  const { nTrades, l, m, f, t } = params;
  const baseRatio = (l + m) / (m - f);
  const divisor = Math.pow(baseRatio, nTrades - 1) * (1 + ((m - f) * t) / 100) - (((m - f) * t) / 100);
  return divisor;
}

/**
 * PRESERVE_FORMULA: Calculate loss percentage including fees
 * Formula: p = (l + f) * t
 */
export function calculateP(params: TradingParams): number {
  const { l, f, t } = params;
  return (l + f) * t;
}

/**
 * PRESERVE_FORMULA: Calculate profit percentage excluding fees
 * Formula: q = (m - f) * t
 */
export function calculateQ(params: TradingParams): number {
  const { m, f, t } = params;
  return (m - f) * t;
}

/**
 * Calculate all computed parameters
 */
export function getComputedParams(params: TradingParams): ComputedParams {
  return {
    divisor: calculateDivisor(params),
    p: calculateP(params),
    q: calculateQ(params)
  };
}

/**
 * PRESERVE_FORMULA: Calculate initial trade amount
 * Formula: currentTrade = initialAmount / divisor
 */
export function calculateInitialTrade(initialAmount: number, divisor: number): number {
  return initialAmount / divisor;
}

/**
 * PRESERVE_FORMULA: Calculate win result
 * Formula: result = currentTrade * (q / 100)
 */
export function calculateWinResult(currentTrade: number, q: number): number {
  return currentTrade * (q / 100);
}

/**
 * PRESERVE_FORMULA: Calculate next trade amount after win
 * Formula: nextTrade = finalAmount / divisor
 */
export function calculateNextTradeAfterWin(finalAmount: number, divisor: number): number {
  return finalAmount / divisor;
}

/**
 * PRESERVE_FORMULA: Calculate loss result
 * Formula: result = -currentTrade * (p / 100)
 */
export function calculateLossResult(currentTrade: number, p: number): number {
  return -currentTrade * (p / 100);
}

/**
 * PRESERVE_FORMULA: Calculate next trade amount after loss
 * Formula: nextTrade = winBaseline + (lossAccumulator * (p / q))
 */
export function calculateNextTradeAfterLoss(
  winBaseline: number,
  lossAccumulator: number,
  p: number,
  q: number
): number {
  return winBaseline + (lossAccumulator * (p / q));
}

/**
 * Calculate change percentage and amount
 */
export function calculateChange(finalAmount: number, initialAmount: number): { percent: number; amount: number } {
  const changePercent = ((finalAmount - initialAmount) / initialAmount) * 100;
  const changeAmount = finalAmount - initialAmount;
  return { percent: changePercent, amount: changeAmount };
}

/**
 * Calculate win/loss statistics
 */
export function calculateStats(rows: any[]): { 
  total: number; 
  wins: number; 
  losses: number; 
  winPercent: number; 
  lossPercent: number;
} {
  let winCount = 0;
  let lossCount = 0;
  
  for (let i = 1; i < rows.length; i++) {
    const res = parseFloat(rows[i - 1].result);
    if (!isNaN(res)) {
      if (res > 0) winCount++;
      else if (res < 0) lossCount++;
    }
  }
  
  const totalTrades = rows.length > 0 ? rows.length - 1 : 0;
  const winPercent = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
  const lossPercent = totalTrades > 0 ? (lossCount / totalTrades) * 100 : 0;
  
  return {
    total: totalTrades,
    wins: winCount,
    losses: lossCount,
    winPercent,
    lossPercent
  };
}
