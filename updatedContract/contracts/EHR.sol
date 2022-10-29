//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

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

    event patregistration(
        uint patientKey,
        string evenType,
        uint registeredOn
    );

    event RecordEvents(
        string comment,
        uint patKey,
        uint docKey,
        uint registeredOn
    );

    modifier only_owner() {
        require(owner == msg.sender);
        _;
    }
    modifier checkPatient(uint _patKey) {
            require(patientAccess[_patKey].isExist == true, 
                    "Patient Not registered");
            _;
        }
    modifier checkDoctor(uint _docKey) {
            require(doctorAccess[_docKey].isExist == true, 
                    "Doctor Not registered");
            _;
        }
        
    //Mapping
    mapping(uint => patientEnroll) public patientAccess;
    mapping(uint => doctorEnroll) public doctorAccess;
    mapping(uint => patientGeo) public patientLocData;
    mapping(uint => patienthealth) public patienthealthData;
    mapping(uint => mapping(string => uint)) public patientrecordsData;
    mapping(uint => mapping(uint => careGiver)) public careGiverData;
    mapping(uint => mapping(uint => bool)) public accessForDoctor;
    string[] RecordType = ['MRI','BLOODTEST','COVIDTEST','COVIDCERTIFICATE','CHECKUP'];
    uint[] index;
    

    //registerPatients Register/update
    function registerPatients(
        string memory patientName,
        string memory patientEmail,
        string memory patientMobile,
        string memory patientPass,
        stateChange reup
    ) public {
        uint patientKey = uint(keccak256(abi.encodePacked(patientMobile,patientEmail)));
        string memory comments;
        if(reup == stateChange.REGISTER){
            require (keccak256(bytes(patientAccess[patientKey].patientEmail)) != keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
            require (keccak256(bytes(patientAccess[patientKey].patientMobile)) != keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
            patientAccess[patientKey] = patientEnroll(patientName,patientEmail,patientMobile,patientPass,true);
            comments = "Patient Registration Done";
        }
        if(reup == stateChange.UPDATE){
            require (keccak256(bytes(patientAccess[patientKey].patientEmail)) == keccak256(bytes(patientEmail)), "EHR-RP-01: Patient already Enrolled.");
            require (keccak256(bytes(patientAccess[patientKey].patientMobile)) == keccak256(bytes(patientMobile)), "EHR-RP-02: Patient already Enrolled.");
            patientAccess[patientKey].patientName = patientName;
            patientAccess[patientKey].patientEmail = patientEmail;
            patientAccess[patientKey].patientMobile = patientMobile;
            comments = "Patient Record Updated";
        }
        
        emit patregistration(
            patientKey,
            comments,
            block.timestamp);
    }

    // registerDoctor register/update
    function registerDoctor(
        string memory doctorName,
        string memory doctorEmail,
        string memory doctorMobile,
        string memory doctorPass,
        string memory doctorCred,
        DoctorType _doctorType,
        Sex _gender,
        stateChange reup
    ) public {
        uint docKey = uint(keccak256(abi.encodePacked(doctorMobile,doctorEmail)));
        string memory comments;
        if(reup == stateChange.REGISTER){
            require (keccak256(bytes(doctorAccess[docKey].doctorEmail)) != keccak256(bytes(doctorEmail)), "EHR-RD-01: Doctor already Enrolled.");
            require (keccak256(bytes(doctorAccess[docKey].doctorMobile)) != keccak256(bytes(doctorMobile)), "EHR-RD-02: Doctor already Enrolled.");
            doctorAccess[docKey] = doctorEnroll(doctorName,doctorEmail,doctorMobile,doctorPass,doctorCred,DoctorType(_doctorType),Sex(_gender),true);
            comments = "Doctor Registration Done";
        }
        if(reup == stateChange.UPDATE){
            require (keccak256(bytes(doctorAccess[docKey].doctorEmail)) == keccak256(bytes(doctorEmail)), "EHR-RD-01: Doctor already Enrolled.");
            require (keccak256(bytes(doctorAccess[docKey].doctorMobile)) == keccak256(bytes(doctorMobile)), "EHR-RD-02: Doctor already Enrolled.");
            doctorAccess[docKey].doctorName = doctorName;
            doctorAccess[docKey].doctorEmail = doctorEmail;
            doctorAccess[docKey].doctorMobile = doctorMobile;
            comments = "Doctor Record Updated";
        }
        emit patregistration(
            docKey,
            comments,
            block.timestamp);
    }

    //PatientLocationData register/update
    function registerPatientLoc(
        string memory city,
        string memory state,
        string memory country,
        string memory landmark,
        uint pincode,
        uint patKey
    ) public checkPatient(patKey){
        patientLocData[patKey] = patientGeo(city,state,country,landmark,pincode);
        emit patregistration(
            patKey,
            "Patient Location Data updated",
            block.timestamp);
    }
    //pregisterPatientHealth register/update
    function registerPatientHealth(
        string memory allergies,
        string memory lifesaver,
        uint height,
        uint weight,
        uint patKey
    ) public checkPatient(patKey){
        patienthealthData[patKey] = patienthealth(allergies,lifesaver,height,weight);
        emit patregistration(
            patKey,
            "Patient Health Data updated",
            block.timestamp);   
    }
    
    //registerCareGiver register
    function registerCareGiver(
        uint patKey,
        uint position,//from API position parameter has to be passed
        string memory careName,
        string memory careMobile,
        string memory careRelation
    ) public checkPatient(patKey){
        // for(uint i=0;i<=2;i++){
            require(careGiverData[patKey][position].isExist == false, "EHR-RCG-01: Already registered");
            careGiverData[patKey][position] = careGiver(careName,careMobile,careRelation,true);
            
        emit patregistration(
            patKey,
            "Caregiver Data registered",
            block.timestamp);
    }

    //updateCareGiver update
    function updateCareGiver(
        uint patKey,
        uint position,//from API position parameter has to be passed
        string memory careName,
        string memory careMobile,
        string memory careRelation
    ) public checkPatient(patKey){
        require(careGiverData[patKey][position].isExist == true, "EHR-RCG-02: Not registered");
        careGiverData[patKey][position] = careGiver(careName,careMobile,careRelation,true);
        emit patregistration(
            patKey,
            "Caregiver Data modified",
            block.timestamp);

    }
    //recordByPatient register/update
    function recordByPatient(
        uint patKey,
        uint rt,
        uint recordHash
        ) public checkPatient(patKey){
            patientrecordsData[patKey][RecordType[rt]] = recordHash;
    }

    //recordByDoctor register/update
    function recordByDoctor(
        uint patKey,
        uint docKey,
        uint rt,
        uint recordHash
        ) public checkPatient(patKey){
            require(accessForDoctor[patKey][docKey] == true,"No access provided by patient");
            patientrecordsData[patKey][RecordType[rt]] = recordHash;
    }

    //AccessControl to grant or revoke access to doctor by patients toards updating medical records
    //accessControl access/revoke
    function accessControl(
        uint _patKey,
        uint _docKey,
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