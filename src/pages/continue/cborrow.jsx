import React, {useEffect, useState} from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import DAI from '../../assets/dai.png'
import Divide from '../../assets/divide3.png'
import Search from '../../assets/search.png'
import Down from '../../assets/down.png'
import KovanAssets from '../../constants/kovan.json';

import data from './data.json'

import styles from './share.module.css'
import { getAddresses } from '../../constants'
import { changeBorrowable } from '../../store/slices/reserves-slice'
import { useStandardContract } from '../../hooks/useContract'
import { useDispatch } from 'react-redux'

const CBorrow = () => {
    const [borrowableList, setBrrowableList] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();
    const contractAddress = getAddresses();

    useEffect(async()=>{
        let brrowable = [];
        await KovanAssets.proto.forEach(async(v,i)=>{
            const ct=useStandardContract(v.address);
            console.log('-');
            
            await ct.methods.balanceOf(contractAddress.LENDINGPOOL_ADDRESS).call().then((value) => {
                console.log(value/Math.pow(10,v.decimals));
                const balance = (value/Math.pow(10,v.decimals));    
                if(balance>0){
                    brrowable =[...brrowable, {address:v.address, decimal:v.decimals, symbol:v.symbol, balance:balance}];        
                }
                
            });                

            if(i===KovanAssets.proto.length-1){
                console.log(brrowable);
                setBrrowableList(brrowable);
                dispatch(changeBorrowable(brrowable));
            }                                
            
        })
        console.log(brrowable);         
    },[])

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
                                    <div className={styles.tr} key={index} onClick={() => router.push('/borrow')}>
                                        <div className={styles.assets}>
                                            <div className={styles.image}>
                                                <Image src={DAI} alt={item.symbol} width={41} height={41} />
                                            </div>
                                            <div className={styles.title}>{item.symbol}</div>
                                        </div>
                                        <div className={styles.ballance}>{item.balance.toFixed(2)}</div>
                                        <div className={styles.rate}>{}</div>
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

export default CBorrow
