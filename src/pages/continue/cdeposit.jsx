import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import DAI from '../../assets/dai.png'
import Divide from '../../assets/divide3.png'
import Search from '../../assets/search.png'

import KovanAssets from '../../constants/kovan.json';

import styles from './share.module.css'

import { useWeb3Context } from '../../hooks/web3/web3-context';
import { changeCurrentReserve} from "../../store/slices/reserves-slice";
import { useDataProvider } from '../../hooks/useDataProvider';

const CDeposit = () => {
    const router = useRouter()
    const {address} =  useWeb3Context();
    const reserveData = useSelector((state)=>state.reserves.reserveData);
    const deposited = useSelector((state)=>state.reserves.deposited);
    const balances = useSelector((state)=>state.reserves.balances);

    const {initialReserveData, initialDepositedBalance, initialBalance, initialReservePriceETH, initialLtvData} = useDataProvider();
    const dispatch = useDispatch();

    useEffect(async()=>{
        if(address){
            initialBalance(address);
            initialDepositedBalance(address);
        }                        
    },[address])
    
    useEffect(()=>{
        initialReserveData();
        initialLtvData();
        initialReservePriceETH();        
    },[])

    const getBalance = (asset) =>{
        const data = balances.find((d)=>d.address == asset);
        if(data !=null){
            return data.balance;
        }
        return 0;
    }
    const getAPR = (asset) => {
        const data = reserveData.find((d)=>d.address == asset);
        if(data != null){
            return data.liquidityRate/Math.pow(10,27)*100;
        }
        return 0;        
    }

    const setCurrentReserve = (asset) => {
        if(address!==""){
            if(getBalance(asset)>0){
                dispatch(changeCurrentReserve(asset));
                router.push(`/deposit`);
            }else{
                toast.error("Your wallet ballance is not enough.");
            }
        }else{
            toast.error("Please connect your wallet.");
        }
        
    }

    return (
        <div className={styles.cdeposit}>
            <div className={styles.container}>
                <div className={styles.listmodal}>
                    <div className={styles.listmodalheader}>
                        <div className={styles.listmodalleft}>
                            <div>Available to deposit</div>
                        </div>
                        <div className={styles.listmodalright}>
                            <div>All</div>
                            <div className={styles.normal}>
                                <Image src={Divide} alt="Divide" width={1} height={25.5} />
                            </div>
                            <div>Stable Coins</div>
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
                            <div className={styles.integrate1}>Wallet balance</div>
                            <div className={styles.integrate}>
                                <div className={styles.normal}>APY</div>
                            </div>
                        </div>
                        <div className={styles.tablebody}>
                            {
                                KovanAssets.proto.map((item, index) => (
                                    <div className={styles.tr} key={index} onClick={() => {setCurrentReserve(item.address)}}>
                                        <div className={styles.assets}>
                                            <div className={styles.image}>
                                                <Image src={`/./icon/${item.symbol}.png`} alt={item.symbol} width={41} height={41} />
                                            </div>
                                            <div className={styles.title}>{item.symbol}</div>
                                        </div>
                                        <div className={styles.ballance}>
                                            {
                                                address == ""?"-":getBalance(item.address).toFixed(2)
                                            }
                                            {/* <div className={styles.ballance1}>{item?.balance.toFixed(4)}</div> */}
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
                        <div>My deposits</div>
                    </div>
                    <div className={styles.resultmodalbody}>
                    {
                        deposited.map((item,i)=>{
                            return <div key={i} className={styles.modalbody}>
                                        <div className={styles.reassets}>
                                            <div className={styles.image}>
                                                <Image src={`/./icon/${item.symbol}.png`} alt={item.symbol} width={41} height={41} />
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
            <ToastContainer />
        </div >
    )
}

export default CDeposit
