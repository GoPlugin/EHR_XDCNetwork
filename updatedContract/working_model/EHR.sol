//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "./interface/emergencyInterface.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

contract EHR is PluginClient, PatientInterface, DoctorInterface, emergencyInterface {
    
    address public owner;
    
    constructor(address _pli) {
        setPluginToken(_pli);
        owner = msg.sender;
    }

    //Events
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
    event verify(
        bool verified
    );
    event accessEvents(
            string patKey,
            string comments,
            uint registeredOn
        );


    //Modifiers
    modifier only_owner() {
        require(owner == msg.sender);
        _;
    }
    modifier checkPatient(string memory _patientId) {
            require(patientAccessData[_patientId].isExist == true, 
                    "Patient Not registered");
            _;
        }
    modifier checkDoctor(string memory _doctorId) {
            require(doctorAccessData[_doctorId].isExist == true, 
                    "Doctor Not registered");
            _;
        }
        
    //Mapping
    mapping(string => patientEnrollStore) public patientAccessData;
    mapping(string => doctorEnrollStore) public doctorAccessData;
    mapping(string => patientGeoStore) public patientGeoData;
    mapping(string => patientHealthStore) public patientHealthData;
    mapping(string => mapping(string => patientRecords)) public patientRecordsData;
    //mapping(string => mapping(string => uint)) public patientRecordsData;
    mapping(string => mapping(uint => careGiverStore)) public careGiverData;
    mapping(string => mapping(string => string)) patientrecordAccessStatus;
    mapping(string => emergencyStore) public emergencyAccessData;
    string[] public RecordType = ['MRI','BLOODTEST','COVIDTEST','COVIDCERTIFICATE','CHECKUP'];

    //key hash functionality
    function string2Bytes(
        string memory _hashVar
        ) internal pure returns(bytes32){
            return(keccak256(bytes(_hashVar)));
    }

    //Patient data Register
    function registerPatient(
        string memory _patientName,
        string memory _patientMobile,
        string memory _patientDob,
        string memory _patientEmail,
        string memory _patientPass,
        string memory _patientId//,
        //string memory _patSecSeed
    ) public {
        // string memory patKey;
        // patKey = string(abi.encodePacked('PLI-EHR-PAT-',_patientMobile,_patientPass));
        require (string2Bytes(patientAccessData[_patientId].patientMobile) != string2Bytes(_patientMobile), 
            "EHR-RP-01: Patient already Enrolled.");
        require (string2Bytes(patientAccessData[_patientId].patientPass) != string2Bytes(_patientPass), 
            "EHR-RP-02: Patient already Enrolled.");
        patientAccessData[_patientId] = patientEnrollStore(_patientName,_patientMobile,_patientDob,_patientEmail,_patientPass,'',true);
        
        emit ehrEvent(
            _patientId,
            "Patient Registration Done",
            block.timestamp);
    }

    //Patient data update
    function updatePatient(
        string memory _patientName,
        string memory _patientMobile,
        string memory _patientDob,
        string memory _patientEmail,
        string memory _patientPass,
        string memory _patientId

    ) public {
        patientAccessData[_patientId].patientName = _patientName;
        patientAccessData[_patientId].patientEmail = _patientEmail;
        patientAccessData[_patientId].patientDob = _patientDob;
        patientAccessData[_patientId].patientMobile = _patientMobile;
        patientAccessData[_patientId].patientPass = _patientPass;
        
        emit ehrEvent(
            _patientId,
            "Patient Record Updated",
            block.timestamp);
    }

     //Patient data Register
    function registerDoctor(
        string memory _doctorName,
        string memory _doctorMobile,
        string memory _doctorDob,
        string memory _doctorEmail,
        string memory _doctorPass,
        string memory _doctorId
    ) public {
        // string memory docKey;
        // docKey = string(abi.encodePacked('PLI-EHR-DOC-',_doctorMobile,_doctorPass));
        require (string2Bytes(doctorAccessData[_doctorId].doctorMobile) != string2Bytes(_doctorMobile), 
            "EHR-RD-01: Doctor already Enrolled.");
        require (string2Bytes(doctorAccessData[_doctorId].doctorPass) != string2Bytes(_doctorPass), 
            "EHR-RD-02: Doctor already Enrolled.");
        doctorAccessData[_doctorId] = doctorEnrollStore(_doctorName,_doctorMobile,_doctorDob,_doctorEmail,_doctorPass,true);
        
        emit ehrEvent(
            _doctorId,
            "Doctor Registration Done",
            block.timestamp);
    }

    //Patient data update
    function updateDoctor(
        string memory _doctorName,
        string memory _doctorMobile,
        string memory _doctorDob,
        string memory _doctorEmail,
        string memory _doctorPass,
        string memory _doctorId
    ) public {

        doctorAccessData[_doctorId].doctorName = _doctorName;
        doctorAccessData[_doctorId].doctorEmail = _doctorEmail;
        doctorAccessData[_doctorId].doctorDob = _doctorDob;
        doctorAccessData[_doctorId].doctorMobile = _doctorMobile;
        doctorAccessData[_doctorId].doctorPass = _doctorPass;
        
        emit ehrEvent(
            _doctorId,
            "Doctor Record Updated",
            block.timestamp);
    }

    
    //PatientLocationData register
    function registerPatientGeo(
        string memory _city,
        string memory _state,
        string memory _country,
        string memory _landmark,
        string memory _patientId,
        string memory _pic,
        uint _pincode
    ) public checkPatient(_patientId) {
            patientGeoData[_patientId] = patientGeoStore(_city,_state,_country,_landmark,_pic,_pincode);
        emit ehrEvent(
            _patientId,
            "Patient Location Data registered",
            block.timestamp);
    }

    //PatientLocationData update
    function updatePatientGeo(
        string memory _city,
        string memory _state,
        string memory _country,
        string memory _landmark,
        string memory _patientId,
        string memory _pic,
        uint _pincode
    ) public checkPatient(_patientId) {
            patientGeoData[_patientId].city = _city;
            patientGeoData[_patientId].state = _state;
            patientGeoData[_patientId].country = _country;
            patientGeoData[_patientId].landmark = _landmark;
            patientGeoData[_patientId].pic = _pic;
            patientGeoData[_patientId].pincode = _pincode;
        emit ehrEvent(
            _patientId,
            "Patient Location Data updated",
            block.timestamp);
    }

    //pregisterPatientHealth register/update
    function registerPatientHealth(
        string memory _allergies,
        string memory _lifesaver,
        string memory _patientId,
        string memory _bloodType,
        uint _height,
        uint _weight
    ) public checkPatient(_patientId){
        patientHealthData[_patientId] = patientHealthStore(_allergies,_lifesaver,_bloodType,_height,_weight);
        emit ehrEvent(
            _patientId,
            "Patient Health Data updated",
            block.timestamp);   
    }
    
    //registerCareGiver register
    function registerCareGiver(
        string memory _patientId,
        string memory _careGiverName,
        string memory _careGiverMobile,
        string memory _careGiverRelation,
        uint _position//from API position parameter has to be passed
    ) public checkPatient(_patientId){
            require(careGiverData[_patientId][_position].isExist == false, "EHR-RCG-01: Already registered");
            careGiverData[_patientId][_position] = careGiverStore(_careGiverName,_careGiverMobile,_careGiverRelation,true);
            
        emit ehrEvent(
            _patientId,
            "Caregiver Data registered",
            block.timestamp);
    }

    //updateCareGiver update
    function updateCareGiver(
        string memory _patientId,
        string memory _careGiverName,
        string memory _careGiverMobile,
        string memory _careGiverRelation,
        uint _position//from API position parameter has to be passed
    ) public checkPatient(_patientId){
        require(careGiverData[_patientId][_position].isExist == true, "EHR-UCG-01: Not registered");
        careGiverData[_patientId][_position].careGiverName = _careGiverName;
        careGiverData[_patientId][_position].careGiverMobile = _careGiverMobile;
        careGiverData[_patientId][_position].careGiverRelation = _careGiverRelation;
        emit ehrEvent(
            _patientId,
            "Caregiver Data modified",
            block.timestamp);

    }
    //recordAddByPatient 
    function recordAddByPatient(
        string memory _patientId,
        string memory _recordLoc,
        string memory _recordName,
        string memory _recordDesc,
        string memory _recordType
        ) public checkPatient(_patientId){
                patientRecordsData[_patientId][_recordType] = patientRecords(_recordLoc, _recordName, _recordDesc);

            emit RecordEvents(
                "Record added by Patient",
                _patientId,
                " ",
                block.timestamp
            );
    }
    

    //recordAddByDoctor
    // function recordAddByDoctor(
    //     string memory _doctorId,
    //     string memory _patientId,
    //     uint _recordHash,
    //     uint _recordIndex
    //     ) public checkPatient(_patientId){
    //             require(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('GRANT'),
    //                 "EHR-RABD-01: Access not provided by Patient");
    //             patientRecordsData[_doctorId][RecordType[_recordIndex]] = _recordHash;

    //         emit RecordEvents(
    //             "Record added by Doctor",
    //             _patientId,
    //             " ",
    //             block.timestamp
    //         );
    // }

    function requestAccess(
        string memory _patientId,
        string memory _doctorId
    ) public checkDoctor(_doctorId){
        patientrecordAccessStatus[_patientId][_doctorId] = 'REQUESTED';

        emit accessEvents(
            _patientId,
            'Access request registered in system',
            block.timestamp
        );
    }

    //patient data acess control
    function patientControl(
        string memory _patientId,
        string memory _doctorId,
        string memory _access
    ) public checkDoctor(_doctorId){
        string memory _comments;
        if(string2Bytes(_access) == string2Bytes('GRANT')){
            if(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('REQUESTED')){
                patientrecordAccessStatus[_patientId][_doctorId] = 'GRANT';
            }
            if(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('PENDING')){
                patientrecordAccessStatus[_patientId][_doctorId] = 'GRANT';
            }    
            _comments = 'Access granted to Doctor request';
        }
        if(string2Bytes(_access) == string2Bytes('PENDING')){
            require(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('REQUESTED'),
                "EHR-PC-02: Not in the required status!");
            patientrecordAccessStatus[_patientId][_doctorId] = 'PENDING';
            _comments = 'Access pending to Doctor request';
        }
        if(string2Bytes(_access) == string2Bytes('REVOKE')){
            if(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('GRANT')){
                patientrecordAccessStatus[_patientId][_doctorId] = 'REVOKE';
            }
            if(string2Bytes(patientrecordAccessStatus[_patientId][_doctorId]) == string2Bytes('PENDING')){
                patientrecordAccessStatus[_patientId][_doctorId] = 'REVOKE';
            }    
            _comments = 'Access revoke to Doctor request';
        }

        emit accessEvents(
            _patientId,
            _comments,
            block.timestamp
        );

    }
    
    //list request
    function listAccessStatus(
        string memory _patientId,
        string memory _doctorId
    ) public view returns(string memory){
       
        return(patientrecordAccessStatus[_patientId][_doctorId]);
    }

    // //view patientsecKey
    // function patientSecKeyAccess(
    //     string memory _patientId
    // ) public view returns(string memory){
    //     require(patientAccessData[_patientId].isExist == true, "EHR-PSK-01: Patient not registered");
    //     return(patientAccessData[_patientId].secSeed);
    // }

    // //view emergencysecKey
    // function emergencySecKeyAccess(
    //     string memory _patientId
    // ) public view returns(string memory){
    //     require(emergencyAccessData[_patientId].isExist == true, "EHR-ESK-01: Patient not registered");
    //     return(emergencyAccessData[_patientId].secSeed);
    // }

    // //view patientPass
    // function patientPass(
    //     string memory _patientId
    // ) public view returns(string memory){
    //     require(patientAccessData[_patientId].isExist == true, "EHR-PP-01: Patient not registered");
    //     return(patientAccessData[_patientId].patientPass);
    // }

    //Login verification 
    // function signInVerification(
    //     string memory _verifMobile,
    //     string memory _verifPass
    // ) public {
    //     require(patientAccessData[string(abi.encodePacked('PLI-EHR-PAT-',_verifMobile,_verifPass))].isExist == true,
    //         "EHR-SIV-01: Patient Not registered");
    //     emit verify(true);
    // }

    //QR code view/patient view fucntionality
    function patientDataView(
        string memory _patientId
    ) public view returns(patientGeoStore memory, patientHealthStore memory, careGiverStore memory){
        require(patientAccessData[_patientId].isExist == true, "EHR-PDV-01: Patient Not registered");
        return (patientGeoData[_patientId],patientHealthData[_patientId],careGiverData[_patientId][0]);
    }

    //Emergency view fucntionality
    function emergencyView(
        string memory _patientId
    ) public view returns(string memory, string memory, string memory, string memory){
        require(patientAccessData[_patientId].isExist == true, "EHR-EV-01: Patient Not registered");
        return (patientAccessData[_patientId].patientName,patientAccessData[_patientId].patientMobile,patientAccessData[_patientId].patientDob,careGiverData[_patientId][0].careGiverMobile);
    }

}