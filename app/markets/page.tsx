'use client';

import { useReadContract } from 'wagmi';
import { MILESTONE_PREDICTION_ADDRESS, MILESTONE_PREDICTION_ABI } from '@/lib/web3/contracts';
import { Market } from '@/lib/types';
import { MarketCard } from '@/components/MarketCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MarketsPage() {
  // Read total market count
  const { data: marketCount } = useReadContract({
    address: MILESTONE_PREDICTION_ADDRESS,
    abi: MILESTONE_PREDICTION_ABI,
    functionName: 'marketCount',
  });

  const totalMarkets = Number(marketCount ?? BigInt(0));

  // Read all markets
  // For simplicity, we'll read markets one by one
  // In production, consider using useReadContracts or implement pagination
  const markets: { id: number; data: Market | undefined }[] = [];
  
  for (let i = 0; i < totalMarkets; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useReadContract({
      address: MILESTONE_PREDICTION_ADDRESS,
      abi: MILESTONE_PREDICTION_ABI,
      functionName: 'getMarket',
      args: [BigInt(i)],
    });
    markets.push({ id: i, data: data as Market | undefined });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">All Markets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {totalMarkets} {totalMarkets === 1 ? 'market' : 'markets'} available
          </p>
        </div>
        <Link href="/markets/create">
          <Button>Create Market</Button>
        </Link>
      </div>

      {totalMarkets === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No markets yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Be the first to create a milestone prediction market!</p>
          <Link href="/markets/create">
            <Button>Create First Market</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market) => 
            market.data ? (
              <MarketCard key={market.id} marketId={market.id} market={market.data} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

