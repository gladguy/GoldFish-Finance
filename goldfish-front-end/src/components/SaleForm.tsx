import React, { useState } from "react";
import { VenomConnect } from "venom-connect";
import { Address, ProviderRpcClient,Contract } from "everscale-inpage-provider";

 

 

// we will user bignumber library to operate with deposit values (remember about decimals multiply)
import BigNumber from "bignumber.js";

// Importing of our contract ABI from smart-contract build action. Of cource we need ABI for contracts calls.

import GoldFishAbi from "../abi/GoldFish.abi.json";

import TokenWallet from "../abi/TokenWallet.abi.json";
import TokenRootAbi from "../abi/TokenRoot.abi.json";

import Dollar from "../abi/Dollar.abi.json";

type Props = {
  balance: string | undefined;
  getBalance: (wallet: string) => void;
  venomConnect: VenomConnect | undefined;
  address: string | undefined;
  provider: ProviderRpcClient | undefined;
};




function SaleForm({ balance, venomConnect, address, provider, getBalance }: Props) {

  
  const [loanAmount, setloanAmount] = useState<number | undefined>();
  const [tenure, setTenure] = useState<number | undefined>();
  const [interestRate, setinterestRate] = useState<number | undefined>();
  const [votesRequired, setVotes] = useState<number | undefined>();

  const [website, setWebsite] = useState<string | undefined>("");
  const [companyName, setcompanyName] = useState<string | undefined>("");

  const [poolid, setPoolID] = useState<number | undefined>();

  const [poolStatus, setPoolStatus] = useState<string | undefined>("Pool is Waiting ⏰");


  const [fullFunded, setFullyFunded] = useState<number | undefined>(0);


  const [borrowCreator, setBorrowCreator] = useState<string | undefined>();

  const [all_liquidity, setLiquidity] = useState<number | undefined>(0);
  const [postiveVotes, setPVotes] = useState<number | undefined>();
  const [negativeVotes, setNVotes] = useState<number | undefined>();
  const [totalVotes, setTVotes] = useState<number | undefined>();
  const [borrow_amount, setBorrowAmount] = useState<number | undefined>();
  const [monthly_interest, setInterestMonth] = useState<number | undefined>(0);

  const [isCreator, setIsCreator] = useState<number | undefined>(0);
  const [poolMoney, setPoolMoney] = useState<number | undefined>(0);

  const [isBackerSupported, setBackerSupported] = useState<number | undefined>(0);

  const [liquidityFundTransfer, setLiquidityTransfer] = useState<number | undefined>(0);

  
  const [RupeeBalance, setBalance] = useState<string | undefined>("0");
  const [companyNameDisplay, setcompanyNameDisplay] = useState<string | undefined>("");


  var borrowPool_ = {
    "loanamount": "50000",
    "interestrate": "12",
    "tenure": "12",
    "companyname": "Venom Corporation",
    "website": "Venom.com",
    "votesLimit": "500",
    "status": "Voting",
    "creator": "0:2f35c41d7a709631fd27b20e9d78d3b36ea3f82008987698bb7e7bbd7f9bc76a"
};

  const [statusMsg, setStatusMsg] = useState<string | undefined>("Welcome to GoldFish Finance 🐠");


  const onChangeLoanAmount = (e: string) => {
    if (e === "") setloanAmount(undefined);
    setloanAmount(Number(e));

    if(Number(e) > 1000000)
    {
      setloanAmount(1000000);
      setStatusMsg("Max limit is 1 million USD")
    }
    else
    {
      setStatusMsg("");
      setloanAmount(Number(e));
    }    
  };

  const onChangeWebsite = (e: string) => {
    if (e === "") setWebsite(undefined);
    setWebsite(e);
  };

  const onChangePoolID = (e: string) => {
    console.log(e);
    if (e === "") setPoolID(Number(1));
    setPoolID(Number(e));
  };
  

  const onChangeVotes = (e: string) => {
    if (e === "") setVotes(undefined);
    setVotes(Number(e));

    if(Number(e) > 1500)
    {
      setVotes(1500);
    }
    else
    {
      setStatusMsg("");
      setVotes(Number(e));
    }    
  };

  const onChangeCompanyName = (e: string) => {
    if (e === "") setcompanyName(undefined);
    setcompanyName(e);
  };

  const onChangeTenure = (e: string) => {
    if (e === "") setTenure(undefined);
    if(Number(e) > 36)
    {
      setTenure(36);
    }
    else
    {
      setTenure(Number(e));
    }
  };  

  const onChangeRate = (e: string) => {
    if (e === "") setinterestRate(undefined);

    if(Number(e) > 15)
    {
      setinterestRate(Number(15));
    }
    else
    {
      setinterestRate(Number(e));
    }

  };  

  const setMaxValue = async () => {

    if (!venomConnect || !address  || !provider) return;

    const userAddress = new Address(address);
  
    const TokenRootContractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0")
    const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);
  
    const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
    const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
    const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();
    const dollar_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(10**2); 

    setloanAmount(Number(12));
  }

  // handler that helps us to ask user about adding our token to the user's venom wallet
  const onTokenAdd = () => {
    console.log(provider?.addAsset({
      account: new Address(address as string), // user's wallet address
      params: {
        rootContract: new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0"), // TokenRoot address
      },
      type: "tip3_token", // tip3 - is a standart we use
    }))
  }

  const onDisconnect = async () => {
    provider?.disconnect();
    window.location.reload();
  };


  const negativeVote = async () => {
    if (!venomConnect || !address || !loanAmount || !poolid || !provider) return;
    const userAddress = new Address(address);
    const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
    const contract = new provider.Contract(GoldFishAbi, contractAddress);
  
    const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
      // another 1 venom for connection. You will receive a change, as you remember
    const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

    const pool_id = (poolid-1);


    try {
        
      // and just call generatecompanyName method according to smart contract
      const result = await contract.methods
        .vote4Pool({
          pool_id : pool_id, 
          userVotes: 100,
          isPositiveVote : false
        } as never)
        .send({
          from: userAddress,
          amount,
          bounce: true,
        });
  
  
      if (result?.id?.lt && result?.endStatus === "active") {
       
        getLiquidity();

        console.log(result);
        setStatusMsg("You have voted 100 Negative votes for  " + companyName + "  USD " + loanAmount + ".00");
     }   
    } catch (e) {
      console.error(e);
    }
  };



  const positiveVote = async () => {
    if (!venomConnect || !address || !poolid  || !loanAmount || !provider) return;
    const userAddress = new Address(address);
    const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
    const contract = new provider.Contract(GoldFishAbi, contractAddress);
  
    const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
      // another 1 venom for connection. You will receive a change, as you remember
    const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();
  
    const pool_id = (poolid-1);

    try {
        
      console.log("Voting Positive");
      // and just call generatecompanyName method according to smart contract
      const result = await contract.methods
        .vote4Pool({
          pool_id : pool_id, 
          userVotes: 100,
          isPositiveVote : true
        } as never)
        .send({
          from: userAddress,
          amount,
          bounce: true,
        });
        
  
      if (result?.id?.lt && result?.endStatus === "active") {
        getLiquidity();

        console.log(result); 
        setStatusMsg("You have voted 100 Positive votes for  " + companyName + "  USD " + loanAmount + ".00");
     }   
    } catch (e) {
      console.error(e);
    }
  };

  

