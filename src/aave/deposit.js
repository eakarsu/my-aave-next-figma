// (i). Deposit collateral

import { ethers } from "ethers";
import { aaveProvider } from "./AaveProvider";

export const deposit = async (
  lendingPoolAddressproviderAddress,
  provider,
  signer,
  amount,
  asset
) => {
  const aaveProviderWrapper = await aaveProvider.connect(
    lendingPoolAddressproviderAddress,
    provider,
    signer
  );

  if (aaveProviderWrapper.done) {
    try {
      const deposit = await aaveProvider.depositCollateral(
        parseInt(ethers.utils.parseEther(amount.toString()).toString()).toString(),
        asset,
        signer
      );

      console.log(deposit);
    } catch (error) {
      console.log(error);
    }
  }
};
