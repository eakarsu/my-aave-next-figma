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
  const ltvData =  useSelector((state)=>state.reserves.ltvData);
  const balances =  useSelector((state)=>state.reserves.balances);
  const deposited =  useSelector((state)=>state.reserves.deposited);
  const pricesETH = useSelector((state)=>state.reserves.pricesETH);
  
  const {initialReserveData, initialDepositedBalance} = useDataProvider();

  const [info, setInfo] = useState(null);
  const [delta, setDelta] = useState(0);
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
    if(address){
      loadDelta();
    }
  },[address])

  const loadDelta = async() => {
      await lpContract.methods.getUserAccountData(address).call().then((value)=>{
        const dPercent = value.currentLiquidationThreshold - value.ltv;
        let totalDebtETH = value.totalDebtETH/Math.pow(10,18);
        totalDebtETH = totalDebtETH + totalDebtETH*dPercent/10000;
        let totalCollateralETH = value.totalCollateralETH/Math.pow(10,18);            
        totalCollateralETH = totalCollateralETH;
        let delt =  totalCollateralETH - totalDebtETH;
        
        setDelta(delt);
      });
  }

  const updateInfo = () =>{
    initialReserveData();
    initialDepositedBalance(address);
    loadDeta();
  }

  const calcPrice=(asset, amount)=>{
    const data =  pricesETH.find((d)=>d.address == asset);
    if(data != null){
        const p = data.price/Math.pow(10, 18);
        const tPrice = p*amount;
        return tPrice;
    }
    return 0;
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

  const getDeposited = () =>{
    const data = deposited.find((d)=>d.address == currentReserve);
    if(data != null){
        return data.balance;
    }
    return 0;
  }
  
  const getTPrice = () => {
    if(getDeposited()!==0){
      const tp = calcPrice(currentReserve, getDeposited());
      return tp;
    }
    return 0;
  }

  const getLtv = () => {
    return 76.69;
  }

  const getAssetLtv = () => {
    const idx =  ltvData.findIndex(d=>d.address == currentReserve);
    if(idx !== -1){
      return ltvData[idx].ltv;
    }
    return 0;
  }

  const getAWAmount = () => {
    const idx =  reserveData.findIndex(d=>d.address == currentReserve);
    if(idx!=-1&&info){
      const minP = Math.min(getTPrice(), delta*getLtv()/100);
      const tNumber = getNumberFromPrice(minP);
      const availableLiquidity = reserveData[idx]?.availableLiquidity||0;
      const awVal = Math.min(tNumber, (availableLiquidity/Math.pow(10, info.decimal)));

      return awVal;
    }
    return 0;
    
  }

  const withdraw  = async() => { 
    try{                        
      await lpContract.methods.withdraw(info.address,new BigNumber(Number(amount)* Math.pow(10,info.decimal)),address).send({from: address});                            
      toast.success("Successfully Withdrawed");
      updateInfo();
    } catch(err){
      toast.error("Failed Withdraw");
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
                  <div className={styles.underdollar}>{getTPrice().toFixed(4)} ETH</div>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.add}>
                  <div className={styles.price}>Loan to value</div>
                  <Image src={Info} alt="Info" width={20} height={20} />
                </div>
                <div className={styles.price}><b>{getLtv()}</b>%</div>
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