const createBorrowPool = async () => {
  if (!venomConnect || !address || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  try {

    
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .newBarrowPool({
        _loanamount : loanAmount, 
        _interestrate: interestRate,
        _tenure : tenure,
        _companyname: companyName,
        _website: website,
        _votesLimit: votesRequired
      } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });


    if (result?.id?.lt && result?.endStatus === "active") {
     
      console.log(result);
      setStatusMsg("Borrow Pool created by " + companyName + " For the loan amount USD " + loanAmount + ".00");
   }   
  } catch (e) {
    console.error(e);
  }
};

// 123123
// 0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0

const getLiquidity = async () => {
  if (!venomConnect || !address || !poolid || !provider) return;
  
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  try {

    const pool_id = (poolid-1);
    const answerId = 1;

    console.log(pool_id);
    // and just call generatecompanyName method according to smart contract
    
    const {value0: userTokenBalance } = await contract.methods.getBarrowPool({pool_id} as never).call();
    
    borrowPool_.companyname = "AbracaDabra";
    console.log(borrowPool_.companyname);

    console.log(userTokenBalance);

    borrowPool_ = userTokenBalance;

    console.log(borrowPool_.companyname);

    setcompanyName(borrowPool_.companyname);
    setTenure(Number(borrowPool_.tenure));
    setWebsite(borrowPool_.website);
    setVotes(Number(borrowPool_.votesLimit));
    setloanAmount(Number(borrowPool_.loanamount));
    setinterestRate(Number(borrowPool_.interestrate));

    console.log(borrowPool_.creator.toString());
    setBorrowCreator((borrowPool_.creator.toString()));


  
    

    const months = 2;

    const {value0: interestAmount } = await contract.methods.getInterestAmount({pool_id,months} as never).call();
    console.log("Interest Amount " + interestAmount);
    setInterestMonth(Number(interestAmount));


    const {value0: liquidityAmount } = await contract.methods.getLiquidity({_wallet: userAddress} as never).call();
    console.log("Total Liquidity  " + liquidityAmount);
    setLiquidity(Number(liquidityAmount));

    const {value0: poolVotes, value1: NVotes ,value2: TVotes  } = await contract.methods.getVotes({pool_id} as never).call();
    console.log("Votes 1 " + poolVotes);

    setPVotes(poolVotes);
    setNVotes(NVotes);
    setTVotes(TVotes);

    setIsCreator(0);

    if(borrowPool_.creator.toString() == address.toString())
    {
      setIsCreator(Number("1"));
      console.log("Same user" + isCreator);
    }
    else
    {
      console.log("Different user" + isCreator);
    }    

    const {value0: poolStatus_  } = await contract.methods.getPoolStatus({pool_id} as never).call();

    const i = 1;
    const {value0: pool_money } = await contract.methods.getPoolAmount({pool_id} as never).call();
    console.log(pool_id + " Pool money " + pool_money);

    setPoolMoney(Number(pool_money));
    setFullyFunded(0);

    if(borrowPool_.status === "Voting")
    {
      setPoolStatus("0");
      setPoolStatus("Pool is Waiting ⏰");

    }
    else if (borrowPool_.status === "Accepted")
    {
      setPoolStatus("1");
      setPoolStatus("Pool is Accepted 🌟🌟🌟");
    }
    else if (borrowPool_.status === "Rejected")
    {
      setPoolStatus("1");
      setPoolStatus("Pool is Rejected 👎🏼👎🏼👎🏼");
    }  
    else 
    {
      setPoolStatus("1");
      setPoolStatus("Fully Funded 🥳🥳🥳");
      setFullyFunded(1);

    }      

    if(Number(borrowPool_.loanamount) <= Number(pool_money))
    {
      setPoolStatus("1");
      setPoolStatus("Fully Funded 🥳🥳🥳");
      setFullyFunded(1);

    }    
    console.log("Pool Status  " + poolStatus_);

 
    
    

    const support_percentage = 20;
    const percentage = 100;
    const backerAmount = (Number(borrowPool_.loanamount) * support_percentage)/percentage;

    console.log("Backer " + backerAmount);
    console.log("Pool Money " + pool_money);

    setBackerSupported(0);  

    const liquidityTransfer_ = Number(borrowPool_.loanamount) - (Number(pool_money));
    setLiquidityTransfer(0);
   
    console.log("Liquidity Transfer ="+ liquidityTransfer_);



    if(Number(pool_money) >= backerAmount)
    {
      console.log("20% is satisfied");
      console.log("setBackerSupported - " + backerAmount +  pool_money);
      setBackerSupported(1);
      setLiquidityTransfer(liquidityTransfer_);

    }
    if ((Number(pool_money)) > (Number(borrowPool_.loanamount)))
    {
      setLiquidityTransfer(0);
    }
    console.log("Liquidity Transfer ="+ liquidityTransfer_  + " ..." + isBackerSupported);






    const {value0: interestReceivers,value1: interestValues } = await contract.methods.getInterestShare({ } as never).call();

    console.log("Interest Receivers " + interestReceivers);
    console.log("Interest Values " + interestValues);



  } catch (e) {
    console.error(e);
  }
};

