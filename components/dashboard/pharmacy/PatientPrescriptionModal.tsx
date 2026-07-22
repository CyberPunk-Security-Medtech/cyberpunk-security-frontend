// "use client";

// import React, { useEffect, useState } from "react";
// import Modal from "@components/Modal";
// import { FieldLabel, Input, Textarea } from "@components/Field";
// import Button from "@components/Button";
// import { consultationService, patientService } from "@services/api";
// import { toast } from "react-toastify";


// interface Patient {
//   id: string;
//   first_name: string;
//   last_name: string;
// }

// interface Consultation {
//   id: string;
//   patient_id: string;
//   reason_for_visit: string;
//   patient?: {
//     id: string;
//   };
// }

// interface PrescriptionFormData {
//   medication_name: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   route: string;
//   instructions: string;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   orgId: string | null;
//   onCreated?: () => void;
// }


// export function PatientPrescriptionModal({
//   open,
//   onClose,
//   orgId,
//   onCreated,
// }: Props) {


// const [patients,setPatients] = useState<Patient[]>([]);

// const [consultations,setConsultations] = useState<Consultation[]>([]);


// const [patientId,setPatientId] = useState("");

// const [consultationId,setConsultationId] = useState("");


// const [loading,setLoading] = useState(false);

// const [loadingConsultations,setLoadingConsultations] = useState(false);



// const [formData,setFormData] = useState<PrescriptionFormData>({

//   medication_name:"",
//   dosage:"",
//   frequency:"",
//   duration:"",
//   route:"",
//   instructions:""

// });





// // useEffect(()=>{


// // if(!orgId || !open)
// // return;



// // const loadData=async()=>{


// // try{


// // const patientData =
// // await patientService.getPatients(
// // orgId
// // );


// // const patientList =
// // Array.isArray(patientData)
// // ? patientData
// // : patientData.patients ?? [];


// // setPatients(patientList);



// // const consultationData =
// // await consultationService.listConsultations(
// // orgId
// // );



// // const consultationList =
// // Array.isArray(consultationData)
// // ? consultationData
// // : consultationData.consultations ?? [];


// // setConsultations(consultationList);







// // }catch(error){

// // console.error(error);

// // }


// // };

// useEffect(() => {

// console.log("Prescription modal effect triggered");

// console.log({
//   open,
//   orgId
// });


// if (!orgId || !open) {
//   console.log("Missing orgId or modal closed");
//   return;
// }



// const loadData = async () => {

// console.log("Loading patients...");


// try {


// const patientData =
// await patientService.getPatients(orgId);


// console.log(
// "PATIENT RESPONSE:",
// patientData
// );



// const patientList =
// Array.isArray(patientData)
// ? patientData
// : patientData?.patients ??
//   patientData?.data ??
//   [];



// console.log(
// "PATIENT LIST:",
// patientList
// );


// setPatients(patientList);





// // const consultationData =
// // await consultationService.listConsultations(orgId);



// // console.log(
// // "CONSULTATION RESPONSE:",
// // consultationData
// // );

// const consultationData =
// await consultationService.listConsultations(orgId);



// console.log(
// "CONSULTATION RESPONSE:",
// consultationData
// );



// const consultationList =
// Array.isArray(consultationData)
// ?
// consultationData
// :
// consultationData?.consultations ??
// consultationData?.data ??
// [];



// console.log(
// "CONSULTATION LIST:",
// consultationList
// );



// setConsultations(
// consultationList
// );



// }catch(error){

// console.error(
// "LOAD ERROR:",
// error
// );


// }


// };


// loadData();



// },[orgId,open]);






// const handleChange=(

// e:
// React.ChangeEvent<
// HTMLInputElement |
// HTMLSelectElement |
// HTMLTextAreaElement
// >

// )=>{


// setFormData(prev=>({

// ...prev,

// [e.target.id]:e.target.value

// }));

// };



// const submit=async()=>{


// if(!orgId || !consultationId){

// toast.error(
// "Select patient consultation first"
// );

// return;

// }



// try{


// setLoading(true);



// await consultationService.createPrescription(

// orgId,

// consultationId,

// {

// medication_name:
// formData.medication_name,


