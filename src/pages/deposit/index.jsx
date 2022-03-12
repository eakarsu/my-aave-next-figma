import React,{useEffect, useState} from "react";
import Image from "next/image";
import { useRouter } from "next/router"

import { useSelector } from "react-redux";

import styles from "./deposit.module.css";

import Minimize from "../../assets/minimize.png";
import SmallD from "../../assets/smallD.png";
import BigD from "../../assets/bigD.png";
import { useLendingPoolContract } from "../../hooks/useContract";
import { useWeb3Context } from "../../hooks/web3/web3-context";


const Deposit = () => {
    const router = useRouter();
    const {address} = useWeb3Context();
    const currentReserve = useSelector((state) => state.reserves.currentReserve);
    const balances =  useSelector((state)=>state.reserves.balances);

    const lpContract =  useLendingPoolContract();

    const [info, setInfo] = useState(null);
    const [dai, setDAI] = React.useState(10);

    useEffect(() => {
        if(currentReserve == ''){
            router.push('/continue/cdeposit');
        }


        const idx = balances.findIndex(d=>d.address == currentReserve);
        console.log(idx);
        if(idx !==-1){
            setInfo(balances[idx]);
            console.log(info);
        }
        console.log(currentReserve);
    }, [currentReserve]);   

    const deposit = async() => {
        
        try{
            await lpContract.methods.deposit(info.address,BigInt(dai* 1e18), address, 0).send({from: address, gas: 200000 });
        } catch(err){
            console.log('error--------');
        }
        
    }

    return (
        <>
            <div className={styles.header}>
                <div className={styles.container1}>
                    <div className={styles.group}>
                        <div className={styles.title}>Your balance in Prosperity</div>
                        <div className={styles.amount}>
                            <b>30.0003</b> {info?.symbol}
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
                            <div>Deposit DAI</div>
                            <div className={styles.minimize}>
                                <div>
                                    <Image src={SmallD} alt="DField" width={15} height={15} />
                                </div>
                                <div>DAI Reserve Overview</div>
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
                                    <b>$1.01</b> USD
                                </div>
                            </div>
                            <div className={styles.mgroup2}>
                                <div className={styles.price}>Profile sharing rate</div>
                                <div className={styles.price}>
                                    <b>$1.01</b> USD
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
                            <div className={styles.label}>Available to borrow</div>
                            <div className={styles.label}>
                                <b>38.17984</b> DAI
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
                                        value={dai}
                                        onChange={(e) => setDAI(e.target.value)}
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
                                onChange={(e) => setDAI(e.target.value)}
                                value={dai}
                            />
                        </div>
                        <button
                            className={styles.continue}
                            onClick ={() => {deposit()}}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Deposit;
