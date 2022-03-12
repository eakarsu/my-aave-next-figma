import { useMemo } from 'react'
import { getAddresses } from "../constants";
import LENDINGPOOL_ABI from "../abi/AaveLendingPool.json";
import MiniABI from "../abi/MiniAbi.json";

import Web3 from 'web3';
// import { AbiItem } from 'web3-utils';

const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");
const addresses = getAddresses();

export const useLendingPoolContract = () => {
    return new web3.eth.Contract(LENDINGPOOL_ABI, addresses.LENDINGPOOL_ADDRESS);  
}

export const useStandardContract = (address) => {
    return new web3.eth.Contract(MiniABI, address);  
}
