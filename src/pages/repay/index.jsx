import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./repay.module.css";

import Info from "../../assets/info.png";
import BigD from "../../assets/bigD.png";
import Back from "../../assets/back.png";

import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";
import { useDataProvider } from "../../hooks/useDataProvider";
import { useLendingPoolContract, useStandardContract } from "../../hooks/useContract";
import { useWeb3Context } from "../../hooks/web3/web3-context";
import BigNumber from "bignumber.js";
import { getAddresses } from "../../constants";

const Repay = () => {
  const router = useRouter();

  const contractAddress = getAddresses();
  const {address} = useWeb3Context();

  const currentReserve = useSelector((state) => state.reserves.currentReserve);
  const balances =  useSelector((state)=>state.reserves.balances);
  const ltvData =  useSelector((state)=>state.reserves.ltvData);
  const borrowed =  useSelector((state)=>state.reserves.borrowed);
  const pricesETH = useSelector((state)=>state.reserves.pricesETH);

  const {initialBalance, initialBorrowedBalance} = useDataProvider();

  const lpContract =  useLendingPoolContract();

  const [isApproved, setApprove] = useState(false);
  const [info, setInfo] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if(currentReserve == ''){
        router.push('/mydashboard');
    }

    const idx = balances.findIndex(d=>d.address == currentReserve);
    if(idx !==-1){
        setInfo(balances[idx]);
    }
    
  }, [currentReserve]);


  const updateInfo = () =>{
    initialBalance(address);
    initialBorrowedBalance(address);
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

  const getBorrowed = () =>{
    const data = borrowed.find((d)=>d.address == currentReserve);
    if(data != null){
        return data.balance.toFixed(4);
    }
    return 0;
  }

  const getBalance = () =>{
    const data = balances.find((d)=>d.address == currentReserve);
    if(data != null){
        return data.balance.toFixed(4);
    }
    return 0;
  }

  const getARAmount = () =>{
    if(info){
      const minVal = Math.min(getBorrowed(), getBalance());
      return minVal;
    }
    return 0;
    
  }

  const approve = async() =>{
    try{
        const ct=useStandardContract(info.address);
        await ct.methods.approve(contractAddress.LENDINGPOOL_ADDRESS,new BigNumber(Number(amount)* Math.pow(10,info.decimal))).send({from: address});
        setApprove(true)
        toast.success("Successfully Approved");
    }catch(err){
        toast.error("Failed Approve");
    }
    
  }

  const repay = async() =>{
    try{                        
      await lpContract.methods.repay(info.address,new BigNumber(Number(amount)* Math.pow(10,info.decimal)),1, address).send({from: address});                            
      toast.success("Successfully Repaied");
      updateInfo();
    } catch(err){
      toast.error("Failed Repay");
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
              <div>Repay {info?.symbol}</div>
            </div>
            <div className={styles.modalborder}></div>
            <div className={styles.modalcontent}>
              <div className={styles.mgroup1}>
                <div className={styles.row1}>
                  <div className={styles.price}>You borrowed</div>
                  <div className={styles.price}>
                    <div>
                      <b>{getBorrowed()}</b> {info?.symbol}
                    </div>
                    <div className={styles.underdollar}>{info?calcPrice(info.address, getBorrowed()).toFixed(4):""} ETH</div>
                  </div>
                </div>
              </div>
              <div className={styles.mgroup1}>
                <div className={styles.row1}>
                  <div className={styles.price}>Wallet Balance</div>
                  <div className={styles.price}>
                    <div className={styles.onlyright}>
                      <b>{getBalance()}</b> {info?.symbol}
                    </div>
                    <div className={styles.underdollar}>{info?calcPrice(info.address, getBalance()).toFixed(4):""}  ETH</div>
                  </div>
                </div>
                <div className={styles.row2}>
                  <div className={styles.price}>Collateral composition</div>
                  <div className={styles.progress}>
                    <div className={styles.marklineprogress}></div>
                    <div className={styles.lineprogress}></div>
                  </div>
                </div>
              </div>
              <div className={styles.mgroup2}>
                <div className={styles.row3}>
                  <div className={styles.add}>
                    <div className={styles.price}>Loan to value</div>
                    <Image src={Info} alt="Info" width={20} height={20} />
                  </div>
                  <div className={styles.price}><b>{76.69}</b>%</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.borrow}>
            <div className={styles.dtitle}>
              Repay
            </div>
            <div className={styles.dcontent}>
              How much do you want to repay?
            </div>
            <div className={styles.labels}>
              <div className={styles.label}>Available to repay</div>
              <div className={styles.label}>
                <b>{getARAmount()}</b> {info?.symbol}
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
                    max={getARAmount()}
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
                    onClick={() => repay()}>
                    Repay
                </button>
            }            
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Repay;
