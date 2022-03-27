import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./borrow.module.css";

import Minimize from "../../assets/minimize.png";
import SmallD from "../../assets/smallD.png";
import BigD from "../../assets/bigD.png";

import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import { useWeb3Context } from "../../hooks/web3";
import { useSelector } from "react-redux";
import { useLendingPoolContract } from "../../hooks/useContract";
import BigNumber from "bignumber.js";
import { useDataProvider } from "../../hooks/useDataProvider";

const Borrow = () => {
    const router = useRouter();
    const {address} = useWeb3Context();
    const currentReserve = useSelector((state) => state.reserves.currentReserve);
    const reserveData =  useSelector((state)=>state.reserves.reserveData);
    const balances = useSelector((state)=>state.reserves.balances);
    const ltvData =  useSelector((state)=>state.reserves.ltvData);
    const borrowable =  useSelector((state)=>state.reserves.borrowable);
    const borrowed =  useSelector((state)=>state.reserves.borrowed);
    const pricesETH = useSelector((state)=>state.reserves.pricesETH);

    const {initialReserveData,initialBorrowedBalance, initialBorrowableBalance} = useDataProvider();

    const lpContract =  useLendingPoolContract();

    const [info, setInfo] = useState(null);
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if(currentReserve == ''){
            router.push('/continue/cborrow');
        }
        const idx = balances.findIndex(d=>d.address == currentReserve);
        if(idx !==-1){
            setInfo(balances[idx]);
        }        
    }, [currentReserve]);
    
    useEffect(()=>{
        const getPrice = () => {
            const data =  pricesETH.find((d)=>d.address == currentReserve);
            if(data != null){
                const p = data.price/Math.pow(10, 18);
                console.log(p); 
                setPrice(p);                
            }            
        };
        getPrice();
    },[pricesETH])

    const updateInfo = () =>{
        initialReserveData();
        initialBorrowedBalance(address);
        initialBorrowableBalance(address);
        
    }

    
    const getNumberFromPrice = (tp) => {
        const data =  pricesETH.find((d)=>d.address == currentReserve);
        if(data != null){
            const p = data.price/Math.pow(10, 18);
            const tn = tp/p;
            return tn;
        }
        return 0;
      }

    const borrow = async() => {
        try{                        
            await lpContract.methods.borrow(info.address,new BigNumber(Number(amount)* Math.pow(10,info.decimal)) ,1, 0,address).send({from: address});                            
            toast.success("Successfully Borrowed");
            updateInfo();
        } catch(err){
            toast.error("Failed Borrow");
        }
        
    }

    const getLiquidity = () => {
        const idx =  reserveData.findIndex(d=>d.address == currentReserve);
        if(idx!=-1&&info){
          const availableLiquidity = reserveData[idx]?.availableLiquidity/Math.pow(10, info.decimal)||0;
          return availableLiquidity;
        }
        return 0;
        
    }

    const getBorrowable = () => {
        const idx = borrowable.findIndex(d=>d.address == currentReserve);
        if(idx !==-1){
            const minVal = Math.min(borrowable[idx].balance.toFixed(4), getLiquidity());
            return minVal;
        }
        return 0;
    }

    const getBorrowed = () =>{
        const data = borrowed.find((d)=>d.address == currentReserve);
        if(data != null){
            return data.balance.toFixed(4);
        }
        return 0;
    }

    const getLtv = () => {
        return 100;
    }

    const getAPR = () => {        
        return 0;
    }

    return (
        <>
            <div className={styles.header}>
                <div className={styles.container1}>
                    <div className={styles.group}>
                        <div className={styles.title}>Your borrowed</div>
                        <div className={styles.amount}>
                            <b>{getBorrowed()}</b> {info?.symbol}
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.title}>Total collateral</div>
                        <div className={styles.amount}>
                            <b>{getLiquidity().toFixed(4)}</b> {info?.symbol}
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.title}>Loan to value</div>
                        <div className={styles.amount}>
                            <b>{getLtv()}</b> %
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.other}>
                <div className={styles.container}>
                    <div className={styles.modal}>
                        <div className={styles.modaltitle}>
                            <div>Borrow {info?.symbol}</div>
                            <div className={styles.minimize}>
                                <div>
                                    <Image src={`/./icon/${info?.symbol}.png`} alt="DField" width={19} height={19} />
                                </div>
                                <div>{info?.symbol} Reserve Overview</div>
                            </div>
                            <div className={styles.minimize}>
                                <div>
                                    <Image src={Minimize} alt="Minimize" width={19} height={19} />
                                </div>
                                <div className={styles.hideminimize}>Minimize</div>
                            </div>
                        </div>
                        <div className={styles.modalborder}></div>
                        <div className={styles.modalcontent}>
                            <div className={styles.mgroup1}>
                                <div className={styles.price}>Asset price</div>
                                <div className={styles.price}>
                                    <b>{price.toFixed(4)}</b> ETH
                                </div>
                            </div>
                            <div className={styles.mgroup2}>
                                <div className={styles.price}>Profit Commission Rate</div>
                                <div className={styles.price}>
                                    <b>3.98</b> %
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.borrow}>
                        <div className={styles.dtitle}>
                            How much would you like to borrow?
                        </div>
                        <div className={styles.dcontent}>
                            Please enter an amount you would like to borrow.
                            <br />
                            The maximum amount you can borrow is shown below.
                        </div>
                        <div className={styles.labels}>
                            <div className={styles.label}>Available to borrow</div>
                            <div className={styles.label}>
                                <b>{getBorrowable()}</b> {info?.symbol}
                            </div>
                        </div>
                        <div className={styles.values}>
                            <div className={styles.left}>
                                <div>
                                    <Image src={BigD} alt="DField" width={29.3} height={29.3} />
                                </div>
                                <div className={styles.dinput}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.max}>Max</div>
                        </div>
                        <div className={styles.slidercontainer}>
                            <div className={styles.sliderlabels}>
                                <div className={styles.safer}>Safer</div>
                                <div className={styles.ghost}>New health factor 2.04</div>
                                <div className={styles.risker}>Risker</div>
                            </div>
                            <input
                                type="range"
                                in="1"
                                max={getBorrowable()}
                                className={styles.slider}
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                            />
                        </div>
                        <button onClick={()=>{borrow()}}
                            className={styles.continue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Borrow;
