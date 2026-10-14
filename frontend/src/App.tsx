
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      sessionStorage.setItem("userName", data.name);
      navigate("/lookup", { replace: true });
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>ABC Hospitals</h1>
        <p className="login-subtitle">EMR Print Portal</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!sessionStorage.getItem("userName")) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PatientSearch() {
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4000/api/patients/${encodeURIComponent(patientId.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `No patient found with ID ${patientId}`);
        return;
      }

      navigate(`/review/${data.id}`);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("userName");
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-page">
      <header className="top-bar">
        <strong>ABC Hospitals</strong>
        <div className="user-actions">
          <span>Welcome, {userName}</span>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="content-card">
        <h1>Patient Search</h1>
        <p>Enter a patient ID to retrieve their medical record.</p>

        <form className="search-form" onSubmit={handleSearch}>
          <label htmlFor="patientId">Patient ID</label>
          <input
            id="patientId"
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            placeholder="e.g. 1001"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
      </main>
    </div>
  );
}


function ReviewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<{
    id: string;
    name: string;
    age: number;
    gender: string;
  } | null>(null);

  const [selectedSections, setSelectedSections] = useState<string[]>([
    "complaints",
    "history",
    "familyHistory",
    "params",
    "prescription",
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(
          `http://localhost:4000/api/patients/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to retrieve patient.");
          return;
        }

        setPatient(data);
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  function toggleSection(section: string) {
    setSelectedSections((previous) =>
      previous.includes(section)
        ? previous.filter((item) => item !== section)
        : [...previous, section]
    );
  }

  function handleLogout() {
    sessionStorage.removeItem("userName");
    navigate("/login", { replace: true });
  }

  const sections = [
    { id: "complaints", label: "Health Complaints" },
    { id: "history", label: "History of Illness" },
    { id: "familyHistory", label: "Family History" },
    { id: "params", label: "Parameters" },
    { id: "prescription", label: "Prescription" },
  ];

  if (loading) {
    return <main className="content-card">Loading patient details...</main>;
  }

  if (error || !patient) {
    return (
      <main className="content-card">
        <p className="login-error">{error || "Patient not found."}</p>
        <button onClick={() => navigate("/lookup")}>
          Back to Patient Search
        </button>
      </main>
    );
  }

  return (
    <div className="app-page">
      <header className="top-bar">
        <strong>ABC Hospitals</strong>
        <div className="user-actions">
          <span>Welcome, {sessionStorage.getItem("userName")}</span>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="content-card">
        <h1>Review Patient</h1>

        <div className="patient-summary">
          <p><strong>Patient Name:</strong> {patient.name}</p>
          <p><strong>Patient ID:</strong> {patient.id}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
        </div>

        <h2>Select Report Sections</h2>

        <div className="section-list">
          {sections.map((section) => (
            <label key={section.id} className="section-option">
              <input
                type="checkbox"
                checked={selectedSections.includes(section.id)}
                onChange={() => toggleSection(section.id)}
              />
              {section.label}
            </label>
          ))}
        </div>

        <div className="review-actions">
          <button
            className="secondary-button"
            onClick={() => navigate("/lookup")}
          >
            Back
          </button>

          <button
            disabled={selectedSections.length === 0}
            onClick={() => {
              sessionStorage.setItem(
                `selectedSections-${patient.id}`,
                JSON.stringify(selectedSections)
              );
              navigate(`/report/${patient.id}`);
            }}
          >
            Generate Report
          </button>
        </div>
      </main>
    </div>
  );
}


function ReportScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storageKey = `selectedSections-${id}`;

  const selectedSections: string[] = JSON.parse(
    sessionStorage.getItem(storageKey) ??
      '["complaints","history","familyHistory","params","prescription"]'
  );

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(
          `http://localhost:4000/api/patients/${id}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to retrieve patient.");
          return;
        }

        setPatient(data);
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  function handleLogout() {
    sessionStorage.removeItem("userName");
    navigate("/login", { replace: true });
  }

  if (loading) {
    return <main className="content-card">Generating report...</main>;
  }

  if (error || !patient) {
    return (
      <main className="content-card">
        <p className="login-error">{error || "Patient not found."}</p>
        <button onClick={() => navigate("/lookup")}>
          Back to Patient Search
        </button>
      </main>
    );
  }

  return (
    <div className="app-page">
      <header className="top-bar no-print">
        <strong>ABC Hospitals</strong>
        <div className="user-actions">
          <span>Welcome, {sessionStorage.getItem("userName")}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="report-page">
        <article className="report-sheet">
          <header className="report-header">
            <h1>ABC Hospitals</h1>
            <h2>Prescription Summary</h2>
          </header>

          <section className="report-patient-details">
            <p><strong>Patient Name:</strong> {patient.name}</p>
            <p><strong>Patient ID:</strong> {patient.id}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Visit Date:</strong> {patient.visitDate}</p>
            <p><strong>Doctor:</strong> {patient.doctor}</p>
          </section>

          {selectedSections.includes("complaints") && (
            <section className="report-section">
              <h3>1. Health Complaints</h3>
              {patient.complaints?.length ? (
                <table>
                  <thead>
                    <tr>
                      <th>Complaint</th>
                      <th>Severity</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.complaints.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.complaint}</td>
                        <td>{item.severity}</td>
                        <td>{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data recorded</p>
              )}
            </section>
          )}

          {selectedSections.includes("history") && (
            <section className="report-section">
              <h3>2. History of Illness</h3>
              <p>{patient.history || "No data recorded"}</p>
            </section>
          )}

          {selectedSections.includes("familyHistory") && (
            <section className="report-section">
              <h3>3. Family History</h3>
              {patient.familyHistory &&
              Object.values(patient.familyHistory).some(Boolean) ? (
                <table>
                  <thead>
                    <tr>
                      <th>Father</th>
                      <th>Mother</th>
                      <th>Siblings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{patient.familyHistory.father || "No data recorded"}</td>
                      <td>{patient.familyHistory.mother || "No data recorded"}</td>
                      <td>{patient.familyHistory.siblings || "No data recorded"}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No data recorded</p>
              )}
            </section>
          )}

          {selectedSections.includes("params") && (
            <section className="report-section">
              <h3>4. Parameters</h3>
              {patient.params &&
              Object.values(patient.params).some(
                (value) => value !== null && value !== undefined && value !== ""
              ) ? (
                <table>
                  <thead>
                    <tr>
                      <th>BP</th>
                      <th>Pulse</th>
                      <th>Weight (kg)</th>
                      <th>Height (cm)</th>
                      <th>BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{patient.params.bp || "No data recorded"}</td>
                      <td>{patient.params.pulse ?? "No data recorded"}</td>
                      <td>{patient.params.weightKg ?? "No data recorded"}</td>
                      <td>{patient.params.heightCm ?? "No data recorded"}</td>
                      <td>{patient.params.bmi ?? "No data recorded"}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No data recorded</p>
              )}
            </section>
          )}

          {selectedSections.includes("prescription") && (
            <section className="report-section">
              <h3>5. Prescription</h3>
              {patient.prescription?.length ? (
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Timing</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.prescription.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.medicine}</td>
                        <td>{item.dosage}</td>
                        <td>{item.timing}</td>
                        <td>{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data recorded</p>
              )}
            </section>
          )}

          <footer className="report-footer">
            <p>ABC Hospitals</p>
            <p>Hospital address: 123 Health Avenue, Bengaluru, Karnataka</p>
            <p>Phone: +91 8000012345</p>
          </footer>
        </article>
      </main>

      <div className="report-actions no-print">
        <button
          className="secondary-button"
          onClick={() => navigate(`/review/${id}`)}
        >
          Back to Review
        </button>
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/lookup"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewScreen/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <ReportScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={sessionStorage.getItem("userName") ? "/lookup" : "/login"}
              replace
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
