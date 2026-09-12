import React from 'react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { AppState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  state: AppState;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (category: string, itemId: string) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  state,
  onBuyItem,
  onEquipItem,
  onClose,
}) => {
  const handlePurchase = (item: ShopItem) => {
    if (state.coins < item.cost) {
      soundManager.playWrong();
      return;
    }
    soundManager.playCoin();
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#0ea5e9'],
      });
    } catch {
      // ignore
    }
    onBuyItem(item);
  };

  const isItemOwned = (item: ShopItem) => {
    if (item.category === 'frame') {
      return state.inventory.avatarFrames.includes(item.id);
    }
    if (item.category === 'theme') {
      return state.inventory.themes.includes(item.id);
    }
    return false;
  };

  const isItemEquipped = (item: ShopItem) => {
    if (item.category === 'frame') {
      return state.user.avatarFrame === item.id;
    }
    if (item.category === 'theme') {
      return state.activeTheme === item.id;
    }
    return false;
  };

  return (
    <div
      id="modal-shop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-white/[0.08] rounded-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg">
              💎
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Grammar Quest Shop</h2>
              <p className="text-xs text-slate-400">
                Spend coins earned through drills on power-ups, themes & frames!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs font-mono">
              <span>💎</span>
              <span>{state.coins} Coins</span>
            </div>

            <button
              id="btn-close-shop"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHOP_ITEMS.map((item) => {
              const owned = isItemOwned(item);
              const equipped = isItemEquipped(item);
              const canAfford = state.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 hover:border-amber-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl p-1.5 rounded-lg bg-slate-900 border border-white/[0.06]">
                        {item.icon}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.cost} 💎
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white">{item.name || item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    {item.category === 'hearts' || item.category === 'hints' || item.category === 'boost' ? (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="w-full py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs shadow transition-transform active:scale-95"
                      >
                        Buy for {item.cost} 💎
                      </button>
                    ) : owned ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onEquipItem(item.category, item.id);
                        }}
                        className={`w-full py-1.5 rounded-md font-semibold text-xs transition-all ${
                          equipped
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        }`}
                      >
                        {equipped ? '✓ Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="w-full py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs shadow transition-transform active:scale-95"
                      >
                        Unlock for {item.cost} 💎
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
