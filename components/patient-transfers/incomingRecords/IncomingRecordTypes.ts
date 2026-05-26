export type IncomingRecordStatus = "Pending" | "Accepted" | "Rejected";

export type IncomingRecord = {
  id: string;
  initials: string;
  patientName: string;
  gpid: string;
  priority: "Urgent" | "Normal";
  condition: string;
  fromHospital: string;
  requestedAt: string;
  records: string[];
  fileSize: string;
  status: IncomingRecordStatus;
  age: number;
  gender: string;
  bloodGroup: string;
  genotype: string;
};