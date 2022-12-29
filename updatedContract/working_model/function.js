/* eslint-disable */
const Xdc3 = require("xdc3");
require("dotenv").config();
const h = require("chainlink-test-helpers");
const express = require('express')
const bodyParser = require('body-parser');
//const app = express()
const port = process.env.EA_PORT || 5001


const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider(process.env.CONNECTION_URL)
);

const requestorABI = require("./ABI/ECA.json");
const requestorcontractAddr = process.env.REQUESTOR_CONTRACT;
const deployed_private_key = process.env.PRIVATE_KEY;

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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
}

module.exports.updatePatient = async (data) => {

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
    data: requestContract.methods.updatePatient(patientName, patientEmail, patientDob, patientMobile, patientPass, patientId).encodeABI(),
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
}

module.exports.registerDoctor = async (data) => {

  const doctorName = data.doctorName;
  const doctorMobile = data.doctorMobile;
  const doctorDob = data.doctorDob;
  const doctorEmail = data.doctorEmail;
  const doctorPass = data.doctorPass;
  const doctorId = data.doctorId;
  

  console.log("doctorName, ", doctorName);
  console.log("doctorMobile, ", doctorMobile);
  console.log("doctorDob, ", doctorDob);
  console.log("doctorEmail, ", doctorEmail);
  console.log("doctorPass, ", doctorPass);
  console.log("doctorId, ", doctorId);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.registerDoctor(doctorName, doctorMobile, doctorDob, doctorEmail, doctorPass, doctorId).encodeABI(),
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});

}

module.exports.updateDoctor = async (data) => {

  //console.log("request value is", req.body, req.body[1], req.body[3])
  const doctorName = data.doctorName;
  const doctorMobile = data.doctorMobile;
  const doctorDob = data.doctorDob;
  const doctorEmail = data.doctorEmail;
  const doctorPass = data.doctorPass;
  const doctorId = data.doctorId;


  console.log("doctorName, ", doctorName);
  console.log("doctorMobile, ", doctorMobile);
  console.log("doctorDob, ", doctorDob);
  console.log("doctorEmail, ", doctorEmail);
  console.log("doctorPass, ", doctorPass);
  console.log("doctorId, ", doctorId);


  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.updateDoctor(doctorName, doctorMobile, doctorDob, doctorEmail, doctorPass, doctorId).encodeABI(),
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
}

module.exports.updatePatientGeo = async (data) => {

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
    data: requestContract.methods.updatePatientGeo(city, state, country, landmark, patId, picHash, pincode).encodeABI(),
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});

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
    return events;
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});

}

module.exports.updateCareGiver = async (data) => {


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
    data: requestContract.methods.updateCareGiver(patId, careGiverName, careGiverMobile, careGiverRelation, pos).encodeABI(),
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
    //res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType});
    return events;
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
    return events;
    //res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
}

module.exports.recordAddByDoctor = async (data) => {

  const docId = data.docId;
  const patId = data.patId;
  const recordHash = data.recordHash;
  const recordIndex = data.recordIndex;

  console.log("docId, ", docId);
  console.log("patId, ", patId);
  console.log("recordHash, ", recordHash);
  console.log("recordIndex, ", recordIndex);



  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.recordByDoctor(docId, patId, recordHash, recordIndex).encodeABI(),
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
    return events;
    //res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
}

module.exports.requestAccess = async (data) => {

  const patId = data.patId;
  const docId = data.docId;
  
  console.log("patId, ", patId);
  console.log("docId, ", docId);


  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.requestAccess(patId, docId).encodeABI(),
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
    const events = await requestContract.getPastEvents("accessEvents",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.patKey);
    return events;
    //res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
}

module.exports.patientControl = async (data) => {

  const patId = data.patId;
  const docId = data.docId;
  const access = data.access;
  
  console.log("patId, ", patId);
  console.log("docId, ", docId);
  console.log("access, ", access);
  
  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  console.log("Account Address is, ", account, account.address);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.patientControl(patId, docId, access).encodeABI(),
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
    const events = await requestContract.getPastEvents("accessEvents",{fromBlock:"latest",toBlock:"latest"});
    //console.log("events",events);
    console.log("events",events[0].returnValues.patKey);
    return events;
    //res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment});
 
}

module.exports.listAccessStatus = async(data) => {
  const patId = data.patId;
  const docId = data.docId;
  console.log("patId, ", patId);
  console.log("docId, ", docId);
   // // //Defining requestContract
   const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
   console.log("Requestor Contract is, ", requestContract);
   const result = await requestContract.methods.listAccessStatus(patId,docId).call();
   console.log("listAccessStatus", result)
   return result;

}

module.exports.patientDataView = async (data) => {

  const patId = data.userID;

  console.log("patId, ", patId);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const result = await requestContract.methods.patientDataView(patId).call();
  console.log("patientView", result)
  return result;
}

module.exports.patientRecordView = async (data) => {

    const patId = data.userID;
  
    //console.log("patId, ", patId);
  
    // // //Defining requestContract
    const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
    console.log("Requestor Contract is, ", requestContract);
    const result = await requestContract.methods.patientDataView(patId).call();
    console.log("patientView", result)
    return result;
  }

module.exports.emergencyView = async (data) => {

  const patId = data.userID;

  console.log("patId, ", patId);

  // // //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);
  console.log("Requestor Contract is, ", requestContract);
  const result = await requestContract.methods.emergencyView(patId).call();
  console.log("patientView", result)
  return result;
}