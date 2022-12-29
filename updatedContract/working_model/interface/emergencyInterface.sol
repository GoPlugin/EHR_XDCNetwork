//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GenericInterface.sol";

interface emergencyInterface is GenericInterface {
    struct emergencyStore {
        string secSeed;
    }

}