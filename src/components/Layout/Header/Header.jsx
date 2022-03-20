import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { CgMenu } from "react-icons/cg";

// import styles
import styles from "./header.module.css";

// import images
import Logo from "../../../assets/logo.png";
import Divide from "../../../assets/divide.png";
import ConnectWallet from "../../ConnectWallet";

const Header = () => {
  const router = useRouter();
  const [state, setState] = useState(false);

  const menuData = [
    {
      title: "My Dashboard",
      path: "/mydashboard",
    },
    {
      title: "My Fund",
      path: "/enz/overview",
    },
    {
      title: "Deposit",
      path: "/continue/cdeposit",
    },
    {
      title: "Borrow",
      path: "/continue/cborrow",
    },
  ];

  const openNav = () => {
    setState(true);
  };

  const closeNav = () => {
    setState(false);
  };

  const connectWalletFunc = () => {

  }

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logos} onClick={() => router.push("/")}>
              <Image
                src={Logo}
                alt="Logo"
                layout="intrinsic"
                width={600}
                height={120}
              />
            </div>
            <div className={styles.menuicon} onClick={openNav}>
              <CgMenu fontSize={40} />
            </div>
            <div
              className={`${styles.overlay}  ${state ? styles.openNav : ""}`}
            >
              <div className={styles.closebtn} onClick={closeNav}>
                &times;
              </div>
              <div className={styles.overlaycontent}>
                {menuData.map((item, key) => (
                  <div
                    key={key}
                    onClick={() => {
                      router.push(item.path);
                      closeNav();
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.menu}>
            {menuData.map((item, key) => (
              <div
                key={key}
                className={`${styles.menubar} ${
                  router.route === item.path && styles.active
                }`}
                onClick={() => router.push(item.path)}
              >
                {item.title}
              </div>
            ))}
            <div className={styles.divide}>
              <Image src={Divide} alt="Divide" width={1} height={41} />
            </div>
            <div
              className={`${styles.menubar} ${
                router.route === "/addnetwork" && styles.active
              }`}
              onClick={() => router.push("/addnetwork")}
            >
              Add Network
            </div>
            <div className={`${styles.menubar} ${
                router.route === "/addnetwork" && styles.active
              }`}
              >
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
