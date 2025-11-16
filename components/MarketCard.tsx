'use client';

import Link from 'next/link';
import { formatEther } from 'viem';
import { Market, MarketState, MarketMetadata } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

interface MarketCardProps {
  marketId: number;
  market: Market;
}

export function MarketCard({ marketId, market }: MarketCardProps) {
  // Parse metadata
  let metadata: MarketMetadata = { title: 'Untitled', description: '' };
  try {
    metadata = JSON.parse(market.metadataURI);
  } catch {
    // Use metadataURI as title if not JSON
    metadata.title = market.metadataURI;
  }

  const totalPool = market.yesPool + market.noPool + market.creatorStake;
  const deadline = new Date(Number(market.deadline) * 1000);
  const isExpired = deadline < new Date();

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

  // Calculate percentages
  const yesPercentage = totalPool > BigInt(0) 
    ? Math.round((Number(market.yesPool) / Number(totalPool)) * 100) 
    : 0;
  const noPercentage = totalPool > BigInt(0) 
    ? Math.round((Number(market.noPool) / Number(totalPool)) * 100) 
    : 0;

  return (
    <Link href={`/markets/${marketId}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-xl">{metadata.title}</CardTitle>
            <Badge variant={stateInfo.variant as 'default' | 'success' | 'warning' | 'danger' | 'info'}>
              {stateInfo.label}
            </Badge>
          </div>
          {metadata.startupName && (
            <p className="text-sm text-gray-600">by {metadata.startupName}</p>
          )}
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {metadata.description}
          </p>

          <div className="space-y-3">
            {/* Pool Distribution */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 font-medium">YES {yesPercentage}%</span>
                <span className="text-red-600 font-medium">NO {noPercentage}%</span>
              </div>
              <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${yesPercentage}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-600">Total Pool</p>
                <p className="text-lg font-bold">{formatEther(totalPool)} BNB</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Deadline</p>
                <p className="text-sm font-medium">
                  {deadline.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

