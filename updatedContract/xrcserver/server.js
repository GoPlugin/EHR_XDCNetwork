/* eslint-disable */
const Xdc3 = require("xdc3");
require("dotenv").config();
const h = require("chainlink-test-helpers");
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.EA_PORT || 5001

const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider(process.env.CONNECTION_URL)
);

const requestorABI = require("./ABI/EHR.json");
const requestorcontractAddr = process.env.REQUESTOR_CONTRACT;
const deployed_private_key = process.env.PRIVATE_KEY;

app.use(bodyParser.json())

app.post('/api/registerPatients', async (req, res) => {

  console.log("request value is", req.body, req.body[1], req.body[3])
  const patientName = req.body[1];
  const patientEmail = req.body[2];
  const patientMobile = req.body[3];
  const patientPass = req.body[4];
  const stateChange = req.body[5];

  //const buyer = req.body[1];
  //const amountPaid = req.body[3];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  //const jobId = process.env.JOB_ID;
  //const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;

  console.log("patientName, ", patientName);
  console.log("patientEmail, ", patientEmail);
  console.log("patientMobile, ", patientMobile);
  console.log("patientPass, ", patientPass);
  console.log("stateChange, ", stateChange);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatients(patientName, patientEmail, patientMobile, patientMobile, patientPass, stateChange).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/registerDoctor', async (req, res) => {

  console.log("request value is", req.body, req.body[1], req.body[3])
  const doctorName = req.body[1];
  const doctorEmail = req.body[2];
  const doctorMobile = req.body[3];
  const doctorPass = req.body[4];
  const stateChange = req.body[5];
  // const buyer = req.body[1];
  // const amountPaid = req.body[3];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  //const jobId = process.env.JOB_ID;
  //const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;

  console.log("doctorName, ", doctorName);
  console.log("doctorEmail, ", doctorEmail);
  console.log("doctorMobile, ", doctorMobile);
  console.log("doctorPass, ", doctorPass);
  console.log("stateChange, ", stateChange);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerDoctor(doctorName, doctorEmail, doctorMobile, doctorPass, stateChange).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/registerPatientLoc', async (req, res) => {

  const city = req.body[1];
  const state = req.body[2];
  const country = req.body[3];
  const landmark = req.body[4];
  const pincode = req.body[5];
  const patKey = req.body[6];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  //const jobId = process.env.JOB_ID;
  //const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;

  console.log("City, ", city);
  console.log("State, ", state);
  console.log("country, ", country);
  console.log("landmark, ", landmark);
  console.log("pincode, ", pincode);
  console.log("patKey, ", patKey);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatientLoc(oracle, jobId, fsystm, tsystm, amountPaid, buyer, tokenaddress).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/regPatientHealth', async (req, res) => {

  const allergies = req.body[1];
  const lifesaver = req.body[2];
  const height = req.body[3];
  const weight = req.body[4];
  const patKey = req.body[5];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  //const jobId = process.env.JOB_ID;
  //const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;

  console.log("allergies, ", allergies);
  console.log("lifesaver, ", lifesaver);
  console.log("height, ", height);
  console.log("weight, ", weight);
  console.log("patKey, ", patKey);


  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.regPatientHealth(allergies, lifesaver, height, weight, patKey).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/regCareGiver', async (req, res) => {

  const patKey = req.body[1];
  const careName = req.body[2];
  const careMobile = req.body[3];
  const careRelation = req.body[4];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  // const jobId = process.env.JOB_ID;
  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;
  console.log("patKey, ", patKey);
  console.log("careName, ",careName);
  console.log("careMobile, ", careMobile);
  console.log("careRelation, ", careRelation);
  // console.log("Buyer Address is, ", buyer);
  // console.log("Amount Paid in ERC20 is, ", amountPaid);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.regCareGiver(patKey, careName, careMobile, careRelation).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/updateCareGiver', async (req, res) => {


  const patKey = req.body[1];
  const careName = req.body[2];
  const careMobile = req.body[3];
  const careRelation = req.body[4];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  // const jobId = process.env.JOB_ID;
  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;
  console.log("patKey, ", patKey);
  console.log("careName, ", careName);
  console.log("careMobile, ", careMobile);
  console.log("careRelation, ", careRelation);
  // console.log("Buyer Address is, ", buyer);
  // console.log("Amount Paid in ERC20 is, ", amountPaid);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.updateCareGiver(patKey, careName, careMobile, careRelation).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/recordByPatient', async (req, res) => {


  const patKey = req.body[1];
  const rt = req.body[2];
  const recordHash = req.body[3];
  //const deployed_private_key = process.env.PRIVATE_KEY;
  // const jobId = process.env.JOB_ID;
  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;

  console.log("patKey, ", patKey);
  console.log("rt, ", rt);
  console.log("recordHash, ", recordHash);
  // console.log("Buyer Address is, ", buyer);
  // console.log("Amount Paid in ERC20 is, ", amountPaid);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.recordByPatient(patKey, rt, recordHash).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})

app.post('/api/recordByDoctor', async (req, res) => {

  const patKey = req.body[1];
  const docKey = req.body[2];
  const rt = req.body[3];
  const recordHash = req.body[4];
  
  // const jobId = process.env.JOB_ID;
  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;
  console.log("patKey, ", patKey);
  console.log("docKey, ", docKey);
  console.log("rt, ", rt);
  console.log("recordHash, ", recordHash);
  // console.log("Buyer Address is, ", buyer);
  // console.log("Amount Paid in ERC20 is, ", amountPaid);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.recordByDoctor(patKey, docKey, rt, recordHash).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  var request = h.decodeRunRequest(txt.logs[3]);
  const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  console.log("resultSet  ,", resultset)
  res.send(resultset)
})


app.listen(port, () => console.log(`Listening on port ${port}!`))
