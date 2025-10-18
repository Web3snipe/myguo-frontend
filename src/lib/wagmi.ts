import { createConfig, http } from 'wagmi';
import { base, mainnet, arbitrum, polygon } from 'wagmi/chains';

// Fix for Chrome extension conflicts with ethereum property
if (typeof window !== 'undefined') {
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj: any, prop: string, descriptor: any) {
    if (prop === 'ethereum' && obj === window && obj.ethereum) {
      // Skip redefining ethereum if it already exists
      return obj;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
}

export const wagmiConfig = createConfig({
  chains: [base, mainnet, arbitrum, polygon],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
});

// Update 4
// Update 14
// Update 24
