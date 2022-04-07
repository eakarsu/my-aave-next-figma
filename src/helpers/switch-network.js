const getHexChainIdByName=(network)=>{
    if(network == "Erol")
        return 1;
    if(network == "BSC")
        return 38;
    if(network == "Polygon")
        return 89
    if(network == "Kovan")
        return '2A'

    return 1;
}

const getChainInfo=(network)=>{
    
    if(network == "BSC")
        return {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            rpcUrls:["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com/"],
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
            },
        };
    if(network == "Erol")
        return {
            chainId: "0x01",
            chainName: "Erol",
            rpcUrls:["http://34.132.227.231/ws2/"],            
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
        }
    if(network == "Kovan")
        return {
            chainId: "0x2A",
            chainName: "Kovan Test Network",
            rpcUrls:["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
            blockExplorerUrls:["https://kovan.etherscan.io"],
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
        },
    }

    return {};
}

const switchRequest = (hexChainId) => {    
        return window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${hexChainId}` }],
            
        });    
};

const addChainRequest = (data) => {    
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: data.chainId,
                chainName: data.chainName,
                rpcUrls: data.rpcUrls,
                blockExplorerUrls: data.blockExplorerUrls,
                nativeCurrency: data.nativeCurrency,
            },
        ],
    });    
};

export const swithNetwork = async (network) => {
    console.log(network);
    const hexChainId = getHexChainIdByName(network);

    if (window.ethereum) {
        try {
            await switchRequest(hexChainId);
        } catch (error) {
            if (error.code === 4902) {
                try {
                    const chainInfo = getChainInfo(network);
                    await addChainRequest(chainInfo);
                    await switchRequest(hexChainId);
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};