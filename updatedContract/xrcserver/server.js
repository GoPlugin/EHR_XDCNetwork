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

  console.log("request value is", req);
  const patientName = req.body.patientName;
  const patientEmail = req.body.patientEmail;
  const patientMobile = req.body.patientMobile;
  const patientPass = req.body.patientPass;
  const patKey = req.body.patKey;
  const stateChange = req.body.stateChange;
  const patientDob = req.body.patientDob;

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
  console.log("patientDob, ", patientDob);
  console.log("stateChange, ", stateChange);
  console.log("patKey, ", patKey);
  
  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  // console.log("requestContract",requestContract)
  
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  // console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();
  // console.log("ACCOUNT",account)
  // console.log("nonce",nonce)
  console.log("gasPrice before",gasPrice)

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerPatients(patientName, patientEmail, patientMobile, patientPass, patKey, patientDob, stateChange).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;
  console.log("gasPrice", gasPrice);
  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  )

  console.log("gasPrice", gasPrice);
  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });

  // const transaction = xdc3.eth.abi.decodeLog(
                        
  //                     )
  const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    // console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
  // console.log("log-0", txt.logs[0]);
  // var request = txt.logs[0];
  // console.log("request", request);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset);
  // res.send(resultset);
  // console.log("gaslimit", gasLimit);
})

app.post('/api/registerDoctor', async (req, res) => {

  //console.log("request value is", req.body, req.body[1], req.body[3])
  const doctorName = req.body.doctorName;
  const doctorEmail = req.body.doctorEmail;
  const doctorMobile = req.body.doctorMobile;
  const doctorPass = req.body.doctorPass;
  const doctorDob = req.body.doctorDob;
  const stateChange = req.body.stateChange;
  const docKey = req.body.docKey;
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
  console.log("doctorDob, ", doctorDob);
  console.log("docKey, ", docKey);
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
    data: requestContract.methods.registerDoctor(doctorName, doctorEmail, doctorMobile, doctorPass, docKey, doctorDob, stateChange).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/registerPatientLoc', async (req, res) => {

  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  const landmark = req.body.landmark;
  const pincode = req.body.pincode;
  const patKey = req.body.patKey;
  //const deployed_private_key = process.env.PRIVATE_KEY;
  //const jobId = process.env.JOB_ID;
  //const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;


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
    data: requestContract.methods.registerPatientLoc(city, state, country, landmark, pincode, patKey).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/registerPatientHealth', async (req, res) => {

  const allergies = req.body.allergies;
  const lifesaver = req.body.lifesaver;
  const height = req.body.height;
  const weight = req.body.weight;
  const patKey = req.body.patKey;
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
    data: requestContract.methods.registerPatientHealth(allergies, lifesaver, height, weight, patKey).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/registerCareGiver', async (req, res) => {

  const patKey = req.body.patKey;
  const careName = req.body.careName;
  const careMobile = req.body.careMobile;
  const careRelation = req.body.careRelation;
  const pos = req.body.pos;
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
  console.log("pos, ", pos);
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
    data: requestContract.methods.registerCareGiver(patKey, pos, careName, careMobile, careRelation).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/updateCareGiver', async (req, res) => {


  const patKey = req.body.patKey;
  const carePosition = req.body.carePosition;
  const careName = req.body.careName;
  const careMobile = req.body.careMobile;
  const careRelation = req.body.careRelation;

  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;
  console.log("patKey, ", patKey);
  console.log("carePosition, ", carePosition);
  console.log("careName, ", careName);
  console.log("careMobile, ", careMobile);
  console.log("careRelation, ", careRelation);
  // console.log("Buyer Address is, ", buyer);
 

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.updateCareGiver(patKey, carePosition, careName, careMobile, careRelation).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("ehrEvent",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.retValue);
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/recordByPatient', async (req, res) => {


  const patKey = req.body.patKey;
  const rt = req.body.rt;
  const recordHash = req.body.recordHash;
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

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.recordByPatient(patKey,rt,recordHash).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("RecordEvents",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.patKey);
    res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
  // var request = h.decodeRunRequest(txt.logs[3]);

  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/recordByDoctor', async (req, res) => {

  const patKey = req.body.patKey;
  const docKey = req.body.docKey;
  const rt = req.body.rt;
  const recordHash = req.body.recordHash;
  
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("RecordEvents",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.patKey);
    res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.post('/api/accessControl', async (req, res) => {

  const patKey = req.body.patKey;
  const docKey = req.body.docKey;
  const ac = req.body.ac;
  
  // const jobId = process.env.JOB_ID;
  // const oracle = process.env.ORACLE_ADDRESS;
  // const fsystm = process.env.FSYSTEM;
  // const tsystm = process.env.TSYSTEM;
  // const tokenaddress = process.env.PLITOKEN;
  console.log("patKey, ", patKey);
  console.log("docKey, ", docKey);
  console.log("rac, ", ac);
  
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
    data: requestContract.methods.accessControl(patKey, docKey, ac).encodeABI(),
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
    .once("receipt", console.log)
    .then(function(receipt){
      console.log("receipt value is",receipt.logs[0].topics[0]);
    });
    const events = await requestContract.getPastEvents("RecordEvents",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.patKey);
    res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
  // var request = h.decodeRunRequest(txt.logs[3]);
  // const resultset = { requestId: request.id, requestData: request.data.toString("utf-8") };
  // console.log("resultSet  ,", resultset)
  // res.send(resultset)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
