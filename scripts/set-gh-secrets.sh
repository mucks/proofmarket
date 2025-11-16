#!/bin/bash

# Script to set GitHub Actions secrets using gh CLI
# Usage: ./scripts/set-gh-secrets.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting GitHub Actions secrets...${NC}"

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

# Function to read from .env.production or prompt
get_secret() {
    local key=$1
    local description=$2
    
    # Try to read from .env.production if it exists
    if [ -f .env.production ]; then
        local value=$(grep "^${key}=" .env.production 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
        if [ -n "$value" ]; then
            echo "$value"
            return
        fi
    fi
    
    # Prompt for the value
    echo -e "${YELLOW}Enter ${description}:${NC}" >&2
    read -s value
    echo "$value"
}

# Get secrets
echo -e "\n${GREEN}Reading secrets...${NC}"

WALLET_CONNECT_PROJECT_ID=$(get_secret "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID" "WalletConnect Project ID")
CONTRACT_ADDRESS=$(get_secret "NEXT_PUBLIC_CONTRACT_ADDRESS" "Contract Address")

# Validate that values are not empty
if [ -z "$WALLET_CONNECT_PROJECT_ID" ]; then
    echo -e "${RED}Error: WalletConnect Project ID cannot be empty${NC}"
    exit 1
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}Error: Contract Address cannot be empty${NC}"
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

