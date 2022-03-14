import { useDispatch } from 'react-redux'
import KovanAssets from '../constants/kovan.json';
import { changeBalances, changeBorrowed, changeDeposited, changePricesETH, changeReserveData } from '../store/slices/reserves-slice';
import { useATokenContract, useDataProviderContract, usePriceOracleContract, useStandardContract } from './useContract';

export const useDataProvider = () => {

    const dispatch = useDispatch();
    const dpContract = useDataProviderContract();
    const oracleContract =  usePriceOracleContract()

    const initialReserveData = () => {
        let reserves = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            await dpContract.methods.getReserveData(v.address).call().then((value) => {
                reserves = [...reserves, {address:v.address, availableLiquidity:value.availableLiquidity, liquidityRate:value.liquidityRate, variableBorrowRate:value.variableBorrowRate, stableBorrowRate:value.stableBorrowRate }];                                        
            });                
            if(i===KovanAssets.proto.length-1){
                dispatch(changeReserveData(reserves));
            }                                            
        })
    }

    const initialReservePriceETH = () => {
        const assets = KovanAssets.proto.map(v=>v.address);
        oracleContract.methods.getAssetsPrices(assets).call().then((value)=>{
            const prices =  value.map((v,i)=>{
                return {address: assets[i], decimal:KovanAssets.proto[i].decimals,symbol:KovanAssets.proto[i].symbol, price:v};
            })
            dispatch(changePricesETH(prices));
        })
        
    }

    const initialBalance = (address) => {
        let balances = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            const ct=useStandardContract(v.address);            
            await ct.methods.balanceOf(address).call().then((value) => {
                const balance = (value/Math.pow(10,v.decimals));    
                if(balance>0){
                    balances =[...balances, {address:v.address, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                }                
            });                

            if(i===KovanAssets.proto.length-1){
                dispatch(changeBalances(balances));
            }                                
            
        })
    }

    const initialDepositedBalance = (address) => {
        let dBalances = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            const ct=useATokenContract(v.aTokenAddress);
            
            await ct.methods.balanceOf(address).call().then((value) => {
                const balance = (value/Math.pow(10,v.decimals));    
                if(balance>0){
                    dBalances = [...dBalances,{address:v.address,aTokenAddress:v.aTokenAddress, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                }
                
            });                
            if(i===KovanAssets.proto.length-1){
                dispatch(changeDeposited(dBalances));
            }            
        })
    }

    const initialBorrowedBalance = (address) => {
        let bBalances = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            
            await dpContract.methods.getUserReserveData(v.address, address).call().then((data) => {
                const balance = (data.currentStableDebt+data.currentVariableDebt)/Math.pow(10, v.decimals);    
                if(balance>0){
                    bBalances = [...bBalances,{address:v.address,aTokenAddress:v.aTokenAddress, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                }
                
            });                
            if(i===KovanAssets.proto.length-1){
                dispatch(changeBorrowed(bBalances));
            }            
        })
    }

    return {initialReserveData, initialDepositedBalance, initialBalance, initialReservePriceETH, initialBorrowedBalance};
}