const supportProject = async () => {
  if (!venomConnect || !address || !poolid  || !poolStatus || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  const pool_id = (poolid-1);

  if(!poolStatus)
  {
    setStatusMsg("Barrow Pool is not yet ACCEPTED by the community");
    return;
  }
  
  try {
   
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .addSupport({
        amount : loanAmount,
        pool_id : pool_id
        } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });

      if (result?.id?.lt && result?.endStatus === "active")
      {
        console.log(result);
        setStatusMsg("Adding Support to the pool " + borrowPool_.companyname);

        getLiquidity();
        
      }   
  } catch (e) {
    console.error(e);
  }
};


 


const liquidity2BorrowPool = async () => {
  if (!venomConnect || !address || !poolid  || !poolStatus || !liquidityFundTransfer || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(liquidityFundTransfer).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  const pool_id = (poolid-1);

  if(liquidityFundTransfer > 0)
  {
    setStatusMsg("Angel Supporters need to complete 20%");
    return;
  }
  
  try {
   
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .transferFromLiquidity({
        amount : liquidityFundTransfer,
        pool_id : pool_id
        } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });

      if (result?.id?.lt && result?.endStatus === "active")
      {
        console.log(result);
        setStatusMsg("Transfering liquidity amount USD " + liquidityFundTransfer + "  to  " + borrowPool_.companyname);

        getLiquidity();
        
      }   
  } catch (e) {
    console.error(e);
  }
};

