import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, AlertCircle, BarChart } from 'lucide-react';
import { WalletType, getWalletDisplayName } from './Utils';

interface ChartPageProps {
  isLoadingChart: boolean;
  tokenAddress: string;
  wallets: WalletType[];
  onDataUpdate?: (data: {
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
  }) => void;
}

// Iframe communication types
interface Wallet {
  address: string;
  label?: string;
}

type IframeMessage = 
  | AddWalletsMessage
  | ClearWalletsMessage
  | GetWalletsMessage;

interface AddWalletsMessage {
  type: 'ADD_WALLETS';
  wallets: (string | Wallet)[];
}

interface ClearWalletsMessage {
  type: 'CLEAR_WALLETS';
}

interface GetWalletsMessage {
  type: 'GET_WALLETS';
}

type IframeResponse = 
  | IframeReadyResponse
  | WalletsAddedResponse
  | WalletsClearedResponse
  | CurrentWalletsResponse
  | WhitelistTradingStatsResponse
  | SolPriceUpdateResponse
  | WhitelistTradeResponse
  | TokenPriceUpdateResponse;

interface IframeReadyResponse {
  type: 'IFRAME_READY';
}

interface WalletsAddedResponse {
  type: 'WALLETS_ADDED';
  success: boolean;
  count: number;
}

interface WalletsClearedResponse {
  type: 'WALLETS_CLEARED';
  success: boolean;
}

interface CurrentWalletsResponse {
  type: 'CURRENT_WALLETS';
  wallets: any[];
}

interface WhitelistTradingStatsResponse {
  type: 'WHITELIST_TRADING_STATS';
  data: {
    bought: number;
    sold: number;
    net: number;
    trades: number;
    solPrice: number;
    timestamp: number;
  };
}

interface SolPriceUpdateResponse {
  type: 'SOL_PRICE_UPDATE';
  data: {
    solPrice: number;
    timestamp: number;
  };
}

interface WhitelistTradeResponse {
  type: 'WHITELIST_TRADE';
  data: {
    type: 'buy' | 'sell';
    address: string;
    tokensAmount: number;
    avgPrice: number;
    solAmount: number;
    timestamp: number;
    signature: string;
  };
}

interface TokenPriceUpdateResponse {
  type: 'TOKEN_PRICE_UPDATE';
  data: {
    tokenPrice: number;
    tokenMint: string;
    timestamp: number;
    tradeType: 'buy' | 'sell';
    volume: number;
  };
}