// dosage:
// formData.dosage,


// frequency:
// formData.frequency,


// duration:
// formData.duration,


// route:
// formData.route,


// instructions:
// formData.instructions


// }

// );



// toast.success(
// "Prescription created"
// );



// onClose();



// if(onCreated)
// onCreated();



// }catch(error){


// console.error(error);

// toast.error(
// "Failed creating prescription"
// );



// }finally{

// setLoading(false);

// }


// };






// return (

// <Modal

// title="Create Prescription"

// isOpen={open}

// onClose={onClose}

// >


// <div className="space-y-5 p-6">





// <div>


// <FieldLabel>
// Select Patient
// </FieldLabel>


// <select

// className="
// w-full
// border
// rounded-md
// p-2
// "

// value={patientId}

// onChange={(e)=>{


// setPatientId(e.target.value);

// setConsultationId("");

// }}


// >


// <option value="">
// Choose patient
// </option>


// {

// patients.map((patient)=>(


// <option

// key={patient.id}

// value={patient.id}

// >


// {patient.first_name} {patient.last_name}


// </option>


// ))

// }


// </select>



// </div>






// <div>


// <FieldLabel>
// Select Consultation
// </FieldLabel>


// <select

// className="
// w-full
// border
// rounded-md
// p-2
// "

// value={consultationId}

// onChange={(e)=>
// setConsultationId(e.target.value)
// }


// disabled={!patientId}


// >


// <option value="">
// Choose consultation
// </option>


// {


// consultations

// .filter(
// (item)=>
// item.patient_id === patientId ||
// item.patient?.id === patientId
// )

// .map((item)=>(


// <option

// key={item.id}

// value={item.id}

// >


// {item.reason_for_visit}


// </option>


// ))


// }



// </select>


// </div>






// <div>


// <FieldLabel htmlFor="medication_name">

// Medication Name

// </FieldLabel>


// <Input

// id="medication_name"

// value={
// formData.medication_name
// }

// onChange={handleChange}

// />


// </div>





// <div>


// <FieldLabel htmlFor="dosage">

// Dosage

// </FieldLabel>


// <Input

// id="dosage"

// placeholder="500mg"

// value={
// formData.dosage
// }

// onChange={handleChange}

// />


// </div>







// <div className="grid grid-cols-2 gap-4">


// <div>


// <FieldLabel htmlFor="frequency">

// Frequency

// </FieldLabel>


// <select

// id="frequency"

// className="
// w-full
// border
// rounded-md
// p-2
// "

// value={formData.frequency}

// onChange={handleChange}

// >


// <option value="">
// Select
// </option>

// <option>
// Once daily
// </option>

// <option>
// Twice daily
// </option>

// <option>
// Three times daily
// </option>


// </select>


// </div>




// <div>


// <FieldLabel htmlFor="duration">

// Duration

// </FieldLabel>


// <Input

// id="duration"

// placeholder="7 Days"

// value={formData.duration}

// onChange={handleChange}

// />


// </div>


// </div>





// <div>


// <FieldLabel htmlFor="route">

// Route

// </FieldLabel>


// <select

// id="route"

// className="
// w-full
// border
// rounded-md
// p-2
// "

// value={formData.route}

// onChange={handleChange}


// >


// <option value="">
// Select route
// </option>


// <option>
// Oral
// </option>


// <option>
// Injection
// </option>


// <option>
// Topical
// </option>


// </select>



// </div>







// <div>


// <FieldLabel htmlFor="instructions">

// Instructions

// </FieldLabel>


// <Textarea

// id="instructions"

// value={formData.instructions}

// onChange={handleChange}

// />


// </div>







// <div className="flex justify-end gap-3">


// <button

// onClick={onClose}

// className="
// border
// rounded-full
// px-5
// py-2
// "

// >

// Cancel

// </button>



// <Button
// type="button"

// onSubmitHandler={submit}

// disabled={loading}

// >

// {
// loading
// ?
// "Saving..."
// :
// "Create Prescription"
// }


// </Button>



// </div>




// </div>


// </Modal>

// );


// }


"use client";

