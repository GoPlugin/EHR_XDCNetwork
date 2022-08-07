import { EthereumContext } from '../eth/context';
import { connectWallet } from '../eth/connect';
import { createInstance } from '../eth/abiartifacts';
import { ethers } from 'ethers';
import { log } from '../service/service';

import './App.css';
import EHR from './EHR/EHR';

import { useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [connecting, setconnecting] = useState(false);
  const [ethereumContext, setethereumContext] = useState({});

  log("APP", "Open", [process.env, process.env.REACT_APP_EXPLORER])

  const connect = async (event) => {
    event.preventDefault();
    const instance = await connectWallet();
    const provider = new ethers.providers.Web3Provider(instance);
    const ehr = createInstance(provider, "EHR");
    const signer = provider.getSigner();
    const account = signer.getAddress();
    setethereumContext({ provider, ehr, account })
    log("Connect", "Get Address", await signer.getAddress());

    setconnecting(true);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>EHR Decentralized Application</h1>
        <p>Powered by PLI in XDC Network</p>
        <form onSubmit={connect}>
          <button type="submit" disabled={connecting}>{connecting ? 'Connecting...' : 'Connect'}</button>
        </form>
      </header>
      <section className="App-content">
        <EthereumContext.Provider value={ethereumContext}>
          <EHR />
        </EthereumContext.Provider>
      </section>
      <ToastContainer hideProgressBar={true} />
    </div>
  );
}

export default App;
