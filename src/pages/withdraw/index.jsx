import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./withdraw.module.css";

import Info from "../../assets/info.png";
import BigD from "../../assets/bigD.png";
import Back from "../../assets/back.png";

import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import { getAddresses } from "../../constants";
import { useWeb3Context } from "../../hooks/web3/web3-context";
import { useSelector } from "react-redux";
import { useLendingPoolContract } from "../../hooks/useContract";
import BigNumber from "bignumber.js";
import { useDataProvider } from "../../hooks/useDataProvider";

const WithDraw = () => {

  const router = useRouter();
  const contractAddress = getAddresses();
  const {address} = useWeb3Context();
  
  const currentReserve = useSelector((state) => state.reserves.currentReserve);
  const reserveData =  useSelector((state)=>state.reserves.reserveData);
  const balances =  useSelector((state)=>state.reserves.balances);
  const deposited =  useSelector((state)=>state.reserves.deposited);
  const pricesETH = useSelector((state)=>state.reserves.pricesETH);
  
  const {initialReserveData, initialDepositedBalance} = useDataProvider();

  const [info, setInfo] = useState(null);
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const lpContract =  useLendingPoolContract();

  useEffect(() => {
    if(currentReserve == ''){
        router.push('/mydashboard');
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
            const tPrice = p * getDeposited(); 
            setPrice(tPrice);            
        }        
    };
    getPrice();
  },[pricesETH])


  const updateInfo = () =>{
    initialReserveData();
    initialDepositedBalance(address);
  }
  const getDeposited = () =>{
    const data = deposited.find((d)=>d.address == currentReserve);
    if(data != null){
        return data.balance;
    }
    return 0;
  }

  const getAWAmount = () => {
    const idx =  reserveData.findIndex(d=>d.address == currentReserve);
    console.log(idx);
    if(idx!=-1&&info){
      const availableLiquidity = reserveData[idx]?.availableLiquidity||0;
      const minVal = Math.min(getDeposited(), (availableLiquidity/Math.pow(10, info.decimal)));
      return minVal;
    }
    return 0;
    
  }

  const withdraw  = async() => { 
    try{                        
      await lpContract.methods.withdraw(info.address,new BigNumber(Number(amount)* Math.pow(10,info.decimal)),address).send({from: address});                            
      toast.success("Successfully Withdrawed");
      updateInfo();
    } catch(err){
      toast.error(err);
    }
  }


  return (
    <>
      <div className={styles.other}>
        <div className={styles.container}>
          <div className={styles.back} onClick={() => router.back()}>
            <Image src={Back} alt="Back" width={7.5} height={15} />
            <div className={styles.title}>Back</div>
          </div>
          <div className={styles.modal}>
            <div className={styles.modaltitle}>
              <div>Withdraw {info?.symbol}</div>
            </div>
            <div className={styles.modalborder}></div>
            <div className={styles.modalcontent}>
              <div className={styles.row1}>
                <div className={styles.price}>Your balance Properity</div>
                <div className={styles.price}>
                  <div>
                    <b>{getDeposited().toFixed(4)}</b> {info?.symbol}
                  </div>
                  <div className={styles.underdollar}>{price.toFixed(4)} ETH</div>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.add}>
                  <div className={styles.price}>Loan to value</div>
                  <Image src={Info} alt="Info" width={20} height={20} />
                </div>
                <div className={styles.price}><b>78.99</b>%</div>
              </div>
              <div className={styles.mgroup2}>
                <div className={styles.price}>Collateral composition</div>
                <div className={styles.lineprogress}>

                </div>
              </div>
            </div>
          </div>
          <div className={styles.borrow}>
            <div className={styles.dtitle}>
              Withdraw
            </div>
            <div className={styles.dcontent}>
              How much do you want to withdraw?
            </div>
            <div className={styles.labels}>
              <div className={styles.label}>Available to withdraw</div>
              <div className={styles.label}>
                <b>{getAWAmount().toFixed(4)}</b> {info?.symbol}
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
                    max={getAWAmount()}
                    className={styles.slider}
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                />
            </div>
            <button
              className={styles.continue}
              onClick={() => withdraw()}
            >
              Withdraw
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default WithDraw;