const addLiquidity = async () => {
  if (!venomConnect || !address || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  try {

    
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .addLiquidity({
        amount : loanAmount
        } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });


    if (result?.id?.lt && result?.endStatus === "active") {
     
      console.log(result);
      setStatusMsg("Liquidity added to the pool " + loanAmount + ".00");
      getLiquidity();
   }   
  } catch (e) {
    console.error(e);
  }
};

const payInterest = async () => {
  if (!venomConnect || !address || !poolid || !monthly_interest || !provider) 
  {
        setStatusMsg("Click CheckInterest");
  	return;
  }
  
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(monthly_interest).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  const pool_id = (poolid-1);

  try {

    
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .payInterest({
      	pool_id :pool_id,
      	months: 2,
        amount : monthly_interest
        } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });


    if (result?.id?.lt && result?.endStatus === "active") {
     
      console.log(result);
      setStatusMsg("Your interest payment Successful  USD " + monthly_interest + ".00");
      getLiquidity();
   }   
  } catch (e) {
    console.error(e);
  }
};


const getDollarBalance = async () => {
  if (!venomConnect || !address  || !provider) return;

  const userAddress = new Address(address);

  const TokenRootContractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  
  const dollar_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(10**2).toString(); 
  setBalance(dollar_balance);
}

getDollarBalance();

const InterestTransferDollars = async () => {

  if (!venomConnect || !address || !monthly_interest  || !provider)
  {
    console.log("No InterestTransferDollars data");
    return;
  }
   const userAddress = new Address(address);

  const TokenRootContractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  const amount = new BigNumber(monthly_interest).multipliedBy(10 ** 2).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
  const dollar_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(1).toString(); 

  if(dollar_balance < amount)
  {
    setStatusMsg("Insucfficient Balance");
    return;
  }

  setStatusMsg("Waiting for Interest Transfer Approval USD " + monthly_interest + ".00 ");

  const {value0: symbol} = await tokenRootContract.methods.symbol({answerId: 0} as never ).call();
  const {value0: decimals} = await tokenRootContract.methods.decimals({answerId: 0} as never).call();
 
  console.log(symbol + " Decimals" + decimals);
  getDollarBalance();


  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const deployWalletValue = new BigNumber(15).multipliedBy(10 **6).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const payload = '';


  const remainingGasTo = new Address("0:da5e5db1755592b73d27fcdc640d26b251abe0280a0240d06ee79e08f02aa151"); // Our Tokensale contract address



  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const goldFishWallet = new provider.Contract(GoldFishAbi, contractAddress);
  const recipient = goldFishWallet.address;


  const notify = true;
  
 
  try {

    setStatusMsg("💸 Sending USD "+ monthly_interest + " as monthly re-payment");

    // Transfer Rupees method according to smart contract
    const result = await contract.methods
      .transfer({
        amount, recipient,deployWalletValue,remainingGasTo,notify,payload
      } as never)
      .send({
        from: userAddress,
        amount: gas,
        bounce: true,
      });



    if (result?.id?.lt && result?.endStatus === "active") {

      const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

      setStatusMsg("Interest payment of USD " + monthly_interest + " successful 💰");

      payInterest();
       

      console.log(result);

      getDollarBalance();
    }
  } catch (e) {
    
    setStatusMsg("Use rejected the transaction");

  }
  

};


