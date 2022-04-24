import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from "react";
import { Connection, Transaction, Signer } from "@solana/web3.js";
import axios from "axios";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";

const Lust: FC = () => {
  const wallet = useWallet();
  
  const [lust, setLust] = useState("0");
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  const getLust = async () => {
    const response = await axios({
      url: `http://localhost:5001/balance/${wallet.publicKey}`,
      method: "get",
    });
    setLust(response.data);
  };

  const withdrawLust = async () => {
    if (Number(lust) == 0) return toast.warn('Not enough earnings');
    setWaiting(true);
    toast.info("Sending transaction...");
    try {
      await axios({
        url: "http://localhost:5001/withdraw",
        method: "post",
        data: {
          publicKey: wallet.publicKey,
        },
      });
      setWaiting(false);
      await getLust();
      toast.success("Withdrawn successfully");
    } catch (err: any)  {
      setWaiting(false);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!wallet.connected) return setLoading(true);
    const initialize = async () => {
      await getLust();
      setLoading(false);
    };
    initialize();
  }, [wallet.connected]);

  return (
    <div className="Container">
      {!loading ? (
        <div className="Manager">
          <h2>Amount: {String(lust)}</h2>
          <button onClick={withdrawLust} disabled={waiting}>
            Withdraw
          </button>
        </div>
      ) : (
        <h2>Connect wallet to begin</h2>
      )}

      <div className="Wallet">
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Lust;
