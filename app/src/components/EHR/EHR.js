import { useState, useContext, useEffect } from 'react';
import { executeTxn, showToasts, queryEvents, queryData } from '../../service/service';
import { EthereumContext } from "../../eth/context";
import { convertPriceToEth, checkCurrencyBalanceForUser, checkCurrencyBalanceForUserAccount, convertPricefromEth } from "../../eth/transaction";
import './EHR.css';
import { log } from '../../service/service'

function EHR() {

  const [submitting, setSubmitting] = useState(false);
  const { provider,ehr, account } = useContext(EthereumContext);
  console.log("EHR is",ehr);
  const registerDoctorFunction = async (event) => {
    event.preventDefault();

    let _doctorAddress = "0xA838966F7B21F5c5CE72BCe9093D8F138AbE11dB";
    let _metaData="testing";
    let _doctorType=2;
    let _status=1;
    let _gender=1;

    log("registerDoctorFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'registerDoctor', [_doctorAddress, _metaData, _doctorType,_status,_gender]);
    log("registerDoctorFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'DoctorEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const registerPatientFunction = async (event) => {
    event.preventDefault();
        let _patientAddress = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";
        let _metaData = "testing";
        let _careGiverContact = "8907078090";
        let _careGiverName = "Jurjees";
        let _status = 4;
        let _gender = 1;
        let _vitals = "Pressure:3.9,cholesterol:4.8";
        let _masterhash = "0xbace";

    log("registerPatientFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'registerPatients', [_patientAddress, _metaData, _careGiverContact, _careGiverName, _status, _gender, _vitals, _masterhash]);
    log("registerPatientFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'PatientEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const deregisterDoctorFunction = async (event) => {
    event.preventDefault();
        let _doctorAddress = "0xA838966F7B21F5c5CE72BCe9093D8F138AbE11dB";

    log("deregisterDoctorFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'deregisterDoctor', [_doctorAddress]);
    log("deregisterDoctorFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'DoctorEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const insertRecordsFunction = async (event) => {
    event.preventDefault();
    let _patientAddr = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";
    let _masterHash = "0xbace";;
    let _filehash = "0xvdsfg";
    let _roleType = 1;
    let _recordType = 1;
    let _diagRepeat = 1;

    log("insertRecordsFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'insertRecords', [_patientAddr,_masterHash,_filehash,_roleType,_recordType,_diagRepeat]);
    log("insertRecordsFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'RecordEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const requestToViewFunction = async (event) => {
    event.preventDefault();
    let _oracle = "0x6cE55f8611B31f99F99bb9B60Af1447603Ebf49B";
    let _jobId = "d91417d0735b497d987571c54dd749b7";
    let _patientAddr = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";
    let _careGiverEmail = "asdasd@asdasd.com";

    log("requestToViewFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'requestToView', [_oracle,_jobId,_patientAddr,_careGiverEmail]);
    log("requestToViewFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'RecordEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const queryRecords = async (event) => {
    event.preventDefault();
    let recordValue="0x571c9F83e21177197Fb8bC499c48811dEF646225";
    log("queryRecords", "EHR", ehr);
    setSubmitting(true);
    let response1 = await queryData(ehr, provider, 'doctorsRegistered', [recordValue]);
    console.log("response1 value is", response1);
    setSubmitting(false);
  }

  const grantAccessFunction = async (event) => {
    event.preventDefault();
    let _roleAddr = "0xA838966F7B21F5c5CE72BCe9093D8F138AbE11dB";

    log("grantAccessFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'grantAccess', [_roleAddr]);
    log("grantAccessFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'PatientEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }
  const revokeAccessFunction = async (event) => {
    event.preventDefault();
    let _roleAddr = "0xA838966F7B21F5c5CE72BCe9093D8F138AbE11dB";

    log("revokeAccessFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'revokeAccess', [_roleAddr]);
    log("revokeAccessFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'PatientEvents',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }
  const ambEcuViewFunction = async (event) => {
    event.preventDefault();
    let _patientAddr = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";

    log("ambEcuViewFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'ambEcuView', [_patientAddr]);
    log("ambEcuViewFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'emergencyView',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }
  const pharmacistViewFunction = async (event) => {
    event.preventDefault();
    let _chemistAddr = "0x6913E5CA61e2e6eCFfdbe57d9cFF17cB6FCCEC07";
    let _patientAddr = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";

    log("pharmacistViewFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'pharmacistView', [_chemistAddr,_patientAddr]);
    log("pharmacistViewFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'PharmacistEvent',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  const InsuranceVerificationFunction = async (event) => {
    event.preventDefault();
    let _insuranceAddr = "0x31366B3059781b25487434788Aa9671B0E24935C";
    let _patientAddr = "0x002feDE33A9edD77133cfe8dA6B5EB73b7b3C020";

    log("InsuranceVerificationFunction", "EHR", ehr);
    setSubmitting(true);

    let response1 = await executeTxn(ehr, provider, 'InsuranceVerification', [_insuranceAddr,_patientAddr]);
    log("InsuranceVerificationFunction", "Registered hash", response1.txHash)
    console.log("response1 value is", response1);
    let response2 = await queryEvents(ehr, provider, 'InsuranceEvent',response1.blockNumber);
    console.log("response2 value",response2)
    showToasts(response1.txHash)
    setSubmitting(false);
  }

  return <div className="Container">
    <div>
      < h1>Register Doctor</h1><br></br>
      <form onSubmit={registerDoctorFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'Registering Doctor..' : 'Register Doctor'}</button>
      </form>
      <h1>Register Patient</h1><br></br>
      <form onSubmit={registerPatientFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'Registering Patient..' : 'Register Patient'}</button>
      </form>
      <h1>DeRegister Doctor</h1><br></br>
      <form onSubmit={deregisterDoctorFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'Deregistering Doctor..' : 'Deregister Doctor'}</button>
      </form>
      <h1>insertRecordsFunction</h1><br></br>
      <form onSubmit={insertRecordsFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'insertRecordsFunction..' : 'insertRecordsFunction'}</button>
      </form>
      <h1>requestToViewFunction</h1><br></br>
      <form onSubmit={requestToViewFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'requestToViewFunction..' : 'requestToViewFunction'}</button>
      </form>
      <h1>grantAccessFunction</h1><br></br>
      <form onSubmit={grantAccessFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'grantAccessFunction..' : 'grantAccessFunction'}</button>
      </form>
      <h1>revokeAccessFunction</h1><br></br>
      <form onSubmit={revokeAccessFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'revokeAccessFunction..' : 'revokeAccessFunction'}</button>
      </form>
      <h1>ambEcuViewFunction</h1><br></br>
      <form onSubmit={ambEcuViewFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'ambEcuViewFunction..' : 'ambEcuViewFunction'}</button>
      </form>
      <h1>pharmacistViewFunction</h1><br></br>
      <form onSubmit={pharmacistViewFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'pharmacistViewFunction..' : 'pharmacistViewFunction'}</button>
      </form>
      <h1>InsuranceVerificationFunction</h1><br></br>
      <form onSubmit={InsuranceVerificationFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'InsuranceVerificationFunction..' : 'InsuranceVerificationFunction'}</button>
      </form>
    </div>
    <div>
      <h1>Query Records</h1><br></br>
      <form onSubmit={queryRecords}>
        <button type="submit" disabled={submitting}>{submitting ? 'Querying Data..' : 'Query Records'}</button>
      </form>
    </div>
  </div>
}

export default EHR;