//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface PatientInterface is GenericInterface {

    struct patientEnroll {
        string patientName;
        string patientEmail;
        string patientMobile;
        string patientPass; 
        bool isExist; 
    }

    struct patientGeo {
        string city;
        string state;
        string country;
        string landmark;
        uint pincode;  
    }

    struct patienthealth {
        string allergies;
        string lifesaver;
        uint height;
        uint weight; 
    }
    struct patientrecords {
        string recordType;
        uint recordHash;
        uint key;
        address updatedBy;
    }
}

