import express from "express";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  visitDate: string;
  doctor: string;
  complaints: {
    complaint: string;
    severity: string;
    duration: string;
  }[];
  history: string;
  familyHistory: {
    father: string;
    mother: string;
    siblings: string;
  };
  params: {
    bp: string;
    pulse: number;
    weightKg: number;
    heightCm: number;
    bmi: number;
  };
  prescription: {
    medicine: string;
    dosage: string;
    timing: string;
    duration: string;
  }[];
}

const patientsPath = path.join(
  process.cwd(),
  "data",
  "patients.json"
);

const patients: Patient[] = JSON.parse(
  fs.readFileSync(patientsPath, "utf-8")
);

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.DEMO_EMAIL ||
    password !== process.env.DEMO_PASSWORD
  ) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  return res.status(200).json({
    name: process.env.DEMO_NAME
  });
});

app.get("/api/patients/:id", (req, res) => {
  const patient = patients.find(
    (item) => item.id === req.params.id
  );

  if (!patient) {
    return res.status(404).json({
      error: `No patient found with ID ${req.params.id}`
    });
  }

  return res.status(200).json(patient);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});