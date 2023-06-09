import React, { useState } from "react";
import { VenomConnect } from "venom-connect";
import { Address, ProviderRpcClient,Contract } from "everscale-inpage-provider";

 

 

// we will user bignumber library to operate with deposit values (remember about decimals multiply)
import BigNumber from "bignumber.js";

// Importing of our contract ABI from smart-contract build action. Of cource we need ABI for contracts calls.
import tokenSaleAbi from "../abi/Tokensale.abi.json";

import WenomUnionAbi from "../abi/GoldFish.abi.json";

import TokenWallet from "../abi/TokenWallet.abi.json";
import TokenRootAbi from "../abi/TokenRoot.abi.json";

import IndianRupee from "../abi/IndiaRupee.abi.json";
import AddTokenImg from "../styles/img/add_token.svg";

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


  const [barrowCreator, setBarrowCreator] = useState<string | undefined>();

  const [all_liquidity, setLiquidity] = useState<number | undefined>();
  const [postiveVotes, setPVotes] = useState<number | undefined>();
  const [negativeVotes, setNVotes] = useState<number | undefined>();
  const [totalVotes, setTVotes] = useState<number | undefined>();
  const [barrow_amount, setBarrowAmount] = useState<number | undefined>();
  const [monthly_interest, setInterestMonth] = useState<number | undefined>(0);


  const [RupeeBalance, setBalance] = useState<string | undefined>("0");
  const [companyNameDisplay, setcompanyNameDisplay] = useState<string | undefined>("");


  var barrowPool_ = {
    "loanamount": "50000",
    "interestrate": "12",
    "tenure": "12",
    "companyname": "Venom Corporation",
    "website": "Venom.com",
    "votesLimit": "500",
    "status": "Voting",
    "creator": "0:2f35c41d7a709631fd27b20e9d78d3b36ea3f82008987698bb7e7bbd7f9bc76a"
};

  const [statusMsg, setStatusMsg] = useState<string | undefined>("Enter the amount for transfer or To Withdraw secret code");


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

    if(Number(e) > 500)
    {
      setVotes(500);
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
    if(Number(e) > 24)
    {
      setTenure(24);
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
  
    const TokenRootContractAddress = new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b")
    const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);
  
    const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
    const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
    const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();
    const inr_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(10**2); 

    setloanAmount(Number(12));
  }

  // handler that helps us to ask user about adding our token to the user's venom wallet
  const onTokenAdd = () => {
    console.log(provider?.addAsset({
      account: new Address(address as string), // user's wallet address
      params: {
        rootContract: new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b"), // TokenRoot address
      },
      type: "tip3_token", // tip3 - is a standart we use
    }))
  }

  const onDisconnect = async () => {
    provider?.disconnect();
    window.location.reload();
  };


  const negativeVote = async () => {
    if (!venomConnect || !address || !loanAmount || !provider) return;
    const userAddress = new Address(address);
    const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
    const contract = new provider.Contract(WenomUnionAbi, contractAddress);
  
    const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
      // another 1 venom for connection. You will receive a change, as you remember
    const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();
  
    try {
        
      // and just call generatecompanyName method according to smart contract
      const result = await contract.methods
        .vote4Pool({
          pool_id : poolid, 
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
    if (!venomConnect || !address || !loanAmount || !provider) return;
    const userAddress = new Address(address);
    const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
    const contract = new provider.Contract(WenomUnionAbi, contractAddress);
  
    const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
      // another 1 venom for connection. You will receive a change, as you remember
    const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();
  
    try {
        
      console.log("Voting Positive");
      // and just call generatecompanyName method according to smart contract
      const result = await contract.methods
        .vote4Pool({
          pool_id : poolid, 
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

  

const createBarrowPool = async () => {
  if (!venomConnect || !address || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
  const contract = new provider.Contract(WenomUnionAbi, contractAddress);

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
      setStatusMsg("Barrow Pool created by " + companyName + "For the loan amount USD " + loanAmount + ".00");
   }   
  } catch (e) {
    console.error(e);
  }
};

// 123123
// 0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997

const getLiquidity = async () => {
  if (!venomConnect || !address || !poolid || !provider) return;
  
  const userAddress = new Address(address);
  const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
  const contract = new provider.Contract(WenomUnionAbi, contractAddress);

  try {

    const pool_id = poolid;
    const answerId = 1;

    console.log(pool_id);
    // and just call generatecompanyName method according to smart contract
    
    const {value0: userTokenBalance } = await contract.methods.getBarrowPool({pool_id} as never).call();
    
    barrowPool_.companyname = "Bummy";
    console.log(barrowPool_.companyname);

    console.log(userTokenBalance);

    barrowPool_ = userTokenBalance;

    console.log(barrowPool_.companyname);

    setcompanyName(barrowPool_.companyname);
    setTenure(Number(barrowPool_.tenure));
    setWebsite(barrowPool_.website);
    setVotes(Number(barrowPool_.votesLimit));
    setloanAmount(Number(barrowPool_.loanamount));
    setinterestRate(Number(barrowPool_.interestrate));

    console.log(barrowPool_.creator.toString());
    setBarrowCreator((barrowPool_.creator.toString()));

    const months = 1;

    const {value0: interestAmount } = await contract.methods.getInterestAmount({pool_id,months} as never).call();
    console.log("Interest Amount " + interestAmount);
    setInterestMonth(Number(interestAmount));


    const {value0: liquidityAmount } = await contract.methods.getLiquidity({_wallet: userAddress} as never).call();
    console.log("Total Liquidity  " + liquidityAmount);
    setLiquidity(Number(liquidityAmount));

    const {value0: poolVotes, value1: NVotes ,value2: TVotes  } = await contract.methods.getVotes({pool_id} as never).call();
    console.log("Votes  " + poolVotes);

    setPVotes(poolVotes);
    setNVotes(NVotes);
    setTVotes(TVotes);


    const {value0: poolStatus_  } = await contract.methods.getPoolStatus({pool_id} as never).call();
    console.log("Pool Status  " + poolStatus_);
    //123123
    if(poolStatus_){
      setPoolStatus("Pool is successful 🌟🌟🌟");
    } 
    else
    {
      setPoolStatus("Pool is Waiting ⏰");
    }
    
    

    const {value0: pool_money } = await contract.methods.getPoolAmount({pool_id} as never).call();
    console.log("Pool money " + pool_money);
 



  } catch (e) {
    console.error(e);
  }
};

const supportProject = async () => {
  if (!venomConnect || !address || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
  const contract = new provider.Contract(WenomUnionAbi, contractAddress);

  const deposit = new BigNumber(loanAmount).multipliedBy(1 ** 1).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
    // another 1 venom for connection. You will receive a change, as you remember
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();

  try {
   
    // and just call generatecompanyName method according to smart contract
    const result = await contract.methods
      .addSupport({
        amount : loanAmount,
        pool_id : poolid
        } as never)
      .send({
        from: userAddress,
        amount,
        bounce: true,
      });

      if (result?.id?.lt && result?.endStatus === "active")
      {
        console.log(result);
        setStatusMsg("Adding Support to the pool" + poolid);
      }   
  } catch (e) {
    console.error(e);
  }
};

const addLiquidity = async () => {
  if (!venomConnect || !address || !loanAmount || !provider) return;
  const userAddress = new Address(address);
  const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address
  const contract = new provider.Contract(WenomUnionAbi, contractAddress);

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
      setStatusMsg("Adding liquidity to the pool");
      getLiquidity();
   }   
  } catch (e) {
    console.error(e);
  }
};



const getBalanceINR = async () => {
  if (!venomConnect || !address  || !provider) return;

  const userAddress = new Address(address);

  const TokenRootContractAddress = new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  
  const inr_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(10**2).toString(); 
  setBalance(inr_balance);
}

getBalanceINR();

const TransferINR = async () => {

  if (!venomConnect || !address || !loanAmount  || !provider) return;
  const userAddress = new Address(address);








  const TokenRootContractAddress = new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b")
  const tokenRootContract = new provider.Contract(TokenRootAbi, TokenRootContractAddress);

  const {value0: userTokenWalletAddress} = await tokenRootContract.methods.walletOf({answerId: 0, walletOwner: userAddress} as never).call();
  const contract = new provider.Contract(TokenWallet, userTokenWalletAddress);
  const {value0: userTokenBalance } = await contract.methods.balance({answerId: 0} as never).call();

  const amount = new BigNumber(loanAmount).multipliedBy(10 ** 2).toString(); // Contract"s rate parameter is 1 venom = 10 tokens
  const inr_balance = new BigNumber(userTokenBalance).dividedToIntegerBy(1).toString(); 

  if(inr_balance < amount)
  {
    setStatusMsg("Insucfficient Balance");
    return;
  }

  setStatusMsg("Waiting for Transfer Approval INR " + loanAmount + ".00 ");

  const {value0: symbol} = await tokenRootContract.methods.symbol({answerId: 0} as never ).call();
  const {value0: decimals} = await tokenRootContract.methods.decimals({answerId: 0} as never).call();
 

  getBalanceINR();


  const gas = new BigNumber(15).multipliedBy(10 ** 7).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const deployWalletValue = new BigNumber(15).multipliedBy(10 **6).toString(); // Contract"s rate parameter is 1 venom = 10 tokens

  const payload = '';


  const remainingGasTo = new Address("0:da5e5db1755592b73d27fcdc640d26b251abe0280a0240d06ee79e08f02aa151"); // Our Tokensale contract address
  const contractAddress = new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b"); // Our Tokensale contract address
  const tokenRupee = new provider.Contract(IndianRupee, contractAddress);

  const recipient = tokenRupee.address;

  const notify = true;


  
 
  try {

    setStatusMsg("Transaction is in progress....");

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

      setStatusMsg("Secret Code generation in started");

       

      console.log(result);

      getBalanceINR();
    }
  } catch (e) {
    
    setStatusMsg("Use rejected the transaction");


  }

   

};

  const withDrawTokens = async () => {

    if (!venomConnect || !address || !companyName || !provider) return;
    const userAddress = new Address(address);
    const contractAddress1 = new Address("0:fac0dea61ab959bf5fc5d325b6ef97ef45ef371c8649042e92b64e46c3c854d5"); // Our Tokensale contract address

    const contractAddress = new Address("0:d286cf09d2cb12ea2e19e1fbb9a9074120be659c1aa53ac0a2f894eb913b6997"); // Our Tokensale contract address

    const contract = new provider.Contract(WenomUnionAbi, contractAddress);

    setStatusMsg("Withdraw of INR started");


    var _secret_code = companyName;
    const amount = new BigNumber(1).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();;
    setcompanyNameDisplay(_secret_code);

    try {
      setStatusMsg("Withdraw of INR is in progress.....");

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
        getBalanceINR();
      }
    } catch (e) {
      console.error(e);
    }

  };
  return (
    <>
      <h1>GoldFish Finance 🐠  🔜  { poolStatus } <br></br>
      Community Voted, Zero Collateral Loan<br></br>
      </h1>
      <div className="item-info">
      <a className="item-price" href="http://bit.ly/goldfish-5871748"><h2>👉🏼 How to use? 👈🏻</h2></a>

      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={createBarrowPool}>
        Create Barrow Pool 💰
      </a>  

      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={addLiquidity}>
      Add Liquidity 💸
        </a>
      <a className={!poolid ? "btn disabled" : "btn"} onClick={getLiquidity}>
         Get Pool Status 📚
      </a>                 

      </div>      
      <div className="item-msg">
        <span>{statusMsg}</span>
      </div>      
      <div className="item-price">
        <span><b>Total Senior Liquidity USD {all_liquidity} </b></span>
         
      </div>
      <div className="item-info">
        <span>Barrow Pool Owner <b>{ barrowCreator }</b></span>
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
      <textarea name="postContent" rows={3} cols={60}
       value={companyName !== undefined ? companyName : ""}
       
       onChange={(e) => {
        onChangeCompanyName(e.target.value);
      }}       
       />
      </div> 

      <div className="item-info">

      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={supportProject}>
          Support Project 🪙
      </a>          
      
        <a className={!tenure ? "btn disabled" : "btn"} onClick={withDrawTokens}>
          Check Interest 💹
        </a>         
      <a className={!loanAmount ? "btn disabled" : "btn"} onClick={withDrawTokens}>
          Pay Interest 🏦
        </a> 
        <a className={!poolid ? "btn disabled" : "btn"} onClick={onDisconnect}>
          Logout 🔓
        </a>  
      </div>      
    
    </>
  );
}

export default SaleForm;
