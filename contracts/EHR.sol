//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/PatientInterface.sol";
import "./interface/DoctorInterface.sol";
import "../CustomTokens/contracts/utils/Counters.sol";
import "@goplugin/contracts/src/v0.8/PluginClient.sol";

contract EHR is PluginClient, PatientInterface, DoctorInterface {
    using Counters for Counters.Counter;
    Counters.Counter private _doctorIds;
    Counters.Counter private _patientIds;
    Counters.Counter private _recordIds;
    Counters.Counter private _viewIds;

    using Plugin for Plugin.Request;

    uint256 private constant ORACLE_PAYMENT = 0.1 * 10**18;

    // address
    address public owner;
    mapping(uint256 => Record) public records;
    mapping(uint256 => Patient) public patients;
    mapping(address => Patient) public patientDetails;
    mapping(address => bool) public patientRegistered;
    mapping(uint256 => Doctor) public doctors;
    mapping(address => bool) public doctorsRegistered;
    mapping(uint256 => DocumentLogs) public documentLogs;
    mapping(bytes32 => DocumentLogs) public documentLogRequestIds;

    constructor(address _pli) {
        setPluginToken(_pli);
        owner = msg.sender;
        _doctorIds.increment();
        _patientIds.increment();
        _recordIds.increment();
        _viewIds.increment();
    }

    modifier only_owner() {
        require(owner == msg.sender);
        _;
    }

    event RecordEvents(
        uint256 recordId,
        string eventType,
        address patient,
        address performedBy,
        uint256 performedOn
    );

    event DoctorEvents(
        uint256 doctorId,
        string eventType,
        address doctor,
        address performedBy,
        uint256 performedOn
    );

    event PatientEvents(
        uint256 patientId,
        string eventType,
        address patient,
        address performedBy,
        uint256 performedOn
    );

    //Initialize event requestCreated
    event requestCreated(
        address indexed requester,
        bytes32 indexed jobId,
        bytes32 indexed requestId
    );

    //Initialize event RequestPermissionFulfilled
    event RequestPermissionFulfilled(
        bytes32 indexed requestId,
        uint256 indexed otp
    );

    // Register Patient
    function registerPatients(
        address _patientAddress,
        string memory _metaData,
        string memory _careGiverContact,
        string memory _careGiverName,
        Status _status,
        Sex _gender,
        string memory _masterhash
    ) public returns (uint256) {
        uint256 _patientid = _patientIds.current();
        _patientIds.increment();

        uint256 unique_id = uint256(
            sha256(abi.encodePacked(msg.sender, block.timestamp))
        );

        patients[_patientid] = Patient(
            _patientid,
            unique_id,
            _patientAddress,
            _metaData,
            Sex(_gender),
            block.timestamp,
            msg.sender,
            _masterhash,
            _careGiverName,
            _careGiverContact,
            Status(_status),
            AccessStatus(3)
        );

        patientRegistered[_patientAddress] = true;

        patientDetails[_patientAddress] = patients[_patientid];

        emit PatientEvents(
            _patientid,
            "Patient Registered",
            msg.sender,
            msg.sender,
            block.timestamp
        );

        return unique_id;
    }

    // Register Doctor
    function registerDoctor(
        address _doctorAddress,
        string memory _metaData,
        DoctorType _doctorType,
        Status _status,
        Sex _gender
    ) public returns (bool) {
        require(
            doctorsRegistered[_doctorAddress] == false,
            "Doctor is already added."
        );
        uint256 _doctorid = _doctorIds.current();
        _doctorIds.increment();
        doctorsRegistered[_doctorAddress] = true;

        doctors[_doctorid] = Doctor(
            _doctorid,
            _doctorAddress,
            DoctorType(_doctorType),
            _metaData,
            Status(_status),
            Sex(_gender),
            block.timestamp,
            msg.sender
        );

        emit DoctorEvents(
            _doctorid,
            "Doctor Added",
            _doctorAddress,
            msg.sender,
            block.timestamp
        );
        return true;
    }

    // take back permissions -- delete authorization of doctors
    function deRegisterDoctor(address _doctorAddress)
        public
        only_owner
        returns (bool)
    {
        // if doctor is authorized
        require(
            doctorsRegistered[_doctorAddress] == true,
            "Cannot remove the Doctor who is not active."
        );
        doctorsRegistered[_doctorAddress] = false;
        emit DoctorEvents(
            0,
            "Doctor Deregistered",
            _doctorAddress,
            msg.sender,
            block.timestamp
        );
        return true;
    }

    //Insert the record
    function insertRecords(
        address _patientAddr,
        string memory _masterHash,
        string memory _filehash,
        Role _roleType
    ) public returns (bool) {
        if (Role(_roleType) == Role.DOCTOR) {
            require(
                doctorsRegistered[msg.sender] == true,
                "Doctor not registererd yet"
            );
        }
        if (Role(_roleType) == Role.PATIENT) {
            require(
                patientRegistered[msg.sender] == true,
                "Patient not registererd yet"
            );
        }
        uint256 _recordid = _recordIds.current();
        _recordIds.increment();

        Patient memory p = patientDetails[_patientAddr];
        p.masterHash = _masterHash;

        records[_recordid] = Record(
            _recordid,
            _patientAddr,
            _filehash,
            RecordStatus(0),
            block.timestamp,
            msg.sender,
            Role(_roleType)
        );
        emit RecordEvents(
            _recordid,
            "Record has been inserted",
            _patientAddr,
            msg.sender,
            block.timestamp
        );
        return true;
    }

    //requestToView
    function requestToView(
        address _oracle,
        string memory _jobId,
        address _patientAddr,
        string memory _careGiverEmail
    ) public returns (bytes32 requestId) {
        uint256 _viewId = _viewIds.current();
        Plugin.Request memory request = buildPluginRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillPermission.selector
        );
        request.add("careGiverEmail", _careGiverEmail);
        //Random Number generate logic comes here, then pass it on
        // Once this random number passed to User via email.
        // User should enter the number they received via email,
        // This will be verified in external adapter & verify if both the numbers are matching
        // if yes, then the request will be processed
        uint256 _randomNumber = 52525; // Dummy data
        request.addUint("randomNumber", _randomNumber);

        documentLogs[_viewId] = DocumentLogs(
            _viewId,
            _patientAddr,
            block.timestamp,
            msg.sender,
            _randomNumber,
            false
        );

        requestId = sendPluginRequestTo(_oracle, request, ORACLE_PAYMENT);
        documentLogRequestIds[requestId] = documentLogs[_viewId];
        emit requestCreated(msg.sender, stringToBytes32(_jobId), requestId);
    }

    //callBack function
    function fulfillPermission(bytes32 _requestId, uint256 _otp)
        public
        recordPluginFulfillment(_requestId)
    {
        DocumentLogs memory docLogs = documentLogRequestIds[_requestId];
        if (docLogs.otp == _otp) {
            docLogs.processed = true;
            emit RequestPermissionFulfilled(_requestId, _otp);
        }
    }

    //String to bytes to convert jobid to bytest32
    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
}
