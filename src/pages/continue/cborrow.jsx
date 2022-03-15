import React, {useEffect, useState} from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import DAI from '../../assets/dai.png'
import Divide from '../../assets/divide3.png'
import Search from '../../assets/search.png'
import Down from '../../assets/down.png'
import KovanAssets from '../../constants/kovan.json';

import styles from './share.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useDataProvider } from '../../hooks/useDataProvider'
import { changeBorrowable, changeCurrentReserve } from '../../store/slices/reserves-slice'
import { useWeb3Context } from '../../hooks/web3/web3-context'
import { useLendingPoolContract } from '../../hooks/useContract'
import BigNumber from 'bignumber.js'

const CBorrow = () => {

    const [borrowableList, setBrrowableList] = useState([]);
    const router = useRouter()
    const {address} =  useWeb3Context();
    const reserveData = useSelector((state)=>state.reserves.reserveData);
    const pricesETH = useSelector((state)=>state.reserves.pricesETH);
    const borrowed = useSelector((state)=>state.reserves.borrowed);

    const {initialReserveData, initialBalance, initialReservePriceETH, initialBorrowedBalance} = useDataProvider();
    const dispatch = useDispatch();

    const lpContract = useLendingPoolContract();

    useEffect(async()=>{
        if(address){
            initialBalance(address);
            initialBorrowedBalance(address);            
        }                        
    },[address])
    
    useEffect(()=>{
        console.log('-----');
        initialReserveData();
        initialReservePriceETH();
    },[])

    useEffect(async()=>{
        if(address){
            if(pricesETH.length>0){
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
                            setBrrowableList(borrowable);
                            dispatch(changeBorrowable(borrowable));
                            console.log(borrowable);
                        }
                    })
                   
                })
                
            }
        }
        
    },[pricesETH, address])


    const getAPR = (asset) => {
        const data = reserveData.find((d)=>d.address == asset);
        if(data != null){
            if(data.stableBorrowRate>0){
                return data.stableBorrowRate/Math.pow(10,27);
            }else{
                return data.variableBorrowRate/Math.pow(10,27);
            }            
        }
        return 0;        
    }

    const setCurrentReserve = (address) => {
        dispatch(changeCurrentReserve(address));
        router.push(`/borrow`);
    }

    return (
        <div className={styles.cborrow}>
            <div className={styles.container}>
                <div className={styles.listmodal}>
                    <div className={styles.listmodalheader}>
                        <div className={styles.listmodalleft}>
                            <div className={styles.normal}>Available to borrow</div>
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
                            <div className={styles.integrate1}>
                                <div className={styles.opacity}>
                                    (Based  on your collateral)
                                </div>
                                <div className={styles.normal}>
                                    Available to borrow
                                </div>
                            </div>
                            <div className={styles.integrate}>
                                <div className={styles.normal}>Profit<br />commi
                                    sion<br />Rate</div>
                                <div className={styles.normal}>
                                    <Image src={Down} alt="Down" width={10} height={5.71} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.tablebody}>
                            {
                                borrowableList.map((item, index) => (
                                    <div className={styles.tr} key={index} onClick={() => setCurrentReserve(item.address)}>
                                        <div className={styles.assets}>
                                            <div className={styles.image}>
                                                <Image src={DAI} alt={item.symbol} width={41} height={41} />
                                            </div>
                                            <div className={styles.title}>{item.symbol}</div>
                                        </div>
                                        <div className={styles.ballance}>{item.balance.toFixed(2)}</div>
                                        <div className={styles.rate}>{getAPR(item.address).toFixed(3)}%</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.resultmodal}>
                    <div className={styles.resultmodalheader}>
                        <div className={styles.normal}>My borrows</div>
                    </div>
                    <div className={styles.resultmodalbody}>
                        {
                            borrowed.map((item,i)=>{
                                return <div key={i} className={styles.modalbody}>
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
                        {/* <div className={styles.resultmodalfooter}>
                            <div className={styles.normal}>Total</div>
                            <div className={styles.normal}>$30.56</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CBorrow
