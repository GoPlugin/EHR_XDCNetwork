//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface PatientInterface is GenericInterface {

    struct patientEnroll {
        string patientName;
        string patientMobile;
        string patientDob;
        string patientEmail;
        string patientPass;
        bool isExist; 
    }

    struct careGiver {
        string careName;
        string careMobile;
        string careRelation;
        bool isExist; 
    }

    struct patientViewDetails{
        patientGeo patg;
        patienthealth path;
        careGiver careg;
    }

    struct patientTransact{
        bytes tranHash;
        string comments;
        uint time;
    }

    struct patientGeo {
        string city;
        string state;
        string country;
        string landmark;
        uint picHash;
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

