import React from "react"

const url = "https://graphql.bitquery.io/";

const GetWalletBalances = async (account) => {

    const walletTokenInfo = []
    const draftwalletTokens = []
    const tokenContracts = []
   
    const query = {
    query: `
    query($network:EthereumNetwork!, $account:String!){
        ethereum(network: $network) {
        address(address: {is: $account}) {
            balances {
            currency {
                name
                symbol
                address
                tokenType
                tokenId
            }
            value
            }
        }
        }
    }`,
    variables: {
        "network":"kovan",
        "account": account
    }
    } 
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
        },
        body: JSON.stringify(query)
    };    
    
    await fetch(url, opts)
            .then(res => res.json())
            .then(async(data) => {                                     
                const balances = data.data.ethereum.address[0].balances
                balances.map((pricetoken) => {                  
                  if(Number(pricetoken.value)>0) {                    
                    draftwalletTokens.push(pricetoken)
                    const contract = pricetoken.currency.address
                    tokenContracts.push(contract)
                  }                 
                    return 1
                })       
               if(tokenContracts.length > 0) {                               
                await getTokenPrice(tokenContracts).then((priceData) => {                    
                    console.log('priceData====---->',priceData)
                    draftwalletTokens.map((token,index) => {                                          
                        const tokenPrice = priceData[index].quotePrice
                        console.log('tokenprice=', tokenPrice)                          
                        const sumPrice = token.value*tokenPrice                   
                        walletTokenInfo.push({ 'balance': token.value, 'symbol': token.currency.symbol,'tokenName':token.currency.symbol , 'price':tokenPrice, 'tokenSumPrice': sumPrice })                
                        return token
                    })                    
                })
              }                
            })
            .catch(console.error);
            console.log('=======>>>>>>>>>>>========',walletTokenInfo)
    return walletTokenInfo;
}

export async function getTokenPrice(contractAddress){    
    console.log('gettokenprice',contractAddress)
    const sliceNumber = 100;
    const loopCount = Math.floor(contractAddress.length / sliceNumber) + 1 ;          
    const loopArray = Array.from(Array(loopCount).keys())    
    let tokenData = []
    // loopArray.map(async(value, index) => {      
      
    //     const startNumber = 100*index;
    //     let endNumber = startNumber + sliceNumber - 1;
    //     if(index === loopCount) {
    //       endNumber = contractAddress.length
    //     }
    const startNumber = 0;
    const endNumber = contractAddress.length
        // const newAddress = contractAddress.slice(startNumber, endNumber)

        const query = {
            query: `
            query (
                $network: EthereumNetwork!, 
                $USD: String!, 
                $tokens: [String!],  
              ) {
                ethereum(network: $network) {
                  count0: dexTrades(
                    options: {asc: "quoteCurrency.symbol"}
                    baseCurrency: {in: $tokens}
                     quoteCurrency: {is: $USD}
                  ) {
                    quoteCurrency {
                      symbol
                      name
                      address
                    }
                    baseCurrency {
                      symbol
                      address
                      name
                    }
                    quotePrice
                    close: maximum(of: block, get: quote_price)
                  }
                }
              }  
            `,
            variables: {     
                network: 'kovan',
                tokens: contractAddress,
                USD: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        
            }
            } ;
            const opts = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9",
                    'Access-Control-Allow-Origin':'*'
                },
                body: JSON.stringify(query)
            };    
            await fetch(url, opts)
                  .then(res => res.json())
                  .then((result) => { 
                    console.log('tokendataprice', result)                                      
                      const draftData = result.data.ethereum.count0;      
                      tokenData = draftData
                  })                                    
            return tokenData
  }

export default GetWalletBalances