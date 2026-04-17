export type PharmacyMedicine = {
  name: string;
  medicineId: string;
  group: string;
  stockQty: number;
  lifetimeSupply: number;
  lifetimeSales: number;
  stockLeft: number;
  howToUse: string;
  sideEffects: string;
};

export type PharmacyMedicineGroup = {
  id: string;
  name: string;
  medicineCount: number;
  medicines: Array<{ name: string; count: number }>;
};

export const pharmacyMedicines: PharmacyMedicine[] = [
  {
    name: "Augmentin 625 Duo Tablet",
    medicineId: "D06ID2324345454",
    group: "Generic Medicine",
    stockQty: 350,
    lifetimeSupply: 298,
    lifetimeSales: 290,
    stockLeft: 8,
    howToUse:
      "Take this medication by mouth with or without food as directed by your doctor, usually once daily.",
    sideEffects:
      "Dizziness, lightheadedness, drowsiness, nausea, vomiting, tiredness, excess saliva, blurred vision, weight gain, constipation, headache, and trouble sleeping may occur.",
  },
  {
    name: "Azithral 500 Tablet",
    medicineId: "D06ID2324345451",
    group: "Generic Medicine",
    stockQty: 20,
    lifetimeSupply: 298,
    lifetimeSales: 290,
    stockLeft: 8,
    howToUse:
      "Take this medication by mouth with or without food as directed by your doctor, usually once daily.",
    sideEffects:
      "Dizziness, lightheadedness, drowsiness, nausea, vomiting, tiredness, excess saliva, blurred vision, weight gain, constipation, headache, and trouble sleeping may occur. If any of these effects persist or worsen, consult your doctor.",
  },
  {
    name: "Ascoril LS Syrup",
    medicineId: "D06ID2324345452",
    group: "Diabetes",
    stockQty: 85,
    lifetimeSupply: 220,
    lifetimeSales: 198,
    stockLeft: 22,
    howToUse:
      "Measure the dose carefully and take as prescribed by your physician.",
    sideEffects:
      "Mild nausea, dry mouth, and dizziness may occur. Contact your doctor if symptoms persist.",
  },
  {
    name: "Azee 500 Tablet",
    medicineId: "D06ID2324345450",
    group: "Generic Medicine",
    stockQty: 75,
    lifetimeSupply: 190,
    lifetimeSales: 162,
    stockLeft: 28,
    howToUse: "Use as directed by your doctor, preferably at the same time each day.",
    sideEffects:
      "Headache, mild stomach pain, and nausea may occur.",
  },
  {
    name: "Allegra 120mg Tablet",
    medicineId: "D06ID2324345455",
    group: "Diabetes",
    stockQty: 44,
    lifetimeSupply: 130,
    lifetimeSales: 120,
    stockLeft: 10,
    howToUse: "Take with water. Do not exceed prescribed dosage.",
    sideEffects: "Drowsiness and dizziness can occur in some patients.",
  },
  {
    name: "Alex Syrup",
    medicineId: "D06ID2324345456",
    group: "Generic Medicine",
    stockQty: 65,
    lifetimeSupply: 160,
    lifetimeSales: 154,
    stockLeft: 6,
    howToUse: "Shake well before use and follow recommended dosage.",
    sideEffects: "Dry mouth and mild nausea may occur.",
  },
  {
    name: "Amoxyclav 625 Tablet",
    medicineId: "D06ID2324345457",
    group: "Generic Medicine",
    stockQty: 150,
    lifetimeSupply: 300,
    lifetimeSales: 276,
    stockLeft: 24,
    howToUse: "Take with food as prescribed by your physician.",
    sideEffects:
      "Stomach upset and diarrhea may occur. Seek medical help if severe.",
  },
  {
    name: "Avil 25 Tablet",
    medicineId: "D06ID2324345458",
    group: "Generic Medicine",
    stockQty: 270,
    lifetimeSupply: 340,
    lifetimeSales: 318,
    stockLeft: 22,
    howToUse: "Use exactly as directed by your doctor.",
    sideEffects: "Sleepiness and dry mouth are common side effects.",
  },
];

export const pharmacyMedicineGroups: PharmacyMedicineGroup[] = [
  {
    id: "generic-medicine-02",
    name: "Generic Medicine (02)",
    medicineCount: 22,
    medicines: [
      { name: "Augmentin 625 Duo Tablet", count: 22 },
      { name: "Azithral 500 Tablet", count: 8 },
    ],
  },
  {
    id: "generic-medicine-03",
    name: "Generic Medicine (03)",
    medicineCount: 8,
    medicines: [
      { name: "Augmentin 625 Duo Tablet", count: 22 },
      { name: "Azithral 500 Tablet", count: 8 },
      { name: "Anapthaline Cite", count: 14 },
    ],
  },
  {
    id: "generic-medicine-04",
    name: "Generic Medicine (04)",
    medicineCount: 14,
    medicines: [
      { name: "Amoxyclav 625 Tablet", count: 14 },
      { name: "Avil 25 Tablet", count: 10 },
    ],
  },
];
