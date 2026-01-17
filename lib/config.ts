import { http, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia, hardhat, polygon, arbitrum, base, optimism } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mainnet, sepolia, hardhat, polygon, arbitrum, base, optimism],
    multiInjectedProviderDiscovery: true,
    connectors: [
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhat.id]: http(),
        [polygon.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [optimism.id]: http(),
    },
})
