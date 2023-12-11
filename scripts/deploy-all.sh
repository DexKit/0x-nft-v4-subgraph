#!/bin/bash
# Deploy all subgraphs at once
yarn build --network mainnet; yarn deploy --product hosted-service dexkit/0x-nft-v4-eth; 
yarn build --network bsc; yarn deploy --product hosted-service dexkit/0x-nft-v4-bsc; 
yarn build --network matic; yarn deploy --product hosted-service dexkit/0x-nft-v4-poly; 
yarn build --network mumbai; yarn deploy --product hosted-service dexkit/0x-nft-v4-mumbai;
yarn build --network fantom; yarn deploy --product hosted-service dexkit/0x-nft-v4-fantom;  
yarn build --network avalanche; yarn deploy --product hosted-service dexkit/0x-nft-v4-avax; 
yarn build --network optimism; yarn deploy --product hosted-service dexkit/0x-nft-v4-op; 
yarn build --network arbitrum-one; yarn deploy --product hosted-service dexkit/0x-nft-v4-arb; 
yarn build --network celo; yarn deploy --product hosted-service dexkit/0x-nft-v4-celo; 