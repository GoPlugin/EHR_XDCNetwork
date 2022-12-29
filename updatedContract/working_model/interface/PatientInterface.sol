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
        string secSeed;
        bool isExist; 
    }

    // struct patientRecord{
    //     string recordHash;
    // }

    struct careGiverStore {
        string careGiverName;
        string careGiverMobile;
        string careGiverRelation;
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
        string pic;
        uint pincode;  
    }

    struct patientHealthStore {
        string allergies;
        string lifesaver;
        string bloodType;
        uint height;
        uint weight; 
    }
    struct patientRecords {
        string recordLoc;
        string recordName;
        string recordDesc;

    }
    
}

