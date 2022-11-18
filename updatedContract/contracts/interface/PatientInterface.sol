//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface PatientInterface is GenericInterface {

    struct patientEnrollStore {
        string patientName;
        string patientMobile;
        string patientDob;
        string patientEmail;
        string patientPass;
        bool isExist; 
    }

    // struct patientRecord{
    //     string recordHash;
    // }

    struct careGiverStore {
        string careName;
        string careMobile;
        string careRelation;
        bool isExist; 
    }

    struct patientViewDetails{
        patientGeoStore patg;
        patientHealthStore path;
        careGiverStore careg;
    }

    struct patientTransact{
        bytes tranHash;
        string comments;
        uint time;
    }

    struct patientGeoStore {
        string city;
        string state;
        string country;
        string landmark;
        uint picHash;
        uint pincode;  
    }

    struct patientHealthStore {
        string allergies;
        string lifesaver;
        string bloodType;
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

