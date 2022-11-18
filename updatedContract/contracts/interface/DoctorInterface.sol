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

    struct doctorEnrollStore {
        string doctorName;
        string doctorMobile;
        string doctorDob;
        string doctorEmail;
        string doctorPass;
        bool isExist; 
    }

    struct doctorCredentials {
        string doctorCred;
        DoctorType docType;
        Sex docSex;
        bool isExist;
    }
}
