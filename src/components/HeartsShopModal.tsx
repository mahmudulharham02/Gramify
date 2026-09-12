import React, { useState } from 'react';
import { Heart, Lightbulb, X, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeartsShopModalProps {
  hearts: number;
  maxHearts?: number;
  hints?: number;
  maxHints?: number;
  diamonds: number;
  initialTab?: 'hearts' | 'hints';
  onTradeDiamonds: (hearts: number, cost?: number) => { success: boolean; message: string };
  onTradeHints: (hints: number, cost: number) => { success: boolean; message: string };
  onClose: () => void;
}

export const HeartsShopModal: React.FC<HeartsShopModalProps> = ({
  hearts,
  maxHearts = 20,
  hints = 3,
  maxHints = 8,
  diamonds,
  initialTab = 'hearts',
  onTradeDiamonds,
  onTradeHints,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'hearts' | 'hints'>(initialTab);
  const [confirmingPack, setConfirmingPack] = useState<{
    type: 'hearts' | 'hints';
    amount: number;
    cost: number;
    label: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Hearts exchange rate: 1 💎 = 3 hearts
  const heartPacks = [
    { hearts: 3, cost: 1, label: 'Small', desc: 'Replenish 3 hearts' },
    { hearts: 9, cost: 3, label: 'Medium', desc: 'Replenish 9 hearts' },
    { hearts: 15, cost: 5, label: 'Large', desc: 'Replenish 15 hearts' },
    { hearts: 20, cost: 7, label: 'Full (20 cap)', desc: 'Max out 20 hearts instantly', popular: true },
  ];

  // Hints exchange rate: 1 💎 = 2 hints (max 8)
  const hintPacks = [
    { hints: 2, cost: 1, label: 'Small', desc: '+2 50/50 hint points' },
    { hints: 4, cost: 2, label: 'Medium', desc: '+4 50/50 hint points' },
    { hints: 6, cost: 3, label: 'Large', desc: '+6 50/50 hint points' },
    { hints: 8, cost: 4, label: 'Max Out (8)', desc: 'Top up to 8 max hints', popular: true },
  ];

  const handleBuyHeartsClick = (pack: { hearts: number; cost: number; label: string }) => {
    soundManager.playClick();
    setConfirmingPack({
      type: 'hearts',
      amount: pack.hearts,
      cost: pack.cost,
      label: pack.label,
    });
  };

  const handleBuyHintsClick = (pack: { hints: number; cost: number; label: string }) => {
    soundManager.playClick();
    setConfirmingPack({
      type: 'hints',
      amount: pack.hints,
      cost: pack.cost,
      label: pack.label,
    });
  };

  const handleConfirmPurchase = () => {
    if (!confirmingPack) return;
    if (confirmingPack.type === 'hearts') {
      const res = onTradeDiamonds(confirmingPack.amount, confirmingPack.cost);
      if (res.success) {
        soundManager.playReward();
        setFeedback(res.message);
        setConfirmingPack(null);
      } else {
        soundManager.playIncorrect();
        setFeedback(res.message);
        setConfirmingPack(null);
      }
    } else {
      const res = onTradeHints(confirmingPack.amount, confirmingPack.cost);
      if (res.success) {
        soundManager.playReward();
        setFeedback(res.message);
        setConfirmingPack(null);
      } else {
        soundManager.playIncorrect();
        setFeedback(res.message);
        setConfirmingPack(null);
      }
    }
  };

  return (
    <div
      id="modal-hearts-shop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-white/[0.08] rounded-xl p-4 sm:p-5 relative my-auto animate-fade-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-0.5 mb-3.5">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-lg">❤️</span>
            <h2 className="text-base sm:text-lg font-bold text-white">Grammar Resource Shop</h2>
            <span className="text-lg">💎</span>
          </div>
          <p className="text-xs text-slate-400">
            Exchange diamonds to refill hearts or boost your 50/50 quiz hints!
          </p>
        </div>

        {/* Unified 3-Item Balances Bar */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          <div className="p-2 rounded-lg bg-slate-800/90 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="text-[11px] text-slate-300 font-semibold">Hearts</span>
            </div>
            <span className="text-xs font-bold text-white font-mono">
              {hearts}/{maxHearts}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-800/90 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[11px] text-slate-300 font-semibold">Hints</span>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono">
              {hints}/{maxHints}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-800/90 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💎</span>
              <span className="text-[11px] text-slate-300 font-semibold">Diamonds</span>
            </div>
            <span className="text-xs font-bold text-cyan-400 font-mono">
              {diamonds}
            </span>
          </div>
        </div>

        {/* 2-Tab Navigation */}
        <div className="flex p-1 rounded-lg bg-slate-800 border border-white/[0.06] mb-3.5">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('hearts');
              setConfirmingPack(null);
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hearts'
                ? 'bg-red-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>❤️</span>
            <span>Hearts Refill</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('hints');
              setConfirmingPack(null);
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hints'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💡</span>
            <span>Hint Points</span>
          </button>
        </div>

        {/* Info banner */}
        {activeTab === 'hearts' ? (
          <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/[0.04] text-[11px] text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Hearts automatically replenish at <strong>+1 heart every 3 hours</strong>.
            </span>
          </div>
        ) : (
          <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/[0.04] text-[11px] text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Hints eliminate 2 wrong options in MCQ drills. Max inventory is <strong>8 hints</strong>.
            </span>
          </div>
        )}

        {feedback && (
          <div className="mb-3.5 p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs text-cyan-200 text-center font-medium">
            {feedback}
          </div>
        )}

        {/* Confirmation Modal overlay inside */}
        {confirmingPack ? (
          <div className="p-4 rounded-xl bg-slate-800/90 border border-white/[0.08] text-center space-y-3 animate-fade-in">
            <div className="text-2xl">
              {confirmingPack.type === 'hearts' ? '💎 ➔ ❤️' : '💎 ➔ 💡'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Confirm Exchange</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Spend <strong className="text-cyan-400">{confirmingPack.cost} 💎</strong> for{' '}
                <strong className={confirmingPack.type === 'hearts' ? 'text-red-400' : 'text-amber-400'}>
                  +{confirmingPack.amount} {confirmingPack.type === 'hearts' ? 'Hearts' : 'Hints'}
                </strong>?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingPack(null)}
                className="flex-1 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold shadow ${
                  confirmingPack.type === 'hearts'
                    ? 'bg-red-500 hover:bg-red-400 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                Confirm Exchange
              </button>
            </div>
          </div>
        ) : activeTab === 'hearts' ? (
          /* Hearts Packs Grid (1 💎 = 3 hearts) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {heartPacks.map((pack) => {
              const canAfford = diamonds >= pack.cost;
              const isFull = hearts >= maxHearts;
              return (
                <div
                  key={pack.hearts}
                  className={`p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                    pack.popular
                      ? 'bg-slate-800/90 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/60 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2 right-2.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
                      Best Value
                    </span>
                  )}

                  <div className="space-y-0.5 mb-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{pack.label}</span>
                      <span className="text-xs font-mono font-bold text-red-400">
                        +{pack.hearts} ❤️
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pack.desc}</p>
                  </div>

                  <button
                    disabled={!canAfford || isFull}
                    onClick={() => handleBuyHeartsClick(pack)}
                    className={`w-full py-1.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-red-500 hover:bg-red-400 text-white font-bold shadow active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isFull
                        ? 'Hearts Full'
                        : canAfford
                        ? `Buy for ${pack.cost} 💎`
                        : `Need ${pack.cost} 💎`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Hints Packs Grid (1 💎 = 2 hints, max 8) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {hintPacks.map((pack) => {
              const canAfford = diamonds >= pack.cost;
              const isFull = hints >= maxHints;
              return (
                <div
                  key={pack.hints}
                  className={`p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                    pack.popular
                      ? 'bg-slate-800/90 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/60 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2 right-2.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
                      Max Pack
                    </span>
                  )}

                  <div className="space-y-0.5 mb-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{pack.label}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{pack.hints} 💡
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pack.desc}</p>
                  </div>

                  <button
                    disabled={!canAfford || isFull}
                    onClick={() => handleBuyHintsClick(pack)}
                    className={`w-full py-1.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isFull
                        ? 'Hints Full (8/8)'
                        : canAfford
                        ? `Buy for ${pack.cost} 💎`
                        : `Need ${pack.cost} 💎`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tip footer */}
        <p className="text-[11px] text-slate-400 text-center mt-3">
          💡 <em>Tip: Answer questions correctly (+1 💎) and complete daily challenges (+10 💎) to earn free diamonds!</em>
        </p>
      </div>
    </div>
  );
};
