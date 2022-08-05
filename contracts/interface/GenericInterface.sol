//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface GenericInterface {
    enum Sex {
        MALE,
        FEMALE,
        OTHERS
    }
    enum Status {
        APPROVED,
        INACTIVE,
        PENDING,
        REGISTERED,
        ACTIVE
    }
    enum Role {
        PATIENT,
        DOCTOR,
        DIAGNOSTICLAB,
        OTHERS
    }
}
