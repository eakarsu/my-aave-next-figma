import { useDispatch } from 'react-redux'
import KovanAssets from '../constants/kovan.json';
import { changeReserveData } from '../store/slices/reserves-slice';
import { useDataProviderContract } from './useContract';

export const useDataProvider = () => {

    const dispatch = useDispatch();
    const dpContract = useDataProviderContract();

    const initialReserveData = () => {
        let reserves = [];
        KovanAssets.proto.forEach(async(v,i)=>{
            await dpContract.methods.getReserveData(v.address).call().then((value) => {
                reserves = [...reserves, {address:v.address, availableLiquidity:value.availableLiquidity, liquidityRate:value.liquidityRate}];                                        
            });                
            if(i===KovanAssets.proto.length-1){
                console.log(reserves);
                dispatch(changeReserveData(reserves));
            }                                
            
        })
    }

    return {initialReserveData};
}