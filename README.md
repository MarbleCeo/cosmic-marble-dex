
# Cosmic Marble Nexus

A professional blockchain platform that integrates with Solana, Ethereum, Binance, and Bitcoin.

## Features

- **Multi-Chain DEX**: Trade tokens seamlessly across Solana, Ethereum, Binance, and Cosmic Marble networks
- **CECLE Token Collateral**: Lock CECLE tokens from Solana (address: `5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs`) as collateral to earn CMX rewards
- **MARBLE Token Staking**: Lock MARBLE tokens from Solana (address: `B9NYKkHRa1VfgWeKXTiGLaBz7V1URQSGnaEPb4gGFsXA`) to earn CMX at 1:1 ratio
- **Cross-Chain Bridge**: Transfer tokens between different blockchains with our secure bridge
- **Token Minting**: Create your own tokens using CMX as the gas fee
- **Custom Token Creation**: Mint your own tokens and trade them on the DEX

## VMIA (Proof of Host) Guide

VMIA (Virtual Machine Infrastructure Alliance) allows users to rent out their computational resources to earn CMX tokens.

### How to Register Your Docker Machine

1. **Install Docker**: Make sure you have Docker installed on your machine. Download from [docker.com](https://docker.com)

2. **Install VMIA Client**:
   ```bash
   git clone https://github.com/MarbleCeo/cosmic-vmia-client
   cd cosmic-vmia-client
   npm install
   ```

3. **Configure Your Node**:
   ```bash
   cp config.example.json config.json
   nano config.json  # Add your system specs and Solana wallet address
   ```

4. **Start VMIA Node**:
   ```bash
   npm run start
   ```

5. **Monitor Earnings**:
   - Log into the Cosmic Marble Dashboard
   - Navigate to the VMIA section
   - View your node status and earnings

### Docker Machine Requirements

| Resource  | Minimum Requirements | Recommended |
|-----------|----------------------|------------|
| CPU       | 4 cores              | 8+ cores   |
| RAM       | 8 GB                 | 16+ GB     |
| Storage   | 100 GB SSD           | 500+ GB SSD|
| Bandwidth | 100 Mbps             | 1+ Gbps    |
| Uptime    | 95%                  | 99%+       |

### Earning Structure

- Base rewards: 0.5 CMX per hour for minimum specs
- Additional rewards based on resource capacity
- Bonus rewards for high uptime (>99%)
- Performance-based bonuses for handling high-demand workloads

## DEX Trading Guide

Our DEX supports trading across multiple blockchains:

1. **Connect Your Wallet**: Support for SolFlare, Phantom, MetaMask, and Trust Wallet
2. **Select Trading Pair**: Choose from a variety of cross-chain trading pairs
3. **Execute Trades**: Swap tokens with minimal fees and slippage
4. **Add Liquidity**: Earn trading fees by providing liquidity to pools
5. **Bridge Tokens**: Move tokens between chains using our secure bridge

## Project Info

**URL**: https://lovable.dev/projects/0c1bb3de-94bc-4055-bd23-d088b5c89f43

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0c1bb3de-94bc-4055-bd23-d088b5c89f43) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0c1bb3de-94bc-4055-bd23-d088b5c89f43) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
