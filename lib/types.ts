export enum MarketState {
  Open = 0,
  Locked = 1,
  Resolved = 2,
}

export enum Side {
  None = 0,
  Yes = 1,
  No = 2,
}

export interface Market {
  creator: `0x${string}`;
  deadline: bigint;
  creatorStake: bigint;
  yesPool: bigint;
  noPool: bigint;
  state: MarketState;
  winningSide: Side;
  metadataURI: string;
}

export interface Bet {
  yesAmount: bigint;
  noAmount: bigint;
  claimed: boolean;
}

export interface MarketMetadata {
  title: string;
  description: string;
  startupName?: string;
}


