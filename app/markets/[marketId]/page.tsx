'use client';

import { use } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { MILESTONE_PREDICTION_ADDRESS, MILESTONE_PREDICTION_ABI } from '@/lib/web3/contracts';
import { Market, MarketState, MarketMetadata, Side } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BetPanel } from '@/components/BetPanel';
import { ClaimPanel } from '@/components/ClaimPanel';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ marketId: string }>;
}

export default function MarketPage({ params }: PageProps) {
  const { marketId } = use(params);
  const { address } = useAccount();
  const marketIdNum = parseInt(marketId);

  // Read market data
  const { data: marketData, isLoading } = useReadContract({
    address: MILESTONE_PREDICTION_ADDRESS,
    abi: MILESTONE_PREDICTION_ABI,
    functionName: 'getMarket',
    args: [BigInt(marketIdNum)],
  });

  const market = marketData as Market | undefined;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Market not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">This market does not exist.</p>
          <Link href="/markets" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  // Parse metadata
  let metadata: MarketMetadata = { title: 'Untitled', description: '' };
  try {
    metadata = JSON.parse(market.metadataURI);
  } catch {
    metadata.title = market.metadataURI;
  }

  const totalPool = market.yesPool + market.noPool + market.creatorStake;
  const deadline = new Date(Number(market.deadline) * 1000);
  const isExpired = deadline < new Date();
  const isOpen = market.state === MarketState.Open && !isExpired;

  const yesPercentage = totalPool > BigInt(0) 
    ? Math.round((Number(market.yesPool) / Number(totalPool)) * 100) 
    : 0;
  const noPercentage = totalPool > BigInt(0) 
    ? Math.round((Number(market.noPool) / Number(totalPool)) * 100) 
    : 0;

  const getStateInfo = () => {
    switch (market.state) {
      case MarketState.Open:
        return {
          label: isExpired ? 'Awaiting Lock' : 'Open',
          variant: isExpired ? 'warning' : 'success',
        };
      case MarketState.Locked:
        return { label: 'Locked', variant: 'warning' };
      case MarketState.Resolved:
        return { label: 'Resolved', variant: 'info' };
      default:
        return { label: 'Unknown', variant: 'default' };
    }
  };

  const stateInfo = getStateInfo();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/markets" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
        ← Back to Markets
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{metadata.title}</CardTitle>
                  {metadata.startupName && (
                    <p className="text-gray-600 dark:text-gray-300">by {metadata.startupName}</p>
                  )}
                </div>
                <Badge variant={stateInfo.variant as 'default' | 'success' | 'warning' | 'danger' | 'info'} className="text-sm px-3 py-1">
                  {stateInfo.label}
                </Badge>
              </div>
              
              {market.state === MarketState.Resolved && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Market Resolved: Winning side is{' '}
                    <span className={market.winningSide === Side.Yes ? 'text-green-600' : 'text-red-600'}>
                      {market.winningSide === Side.Yes ? 'YES' : 'NO'}
                    </span>
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{metadata.description}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-800 pt-6">
                <h3 className="font-semibold mb-4">Pool Distribution</h3>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-600 font-medium">YES {yesPercentage}%</span>
                    <span className="text-red-600 font-medium">NO {noPercentage}%</span>
                  </div>
                  <div className="flex h-4 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${yesPercentage}%` }}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${noPercentage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">YES Pool</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatEther(market.yesPool)} BNB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">NO Pool</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatEther(market.noPool)} BNB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Pool</p>
                  <p className="text-2xl font-bold">{formatEther(totalPool)} BNB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Creator Stake</p>
                  <p className="text-2xl font-bold">{formatEther(market.creatorStake)} BNB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Deadline</p>
                  <p className="text-lg font-medium">
                    {deadline.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Creator</p>
                  <p className="text-sm font-mono">
                    {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {address && <ClaimPanel marketId={marketIdNum} winningSide={market.winningSide} marketState={market.state} />}
          
          <BetPanel 
            marketId={marketIdNum}
            yesPool={market.yesPool}
            noPool={market.noPool}
            creatorStake={market.creatorStake}
            isOpen={isOpen}
          />
        </div>
      </div>
    </div>
  );
}

