#!/bin/bash

# Script to set GitHub Actions secrets from .env.production file
# Usage: ./scripts/set-gh-secrets-from-env.sh

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting GitHub Actions secrets from .env.production...${NC}"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    echo "Create it with your secrets first."
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: gh CLI is not installed.${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}You need to authenticate with GitHub first.${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Read secrets from .env.production
WALLET_CONNECT_PROJECT_ID=$(grep "^NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=" .env.production | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
CONTRACT_ADDRESS=$(grep "^NEXT_PUBLIC_CONTRACT_ADDRESS=" .env.production | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)

# Validate that values are not empty
if [ -z "$WALLET_CONNECT_PROJECT_ID" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not found in .env.production${NC}"
    exit 1
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_CONTRACT_ADDRESS not found in .env.production${NC}"
    exit 1
fi

# Set the secrets
echo -e "\n${GREEN}Setting secrets...${NC}"

echo -n "Setting NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID... "
if echo -n "$WALLET_CONNECT_PROJECT_ID" | gh secret set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

echo -n "Setting NEXT_PUBLIC_CONTRACT_ADDRESS... "
if echo -n "$CONTRACT_ADDRESS" | gh secret set NEXT_PUBLIC_CONTRACT_ADDRESS; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

echo -e "\n${GREEN}All secrets have been set successfully!${NC}"
echo -e "${YELLOW}Note: Secrets are now available to your GitHub Actions workflows.${NC}"

