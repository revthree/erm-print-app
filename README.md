# EMR Print App

A mini Electronic Medical Records (EMR) application that allows users to log in, search for a patient, select report sections, and generate a printable Prescription Summary.

## Tech Stack

**Frontend**
- React
- Vite
- TypeScript
- React Router

**Backend**
- Node.js
- Express
- TypeScript

**Data Storage**
- JSON file
- No database required

## Features

- Demo login with backend credential validation
- Patient search by Patient ID
- Review screen with selectable report sections
- Prescription Summary report
- Empty sections display "No data recorded"
- Print-friendly A4 report layout
- Logout and protected frontend routes
- Save the report as a PDF through the browser's print dialog

## Project Structure

```text
emr-print-app/
├── frontend/
│   └── src/
│       ├── App.tsx
│       └── App.css
├── backend/
│   ├── data/
│   │   └── patients.json
│   ├── src/
│   │   └── server.ts
│   ├── .env
│   └── tsconfig.json
└── .gitignore
```

## Prerequisites

- Node.js and npm installed
- A terminal or command prompt

## Setup and Installation

### 1. Backend Setup

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:

```env
DEMO_EMAIL=demo@example.com
DEMO_PASSWORD=demo123
DEMO_NAME=Demo User
PORT=4000
```

Start the backend server:

```bash
npm run dev
```

The backend runs at `http://localhost:4000`.

Keep this terminal running.

### 2. Frontend Setup

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser, usually `http://localhost:5173`.

Keep this terminal running as well.

## Demo Credentials

- **Email:** `demo@example.com`
- **Password:** `demo123`

These credentials are for local demonstration purposes.

## Sample Patient IDs

The application includes three dummy patient records:

- `1001`
- `1002`
- `1003`

Searching for an unknown patient ID, such as `9999`, displays a not-found message.

## Report Sections

The report supports the following sections in a fixed order:

1. Health Complaints
2. History of Illness
3. Family History
4. Parameters
5. Prescription

All sections are selected by default. Users can deselect sections they do not want included in the report.

If a section has no data, the report displays "No data recorded".

## Printing the Report

1. Search for a patient and open the Review screen.
2. Select the report sections to include.
3. Click **Generate Report**.
4. Click **Print** on the Report screen.
5. Choose **Save as PDF** in the browser's print dialog.

The report is designed to fit A4 paper.

## Notes

- Patient records are stored in `backend/data/patients.json`.
- Demo credentials are configured in `backend/.env`.
- The `.env` file should not be committed to version control.
- This is an evaluation application that uses dummy patient data and does not require a database.