const SupportTransferDollars = async () => {

  if (!venomConnect || !address || !loanAmount  || !provider) return;
  const userAddress = new Address(address);

  const TokenRootContractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  const amount = new BigNumber(loanAmount).multipliedBy(10 ** 2).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
  const dollar_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(1).toString(); 

  if(dollar_balance < amount)
  {
    setStatusMsg("Insucfficient Balance");
    return;
  }

  setStatusMsg("Waiting for 👰🏻‍♀️ Angel Support transfer Approval USD " + loanAmount + ".00 ");

  const {value0: symbol} = await tokenRootContract.methods.symbol({answerId: 0} as never ).call();
  const {value0: decimals} = await tokenRootContract.methods.decimals({answerId: 0} as never).call();
 
  console.log(symbol + " Decimals" + decimals);
  getDollarBalance();


  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const deployWalletValue = new BigNumber(15).multipliedBy(10 **6).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const payload = '';


  const remainingGasTo = new Address("0:da5e5db1755592b73d27fcdc640d26b251abe0280a0240d06ee79e08f02aa151"); // Our Tokensale contract address

  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const goldFishWallet = new provider.Contract(GoldFishAbi, contractAddress);
  const recipient = goldFishWallet.address;


  const notify = true;
  
 
  try {

    setStatusMsg("👰🏻‍♀️ An Angel is Sending 💸  Support amount USD "+ loanAmount + " towards Borrow Pool of " + borrowPool_.website);

    // Transfer Rupees method according to smart contract
    const result = await contract.methods
      .transfer({
        amount, recipient,deployWalletValue,remainingGasTo,notify,payload
      } as never)
      .send({
        from: userAddress,
        amount: gas,
        bounce: true,
      });



    if (result?.id?.lt && result?.endStatus === "active") {

      const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

      setStatusMsg("Transaction registration started.....");

      supportProject();
       

      console.log(result);

      getDollarBalance();
    }
  } catch (e) {
    
    setStatusMsg("Use rejected the transaction");
  }   

};

