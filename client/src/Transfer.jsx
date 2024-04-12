import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function hashMessage(message) {
  const hash = keccak256(utf8ToBytes(message));
  return toHex(hash);
}

function Transfer({ address, setBalance, signature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      Sign the following hash with your key to transfer
      <code className="hash">
        {hashMessage(
          JSON.stringify({
            sender: address,
            amount: parseInt(sendAmount),
            recipient,
          })
        )}
      </code>
      <input
        disabled={!signature}
        type="submit"
        className="button"
        value="Transfer"
      />
    </form>
  );
}

export default Transfer;
