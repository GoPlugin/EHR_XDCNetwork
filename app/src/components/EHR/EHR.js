import { useState, useContext, useEffect } from 'react';
import { executeTxn, showToasts, queryEvents, queryData } from '../../service/service';
import { EthereumContext } from "../../eth/context";
import { convertPriceToEth, checkCurrencyBalanceForUser, checkCurrencyBalanceForUserAccount, convertPricefromEth } from "../../eth/transaction";
import './EHR.css';
import { log } from '../../service/service'

function EHR() {

  const [submitting, setSubmitting] = useState(false);
  const { provider,ehr, account } = useContext(EthereumContext);

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


  const queryRecords = async (event) => {
    event.preventDefault();
    let recordValue="0x571c9F83e21177197Fb8bC499c48811dEF646225";
    log("queryRecords", "EHR", ehr);
    setSubmitting(true);
    let response1 = await queryData(ehr, provider, 'doctorsRegistered', [recordValue]);
    console.log("response1 value is", response1);
    setSubmitting(false);
  }


  return <div className="Container">
    <div>
      <h1>Register Doctor</h1><br></br>
      <form onSubmit={registerDoctorFunction}>
        <button type="submit" disabled={submitting}>{submitting ? 'Registering Doctor..' : 'Register Doctor'}</button>
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