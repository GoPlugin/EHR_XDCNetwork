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

    struct Doctor {
        uint256 doctorId;
        address doctor;
        DoctorType decordType;
        string doctorDetails; // Should be metadata hash about a doctors
        Status status;
        Sex sex;
        uint256 registeredOn;
        address registeredBy;
    }
}
