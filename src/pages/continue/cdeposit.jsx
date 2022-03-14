import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image'
import { useRouter } from 'next/router'

import DAI from '../../assets/dai.png'
import Divide from '../../assets/divide3.png'
import Search from '../../assets/search.png'
import Down from '../../assets/down.png'

import data from './data.json'

import styles from './share.module.css'

import { useWeb3Context } from '../../hooks/web3/web3-context';
import { useATokenContract, useDataProviderContract, useStandardContract } from "../../hooks/useContract";
import {changeReserves, changeBalances, changeCurrentReserve, changeReserveData, changeDeposited} from "../../store/slices/reserves-slice";
import KovanAssets from '../../constants/kovan.json';
import { useDataProvider } from '../../hooks/useDataProvider';

const CDeposit = () => {
    const router = useRouter()
    const {address} =  useWeb3Context();
    const reserveData = useSelector((state)=>state.reserves.reserveData);
    const [availableReserves, setAReserves] =  useState([]);
    const [depositedReserves, setDReserves] = useState([]);

    const dpContract = useDataProviderContract();
    const {initialReserveData} = useDataProvider();
    const dispatch = useDispatch();

    useEffect(async()=>{
        if(address){
            let balances = [];
            await KovanAssets.proto.forEach(async(v,i)=>{
                const ct=useStandardContract(v.address);
                console.log('-');
                
                await ct.methods.balanceOf(address).call().then((value) => {
                    console.log(value/Math.pow(10,v.decimals));
                    const balance = (value/Math.pow(10,v.decimals));    
                    if(balance>0){
                        balances =[...balances, {address:v.address, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                    }
                    
                });                

                if(i===KovanAssets.proto.length-1){
                    console.log(balances);
                    setAReserves(balances);
                    dispatch(changeBalances(balances));
                }                                
                
            })
            console.log(balances);
        }                
        
    },[address])

    useEffect(async()=>{
        if(address){
            let balances = [];
            console.log('--------deposited tokens');
            await KovanAssets.proto.forEach(async(v,i)=>{
                const ct=useATokenContract(v.aTokenAddress);
                console.log('-');
                
                await ct.methods.balanceOf(address).call().then((value) => {
                    console.log(value/Math.pow(10,v.decimals));
                    const balance = (value/Math.pow(10,v.decimals));    
                    if(balance>0){
                        balances = [...balances,{address:v.address,aTokenAddress:v.aTokenAddress, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                    }
                    
                });                

                if(i===KovanAssets.proto.length-1){
                    console.log(balances);
                    setDReserves(balances);
                    console.log('deposited',depositedReserves);
                    dispatch(changeDeposited(balances));
                }
                
                
                
            })
            console.log(balances);
        }                
        
    },[address])

    
    useEffect(()=>{
        console.log('dfdfdsfadfasfas');
        initialReserveData();
    },[])


    const getAPR = (asset) => {
        // cls
        const data = reserveData.find((d)=>d.address == asset);
        if(data != null){
            console.log(data);
            return data.liquidityRate/Math.pow(10,27);
        }
        return 0;
        
    }

    const setCurrentReserve = (address) => {
        dispatch(changeCurrentReserve(address));
        router.push(`/deposit`);
    }

    return (
        <div className={styles.cdeposit}>
            <div className={styles.container}>
                <div className={styles.listmodal}>
                    <div className={styles.listmodalheader}>
                        <div className={styles.listmodalleft}>
                            <div className={styles.normal}>Available to deposit</div>
                        </div>
                        <div className={styles.listmodalright}>
                            <div className={styles.normalblue}>All</div>
                            <div className={styles.normal}>
                                <Image src={Divide} alt="Divide" width={1} height={25.5} />
                            </div>
                            <div className={styles.normal}>Stable Coins</div>
                        </div>
                    </div>
                    <div className={styles.searchpart}>
                        <div className={styles.search}>
                            <input type="text" className={styles.searchinput} placeholder="Search" />
                            <div>
                                <Image src={Search} alt="Search" width={11.81} height={11.81} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.tableheader}>
                            <div className={styles.hasset}>Asset</div>
                            <div className={styles.integrate1}>Your wallet balance</div>
                            <div className={styles.integrate}>
                                <div className={styles.normal}>Profit Sharing Rate</div>
                                <div className={styles.normal}>
                                    <Image src={Down} alt="Down" width={10} height={5.71} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.tablebody}>
                            {
                                availableReserves.map((item, index) => (
                                    <div className={styles.tr} key={index} onClick={() => {setCurrentReserve(item.address)}}>
                                        <div className={styles.assets}>
                                            <div className={styles.image}>
                                                <Image src={DAI} alt={item.symbol} width={41} height={41} />
                                            </div>
                                            <div className={styles.title}>{item.symbol}</div>
                                        </div>
                                        <div className={styles.ballance}>
                                            <div className={styles.ballance1}>{item?.balance.toFixed(4)}</div>
                                            <div className={styles.ballance2}></div>
                                        </div>
                                        <div className={styles.rate}>{item?getAPR(item.address).toFixed(4):''}%</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.resultmodal}>
                    <div className={styles.resultmodalheader}>
                        <div className={styles.normal}>My deposits</div>
                    </div>
                    <div className={styles.resultmodalbody}>
                    {
                        depositedReserves.map((item,i)=>{
                            return <div className={styles.modalbody}>
                                        <div className={styles.reassets}>
                                            <div className={styles.image}>
                                                <Image src={DAI} alt={item.symbol} width={41} height={41} />
                                            </div>
                                            <div className={styles.title}>{item.symbol}</div>
                                        </div>
                                        <div className={styles.normal}>{item.balance.toFixed(4)}</div>
                                    </div>
                        })
                    }                
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CDeposit
