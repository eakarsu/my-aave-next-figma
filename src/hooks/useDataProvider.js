import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux'
import KovanAssets from '../constants/kovan.json';
import { changeBalances, changeBorrowable, changeBorrowed, changeDeposited, changePricesETH, changeReserveData, changeLtvData } from '../store/slices/reserves-slice';
import { useATokenContract, useDataProviderContract, useLendingPoolContract, usePriceOracleContract, useStandardContract } from './useContract';

export const useDataProvider = () => {

    const pricesETH = useSelector((state)=>state.reserves.pricesETH);
    const reserveData = useSelector((state)=>state.reserves.reserveData);

    const dispatch = useDispatch();
    const lpContract = useLendingPoolContract();
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

    const initialLtvData = () => {
        let ltvs = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            await dpContract.methods.getReserveConfigurationData(v.address).call().then((value) => {
                ltvs = [...ltvs, {address:v.address, ltv:value.ltv}];                                        
            });                
            if(i===KovanAssets.proto.length-1){
                dispatch(changeLtvData(ltvs));
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

    const initialBorrowableBalance = async(address) => {
        let borrowable = [];
        await lpContract.methods.getUserAccountData(address).call().then((value)=>{
            const availableBorrowsETH = value.availableBorrowsETH;
            pricesETH.forEach((d,i)=>{
                const availableAmount = availableBorrowsETH/d.price;
                const availableLiquidity = reserveData[i]?.availableLiquidity||0;
                const availableLqAmount = BigNumber(availableLiquidity)/Math.pow(10,d.decimal);
                const minVal = Math.min(availableAmount, availableLqAmount);
                if(minVal>0.01){
                    borrowable = [...borrowable, {address:d.address, decimal:d.decimal, symbol:d.symbol, balance:minVal}]
                }            
                if(i === pricesETH.length-1){
                    dispatch(changeBorrowable(borrowable));
                    console.log(borrowable);
                }
            })
            
        })
    }

    const initialBorrowedBalance = (address) => {
        let bBalances = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            
            await dpContract.methods.getUserReserveData(v.address, address).call().then((data) => {
                const balance = (Number(data.currentStableDebt)+Number(data.currentVariableDebt))/Math.pow(10, v.decimals);    
                
                if(balance>0){
                    console.log(v.decimals);
                    bBalances = [...bBalances,{address:v.address,aTokenAddress:v.aTokenAddress, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                }
                
            });                
            if(i===KovanAssets.proto.length-1){
                dispatch(changeBorrowed(bBalances));
            }            
        })
    }

    return {initialReserveData, initialDepositedBalance, initialBalance, initialReservePriceETH, initialBorrowedBalance, initialBorrowableBalance, initialLtvData};
}