// Button component with animation
const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'solid';
  className?: string;
}> = ({ icon, onClick, title, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#87D693]/20 hover:bg-[#87D693]/30 text-[#87D693]',
    secondary: 'bg-neutral-800/40 hover:bg-neutral-700/50 text-white',
    solid: 'bg-[#87D693] hover:bg-[#87D693]/90 text-black shadow-lg shadow-[#87D693]/25'
  };
  
  return (
      <motion.button
        className={`p-2 rounded-md transition-colors ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {icon}
      </motion.button>
  );
};

export const ChartPage: React.FC<ChartPageProps> = ({
  isLoadingChart,
  tokenAddress,
  wallets,
  onDataUpdate
}) => {
  const [frameLoading, setFrameLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [isIframeReady, setIsIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messageQueue = useRef<IframeMessage[]>([]);
  
  // State for iframe data
  const [tradingStats, setTradingStats] = useState<{
    bought: number;
    sold: number;
    net: number;
    trades: number;
    timestamp: number;
  } | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [currentWallets, setCurrentWallets] = useState<any[]>([]);
  const [recentTrades, setRecentTrades] = useState<{
    type: 'buy' | 'sell';
    address: string;
    tokensAmount: number;
    avgPrice: number;
    solAmount: number;
    timestamp: number;
    signature: string;
  }[]>([]);
  const [tokenPrice, setTokenPrice] = useState<{
    tokenPrice: number;
    tokenMint: string;
    timestamp: number;
    tradeType: 'buy' | 'sell';
    volume: number;
  } | null>(null);

  // Notify parent component of data updates (excluding currentWallets to prevent balance updates on selection)
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        tradingStats,
        solPrice,
        currentWallets,
        recentTrades,
        tokenPrice
      });
    }
  }, [tradingStats, solPrice, recentTrades, tokenPrice, onDataUpdate]);


  
  // Setup iframe message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent<IframeResponse>) => {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      
      switch (event.data.type) {
        case 'IFRAME_READY':
          setIsIframeReady(true);
          // Process queued messages
          messageQueue.current.forEach(message => {
            sendMessageToIframe(message);
          });
          messageQueue.current = [];
          break;
        
        case 'WALLETS_ADDED':
          console.log(`Successfully added ${event.data.count} wallets to iframe`);
          break;
        
        case 'WALLETS_CLEARED':
          console.log('Cleared all iframe wallets');
          break;
        
        case 'CURRENT_WALLETS':
          console.log('Current wallets in iframe:', event.data.wallets);
          setCurrentWallets(event.data.wallets);
          break;
        
        case 'WHITELIST_TRADING_STATS': {
          const response = event.data as WhitelistTradingStatsResponse;
          console.log('Trading stats updated:', response.data);
          setTradingStats(response.data);
          break;
        }
        
        case 'SOL_PRICE_UPDATE': {
          const response = event.data as SolPriceUpdateResponse;
          console.log('SOL price updated:', response.data.solPrice);
          setSolPrice(response.data.solPrice);
          break;
        }
        
        case 'WHITELIST_TRADE': {
          const response = event.data as WhitelistTradeResponse;
          console.log('New whitelist trade:', response.data);
          setRecentTrades(prev => {
            const newTrades = [response.data, ...prev].slice(0, 10); // Keep only last 10 trades
            return newTrades;
          });
          break;
        }
        
        case 'TOKEN_PRICE_UPDATE': {
          const response = event.data as TokenPriceUpdateResponse;
          console.log('Token price updated:', response.data);
          setTokenPrice(response.data);
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send message to iframe
  const sendMessageToIframe = (message: IframeMessage): void => {
    if (!isIframeReady || !iframeRef.current) {
      messageQueue.current.push(message);
      return;
    }

    iframeRef.current.contentWindow?.postMessage(message, '*');
  };

  // Send wallets to iframe only when addresses change (not selection changes)
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const iframeWallets: Wallet[] = wallets.map((wallet) => ({
        address: wallet.address,
        label: getWalletDisplayName(wallet)
      }));
      
      sendMessageToIframe({
        type: 'ADD_WALLETS',
        wallets: iframeWallets
      });
    } else {
      // Clear wallets if no addresses provided
      sendMessageToIframe({
        type: 'CLEAR_WALLETS'
      });
    }
  }, [
    // Only trigger when wallet addresses change, not when isActive changes
    wallets.map(w => w.address).join(','), 
    wallets.length, 
    isIframeReady
  ]);
  
  // Reset loading state when token changes
  useEffect(() => {
    if (tokenAddress) {
      setFrameLoading(true);
      setIsIframeReady(false);
    }
  }, [tokenAddress]);
  
  // Handle iframe load completion
  const handleFrameLoad = () => {
    setFrameLoading(false);
  };


  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  const pulseVariants: Variants = {
    initial: { opacity: 0.5, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as "reverse",
        ease: "easeInOut"
      }
    }
  };

  const loaderVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  

  
  // Render loader
  const renderLoader = (loading: boolean) => (
    <AnimatePresence>
      {loading && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f]/90 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="w-12 h-12 rounded-full border-2 border-t-transparent border-[#87D693]/30"
            variants={loaderVariants}
            animate="animate"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
  


  // Render iframe with single frame
  const renderFrame = () => {
    return (
      <div className="relative flex-1 overflow-hidden iframe-container">
        {renderLoader(frameLoading || isLoadingChart)}
        
        <div className="absolute inset-0 overflow-hidden">
          <iframe 
            ref={iframeRef}
            key={`frame-${iframeKey}`}
            src={`https://frame.fury.bot/?tokenMint=${tokenAddress}&theme=green`}
            className="absolute inset-0 w-full h-full border-0"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              minHeight: '100%'
            }}
            title="BetterSkill Frame"
            loading="eager"
            onLoad={handleFrameLoad}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    );
  };
  
  // Render placeholder when no token is selected
  const renderPlaceholder = () => (
    <motion.div 
      key="placeholder"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center p-8"
    >
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate" 
        className="rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#101010] p-4 mb-6"
      >
        <Search className="h-10 w-10 text-gray-600 opacity-50" />
      </motion.div>
      
      <motion.h3 
        variants={itemVariants}
        className="text-lg font-medium text-gray-400 mb-2"
      >
        Set token address
      </motion.h3>
      
      <motion.p 
        variants={itemVariants}
        className="text-gray-500 text-sm max-w-md text-center"
      >
        Enter a valid token address in the search bar above to view the token frame
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        className="mt-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
      >
        <AlertCircle size={16} className="text-yellow-400" />
        <span className="text-yellow-300 text-sm">No token selected</span>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full rounded-lg overflow-hidden h-full md:h-full min-h-[calc(100vh-4rem)] md:min-h-full"
      style={{
        background: "linear-gradient(145deg, #0f0f0f 0%, #141414 100%)",
        touchAction: 'manipulation',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/10 to-transparent pointer-events-none" />
      

      
      <AnimatePresence mode="wait">
        {isLoadingChart ? (
          <div className="h-full flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <BarChart size={24} className="text-[#87D693]" />
            </motion.div>
          </div>
        ) : !tokenAddress ? (
          renderPlaceholder()
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 h-full"
          >
            {renderFrame()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChartPage;