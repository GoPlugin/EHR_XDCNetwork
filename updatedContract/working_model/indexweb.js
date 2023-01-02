const express = require('express');
const { registerPatient, updatePatient, registerPatientGeo, updatePatientGeo, registerPatientHealth, registerCareGiver, 
    updateCareGiver, recordAddByPatient, patientDataView, emergencyView} = require('./function');
const router = express.Router();


router.post('/registerPatient', async (req, res) => {
   const events = await registerPatient(req.body)
   console.log("EVENTS",events)
   res.json(events)
    // res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/updatePatient', async (req, res) => {
    const events = await updatePatient(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/registerPatientGeo', async (req, res) => {
    const events = await registerPatientGeo(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/updatePatientGeo', async (req, res) => {
    const events = await updatePatientGeo(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/registerPatientHealth', async (req, res) => {
    const events = await registerPatientHealth(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/registerCareGiver', async (req, res) => {
    const events = await registerCareGiver(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/updateCareGiver', async (req, res) => {
    const events = await updateCareGiver(req.body)
    res.json({patientKey:events[0].returnValues.retValue,message:events[0].returnValues.evenType})
})

router.post('/recordAddByPatient', async (req, res) => {
    const events = await recordAddByPatient(req.body)
    res.json({patientKey:events[0].returnValues.patKey,message:events[0].returnValues.comment})
})

router.post('/patientDataView', async (req, res) => {
    const events = await patientDataView(req.body)
    res.json({Result:events})
})

router.post('/emergencyView', async (req, res) => {
    const events = await emergencyView(req.body)
    res.json({Result:events})
})


module.exports = router;
