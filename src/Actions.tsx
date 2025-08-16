import React, { useEffect, useState } from 'react';
import {
   Download, 
   Settings2,
   ChevronDown, 
   Share2,
   Waypoints,
   Blocks,
   Trash2,
   ChartSpline,
   Send,
   Workflow,
   Sparkles,
   Activity,
   TrendingUp,
   Users,
   BarChart,
   Coins
 } from 'lucide-react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { WalletType, loadConfigFromCookies } from "./Utils";
import { useToast } from "./Notifications";
import { countActiveWallets, validateActiveWallets, getScriptName, maxWalletsConfig } from './Wallets';
import TradingCard from './TradingForm';

import { executePumpSell, validatePumpSellInputs } from './utils/pumpsell';
import { executePumpBuy, validatePumpBuyInputs } from './utils/pumpbuy';
import { executeBoopSell, validateBoopSellInputs } from './utils/boopsell';
import { executeBoopBuy, validateBoopBuyInputs } from './utils/boopbuy';

// Enhanced cyberpunk-styled Switch component (simplified)
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={`
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
      border-2 border-[#FFD70040] transition-colors duration-300
      focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-[#FFD700] focus-visible:ring-offset-2
      focus-visible:ring-offset-[#050a0e] disabled:cursor-not-allowed
      disabled:opacity-50 data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-[#0a1419]
      relative overflow-hidden ${className}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={`
        pointer-events-none block h-5 w-5 rounded-full
        bg-white shadow-lg ring-0 transition-transform
        data-[state=checked]:translate-x-5 data-[state=checked]:bg-[#FFE4B5]
        data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-[#FFE4B5]`}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

interface ActionsPageProps {
  tokenAddress: string;
  transactionFee: string;
  handleRefresh: () => void;
  wallets: WalletType[];
  solBalances: Map<string, number>;
  tokenBalances: Map<string, number>;
  currentMarketCap: number | null;
  setBurnModalOpen: (open: boolean) => void;
  setCalculatePNLModalOpen: (open: boolean) => void;
  setDeployModalOpen: (open: boolean) => void;
  setCleanerTokensModalOpen: (open: boolean) => void;
  setCustomBuyModalOpen: (open: boolean) => void;
  onOpenFloating: () => void;
  isFloatingCardOpen: boolean;
  iframeData?: {
    tradingStats: any;
    solPrice: number | null;
    currentWallets: any[];
    recentTrades: {
      type: 'buy' | 'sell';
      address: string;
      tokensAmount: number;
      avgPrice: number;
      solAmount: number;
      timestamp: number;
      signature: string;
    }[];
    tokenPrice: {
      tokenPrice: number;
      tokenMint: string;
      timestamp: number;
      tradeType: 'buy' | 'sell';
      volume: number;
    } | null;
  } | null;
}

// Simplified Tooltip component without animations
export const Tooltip = ({ 
  children, 
  content,
  position = 'top'
}: { 
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-[#051014] border border-[#FFD70040] text-[#FFD700] text-xs px-2 py-1 rounded 
                         shadow-lg shadow-[#FFD70020] whitespace-nowrap font-mono tracking-wide">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
// Cyberpunk-themed DataBox with minimal clean column layout
const DataBox: React.FC<{
  iframeData?: {
    tradingStats: any;
    solPrice: number | null;
    currentWallets: any[];
    recentTrades: {
      type: 'buy' | 'sell';
      address: string;
      tokensAmount: number;
      avgPrice: number;
      solAmount: number;
      timestamp: number;
      signature: string;
    }[];
    tokenPrice: {
      tokenPrice: number;
      tokenMint: string;
      timestamp: number;
      tradeType: 'buy' | 'sell';
      volume: number;
    } | null;
  } | null;
  tokenAddress: string;
  tokenBalances: Map<string, number>;
}> = ({ iframeData, tokenAddress, tokenBalances }) => {
  if (!tokenAddress || !iframeData) return null;

  const { tradingStats, solPrice, currentWallets, recentTrades, tokenPrice } = iframeData;

  // Calculate holdings value
  const totalTokens = Array.from(tokenBalances.values()).reduce((sum, balance) => sum + balance, 0);
  const currentTokenPrice = tokenPrice?.tokenPrice || 0;
  const holdingsValue = totalTokens * currentTokenPrice;

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-br from-[#0a141980] to-[#05080a80] backdrop-blur-sm rounded-xl p-6 shadow-xl border border-[#FFD70020] relative overflow-hidden">
        
        {/* Cyberpunk accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD70040] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD70040] to-transparent"></div>
        
        {/* Main stats grid - clean 4-column layout */}
        <div className="grid grid-cols-4 gap-8 relative z-10">
          
          {/* Bought */}
          <div className="flex flex-col items-center text-center group">
            <div className="text-xs font-mono tracking-wider text-[#FFE4B580] uppercase mb-2 font-medium">
              Bought
            </div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-[#FFD700] font-mono tracking-tight">
                {tradingStats ? tradingStats.bought.toFixed(2) : '0.00'}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-[#FFD700] rounded opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#FFD700] rounded opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#FFD700] rounded opacity-40 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Sold */}
          <div className="flex flex-col items-center text-center group">
            <div className="text-xs font-mono tracking-wider text-[#FFE4B580] uppercase mb-2 font-medium">
              Sold
            </div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-[#ff6b6b] font-mono tracking-tight">
                {tradingStats ? tradingStats.sold.toFixed(2) : '0.00'}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-[#ff6b6b] rounded opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#ff6b6b] rounded opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#ff6b6b] rounded opacity-40 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Holding */}
          <div className="flex flex-col items-center text-center group">
            <div className="text-xs font-mono tracking-wider text-[#FFE4B580] uppercase mb-2 font-medium">
              Holding
            </div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-[#FFE4B5] font-mono tracking-tight">
                {holdingsValue.toFixed(2)}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-[#FFE4B5] rounded opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#FFE4B5] rounded opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-0.5 bg-[#FFE4B5] rounded opacity-40 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* PnL */}
          <div className="flex flex-col items-center text-center group">
            <div className="text-xs font-mono tracking-wider text-[#FFE4B580] uppercase mb-2 font-medium">
              PnL
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-lg font-bold font-mono tracking-tight ${
                tradingStats && tradingStats.net >= 0 ? 'text-[#FFD700]' : 'text-[#ff6b6b]'
              }`}>
                {tradingStats ? (
                  <div>
                    {tradingStats.net >= 0 ? '+' : ''}{tradingStats.net.toFixed(2)}
                  </div>
                ) : (
                  <div>+0.00</div>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className={`w-2 h-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity ${
                  tradingStats && tradingStats.net >= 0 ? 'bg-[#FFD700]' : 'bg-[#ff6b6b]'
                }`}></div>
                <div className={`w-2 h-0.5 rounded opacity-60 group-hover:opacity-100 transition-opacity ${
                  tradingStats && tradingStats.net >= 0 ? 'bg-[#FFD700]' : 'bg-[#ff6b6b]'
                }`}></div>
                <div className={`w-2 h-0.5 rounded opacity-40 group-hover:opacity-100 transition-opacity ${
                  tradingStats && tradingStats.net >= 0 ? 'bg-[#FFD700]' : 'bg-[#ff6b6b]'
                }`}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal footer info */}
        {currentWallets && currentWallets.length > 0 && (
          <div className="mt-8 pt-4 border-t border-[#FFD70020]">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
                <span className="text-[#FFE4B5] font-mono text-xs tracking-wider">
                  {currentWallets.length} ACTIVE
                </span>
              </div>
              {tradingStats && (
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                  <span className="text-[#FFE4B5] font-mono text-xs tracking-wider">
                    {tradingStats.trades} TRADES
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70005] to-transparent pointer-events-none"></div>
        
      </div>
    </div>
  );
};
export const ActionsPage: React.FC<ActionsPageProps> = ({ 
  tokenAddress, 
  transactionFee, 
  handleRefresh, 
  wallets, 
  solBalances, 
  tokenBalances, 
  currentMarketCap,
  setBurnModalOpen,
  setCalculatePNLModalOpen,
  setDeployModalOpen,
  setCleanerTokensModalOpen,
  setCustomBuyModalOpen,
  onOpenFloating,
  isFloatingCardOpen,
  iframeData
}) => {
  // State management (no changes)
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedDex, setSelectedDex] = useState('auto'); // Default to auto
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const { showToast } = useToast();


  const dexOptions = [
    { value: 'auto', label: '⭐ Auto', icon: '⭐' },
    { value: 'pumpfun', label: 'PumpFun' },
    { value: 'moonshot', label: 'Moonshot' },
    { value: 'pumpswap', label: 'PumpSwap' },
    { value: 'raydium', label: 'Raydium' },
    { value: 'launchpad', label: 'Launchpad' },
    { value: 'boopfun', label: 'BoopFun' },
  ];
  
  const handleTradeSubmit = async (wallets: WalletType[], isBuyMode: boolean, dex?: string, buyAmount?: string, sellAmount?: string) => {
    setIsLoading(true);
    
    if (!tokenAddress) {
      showToast("Please select a token first", "error");
      setIsLoading(false);
      return;
    }
    
    // Use the provided dex parameter if available, otherwise use selectedDex
    const dexToUse = dex || selectedDex;
    
    // Use the determined DEX
    await originalHandleTradeSubmit(dexToUse, wallets, isBuyMode, buyAmount, sellAmount);
  };

  // Original trade submit function that accepts selectedDex as a parameter
  const originalHandleTradeSubmit = async (dex: string, wallets: WalletType[], isBuyMode: boolean, buyAmountParam?: string, sellAmountParam?: string) => {
    // Replace the moonshot branch in handleTradeSubmit with this implementation
    if (dex === 'moonshot') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for MoonBuy/MoonSell
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // MoonBuy flow - implementation unchanged
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateMoonBuyInputs, executeMoonBuy } = await import('./utils/moonbuy');
          
          const validation = validateMoonBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing MoonBuy for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute MoonBuy operation
          const result = await executeMoonBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("MoonBuy transactions submitted successfully", "success");
          } else {
            showToast(`MoonBuy failed: ${result.error}`, "error");
          }
        } else {
          // MoonSell flow - implementation unchanged
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Import and execute MoonSell
          const { executeMoonSell } = await import('./utils/moonsell');
          
          console.log(`Executing MoonSell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute MoonSell operation
          const result = await executeMoonSell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("MoonSell transactions submitted successfully", "success");
          } else {
            showToast(`MoonSell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Moonshot ${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Special handling for boopFun operations with client-side transaction signing
    if (dex === 'boopfun') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for BoopBuy/BoopSell
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // BoopBuy flow 
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Validate inputs before executing
          const validation = validateBoopBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing BoopBuy for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute BoopBuy operation
          const result = await executeBoopBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("BoopBuy transactions submitted successfully", "success");
          } else {
            showToast(`BoopBuy failed: ${result.error}`, "error");
          }
        } else {
          // BoopSell flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Import and execute BoopSell
          const { executeBoopSell } = await import('./utils/boopsell');
          
          console.log(`Executing BoopSell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute BoopSell operation
          const result = await executeBoopSell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("BoopSell transactions submitted successfully", "success");
          } else {
            showToast(`BoopSell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Boop${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Special handling for PumpFun operations with client-side transaction signing
    if (dex === 'pumpfun') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for PumpBuy/PumpSell
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // PumpBuy flow 
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Validate inputs before executing
          const validation = validatePumpBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing PumpBuy for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute PumpBuy operation
          const result = await executePumpBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("PumpBuy transactions submitted successfully", "success");
          } else {
            showToast(`PumpBuy failed: ${result.error}`, "error");
          }
        } else {
          // PumpSell flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Create a token balance map for validation
          const tokenBalanceMap = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = tokenBalances.get(wallet.address) || 0;
            tokenBalanceMap.set(wallet.address, balance);
          });
          
          // Validate inputs before executing
          const validation = validatePumpSellInputs(formattedWallets, tokenConfig, tokenBalanceMap);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing PumpSell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute PumpSell operation
          const result = await executePumpSell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("PumpSell transactions submitted successfully", "success");
          } else {
            showToast(`PumpSell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Pump${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Special handling for Auto operations with client-side transaction signing
    if (dex === 'auto') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for Auto operations
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // Auto Buy flow
          const swapConfig = {
            inputMint: "So11111111111111111111111111111111111111112", // SOL
            outputMint: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount),
            slippageBps: 9900 // Default to 1% slippage
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateJupSwapInputs, executeJupSwap } = await import('./utils/jupbuy');
          
          const validation = validateJupSwapInputs(formattedWallets, swapConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing Auto Swap (Buy) for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute JupSwap operation
          const result = await executeJupSwap(formattedWallets, swapConfig);
          
          if (result.success) {
            showToast("Auto Buy transactions submitted successfully", "success");
          } else {
            showToast(`Auto Buy failed: ${result.error}`, "error");
          }
        } else {
          // Auto Sell flow
          const sellConfig = {
            inputMint: tokenAddress, // Token to sell
            outputMint: "So11111111111111111111111111111111111111112", // SOL
            sellPercent: parseFloat(sellAmountParam || sellAmount), // Percentage of tokens to sell
            slippageBps: 9900 // Default to 1% slippage
          };
          
          // Create a token balance map for validation
          const tokenBalanceMap = new Map<string, bigint>();
          activeWallets.forEach(wallet => {
            // Convert to bigint for compatibility with selljup validation
            const balance = BigInt(Math.floor((tokenBalances.get(wallet.address) || 0)));
            tokenBalanceMap.set(wallet.address, balance);
          });
          
          // Import the dedicated sell functions from selljup
          const { validateJupSellInputs, executeJupSell } = await import('./utils/jupsell');
          
          console.log(`Executing Auto Sell for ${tokenAddress} with ${activeWallets.length} wallets (${sellConfig.sellPercent}%)`);
          
          // Execute JupSell operation with RPC URL
          const result = await executeJupSell(formattedWallets, sellConfig);
          
          if (result.success) {
            showToast("Auto Sell transactions submitted successfully", "success");
          } else {
            showToast(`Auto Sell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Auto ${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
  
    // Replace the raydium branch in handleTradeSubmit with this implementation
    if (dex === 'raydium') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for RayBuy/Ray
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // Ray flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateRayBuyInputs, executeRayBuy } = await import('./utils/raybuy');
          
          const validation = validateRayBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing RayBuy for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute MoonBuy operation
          const result = await executeRayBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("RayBuy transactions submitted successfully", "success");
          } else {
            showToast(`RayBuy failed: ${result.error}`, "error");
          }
        } else {
          // RaySell flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Create a token balance map for validation
          const tokenBalanceMap = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = tokenBalances.get(wallet.address) || 0;
            tokenBalanceMap.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateRaySellInputs, executeRaySell } = await import('./utils/raysell');
          
          const validation = validateRaySellInputs(formattedWallets, tokenConfig, tokenBalanceMap);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing RaySell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute RaySell operation
          const result = await executeRaySell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("RaySell transactions submitted successfully", "success");
          } else {
            showToast(`RaySell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Moonshot ${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    // Replace the raydium branch in handleTradeSubmit with this implementation
    if (dex === 'launchpad') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for RayBuy/Ray
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // Ray flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateLaunchBuyInputs, executeLaunchBuy } = await import('./utils/launchbuy');
          
          const validation = validateLaunchBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing RayBuy for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute MoonBuy operation
          const result = await executeLaunchBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("RayBuy transactions submitted successfully", "success");
          } else {
            showToast(`RayBuy failed: ${result.error}`, "error");
          }
        } else {
          // RaySell flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Create a token balance map for validation
          const tokenBalanceMap = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = tokenBalances.get(wallet.address) || 0;
            tokenBalanceMap.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateLaunchSellInputs, executeLaunchSell } = await import('./utils/launchsell');
          
          const validation = validateLaunchSellInputs(formattedWallets, tokenConfig, tokenBalanceMap);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing RaySell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute RaySell operation
          const result = await executeLaunchSell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("RaySell transactions submitted successfully", "success");
          } else {
            showToast(`RaySell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Moonshot ${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Replace the pumpswap branch in handleTradeSubmit with this implementation
    if (dex === 'pumpswap') {
      try {
        // Get active wallets
        const activeWallets = wallets.filter(wallet => wallet.isActive);
        
        if (activeWallets.length === 0) {
          showToast("Please activate at least one wallet", "error");
          setIsLoading(false);
          return;
        }
        
        // Format wallets for MoonBuy/MoonSell
        const formattedWallets = activeWallets.map(wallet => ({
          address: wallet.address,
          privateKey: wallet.privateKey
        }));
        
        if (isBuyMode) {
          // MoonBuy flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            solAmount: parseFloat(buyAmountParam || buyAmount)
          };
          
          // Create a balance map for validation
          const walletBalances = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = solBalances.get(wallet.address) || 0;
            walletBalances.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateSwapBuyInputs, executeSwapBuy } = await import('./utils/swapbuy');
          
          const validation = validateSwapBuyInputs(formattedWallets, tokenConfig, walletBalances);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing Swap for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute Swap operation
          const result = await executeSwapBuy(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("Swap transactions submitted successfully", "success");
          } else {
            showToast(`MoonBuy failed: ${result.error}`, "error");
          }
        } else {
          // MoonSell flow
          const tokenConfig = {
            tokenAddress: tokenAddress,
            sellPercent: parseFloat(sellAmountParam || sellAmount)
          };
          
          // Create a token balance map for validation
          const tokenBalanceMap = new Map<string, number>();
          activeWallets.forEach(wallet => {
            const balance = tokenBalances.get(wallet.address) || 0;
            tokenBalanceMap.set(wallet.address, balance);
          });
          
          // Import and validate inputs before executing
          const { validateSwapSellInputs, executeSwapSell } = await import('./utils/swapsell');
          
          const validation = validateSwapSellInputs(formattedWallets, tokenConfig, tokenBalanceMap);
          if (!validation.valid) {
            showToast(`Validation failed: ${validation.error}`, "error");
            setIsLoading(false);
            return;
          }
          
          console.log(`Executing MoonSell for ${tokenAddress} with ${activeWallets.length} wallets`);
          
          // Execute MoonSell operation
          const result = await executeSwapSell(formattedWallets, tokenConfig);
          
          if (result.success) {
            showToast("MoonSell transactions submitted successfully", "success");
          } else {
            showToast(`MoonSell failed: ${result.error}`, "error");
          }
        }
      } catch (error) {
        console.error(`Moonshot ${isBuyMode ? 'Buy' : 'Sell'} error:`, error);
        showToast(`Error: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050a0e] p-4 md:p-6 relative">
      {/* Background effects - keeping original */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[#050a0e] opacity-90">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFD70005] to-transparent"></div>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(2, 179, 109, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(2, 179, 109, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: 'center center',
            }}
          ></div>
        </div>
        
        {/* Glowing corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
          <div className="absolute top-0 left-0 w-px h-16 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-[#FFD700] to-transparent"></div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
          <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-[#FFD700] to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
          <div className="absolute bottom-0 left-0 w-px h-16 bg-gradient-to-t from-[#FFD700] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-[#FFD700] to-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute bottom-0 right-0 w-px h-16 bg-gradient-to-t from-[#FFD700] to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-[#FFD700] to-transparent"></div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Trading Card (unchanged) */}
        <TradingCard
          tokenAddress={tokenAddress}
          wallets={wallets}
          selectedDex={selectedDex}
          setSelectedDex={setSelectedDex}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
          sellAmount={sellAmount}
          setSellAmount={setSellAmount}
          handleTradeSubmit={handleTradeSubmit}
          isLoading={isLoading}
          dexOptions={dexOptions}
          validateActiveWallets={validateActiveWallets}
          getScriptName={getScriptName}
          countActiveWallets={countActiveWallets}
          maxWalletsConfig={maxWalletsConfig}
          currentMarketCap={currentMarketCap}
          tokenBalances={tokenBalances}
          onOpenFloating={onOpenFloating}
          isFloatingCardOpen={isFloatingCardOpen}
        />
        
        {/* Token Operations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
              <Settings2 size={16} className="text-[#FFD700]" />
            </div>
            <span className="font-mono text-sm tracking-wider text-[#FFE4B5] uppercase">Operations</span>
          </div>
          
          <div className="bg-gradient-to-br from-[#0a141980] to-[#05080a80] backdrop-blur-sm rounded-xl p-4 shadow-xl border border-[#FFD70020] relative overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {/* Cleaner Button */}
              <button
                onClick={() => {
                  if (!tokenAddress) {
                    showToast("Please select a token first", "error");
                    return;
                  }
                  setCleanerTokensModalOpen(true);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                          bg-gradient-to-br from-[#0a141990] to-[#05080a90] border border-[#FFD70030] hover:border-[#FFD70060]
                          transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
                  <Waypoints size={20} className="text-[#FFD700]" />
                </div>
                <span className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">Cleaner</span>
              </button>
              
              {/* Deploy Button */}
              <button
                onClick={() => setDeployModalOpen(true)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                          bg-gradient-to-br from-[#0a141990] to-[#05080a90] border border-[#FFD70030] hover:border-[#FFD70060]
                          transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
                  <Blocks size={20} className="text-[#FFD700]" />
                </div>
                <span className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">Deploy</span>
              </button>
              
              {/* Burn Button */}
              <button
                onClick={() => {
                  if (!tokenAddress) {
                    showToast("Please select a token first", "error");
                    return;
                  }
                  setBurnModalOpen(true);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                          bg-gradient-to-br from-[#0a141990] to-[#05080a90] border border-[#FFD70030] hover:border-[#FFD70060]
                          transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
                  <Trash2 size={20} className="text-[#FFD700]" />
                </div>
                <span className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">Burn</span>
              </button>
              
              {/* Stagger Button */}
              <button
                onClick={() => {
                  if (!tokenAddress) {
                    showToast("Please select a token first", "error");
                    return;
                  }
                  setCustomBuyModalOpen(true);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                          bg-gradient-to-br from-[#0a141990] to-[#05080a90] border border-[#FFD70030] hover:border-[#FFD70060]
                          transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
                  <Workflow size={20} className="text-[#FFD700]" />
                </div>
                <span className="text-xs font-mono tracking-wider text-[#FFE4B5] uppercase">Stagger</span>
              </button>
            </div>
          </div>
          
          {/* Live Data Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-[#FFD70020] to-[#FFD70005] rounded-lg">
                  <Activity size={16} className="text-[#FFD700]" />
                </div>
                <span className="font-mono text-sm tracking-wider text-[#FFE4B5] uppercase">Live Data</span>
              </div>
              
              {/* Share PNL Button moved next to Live Data */}
              <button
                onClick={() => {
                  if (!tokenAddress) {
                    showToast("Please select a token first", "error");
                    return;
                  }
                  setCalculatePNLModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                          bg-gradient-to-r from-[#FFD700] to-[#01a35f] hover:from-[#01a35f] hover:to-[#029359]
                          shadow-md shadow-[#FFD70040] hover:shadow-[#FFD70060]
                          transition-all duration-300 relative overflow-hidden"
              >
                <ChartSpline size={16} className="text-black relative z-10" />
                <span className="text-sm font-mono tracking-wider text-black font-medium relative z-10">Share PNL</span>
              </button>
            </div>
            <DataBox iframeData={iframeData} tokenAddress={tokenAddress} tokenBalances={tokenBalances} />
          </div>
        </div>
      </div>


      
    </div>
  );
};