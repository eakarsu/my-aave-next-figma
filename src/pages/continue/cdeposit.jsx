import React, {useEffect, useState} from 'react'
import { useDispatch } from "react-redux";
import Image from 'next/image'
import { useRouter } from 'next/router'

import DAI from '../../assets/dai.png'
import Divide from '../../assets/divide3.png'
import Search from '../../assets/search.png'
import Down from '../../assets/down.png'

import data from './data.json'

import styles from './share.module.css'

import { useWeb3Context } from '../../hooks/web3/web3-context';
import { useLendingPoolContract, useStandardContract } from "../../hooks/useContract";
import {changeReserves, changeBalances, changeCurrentReserve} from "../../store/slices/reserves-slice"

const CDeposit = () => {
    const router = useRouter()
    const {address} =  useWeb3Context();
    const [availableReserves, setAReserves] =  useState([]);

    const lpContract =  useLendingPoolContract();
    const tokenList = [
        {
            address:"0x04DF6e4121c27713ED22341E7c7Df330F56f289B",
            decimal:18,
            symbol:'DAI'
        }        
    ]
    const dispatch = useDispatch();

    useEffect(async()=>{
        const reserves = await lpContract.methods.getReservesList().call();
        dispatch(changeReserves(reserves));
        if(address){
            let balances = [];
            await tokenList.forEach(async(v,i)=>{
                const ct=useStandardContract(v.address);
                console.log('-');
                let balance = 0;
                await ct.methods.balanceOf(address).call().then((value) => {
                    console.log(value/Math.pow(10,v.decimal));
                    balance =  (value/Math.pow(10,v.decimal));    
                    balances.push({address:v.address, decimal:v.decimal, symbol:v.symbol, balance:balance});        
                });                

                if(i===tokenList.length-1){
                    console.log(balances);
                    setAReserves(balances);
                    dispatch(changeBalances(balances));
                }
                
                
                
            })
            console.log(balances);
        }                
        
    },[address])

    useEffect(async() => {
        
        
    }, [address]);


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
                                            <div className={styles.ballance1}>{item.balance}</div>
                                            <div className={styles.ballance2}></div>
                                        </div>
                                        <div className={styles.rate}></div>
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
                        <div className={styles.modalbody}>
                            <div className={styles.reassets}>
                                <div className={styles.image}>
                                    <Image src={DAI} alt="DAI" width={41} height={41} />
                                </div>
                                <div className={styles.title}>DAI</div>
                            </div>
                            <div className={styles.normal}>20. 00000987</div>
                        </div>
                        <div className={styles.modalbody}>
                            <div className={styles.reassets}>
                                <div className={styles.image}>
                                    <Image src={DAI} alt="DAI" width={41} height={41} />
                                </div>
                                <div className={styles.title}>Bitcoin</div>
                            </div>
                            <div className={styles.normal}>10. 00000987</div>
                        </div>
                        <div className={styles.resultmodalfooter}>
                            <div className={styles.normal}>Total</div>
                            <div className={styles.normal}>$30.56</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CDeposit
