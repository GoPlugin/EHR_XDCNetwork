//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

contract EHR is PluginClient, PatientInterface, DoctorInterface {
    
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
    event accesEvents(
            string patKey,
            string comments,
            uint registeredOn
        );


    //Modifiers
    modifier only_owner() {
        require(owner == msg.sender);
        _;
    }
    modifier checkPatient(string memory _patKey) {
            require(patientAccessData[_patKey].isExist == true, 
                    "Patient Not registered");
            _;
        }
    modifier checkDoctor(string memory _docKey) {
            require(doctorAccessData[_docKey].isExist == true, 
                    "Doctor Not registered");
            _;
        }
        
    //Mapping
    mapping(string => patientEnrollStore) public patientAccessData;
    mapping(string => doctorEnrollStore) public doctorAccessData;
    mapping(string => patientGeoStore) public patientGeoData;
    mapping(string => patientHealthStore) public patientHealthData;
    mapping(string => mapping(string => uint)) public patientRecordsData;
    mapping(string => mapping(uint => careGiverStore)) public careGiverData;
    mapping(string => mapping(string => string)) patientrecordAccessStatus;
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
        string memory _patientPass
    ) public {
        string memory patKey;
        patKey = string(abi.encodePacked('PLI-EHR-PAT-',_patientMobile,_patientPass));
        require (string2Bytes(patientAccessData[patKey].patientMobile) != string2Bytes(_patientMobile), 
            "EHR-RP-01: Patient already Enrolled.");
        require (string2Bytes(patientAccessData[patKey].patientPass) != string2Bytes(_patientPass), 
            "EHR-RP-02: Patient already Enrolled.");
        patientAccessData[patKey] = patientEnrollStore(_patientName,_patientMobile,_patientDob,_patientEmail,_patientPass,true);
        
        emit ehrEvent(
            patKey,
            "Patient Registration Done",
            block.timestamp);
    }

    //Patient data update
    function updatePatient(
        string memory _patientName,
        string memory _patientDob,
        string memory _patKey,
        string memory _patientEmail
    ) public {
        patientAccessData[_patKey].patientName = _patientName;
        patientAccessData[_patKey].patientEmail = _patientEmail;
        patientAccessData[_patKey].patientDob = _patientDob;
        
        emit ehrEvent(
            _patKey,
            "Patient Record Updated",
            block.timestamp);
    }

     //Patient data Register
    function registerDoctor(
        string memory _doctorName,
        string memory _doctorMobile,
        string memory _doctorDob,
        string memory _doctorEmail,
        string memory _doctorPass
    ) public {
        string memory docKey;
        docKey = string(abi.encodePacked('PLI-EHR-DOC-',_doctorMobile,_doctorPass));
        require (string2Bytes(doctorAccessData[docKey].doctorMobile) != string2Bytes(_doctorMobile), 
            "EHR-RD-01: Doctor already Enrolled.");
        require (string2Bytes(doctorAccessData[docKey].doctorPass) != string2Bytes(_doctorPass), 
            "EHR-RD-02: Doctor already Enrolled.");
        doctorAccessData[docKey] = doctorEnrollStore(_doctorName,_doctorMobile,_doctorDob,_doctorEmail,_doctorPass,true);
        
        emit ehrEvent(
            docKey,
            "Doctor Registration Done",
            block.timestamp);
    }

    //Patient data update
    function updateDoctor(
        string memory _doctorName,
        string memory _doctorDob,
        string memory _docKey,
        string memory _doctorEmail
    ) public {

        doctorAccessData[_docKey].doctorName = _doctorName;
        doctorAccessData[_docKey].doctorEmail = _doctorEmail;
        doctorAccessData[_docKey].doctorDob = _doctorDob;
        
        emit ehrEvent(
            _docKey,
            "Doctor Record Updated",
            block.timestamp);
    }

    
    //PatientLocationData register
    function registerPatientLoc(
        string memory _city,
        string memory _state,
        string memory _country,
        string memory _landmark,
        string memory _patKey,
        uint _picHash,
        uint _pincode
    ) public checkPatient(_patKey) {
            patientGeoData[_patKey] = patientGeoStore(_city,_state,_country,_landmark,_picHash,_pincode);
        emit ehrEvent(
            _patKey,
            "Patient Location Data registered",
            block.timestamp);
    }

    //PatientLocationData update
    function updatePatientLoc(
        string memory _city,
        string memory _state,
        string memory _country,
        string memory _landmark,
        string memory _patKey,
        uint _picHash,
        uint _pincode
    ) public checkPatient(_patKey) {
            patientGeoData[_patKey].city = _city;
            patientGeoData[_patKey].state = _state;
            patientGeoData[_patKey].country = _country;
            patientGeoData[_patKey].landmark = _landmark;
            patientGeoData[_patKey].picHash = _picHash;
            patientGeoData[_patKey].pincode = _pincode;
        emit ehrEvent(
            _patKey,
            "Patient Location Data updated",
            block.timestamp);
    }

    //pregisterPatientHealth register/update
    function registerPatientHealth(
        string memory _allergies,
        string memory _lifesaver,
        string memory _patientKey,
        string memory _bloodType,
        uint _height,
        uint _weight
    ) public checkPatient(_patientKey){
        patientHealthData[_patientKey] = patientHealthStore(_allergies,_lifesaver,_bloodType,_height,_weight);
        emit ehrEvent(
            _patientKey,
            "Patient Health Data updated",
            block.timestamp);   
    }
    
    //registerCareGiver register
    function registerCareGiver(
        string memory _patKey,
        string memory _careName,
        string memory _careMobile,
        string memory _careRelation,
        uint _position//from API position parameter has to be passed
    ) public checkPatient(_patKey){
            require(careGiverData[_patKey][_position].isExist == false, "EHR-RCG-01: Already registered");
            careGiverData[_patKey][_position] = careGiverStore(_careName,_careMobile,_careRelation,true);
            
        emit ehrEvent(
            _patKey,
            "Caregiver Data registered",
            block.timestamp);
    }

    //updateCareGiver update
    function updateCareGiver(
        string memory _patKey,
        string memory _careName,
        string memory _careMobile,
        string memory _careRelation,
        uint _position//from API position parameter has to be passed
    ) public checkPatient(_patKey){
        require(careGiverData[_patKey][_position].isExist == true, "EHR-UCG-01: Not registered");
        careGiverData[_patKey][_position].careName = _careName;
        careGiverData[_patKey][_position].careMobile = _careMobile;
        careGiverData[_patKey][_position].careRelation = _careRelation;
        emit ehrEvent(
            _patKey,
            "Caregiver Data modified",
            block.timestamp);

    }
    //recordByPatient register/update
    function recordAddByPatient(
        string memory _patKey,
        uint _recordHash,
        uint _recordIndex
        ) public checkPatient(_patKey){
                patientRecordsData[_patKey][RecordType[_recordIndex]] = _recordHash;

            emit RecordEvents(
                "Record added by Patient",
                _patKey,
                " ",
                block.timestamp
            );
    }

    function requestAcces(
        string memory _patKey,
        string memory _docKey
    ) public checkDoctor(_docKey){
        patientrecordAccessStatus[_patKey][_docKey] = 'REQUESTED';

        emit accesEvents(
            _patKey,
            'Access request registered in system',
            block.timestamp
        );
    }

    function patientControl(
        string memory _patKey,
        string memory _docKey,
        string memory _access
    ) public checkDoctor(_docKey){
        string memory _comments;
        if(string2Bytes(_access) == string2Bytes('GRANT')){
            require(string2Bytes(patientrecordAccessStatus[_patKey][_docKey]) == string2Bytes('REQUESTED') | string2Bytes('PENDING'),
                "EHR-PC-01: Not in the required status!");
            patientrecordAccessStatus[_patKey][_docKey] = 'GRANT';
            _comments = 'Access granted to Doctor request';
        }
        if(string2Bytes(_access) == string2Bytes('PENDING')){
            require(string2Bytes(patientrecordAccessStatus[_patKey][_docKey]) == string2Bytes('REQUESTED'),
                "EHR-PC-02: Not in the required status!");
            patientrecordAccessStatus[_patKey][_docKey] = 'PENDING';
            _comments = 'Access pending to Doctor request';
        }
        if(string2Bytes(_access) == string2Bytes('REVOKE')){
            require(string2Bytes(patientrecordAccessStatus[_patKey][_docKey]) == string2Bytes('GRANT')|string2Bytes('PENDING'),
                "EHR-PC-03: Not in the required status!");
            patientrecordAccessStatus[_patKey][_docKey] = 'REVOKE';
            _comments = 'Access revoke to Doctor request';
        }

        emit accesEvents(
            _patKey,
            _comments,
            block.timestamp
        );

    }
    
    //Login verification 
    function signInVerification(
        string memory _verifMobile,
        string memory _verifPass
    ) public {
        require(patientAccessData[string(abi.encodePacked('PLI-EHR-PAT-',_verifMobile,_verifPass))].isExist == true,
            "Patient Not registered");
        emit verify(true);
    }

    //QR code view/patient view fucntionality
    function patientDataView(
        string memory _patKey
    ) public view returns(patientGeoStore memory, patientHealthStore memory, careGiverStore memory){
        require(patientAccessData[_patKey].isExist == true, "Patient Not registered");
        return (patientGeoData[_patKey],patientHealthData[_patKey],careGiverData[_patKey][0]);
    }

    //Emergency view fucntionality
    function emergencyView(
        string memory _patKey
    ) public view returns(string memory, string memory, string memory, string memory){
        require(patientAccessData[_patKey].isExist == true, "Patient Not registered");
        return (patientAccessData[_patKey].patientName,patientAccessData[_patKey].patientMobile,patientAccessData[_patKey].patientDob,careGiverData[_patKey][0].careMobile);
    }

}