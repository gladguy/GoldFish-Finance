import React from 'react';
import { VenomConnect } from 'venom-connect';

type Props = {
  venomConnect: VenomConnect | undefined;
};

function ConnectWallet({ venomConnect }: Props) {
  const login = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };
  return (
    <div>
      <>

        <h1>GoldFish Finance 🐠 <br></br> Community Voted,  Zero Collateral Loan</h1>
        <a className="btn" onClick={login}>
          Connect wallet 🐠  
        </a>
        <p className='vote'>
        🐠 🐠 🐠 🐠 Stake Holders 🐠 🐠 🐠 🐠<hr></hr> 
        🙋🏾‍♂️ - 💵 -Barrowers  - Create Barrowing Pool(LOAN)<hr></hr>
        👰🏻‍♀️ - 🛄 -Angel Supporters  - Early Supporters of LOAN<hr></hr>
        🤵🏻‍♀️ - 💰 -Investors  - Invest in Barrowing Pool <hr></hr>
        👨‍👩‍👦‍👦 - 🗳️ -Community Voters - Who Audits Barrowing Pool Profile
        </p>

      </>
    </div>
  );
}
  
export default ConnectWallet;
  