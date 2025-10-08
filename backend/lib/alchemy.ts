import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
};

// Initialize Alchemy instances for different networks
export const alchemyBase = new Alchemy({
  ...config,
  network: Network.BASE_MAINNET,
});

export const alchemyEthereum = new Alchemy({
  ...config,
  network: Network.ETH_MAINNET,
});

export const alchemyArbitrum = new Alchemy({
  ...config,
  network: Network.ARB_MAINNET,
});

export const alchemyPolygon = new Alchemy({
  ...config,
  network: Network.MATIC_MAINNET,
});

export const getAlchemyInstance = (chainId: number): Alchemy => {
  switch (chainId) {
    case 8453: // Base
      return alchemyBase;
    case 1: // Ethereum
      return alchemyEthereum;
    case 42161: // Arbitrum
      return alchemyArbitrum;
    case 137: // Polygon
      return alchemyPolygon;
    default:
      return alchemyBase;
  }
};

export const SUPPORTED_CHAINS = [
  { id: 8453, name: 'Base', symbol: 'ETH', alchemy: alchemyBase },
  { id: 1, name: 'Ethereum', symbol: 'ETH', alchemy: alchemyEthereum },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH', alchemy: alchemyArbitrum },
  { id: 137, name: 'Polygon', symbol: 'MATIC', alchemy: alchemyPolygon },
];

