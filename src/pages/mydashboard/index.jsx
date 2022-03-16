import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router"

import ProgressBar from "progressbar.js";

import styles from "./mydashboard.module.css";

import Minimize from "../../assets/minimize.png";
import Info from "../../assets/info.png";
import DAI from "../../assets/dai.png";
import { useDispatch, useSelector } from "react-redux";
import { useDataProvider } from "../../hooks/useDataProvider";
import { useWeb3Context } from "../../hooks/web3/web3-context";
import { useLendingPoolContract } from "../../hooks/useContract";
import { changeCurrentReserve } from "../../store/slices/reserves-slice";


const MyDashboard = () => {
    const router = useRouter();

    const [check, setCheck] = useState(true);
    const [check1, setCheck1] = useState(true);

    const {address} =  useWeb3Context();
    const reserveData = useSelector((state)=>state.reserves.reserveData);
    const pricesETH = useSelector((state)=>state.reserves.pricesETH);
    const borrowed = useSelector((state)=>state.reserves.borrowed);
    const deposited = useSelector((state)=>state.reserves.deposited);
    const [bar1, setBar1] = useState(null);
    const [bar, setBar] = useState(null);

    const [overview, setOverview] = useState(null);

    const {initialReserveData, initialBalance, initialReservePriceETH, initialDepositedBalance,  initialBorrowedBalance} = useDataProvider();
    const dispatch = useDispatch();

    const lpContract = useLendingPoolContract();

    useEffect(async()=>{
        if(address){
            initialBalance(address);
            initialDepositedBalance(address);
            initialBorrowedBalance(address);
        }                        
    },[address])
    
    useEffect(()=>{
        initialReserveData();
        initialReservePriceETH();
    },[])

    useEffect(async()=>{
        if(address){
            await lpContract.methods.getUserAccountData(address).call().then((value)=>{
                const totalDebtETH = value.totalDebtETH/Math.pow(10,18);
                const totalCollateralETH = value.totalCollateralETH/Math.pow(10,18);            
                const availableBorrowsETH = value.availableBorrowsETH/Math.pow(10,18);            
                let totalDepositedETH = 0;
                deposited.forEach(item=>{                
                    const p = calcPrice(item.address, item.balance);
                    totalDepositedETH = totalDepositedETH + Number(p);
                });

                const collateralUsed = totalCollateralETH/totalDepositedETH*100;
                const borrowedUsed = totalDebtETH/totalCollateralETH*100;
    
                setOverview({
                    totalDepositedETH:totalDepositedETH, 
                    totalCollateralETH:totalCollateralETH, 
                    totalDebtETH:totalDebtETH,
                    availableBorrowsETH:availableBorrowsETH,
                    collateralUsed:collateralUsed,
                    borrowedUsed:borrowedUsed
                });
            });
        }        
    },[address,deposited])

    const calcPrice=(asset, amount)=>{
        const data =  pricesETH.find((d)=>d.address == asset);
        if(data != null){
            const p = data.price/Math.pow(10, 18);
            const tPrice = p*amount;
            return tPrice;
        }
        return 0;
    }

    const getAPRForDeposit = (asset) => {
        const data = reserveData.find((d)=>d.address == asset);
        if(data != null){
            return data.liquidityRate/Math.pow(10,27);
        }
        return 0;   
    }

    const getAPRForBorrow = (asset) => {
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

    const setCurrentReserve = (address, url) => {
        dispatch(changeCurrentReserve(address));
        router.push(`/${url}`);
    }


    useEffect(()=>{
        const cbar  = new ProgressBar.Circle(container, {
            text: {
                autoStyleContainer: false,
            },
            trailColor: "#4e5984",
            trailWidth: 10,
            duration: 1800,
            easing: "bounce",
            strokeWidth: 10,
            from: { color: "#FFEA82", a: 0 },
            to: { color: "#EF967A 100% #FCFE99 100%", a: 0.4 },
            // Set default step function for all animate calls
            step: function (state, circle) {
                circle.path.setAttribute("stroke", state.color);
                circle.setText("Collateral <br /> composition");
            },
        });
        cbar.text.style.fontFamily = "Poppins";
        cbar.text.style.fontSize = "10.5px";
        cbar.text.style.textAlign = "center";
        cbar.text.style.color = "#4E5984";
        cbar.animate(0.5); // Number from 0.0 to 1.0

        const cbar1 = new ProgressBar.Circle(container1, {
            text: {
                autoStyleContainer: false,
            },
            trailColor: "#4e5984",
            trailWidth: 10,
            duration: 1800,
            easing: "bounce",
            strokeWidth: 10,
            from: { color: "#FFEA82", a: 0 },
            to: { color: "#EF967A 100% #FCFE99 100%", a: 0.4 },
            // Set default step function for all animate calls
            step: function (state, circle) {
                circle.path.setAttribute("stroke", state.color);
                circle.setText("Borrow <br /> composition");
            },
        });
        cbar1.text.style.fontFamily = "Poppins";
        cbar1.text.style.fontSize = "10.5px";
        cbar1.text.style.textAlign = "center";
        cbar1.text.style.color = "#4E5984";
        cbar1.animate(0.5); // Number from 0.0 to 1.0
        setBar(cbar);
        setBar1(cbar1);
    },[])

    useEffect(() => {
        if(overview&&bar){
            if(overview.collateralUsed!=Infinity){
                bar.animate((overview.collateralUsed/100).toFixed(1));     
                bar1.animate((overview.borrowedUsed/100).toFixed(1));        
            }            
        }        
    }, [overview]);



    return (
        <div className={styles.mydashboard}>
            <div className={styles.container}>
                <div className={styles.leftmodal}>
                    <div className={styles.lheader}>Deposit information</div>
                    <div className={styles.progress}>
                        <div className={styles.ptitle1}>
                            <div className={styles.item1}>
                                <div>You collateral</div>
                                <div>{overview?overview.totalDepositedETH.toFixed(4)+'ETH':'-'}</div>
                            </div>
                            <div className={styles.item2}>
                                <div>Collateral Powed Used</div>
                                <div>{overview?overview.collateralUsed.toFixed(0)+'%':'-'}</div>
                            </div>
                            <div className={styles.item3}>
                                <div>Your deposited</div>
                                <div>{overview?overview.totalCollateralETH.toFixed(4)+'ETH':'-'}</div>
                            </div>                            
                        </div>
                        <div className={styles.progressgroup}>
                            <div id="container" className={styles.progressbar}></div>
                        </div>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.thead}>
                            <div className={styles.deposits}>Your <br /> deposits</div>
                            <div className={styles.ballance} >Current <br /> ballance</div>
                            <div className={styles.profit}>Profit <br /> Sharing <br /> Rate</div>
                            <div className={styles.merge}>
                                <div>Collateral</div>
                                <Image src={Info} alt="Info" width={18} height={18} />
                            </div>
                            <div className={styles.bspace}></div>
                        </div>
                        <div className={styles.tbody}>
                            {
                                deposited.map((item,i)=>{
                                    return <div key={i} className={styles.child}>
                                                <div className={styles.bdeposits}>
                                                    <Image src={DAI} alt="DAI" width={30} height={30} />
                                                    <div>{item.symbol}</div>
                                                </div>
                                                <div className={styles.bballance}>
                                                    <div>{item.balance.toFixed(4)}</div>
                                                    <div className={styles.opacity}>
                                                        {calcPrice(item.address, item.balance)>0?calcPrice(item.address, item.balance).toFixed(4):'-'} ETH
                                                    </div>
                                                </div>
                                                <div className={styles.bprofit}>{getAPRForDeposit(item.address).toFixed(3)}%</div>
                                                <div className={styles.bmerge}>
                                                    <label className={styles.yes}>
                                                        {!check1 ? "Yes" : ""}
                                                    </label>
                                                    <label className={styles.no}>
                                                        {!check1 ? "" : "No"}
                                                    </label>
                                                    <label className={styles.switch}>
                                                        <input type="checkbox" onChange={() => setCheck1(!check1)} />
                                                        <span className={`${styles.slider} ${styles.round}`}></span>
                                                    </label>
                                                </div>
                                                <div className={styles.bspace}>
                                                    <div className={styles.deposit} onClick={() => router.push('/continue/cdeposit')}>Deposit</div>
                                                    <div className={styles.withdraw} onClick={() => setCurrentReserve(item.address, 'withdraw')}>Withdraw</div>
                                                </div>
                                            </div>
                                })
                            }
                            
                            
                        </div>
                    </div>
                </div>
                {/* right modal */}
                <div className={styles.rightmodal}>
                    <div className={styles.rheader}>
                        <div className={styles.title}>Borrow information</div>
                        <div className={styles.minimize}>
                            <Image src={Minimize} alt="Minimize" width={19} height={19} />
                            <div className={styles.hideminimize}>Minimize</div>
                        </div>
                    </div>
                    <div className={styles.progress}>
                        <div className={styles.ptitle1}>
                            <div className={styles.item1}>
                                <div>You borrowed</div>
                                <div>{overview?overview.totalDebtETH.toFixed(4)+'ETH':'-'}</div>
                            </div>
                            <div className={styles.item2}>
                                <div>Borrowing Powed Used</div>
                                <div>{overview?overview.borrowedUsed.toFixed(0)+'%':'-'}</div>
                            </div>
                            <div className={styles.item3}>
                                <div>Your collateral</div>
                                <div>{overview?overview.totalCollateralETH.toFixed(4)+'ETH':'-'}</div>
                            </div>
                            <div className={styles.item4}>
                                <div className={styles.btn}>Details</div>
                            </div>
                        </div>
                        <div className={styles.progressgroup}>
                            <div id="container1" className={styles.progressbar}></div>                        
                        </div>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.thead}>
                            <div className={styles.deposits}>Your <br /> borrows</div>
                            <div className={styles.ballance} >Borrowed</div>
                            <div className={styles.profit}>Profit <br /> Commission <br /> Rate</div>
                            <div className={styles.merge}></div>
                            <div className={styles.bspace}></div>
                        </div>
                        <div className={styles.tbody}>
                            {
                                borrowed.map((item, index)=>{
                                    return <div key={index} className={styles.child}>
                                                <div className={styles.bdeposits}>
                                                    <Image src={DAI} alt="DAI" width={30} height={30} />
                                                    <div>{item.symbol}</div>
                                                </div>
                                                <div className={styles.bballance}>
                                                    <div>{item.balance.toFixed(4)}</div>
                                                    <div className={styles.opacity}>
                                                        {calcPrice(item.address, item.balance)>0?calcPrice(item.address, item.balance).toFixed(4):'-'} ETH
                                                    </div>
                                                </div>
                                                <div className={styles.bprofit}>{getAPRForBorrow(item.address).toFixed(3)}%</div>
                                                <div className={styles.bmerge}></div>
                                                <div className={styles.bspace}>
                                                    <div className={styles.deposit} onClick={() => router.push('/continue/cborrow')}>Borrow</div>
                                                    <div className={styles.withdraw} onClick={() => setCurrentReserve(item.address, 'repay')}>Repay</div>
                                                </div>
                                            </div>
                                })
                            }                            
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MyDashboard;
