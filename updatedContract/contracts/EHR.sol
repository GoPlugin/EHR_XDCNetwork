//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

// import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
// import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

contract EHR is PluginClient, PatientInterface, DoctorInterface {
    
    // address
    address public owner;

    
    constructor(address _pli) {
        setPluginToken(_pli);
        owner = msg.sender;
    }
    struct careGiver {
        string careName;
        string careMobile;
        string careRelation;
        bool isExist; 
        }

    event ehrEvent(
        string retValue,
        string evenType,
        uint registeredOn
    );

    event RecordEvents(
        string comment,
        string patKey,
        string docKey,
        uint registeredOn
    );

    modifier only_owner() {
        require(owner == msg.sender);
        _;
    }
    modifier checkPatient(string memory _patKey) {
            require(patientAccess[_patKey].isExist == true, 
                    "Patient Not registered");
            _;
        }
    modifier checkDoctor(string memory _docKey) {
            require(doctorAccess[_docKey].isExist == true, 
                    "Doctor Not registered");
            _;
        }
        
    //Mapping
    mapping(string => patientEnroll) public patientAccess;
    mapping(string => doctorEnroll) public doctorAccess;
    mapping(string => patientGeo) public patientLocData;
    mapping(string => patienthealth) public patienthealthData;
    mapping(string => mapping(string => uint)) public patientrecordsData;
    mapping(string => mapping(uint => careGiver)) public careGiverData;
    mapping(string => mapping(string => bool)) public accessForDoctor;
    mapping(uint => doctorCredentials) public doctorCredentialsStore;
    string[] RecordType = ['MRI','BLOODTEST','COVIDTEST','COVIDCERTIFICATE','CHECKUP'];
    uint[] index;
    
    // function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    //     // require(bytes(source).length <= 32); // causes error
    //     // but string have to be max 32 chars
    //     // https://ethereum.stackexchange.com/questions/9603/understanding-mload-assembly-function
    //     // http://solidity.readthedocs.io/en/latest/assembly.html
    //     assembly {
    //     result := mload(add(source, 32))
    //     }
    // }

    //registerPatients Register/update
    function registerPatients(
        string memory patientName,
        string memory patientEmail,
        string memory patientMobile,
        string memory patientPass,
        string memory patientKey,
        string memory patientDob,
        stateChange reup
    ) public returns(string memory patKey){
        string memory patKey;
        string memory comments;
        if(reup == stateChange.REGISTER){
            // patientS = uint256(keccak256(abi.encodePacked(patientMobile,patientEmail)));
            // patKey = Strings.toString(patientS);
            patKey = string(abi.encodePacked('PLI-EHR-PA-',patientMobile,'-',patientDob));
            require (keccak256(bytes(patientAccess[patKey].patientEmail)) != keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
            require (keccak256(bytes(patientAccess[patKey].patientMobile)) != keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
            patientAccess[patKey] = patientEnroll(patientName,patientEmail,patientMobile,patientPass,patientDob,true);
            comments = "Patient Registration Done";
        }
        if(reup == stateChange.UPDATE){
            patKey = patientKey;
            // require (keccak256(bytes(patientAccess[patKey].patientEmail)) == keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
            // require (keccak256(bytes(patientAccess[patKey].patientMobile)) == keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
            patientAccess[patKey].patientName = patientName;
            patientAccess[patKey].patientEmail = patientEmail;
            patientAccess[patKey].patientMobile = patientMobile;
            comments = "Patient Record Updated";
        }
        
        emit ehrEvent(
            patKey,
            comments,
            block.timestamp);
        //return patKey;
    }

    // function registerPatients(
    //     bytes memory patientName,
    //     string memory patientEmail,
    //     string memory patientMobile,
    //     bytes memory patientPass,
    //     stateChange reup
    // ) public returns(uint){
    //     uint patientKey = uint(keccak256(abi.encodePacked(patientMobile,patientEmail)));
    //     string memory comments;
    //     if(reup == stateChange.REGISTER){
    //         require (keccak256(bytes(patientAccess[patientKey].patientEmail)) != keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
    //         require (keccak256(bytes(patientAccess[patientKey].patientMobile)) != keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
    //         patientAccess[patientKey] = patientEnroll(patientName,patientEmail,patientMobile,patientPass,true);
    //         comments = "Patient Registration Done";
    //     }
    //     if(reup == stateChange.UPDATE){
    //         require (keccak256(bytes(patientAccess[patientKey].patientEmail)) == keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
    //         require (keccak256(bytes(patientAccess[patientKey].patientMobile)) == keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
    //         patientAccess[patientKey].patientName = patientName;
    //         patientAccess[patientKey].patientEmail = patientEmail;
    //         patientAccess[patientKey].patientMobile = patientMobile;
    //         comments = "Patient Record Updated";
    //     }
        
    //     emit ehrEvent(
    //         patientKey,
    //         comments,
    //         block.timestamp);
    //         return patientKey;
    // }

    // registerDoctor register/update

    function registerDoctor(
        string memory doctorName,
        string memory doctorEmail,
        string memory doctorMobile,
        string memory doctorPass,
        string memory doctorKey,
        string memory doctorDob,
        stateChange reup
    ) public returns(string memory docKey){
        string memory docKey;
        string memory comments;
        if(reup == stateChange.REGISTER){
            docKey = string(abi.encodePacked('PLI-EHR-DO-',doctorMobile,'-',doctorDob));
            require (keccak256(bytes(doctorAccess[docKey].doctorEmail)) != keccak256(bytes(doctorEmail)), "EHR-RD-01: Doctor already Enrolled.");
            require (keccak256(bytes(doctorAccess[docKey].doctorMobile)) != keccak256(bytes(doctorMobile)), "EHR-RD-02: Doctor already Enrolled.");
            doctorAccess[docKey] = doctorEnroll(doctorName,doctorEmail,doctorMobile,doctorPass,doctorDob,true);
            comments = "Doctor Registration Done";
        }
        if(reup == stateChange.UPDATE){
            docKey = doctorKey;
            // require (keccak256(bytes(doctorAccess[docKey].doctorEmail)) == keccak256(bytes(doctorEmail)), "EHR-RD-01: Doctor already Enrolled.");
            // require (keccak256(bytes(doctorAccess[docKey].doctorMobile)) == keccak256(bytes(doctorMobile)), "EHR-RD-02: Doctor already Enrolled.");
            doctorAccess[docKey].doctorName = doctorName;
            doctorAccess[docKey].doctorEmail = doctorEmail;
            doctorAccess[docKey].doctorMobile = doctorMobile;
            comments = "Doctor Record Updated";
        }
        emit ehrEvent(
            docKey,
            comments,
            block.timestamp);
            //return docKey;
    }

    // doctorCreds register/update
    // function doctorCreds(
    //     uint doctorKey,
    //     string memory doctorCred,
    //     DoctorType doctorType,
    //     Sex gender,
    //     stateChange reup
    // ) public {
    //     require(doctorAccess[doctorKey].isExist == true, "EHR-DC-01: Doctor isn't registered");
    //     string memory comments;
    //     if(reup == stateChange.REGISTER){
    //         doctorCredentialsStore[doctorKey] = doctorCredentials(doctorCred,DoctorType(doctorType),Sex(gender),true);
    //         comments = "Doctor Credentials registered";
    //     }
    //     if(reup == stateChange.UPDATE){
    //         doctorCredentialsStore[doctorKey].doctorCred = doctorCred;
    //         doctorCredentialsStore[doctorKey].docType = DoctorType(doctorType);
    //         doctorCredentialsStore[doctorKey].docSex = gender;
    //         comments = "Doctor Credentials updated";
    //     }
    //     emit ehrEvent(
    //         doctorKey,
    //         comments,
    //         block.timestamp);
    // }

    //PatientLocationData register/update
    function registerPatientLoc(
        string memory city,
        string memory state,
        string memory country,
        string memory landmark,
        uint pincode,
        string memory patKey
    ) public checkPatient(patKey) returns(string memory){
        patientLocData[patKey] = patientGeo(city,state,country,landmark,pincode);
        emit ehrEvent(
            patKey,
            "Patient Location Data updated",
            block.timestamp);
            //return patKey;
    }
    //pregisterPatientHealth register/update
    function registerPatientHealth(
        string memory allergies,
        string memory lifesaver,
        uint height,
        uint weight,
        string memory patKey
    ) public checkPatient(patKey){
        patienthealthData[patKey] = patienthealth(allergies,lifesaver,height,weight);
        emit ehrEvent(
            patKey,
            "Patient Health Data updated",
            block.timestamp);   
    }
    
    //registerCareGiver register
    function registerCareGiver(
        string memory patKey,
        uint position,//from API position parameter has to be passed
        string memory careName,
        string memory careMobile,
        string memory careRelation
    ) public checkPatient(patKey){
        // for(uint i=0;i<=2;i++){
            require(careGiverData[patKey][position].isExist == false, "EHR-RCG-01: Already registered");
            careGiverData[patKey][position] = careGiver(careName,careMobile,careRelation,true);
            
        emit ehrEvent(
            patKey,
            "Caregiver Data registered",
            block.timestamp);
    }

    //updateCareGiver update
    function updateCareGiver(
        string memory patKey,
        uint position,//from API position parameter has to be passed
        string memory careName,
        string memory careMobile,
        string memory careRelation
    ) public checkPatient(patKey){
        require(careGiverData[patKey][position].isExist == true, "EHR-RCG-02: Not registered");
        careGiverData[patKey][position] = careGiver(careName,careMobile,careRelation,true);
        emit ehrEvent(
            patKey,
            "Caregiver Data modified",
            block.timestamp);

    }
    //recordByPatient register/update
    function recordByPatient(
        string memory patKey,
        uint rt,
        uint recordHash
        ) public checkPatient(patKey){
            patientrecordsData[patKey][RecordType[rt]] = recordHash;

            emit RecordEvents(
                "Record added by Patient",
                patKey,
                "  ",
                block.timestamp
            );
    }

    //recordByDoctor register/update
    function recordByDoctor(
        string memory patKey,
        string memory docKey,
        uint rt,
        uint recordHash
        ) public checkPatient(patKey){
            require(accessForDoctor[patKey][docKey] == true,"No access provided by patient");
            patientrecordsData[patKey][RecordType[rt]] = recordHash;
            //string(abi.encodePacked(RecordType[rt]," record added by Doctor")),
            emit RecordEvents(
                "Record added by Doctor",
                patKey,
                docKey,
                block.timestamp
            );
    }

    //AccessControl to grant or revoke access to doctor by patients toards updating medical records
    //accessControl access/revoke
    function accessControl(
        string memory _patKey,
        string memory _docKey,
        access ac
        ) public checkDoctor(_docKey){
        string memory accessComment;
        if(ac == access.GRANT){
            require(accessForDoctor[_patKey][_docKey] == false,
                    "EHR-AC-01: Access had been provided!");
            accessForDoctor[_patKey][_docKey] = true;
            accessComment = "Access is provided to doctor";
        }
        if(ac == access.REVOKE){
            require(accessForDoctor[_patKey][_docKey] == true,
                    "EHR-AC-02: Access was not provided!");
            accessForDoctor[_patKey][_docKey] = false;
            accessComment = "Access is revoked to doctor";
        }
        emit RecordEvents(
            accessComment,
            _patKey,
            _docKey,
            block.timestamp
        );
    }
    
    // function siginInVerification(
    //     string memory verifName,
    //     string memory verifPass,
    //     string memo
    // ) public returns(bool){
    //     require(patientAccess[]);

    // }

}