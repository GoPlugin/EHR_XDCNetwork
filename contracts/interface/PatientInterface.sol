//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface PatientInterface is GenericInterface {
    enum RecordStatus {
        CREATED,
        DELETED,
        CHANGED,
        QUERIED
    }

    enum AccessStatus {
        TRANSFERRED,
        GRANTED,
        REVOKED,
        PROTECTED
    }

    struct Patient {
        uint256 patientId;
        uint256 patientUUID;
        address patient;
        string patientDetails; //Should be metadata hash about the patients
        Sex sex;
        uint256 registeredOn;
        address registeredBy;
        string masterHash;
        string nominee;
        string contact;
        Status status;
        AccessStatus access;
    }

    struct Record {
        uint256 recordId;
        address patient;
        string fileHash;
        RecordStatus recordStatus;
        uint256 recordAddedOn;
        address recordAddedBy;
        Role roleType;
    }

    struct DocumentLogs {
        uint256 logId;
        address patient;
        uint256 recordAddedOn;
        address recordAddedBy;
        uint256 otp;
        bool processed;
    }
}
