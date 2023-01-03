/* eslint-disable */
const Xdc3 = require("xdc3");
//const web3 = new Xdc3()
require("dotenv").config();
const h = require("chainlink-test-helpers");
const express = require('express')
const bodyParser = require('body-parser');
//const app = express()
const port = process.env.EA_PORT || 5001
const gasLimit = 200000


const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider(process.env.CONNECTION_URL)
);
const expectedBlockTime = 3000;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const requestorABI = require("./ABI/ECA.json");
const requestorcontractAddr = process.env.REQUESTOR_CONTRACT;
const deployed_private_key = process.env.PRIVATE_KEY;

const  getTxnStatus = async (txHash,web3) => {
  let transactionReceipt = null
  while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
    transactionReceipt = await xdc3.eth.getTransactionReceipt(txHash);
    await sleep(expectedBlockTime)
  }
  console.log("Got the transaction receipt: ", transactionReceipt, transactionReceipt.status)
  if (transactionReceipt.status) {
    return [txHash, true];
  } else {
    return [txHash, false];
  }
}
//app.use(bodyParser.json())

module.exports.registerPatient = async (data) => {

  //console.log("request value is", req);
  const patientName = data.name;
  const patientMobile = data.mobile;
  const patientDob = data.dob;
  const patientEmail = data.email;
  const patientPass = data.password;  
  const patientId = data.userID; 


  console.log("patientName, ", patientName);
  console.log("patientMobile, ", patientMobile);
  console.log("patientDob, ", patientDob);
  console.log("patientEmail, ", patientEmail);
  console.log("patientPass, ", patientPass);
  console.log("patientPass, ", patientId);
  
  
  // // //Defining requestContract
  //console.log("ABI", requestorABI);
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  // console.log("requestContract",requestContract)
  
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  // console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();
  console.log("gasPrice before",gasPrice)

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatient(patientName, patientMobile, patientDob, patientEmail, patientPass, patientId).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  //const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;
  console.log("gasPrice", gasPrice);
  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  )

  console.log("gasPrice", gasPrice);
  const returnData = await new Promise((resolve, reject) => {
    const txt = xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on("transactionHash", async function (transactionHash){
    const [txhash, status] = await getTxnStatus(transactionHash, xdc3)
    console.log("`tx`h",txhash)
    resolve({txhash,status})
  })
  });
  return returnData;
}

module.exports.registerPatientGeo = async (data) => {

  const city = data.city;
  const state = data.state;
  const country = data.country;
  const landmark = data.landmark;
  const patId = data.userID;
  const picHash = data.photo;
  const pincode = data.pincode;

  console.log("City, ", city);
  console.log("State, ", state);
  console.log("country, ", country);
  console.log("landmark, ", landmark);
  console.log("pincode, ", pincode);
  console.log("patId, ", patId);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatientGeo(city, state, country, landmark, patId, picHash, pincode).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  //const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const returnData = await new Promise((resolve, reject) => {
    const txt = xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on("transactionHash", async function (transactionHash){
    const [txhash, status] = await getTxnStatus(transactionHash, xdc3)
    console.log("`tx`h",txhash)
    resolve({txhash,status})
  })
  });
  return returnData;
}

module.exports.registerPatientHealth = async (data) => {

  const allergies = data.allergic;
  const lifesaver = data.lifeInfo;
  const patId = data.userID;
  const bloodType = data.bloodGroup;
  const height = data.height;
  const weight = data.weight;

  console.log("allergies, ", allergies);
  console.log("lifesaver, ", lifesaver);
  console.log("patId, ", patId);
  console.log("bloodType, ", bloodType);
  console.log("height, ", height);
  console.log("weight, ", weight);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatientHealth(allergies, lifesaver, patId, bloodType, height, weight).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  //const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const returnData = await new Promise((resolve, reject) => {
    const txt = xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on("transactionHash", async function (transactionHash){
    const [txhash, status] = await getTxnStatus(transactionHash, xdc3)
    console.log("`tx`h",txhash)
    resolve({txhash,status})
  })
  });
  return returnData;

}

module.exports.registerCareGiver = async (data) => {

  const patId = data.userID;
  const careGiverName = data.name;
  const careGiverMobile = data.mobile;
  const careGiverRelation = data.relation;
  const pos = data.pos;

  console.log("patId, ", patId);
  console.log("careGiverName, ",careGiverName);
  console.log("careGiverMobile, ", careGiverMobile);
  console.log("careGiverRelation, ", careGiverRelation);
  console.log("pos, ", pos);


  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerCareGiver(patId, careGiverName, careGiverMobile, careGiverRelation, pos).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  //const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const returnData = await new Promise((resolve, reject) => {
    const txt = xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on("transactionHash", async function (transactionHash){
    const [txhash, status] = await getTxnStatus(transactionHash, xdc3)
    console.log("`tx`h",txhash)
    resolve({txhash,status})
  })
  });
  return returnData;

}

module.exports.recordAddByPatient = async (data) => {


  const patId = data.userID;
  const recordLoc = data.fileUrl;
  const recordName = data.fileName;
  const recordDesc = data.fileDesc;
  const recordType = data.fileType;

  console.log("patId, ", patId);
  console.log("recordHash, ", recordLoc);
  console.log("recordName, ", recordName);
  console.log("accType, ", recordDesc);
  console.log("accType, ", recordType);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.recordAddByPatient(patId,recordLoc,recordName,recordDesc,recordType).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };


  //const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const returnData = await new Promise((resolve, reject) => {
    const txt = xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on("transactionHash", async function (transactionHash){
    const [txhash, status] = await getTxnStatus(transactionHash, xdc3)
    console.log("`tx`h",txhash)
    resolve({txhash,status})
  })
  });
  return returnData;
}