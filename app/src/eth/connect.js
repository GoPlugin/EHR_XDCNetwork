/* eslint-disable no-unused-vars */
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";

export async function connectWallet() {

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpcUrl: "https://rpc.apothem.network",
      }
    },
    torus: {
      package: Torus, // required
      options: {
        config: {
          buildEnv: "devlopment" // optional
        },
        network: "mumbai"
      }
    }

  };
  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  const providerConnect = await web3Modal.connect();

  return providerConnect
}