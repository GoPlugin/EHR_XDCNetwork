//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface GenericInterface {
    enum stateChange {
        REGISTER,
        UPDATE
    }
    enum Sex {
        MALE,
        FEMALE,
        OTHERS
    }
    enum access {
        GRANT,
        REVOKE
    }
}
