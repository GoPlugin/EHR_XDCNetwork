//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "./interface/emergencyInterface.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

contract ECA is PluginClient, PatientInterface, DoctorInterface, emergencyInterface {
    
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
        
    //Mapping
    mapping(string => patientEnrollStore) public patientAccessData;
    mapping(string => patientGeoStore) public patientGeoData;
    mapping(string => patientHealthStore) public patientHealthData;
    mapping(string => mapping(string => patientRecords)) public patientRecordsData;
    mapping(string => mapping(string => careGiverStore)) public careGiverData;
   //string[] public RecordType = ['MRI','BLOODTEST','COVIDTEST','COVIDCERTIFICATE','CHECKUP'];

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
        string memory _patientId
    ) public {
        patientAccessData[_patientId] = patientEnrollStore(_patientName,_patientMobile,_patientDob,_patientEmail,_patientPass,'',true);
        
        emit ehrEvent(
            _patientId,
            "Patient Registration Done",
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
        string memory _position//from API position parameter has to be passed
    ) public checkPatient(_patientId){
            careGiverData[_patientId][_position] = careGiverStore(_careGiverName,_careGiverMobile,_careGiverRelation,true);
            
        emit ehrEvent(
            _patientId,
            "Caregiver Data registered",
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
    


}
