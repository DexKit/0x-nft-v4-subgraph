import { Address, dataSource, log, TypedMap } from "@graphprotocol/graph-ts";
import { ZERO_ADDRESS } from ".";

namespace Network {
    export const MAINNET = "mainnet";
    export const OPTMISM = "optimism";
    export const BSC = "bsc";
    export const POLYGON = "matic";
    export const FANTOM = "fantom";
    export const AVALANCHE = "avalanche";
    export const BASE = "base";
    export const CELO = "celo";
    export const ARBITRUM_ONE = "arbitrum-one";
    export const MUMBAI = "mumbai"
    // used for not supported networks
    export const NOT_SUPPORTED = "not_supported_network";
}

let WETH_ADDRESS = new TypedMap<string, Address>();

WETH_ADDRESS.set(Network.MAINNET, Address.fromString("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"));
WETH_ADDRESS.set(Network.OPTMISM, Address.fromString("0x4200000000000000000000000000000000000006"));
WETH_ADDRESS.set(Network.BSC, Address.fromString("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"));
WETH_ADDRESS.set(Network.FANTOM, Address.fromString("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"));
WETH_ADDRESS.set(Network.POLYGON, Address.fromString("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"));
WETH_ADDRESS.set(Network.AVALANCHE, Address.fromString("0xdb6f1920a889355780af7570773609bd8cb1f498"));
WETH_ADDRESS.set(Network.BASE, Address.fromString("0x22f9dcf4647084d6c31b2765f6910cd85c178c18"));
WETH_ADDRESS.set(Network.ARBITRUM_ONE, Address.fromString("0x4200000000000000000000000000000000000006"));
WETH_ADDRESS.set(Network.MUMBAI, Address.fromString("0x9c3c9283d3e44854697cd22d3faa240cfb032889"));
WETH_ADDRESS.set(Network.NOT_SUPPORTED, ZERO_ADDRESS);


// util function to get address on any network and fallback for zero address if network is not supported
function GET_ADDRESS(map: TypedMap<string, Address>): Address {
    const network = dataSource.network();
    if (map.isSet(network)) {
        return map.get(network) as Address;
    } else {
        log.error("GET_ADDRESS - unsupported network", [network]);
        return map.get(Network.NOT_SUPPORTED) as Address;
    }
}

export function GET_WETH_ADDRESS(): Address {
    return GET_ADDRESS(WETH_ADDRESS);
}

