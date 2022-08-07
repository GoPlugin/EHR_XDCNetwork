import { ethers } from 'ethers';

import {
  EHR as ehraddress,
} from '../deploy.json';

import { abi as ehrabi } from '../artifacts/contracts/EHR.sol/EHR.json';

export function createInstance(provider, name) {
  if (name === "EHR") {
    return new ethers.Contract(ehraddress, ehrabi, provider);
  }
}
