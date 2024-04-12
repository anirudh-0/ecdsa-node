import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <label>
        Signature
        <input
          placeholder="Type an address, for example: 0x1"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        ></input>
      </label>
      <Transfer
        setBalance={setBalance}
        address={address}
        signature={signature}
      />
    </div>
  );
}

export default App;
