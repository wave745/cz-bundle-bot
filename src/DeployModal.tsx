import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Rocket, Zap, X, Utensils } from 'lucide-react';
import { DeployPumpModal } from './DeployPumpModal';
import { DeployBonkModal } from './DeployBonkModal';
import { DeployCookModal } from './DeployCookModal';
import { DeployMoonModal } from './DeployMoonModal';
import { DeployBoopModal } from './DeployBoopModal';
import { useToast } from "./Notifications";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeployModalProps extends BaseModalProps {
  onDeploy: (data: any) => void;
  handleRefresh: () => void;
  solBalances: Map<string, number>;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
  handleRefresh,
  solBalances,
}) => {
  const [selectedDeployType, setSelectedDeployType] = useState<'pump' | 'bonk' | 'cook' | 'moon' | 'boop' | null>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{backgroundColor: 'rgba(5, 10, 14, 0.95)'}}>
      <div className="relative bg-[#050a0e] border-2 border-[#FFD70040] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden transform modal-glow">
        {/* Header */}
        <div className="relative z-10 p-5 flex justify-between items-center border-b border-[#FFD70040]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFD70020]">
              <Rocket size={20} className="text-[#FFD700]" />
            </div>
            <h2 className="text-xl font-bold text-[#FFE4B5] font-mono">
              <span className="text-[#FFD700]">/</span> SELECT DEPLOY TYPE <span className="text-[#FFD700]">/</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#FFE4B5] hover:text-[#FFD700] transition-colors p-1.5 hover:bg-[#FFD70020] rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Deployment Options */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pump Deploy Option */}
          <div 
            onClick={() => setSelectedDeployType('pump')}
            className="group relative cursor-pointer bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD70020]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Zap size={24} className="text-[#FFD700] group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">PUMP.FUN</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
                Create a new pump.fun token with customizable parameters. Includes liquidity setup.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Bonk Deploy Option */}
          <div 
            onClick={() => setSelectedDeployType('bonk')}
            className="group relative cursor-pointer bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD70020]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Rocket size={24} className="text-[#FFD700] group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">LETSBONK.FUN</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
                Create a new letsbonk.fun token with customizable parameters. Includes liquidity setup.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Cook.Meme Deploy Option */}
          <div 
            onClick={() => setSelectedDeployType('cook')}
            className="group relative cursor-pointer bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD70020]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Utensils size={24} className="text-[#FFD700] group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">COOK.MEME</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
              Create a new cook.meme token with customizable parameters. Includes liquidity setup.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>
          
          {/* moon.it Deploy Option */}
          <div 
            onClick={() => setSelectedDeployType('moon')}
            className="group relative cursor-pointer bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD70020]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Utensils size={24} className="text-[#FFD700] group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">MOON.IT</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
              Create a new moon.it token with customizable parameters. Includes liquidity setup.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>
          
          {/* boop.fun Deploy Option */}
          <div 
            onClick={() => setSelectedDeployType('boop')}
            className="group relative cursor-pointer bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD70020]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Utensils size={24} className="text-[#FFD700] group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">BOOP.FUN</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
              Create a new boop.fun token with customizable parameters. Includes liquidity setup.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>
          <div 
            onClick={() => showToast("LAUNCHPAD deployment coming soon!", "error")}
            className="group relative cursor-not-allowed bg-[#091217] border-2 border-[#FFD70030] rounded-xl p-4 opacity-60"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD70020] flex items-center justify-center">
                <Utensils size={24} className="text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-bold text-[#FFE4B5] font-mono">LAUNCHPAD</h3>
              <p className="text-[#FFE4B5] text-xs leading-relaxed">
                Create a new LAUNCHPAD token. Advanced features including customizable tokenomics and marketing.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD70010] to-transparent rounded-xl" />
          </div>
        </div>

        {/* Render selected modal */}
        {selectedDeployType === 'pump' && (
          <DeployPumpModal
            isOpen={true}
            onClose={() => setSelectedDeployType(null)}
            onDeploy={onDeploy}
            handleRefresh={handleRefresh}
            solBalances={solBalances}
          />
        )}
        
        {/* Render Bonk Deploy Modal when selected */}
        {selectedDeployType === 'bonk' && (
          <DeployBonkModal
            isOpen={true}
            onClose={() => setSelectedDeployType(null)}
            onDeploy={onDeploy}
            handleRefresh={handleRefresh}
            solBalances={solBalances}
          />
        )}
        
        {/* Render Cook Deploy Modal when selected */}
        {selectedDeployType === 'cook' && (
          <DeployCookModal
            isOpen={true}
            onClose={() => setSelectedDeployType(null)}
            onDeploy={onDeploy}
            handleRefresh={handleRefresh}
            solBalances={solBalances}
          />
        )}
        {/* Render Moon Deploy Modal when selected */}
        {selectedDeployType === 'moon' && (
          <DeployMoonModal
            isOpen={true}
            onClose={() => setSelectedDeployType(null)}
            onDeploy={onDeploy}
            handleRefresh={handleRefresh}
            solBalances={solBalances}
          />
        )}
        {/* Render Boop Deploy Modal when selected */}
        {selectedDeployType === 'boop' && (
          <DeployBoopModal
            isOpen={true}
            onClose={() => setSelectedDeployType(null)}
            onDeploy={onDeploy}
            handleRefresh={handleRefresh}
            solBalances={solBalances}
          />
        )}
      </div>
    </div>,
    document.body
  );
};