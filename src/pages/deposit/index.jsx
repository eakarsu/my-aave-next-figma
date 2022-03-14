import React,{useEffect, useState} from "react";
import BigNumber from 'bignumber.js';

import Image from "next/image";
import { useRouter } from "next/router"

import { useSelector } from "react-redux";

import styles from "./deposit.module.css";

import Minimize from "../../assets/minimize.png";
import SmallD from "../../assets/smallD.png";
import BigD from "../../assets/bigD.png";

import { getAddresses } from "../../constants";
import { useLendingPoolContract, useStandardContract, usePriceOracleContract } from "../../hooks/useContract";
import { useWeb3Context } from "../../hooks/web3/web3-context";


const Deposit = () => {
    const router = useRouter();
    const contractAddress = getAddresses();
    const {address} = useWeb3Context();
    const currentReserve = useSelector((state) => state.reserves.currentReserve);
    const balances =  useSelector((state)=>state.reserves.balances);
    const deposited =  useSelector((state)=>state.reserves.deposited);
    const reserveData = useSelector((state)=>state.reserves.reserveData);
    const pricesETH = useSelector((state)=>state.reserves.pricesETH);

    const [isApproved, setApprove] = useState(false);

    const lpContract =  useLendingPoolContract();

    const [info, setInfo] = useState(null);
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if(currentReserve == ''){
            router.push('/continue/cdeposit');
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

    const isAllowance = async() =>{
        if(!info)
            return false;

        const ct=useStandardContract(info.address);
        const allow =  await ct.methods.allowance(address,contractAddress.LENDINGPOOL_ADDRESS).call();
        console.log('allow',allow);
        return allow>0;
    }

    const approve = async() =>{
        try{
            const ct=useStandardContract(info.address);
            await ct.methods.approve(contractAddress.LENDINGPOOL_ADDRESS,new BigNumber(Number(info.balance)* Math.pow(10,info.decimal))).send({from: address});
            setApprove(true)
        }catch(err){
            console.log('err--approve');
        }
        
    }

    const deposit = async() => {
        
        try{                        
            await lpContract.methods.deposit(info.address,new BigNumber(Number(amount)* Math.pow(10,info.decimal)) , address, 0).send({from: address});                            
        } catch(err){
            console.log('error--------');
        }
        
    }

    const getDeposited = () =>{
        const data = deposited.find((d)=>d.address == currentReserve);
        if(data != null){
            return data.balance.toFixed(4);
        }
        return 0;
    }

    const getAPR = () => {
        const data = reserveData.find((d)=>d.address == currentReserve);
        if(data != null){
            return (data.liquidityRate/Math.pow(10,27)).toFixed(4);
        }
        return 0;
    }

    

    return (
        <>
            <div className={styles.header}>
                <div className={styles.container1}>
                    <div className={styles.group}>
                        <div className={styles.title}>Your balance in Prosperity</div>
                        <div className={styles.amount}>
                            <b>{getDeposited()}</b> {info?.symbol}
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.title}>Your wallet balance</div>
                        <div className={styles.amount}>
                            <b>{info?.balance.toFixed(4)}</b> {info?.symbol}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.other}>
                <div className={styles.container}>
                    <div className={styles.modal}>
                        <div className={styles.modaltitle}>
                            <div>Deposit {info?.symbol}</div>
                            <div className={styles.minimize}>
                                <div>
                                    <Image src={SmallD} alt="DField" width={15} height={15} />
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
                                <div className={styles.price}>Profile sharing rate</div>
                                <div className={styles.price}>
                                    <b>{getAPR()}</b> %
                                </div>
                            </div>
                            <div className={styles.mgroup3}>
                                <div className={styles.price}>Can be used as collateral</div>
                                <div className={styles.yes}>Yes</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.deposit}>
                        <div className={styles.dtitle}>
                            How much would you like to deposit?
                        </div>
                        <div className={styles.dcontent}>
                            Please enter an amount you would like to deposit.
                            <br />
                            The maximum amount you can deposit is shown below.
                        </div>
                        <div className={styles.labels}>
                            <div className={styles.label}>Available to Deposit</div>
                            <div className={styles.label}>
                                <b>{info?.balance.toFixed(4)}</b> {info?.symbol}
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
                                max={info?.balance}
                                className={styles.slider}
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                            />
                        </div>
                        {
                            !isApproved?
                            <button
                                className={styles.continue}
                                onClick ={() => {approve()}}
                            >
                                Approve
                            </button>:
                            <button
                                className={styles.continue}
                                onClick ={() => {deposit()}}
                            >
                                Deposit
                            </button>
                        }                                            
                    </div>
                </div>
            </div>
        </>
    );
};

export default Deposit;
