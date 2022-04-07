import { useMemo } from 'react'
import { getAddresses } from "../constants";
import LENDINGPOOL_ABI from "../abi/AaveLendingPool.json";
import DATAPROVIDER_ABI from "../abi/DataProvider.json";
import PRICEORACLE_ABI from "../abi/PriceOracle.json";
import MiniABI from "../abi/MiniAbi.json";
import ATokenABI from "../abi/AToken.json";

import Web3 from 'web3';
// import { AbiItem } from 'web3-utils';

const web3 = new Web3(Web3.givenProvider || "http://34.132.227.231/ws2/");
const addresses = getAddresses();

export const useLendingPoolContract = () => {
    return new web3.eth.Contract(LENDINGPOOL_ABI, addresses.LENDINGPOOL_ADDRESS);  
}


export const useDataProviderContract = () => {
    return new web3.eth.Contract(DATAPROVIDER_ABI, addresses.DATAPROVIDER_ADDRESS);  
}

export const usePriceOracleContract = () => {
    return new web3.eth.Contract(PRICEORACLE_ABI, addresses.PRICEORACLE_ADDRESS);  
}

export const useStandardContract = (address) => {
    return new web3.eth.Contract(MiniABI, address);  
}

export const useATokenContract = (address) => {
    return new web3.eth.Contract(ATokenABI, address);  
}