import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { FieldLabel, Input, Textarea } from "@components/Field";
import Button from "@components/Button";
import { consultationService, patientService } from "@services/api";
import { toast } from "react-toastify";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface Consultation {
  id: string;
  patient_id: string;
  reason_for_visit: string;
  patient?: {
    id: string;
  };
}

interface PrescriptionFormData {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  orgId: string | null;
  onCreated?: () => void;
}

const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily"];
const ROUTE_OPTIONS = ["Oral", "Injection", "Topical"];

export function PatientPrescriptionModal({
  open,
  onClose,
  orgId,
  onCreated,
}: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patientId, setPatientId] = useState("");
  const [consultationId, setConsultationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [formData, setFormData] = useState<PrescriptionFormData>({
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "",
    instructions: "",
  });

  /**
   * Load patients whenever modal opens
   */
  useEffect(() => {
    if (!open || !orgId) return;

    const loadPatients = async () => {
      try {
        const response = await patientService.getPatients(orgId);
        const list =
          Array.isArray(response)
            ? response
            : response?.patients ?? response?.data ?? [];
        setPatients(list);
      } catch (error) {
        console.error("Failed loading patients", error);
      }
    };

    loadPatients();
  }, [open, orgId]);

  /**
   * Load consultations for selected patient
   */
  const loadPatientConsultations = async (patientId: string) => {
    if (!orgId || !patientId) return;

    try {
      setLoadingConsultations(true);
      const response = await consultationService.listConsultations(orgId, {
        patient_id: patientId,
        status_filter: "In Progress",
      });
      const list: Consultation[] =
        Array.isArray(response)
          ? response
          : response?.consultations ?? response?.data ?? [];

      setConsultations(list);
    } catch (error) {
      console.error("Failed loading consultations", error);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPatientId(id);
    setConsultationId("");
    setConsultations([]);
    if (id) {
      loadPatientConsultations(id);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const resetForm = () => {
    setPatientId("");
    setConsultationId("");
    setConsultations([]);
    setFormData({
      medication_name: "",
      dosage: "",
      frequency: "",
      duration: "",
      route: "",
      instructions: "",
    });
  };

  const submit = async () => {
    if (!orgId || !patientId || !consultationId) {
      toast.error("Select patient and consultation first");
      return;
    }

    if (!formData.medication_name || !formData.dosage || !formData.frequency || !formData.duration || !formData.route) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await consultationService.createPrescription(orgId, consultationId, {
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        route: formData.route,
        instructions: formData.instructions,
      });
      toast.success("Prescription created");
      resetForm();
      onClose();
      if (onCreated) onCreated();
    } catch (error) {
      console.error("CREATE PRESCRIPTION ERROR", error);
      toast.error("Failed creating prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Prescription"
      isOpen={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
    >
      <div className="space-y-5 p-6">
        <div>
          <FieldLabel>Select Patient</FieldLabel>
          <select
            className="w-full border rounded-md p-2"
            value={patientId}
            onChange={handlePatientChange}
          >
            <option value="">Choose patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Select Consultation</FieldLabel>
          <select
            className="w-full border rounded-md p-2"
            value={consultationId}
            disabled={!patientId || loadingConsultations}
            onChange={(e) => setConsultationId(e.target.value)}
          >
            <option value="">
              {loadingConsultations
                ? "Loading consultations..."
                : "Choose consultation"}
            </option>
            {consultations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.reason_for_visit ?? "Consultation"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="medication_name">Medication Name</FieldLabel>
          <Input
            id="medication_name"
            value={formData.medication_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <FieldLabel htmlFor="dosage">Dosage</FieldLabel>
          <Input
            id="dosage"
            placeholder="500mg"
            value={formData.dosage}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
            <select
              id="frequency"
              className="w-full border rounded-md p-2"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {FREQUENCY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="duration">Duration</FieldLabel>
            <Input
              id="duration"
              placeholder="7 Days"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="route">Route</FieldLabel>
          <select
            id="route"
            className="w-full border rounded-md p-2"
            value={formData.route}
            onChange={handleChange}
          >
            <option value="">Select route</option>
            {ROUTE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="border rounded-full px-5 py-2"
          >
            Cancel
          </button>
          <Button
            type="button"
            onSubmitHandler={submit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Prescription"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
