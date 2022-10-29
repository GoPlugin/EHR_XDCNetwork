//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface DoctorInterface is GenericInterface {
    enum DoctorType {
        GENERAL,
        SURGEON,
        ORTHO,
        DENTAL,
        OTHERS
    }

    struct doctorEnroll {
    string doctorName;
    string doctorEmail;
    string doctorMobile;
    string doctorPass; 
    string doctorCred;
    DoctorType docType;
    Sex docSex;
    bool isExist; 
    }
}
