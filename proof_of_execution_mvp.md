# MVP Guide: Proof of Execution -- Prediction Markets for Startup Milestones

## Overview

This document provides the full concept, architecture, specs, contract
outline, and Next.js structure needed to build the Minimum Viable
Product (MVP) for a startup execution prediction platform.

------------------------------------------------------------------------

## 1. Product Concept

### Core Idea

A prediction layer for startup execution where founders, investors, and
communities stake tokens on whether milestones will be achieved. Turns
startup progress into transparent, verifiable markets.

### Use Cases

-   **Founders**: Create milestone markets like *"Ship AI Copilot v1 by
    Dec 15"*.
-   **Investors**: Bet on delivery to assess credibility.
-   **Communities**: Support teams that actually execute.

------------------------------------------------------------------------

## 2. Game Mechanics

### Market Structure

Each milestone is a **binary prediction market**:

-   **YES pool** -- users betting the milestone *will* be delivered.
-   **NO pool** -- users betting it *won't*.
-   **Founder stake** -- skin in the game.

### Outcome & Payouts

-   After deadline → market locks.
-   Oracle resolves YES/NO.
-   Winning side receives proportional rewards:
    -   payout = (total pools + creator stake) × (user stake / winning
        pool)

### Founder Incentives

-   Earn reputation score.
-   Skin in the game encourages honesty.
-   Successful teams attract more YES liquidity.

------------------------------------------------------------------------

## 3. System Architecture

### On-Chain (BNB-Compatible)

-   **MilestonePrediction** contract:
    -   Create markets
    -   Bet YES/NO
    -   Lock & Resolve
    -   Claim rewards
-   Uses native BNB for simplicity.

### Off-Chain

-   (Optional MVP) small database for:
    -   Startup profiles
    -   Market metadata
    -   Leaderboards

------------------------------------------------------------------------

## 4. MVP Scope

### Required User Flows

1.  **Create Market**
    -   Milestone title + description
    -   Deadline
    -   Stake (BNB)
2.  **Bet YES/NO**
3.  **View Market Stats**
4.  **Oracle Resolution**
5.  **Claim Payouts**
6.  **Leaderboard**
    -   success rate
    -   total liquidity
    -   completed milestones

------------------------------------------------------------------------

## 5. Next.js Architecture

### Tech Stack

-   Next.js (App Router)
-   TailwindCSS
-   wagmi + viem
-   RainbowKit
-   shadcn/ui components
-   Optional: Prisma + Postgres

### Recommended Folder Structure

    app/
      markets/
        page.tsx
        create/page.tsx
        [marketId]/page.tsx
      startups/
        page.tsx
      admin/
        markets/page.tsx

    components/
      MarketCard.tsx
      BetPanel.tsx
      ClaimPanel.tsx
      CreateMarketForm.tsx

    lib/
      web3/
        wagmiConfig.ts
        contracts.ts
      db/
        prisma.ts

------------------------------------------------------------------------

## 6. Solidity Smart Contract (Simplified MVP)

### Features

-   Create market
-   Bet yes/no
-   Lock after deadline
-   Oracle resolves YES/NO
-   Claim payout

### Contract (Summary)

``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MilestonePrediction {
    enum Side { None, Yes, No }
    enum MarketState { Open, Locked, Resolved }

    struct Market {
        address creator;
        uint256 deadline;
        uint256 creatorStake;
        uint256 yesPool;
        uint256 noPool;
        MarketState state;
        Side winningSide;
        string metadataURI;
    }

    // Creating, betting, locking, resolving & claiming functions...
    // (Full contract provided in conversation)
}
```

------------------------------------------------------------------------

## 7. Next.js Web3 Integration

### Use wagmi to Read/Write

Example betting hook:

``` ts
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

export function useBet(contract) {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const betYes = (id, value) =>
    writeContract({ ...contract, functionName: "betYes", args: [id], value });

  const betNo = (id, value) =>
    writeContract({ ...contract, functionName: "betNo", args: [id], value });

  return { betYes, betNo, isLoading, isSuccess };
}
```

------------------------------------------------------------------------

## 8. Roadmap (Post-MVP)

### Short Term

-   GitHub verification
-   Notion-integrated submissions
-   Oracle dispute window
-   Builder reputation NFTs

### Long Term

-   AI agent for milestone credibility scoring
-   VC dashboards
-   Fully decentralized resolution

------------------------------------------------------------------------

## 9. Action Plan for Building the MVP

### Day 1

-   Deploy contract to BSC testnet
-   Build market creation & market page
-   Implement YES/NO betting

### Day 2

-   Implement resolution & claiming
-   Build leaderboard
-   Polish UI in shadcn/UI
-   Deploy frontend via Vercel

------------------------------------------------------------------------

## 10. Summary

This MVP is intentionally simple: - Binary markets - Manual oracle -
Native BNB - Minimal UI

But it establishes: - On-chain progress accountability - Reputation
scoring - Market-driven validation of execution

This is enough to test demand and gather early users.

------------------------------------------------------------------------

**Build fast. Iterate faster.**