const claimUserProfit = async () => {

  if (!venomConnect || !address || !loanAmount  || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();
  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  
  try {

    setStatusMsg("💸 Claiming Profit from the interest re-payments");

    const claimAmount = Math.floor(Math.random() * 1000);

    console.log("Claiming amount "+ claimAmount);

    // Transfer Rupees method according to smart contract
    const result = await contract.methods
      .claimProfit({
        amount : claimAmount
      } as never)
      .send({
        from: userAddress,
        amount: gas,
        bounce: true,
      });



    if (result?.id?.lt && result?.endStatus === "active") {

      const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

      setStatusMsg("Claim Successful");
       

      console.log(result);

      getDollarBalance();
    }
  } catch (e) {
    
    console.log(e);
    setStatusMsg("Use rejected the transaction" );


  }

   

};


const borrowFund = async () => {

  if (!venomConnect || !address || !loanAmount  || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const contract = new provider.Contract(GoldFishAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();
  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  
  try {

    setStatusMsg("💸 Withdraw from Borrow Pool ");

    const claimAmount = loanAmount; //Math.floor(Math.random() * 1000);

    console.log("Claiming amount "+ claimAmount);

    // Transfer Rupees method according to smart contract
    const result = await contract.methods
      .claimProfit({
        amount : claimAmount
      } as never)
      .send({
        from: userAddress,
        amount: gas,
        bounce: true,
      });



    if (result?.id?.lt && result?.endStatus === "active") {

      const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

      setStatusMsg("Withdraw Successful");
      

      console.log(result);

      getDollarBalance();
    }
  } catch (e) {
    
    console.log(e);
    setStatusMsg("Use rejected the transaction" );
  }  
};

const LiquidityTransferDollars = async () => {

  if (!venomConnect || !address || !loanAmount  || !provider) return;
  const userAddress = new Address(address);

  const TokenRootContractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  const amount = new BigNumber(loanAmount).multipliedBy(10 ** 2).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
  const dollar_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(1).toString(); 

  if(dollar_balance < amount)
  {
    setStatusMsg("Insucfficient Balance");
    return;
  }

  setStatusMsg("Waiting for Liquidity transfer Approval USD " + loanAmount + ".00 ");

  const {value0: symbol} = await tokenRootContract.methods.symbol({answerId: 0} as never ).call();
  const {value0: decimals} = await tokenRootContract.methods.decimals({answerId: 0} as never).call();
 
  console.log(symbol + " Decimals" + decimals);
  getDollarBalance();


  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const deployWalletValue = new BigNumber(15).multipliedBy(10 **6).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const payload = '';


  const remainingGasTo = new Address("0:da5e5db1755592b73d27fcdc640d26b251abe0280a0240d06ee79e08f02aa151"); // Our Tokensale contract address
  //const contractAddress = new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0"); // Our Tokensale contract address
  //const tokenRupee = new provider.Contract(Dollar, contractAddress);


  const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address
  const goldFishWallet = new provider.Contract(GoldFishAbi, contractAddress);
  const recipient = goldFishWallet.address;

  const notify = true;
  
 
  try {

    setStatusMsg("💸 Sending USD "+ loanAmount + " to the Liquidity");

    // Transfer Rupees method according to smart contract
    const result = await contract.methods
      .transfer({
        amount, recipient,deployWalletValue,remainingGasTo,notify,payload
      } as never)
      .send({
        from: userAddress,
        amount: gas,
        bounce: true,
      });



    if (result?.id?.lt && result?.endStatus === "active") {

      const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

      setStatusMsg("Liquidity Transaction registration is in progress....");

      addLiquidity();
       

      console.log(result);

      getDollarBalance();
    }
  } catch (e) {
    
    setStatusMsg("Use rejected the transaction");


  }

   

};

  const withDrawTokens = async () => {

    if (!venomConnect || !address || !companyName || !provider) return;
    const userAddress = new Address(address);
    const contractAddress1 = new Address("0:fac0dea61ab959bf5fc5d325b6ef97ef45ef371c8649042e92b64e46c3c854d5"); // Our Tokensale contract address

    const contractAddress = new Address("0:e12f91b73b66240dac499e95a956e80789cfcdaa7fbac1d1c0bb21eee2304bb0"); // Our Tokensale contract address

    const contract = new provider.Contract(GoldFishAbi, contractAddress);

    setStatusMsg("Withdraw of USD started");


    var _secret_code = companyName;
    const amount = new BigNumber(1).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();;
    setcompanyNameDisplay(_secret_code);

    try {
      setStatusMsg("Withdraw of USD is in progress.....");

      // withDrawTokens method according to smart contract
      const result = await contract.methods
        .withDrawTokens({
          _secret_code 
        } as never)
        .send({
          from: userAddress,
          amount,
          bounce: true,
        });


      if (result?.id?.lt && result?.endStatus === "active") {
        setStatusMsg("Withdraw Success !");
        getDollarBalance();
      }
    } catch (e) {
      console.error(e);
    }

  };
  return (
    <>
      <h1>GoldFish Finance 🐠  🔜  <span className="item-price">{ poolStatus } </span><br></br>
      Community Voted, Zero Collateral Loan<br></br>
      </h1>
      <div className="item-info">
      <a className="item-price" href="http://bit.ly/goldfish-5871748"><h2>👉🏼 How to use? 👈🏻</h2></a>

      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={createBorrowPool}>
        Create Borrow Pool 💰
      </a>  

      <a className={!poolid ? "btn disabled" : "btn"} onClick={getLiquidity}>
         Get Pool Status 📚
      </a>    

      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={SupportTransferDollars}>
          Support Project 🪙
      </a>          
      
      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={LiquidityTransferDollars}>
        Add Liquidity 💸
      </a>

      </div>      
      <div className="item-msg">
        <span>{statusMsg}</span>
      </div>      
      <div className="item-price"><span><b>
      {(monthly_interest) ? 
       "🏦 Total Senior Liquidity USD " + all_liquidity+ "   | 👰🏻‍♀️💰 Total Borrow Pool Amount USD "+  poolMoney 
         : " "
      }

    {(isBackerSupported) ? 
       "👰🏻‍♀️💰 Supporters Funding above 20%"
         : " "
      }
       
      </b></span>
      </div>
      <div className="item-info">
        <span>Borrow Pool Owner <b>{ borrowCreator }</b></span>
      </div>      
      <div className="item-info">
        <span>Loan Amount</span>&nbsp;  <span>Pool ID</span>&nbsp;<span>Website</span>&nbsp;
      </div>
      <div className="item-info">
        <input
            type="text"
            value={loanAmount !== undefined ? loanAmount : ""}
            onChange={(e) => {
              onChangeLoanAmount(e.target.value);
            }}
            maxLength={75}            
          />

        <input
            type="text"
            value={poolid !== undefined ? poolid : ""}
            onChange={(e) => {
              onChangePoolID(e.target.value);
            }}
            maxLength={3}            
          />           
        <input
            type="text"
            value={website !== undefined ? website : ""}
            onChange={(e) => {
              onChangeWebsite(e.target.value);
            }}
            maxLength={25}            
          />               
      </div> 
      <div className="item-info">
        <span className="vote" onClick={positiveVote}>👍🏻 ✅ <b>{postiveVotes}</b></span>&nbsp;<span  className="vote"><b>Total Votes:{totalVotes}</b></span><span className="vote" onClick={negativeVote}> 🚫👎🏼<b>{negativeVotes}</b></span>
      </div>         
     
      <div className="item-price">
       <span><b>Two months Interest Rate USD {monthly_interest}</b></span>&nbsp;
      </div>
           
      <div className="item-info">
      <span>Tenure</span>&nbsp;  <span>Votes Required</span>&nbsp;<span>Interest Rate % </span>&nbsp;
      </div>
        <div className="item-info">
          <input
            type="number"
            min={0}
            value={tenure !== undefined ? tenure : ""}
            onChange={(e) => {
              onChangeTenure(e.target.value);
            }}
            maxLength={5}           
           />&nbsp;&nbsp;
      
      <input
            type="number"
            min={0}
            value={votesRequired !== undefined ? votesRequired : ""}
            onChange={(e) => {
              onChangeVotes(e.target.value);
            }}
            maxLength={4}           
           />&nbsp;&nbsp;

           <input
            type="number"
            min={0}
            value={interestRate !== undefined ? interestRate : ""}
            onChange={(e) => {
              onChangeRate(e.target.value);
            }}
            maxLength={5}           
           />&nbsp;&nbsp;
      </div>

      <div className="item-info">
        <span>Company Name </span>&nbsp;
      </div>
      <div className="item-info">
      <textarea name="postContent" rows={2} cols={60}
       value={companyName !== undefined ? companyName : ""}
       
       onChange={(e) => {
        onChangeCompanyName(e.target.value);
      }}       
       />
      </div> 

      <div className="item-info">


      <a className={!tenure ? "btn disabled" : "btn"} onClick={liquidity2BorrowPool}>
          Approve from Liquidity 💹
      </a>  
      <a className={!fullFunded ? "btn disabled" : "btn"} onClick={borrowFund}>
          Withdraw Barrow Amount 💹 
      </a>    
      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={claimUserProfit}>
        Claim Profit 🤑
      </a>  
     
      <a className={(!isCreator || !monthly_interest) ? "btn disabled" : "btn"} onClick={InterestTransferDollars}>
          Pay Interest 🏦
        </a>   
        <a className={"btn"} onClick={onDisconnect}>
          Logout 🔓
        </a>  
      </div>      
    
    </>
  );
}

export default SaleForm;
