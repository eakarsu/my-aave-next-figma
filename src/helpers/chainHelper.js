export function getChainIdByName(str){
    let chainId =1;
    if(str == "Erol"){
        chainId = 1;
    }

    if(str == "BSC"){
        chainId = 56;
    }

    if(str == "Polygon"){
        chainId = 137;
    }

    if(str == "Kovan"){
        chainId = 42;
    }

    return chainId;
}


export function getRPCByChainID(chainId){
    let rpc = " http://34.132.227.231/ws2/";
    if(chainId ==1){
        rpc = " http://34.132.227.231/ws2/";
    }

    if(chainId==56){
        rpc ="https://bsc-dataseed.binance.org/";
    }

    if(chainId == 137){
        rpc = "https://polygon-rpc.com/";
    }

    if(chainId == 42)
        rpc ="https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

    return rpc;
}