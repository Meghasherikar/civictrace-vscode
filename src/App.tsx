 import { useMemo, useState, type ReactNode } from "react";

type Tab =
  | "dashboard"
  | "timeline"
  | "analysis"
  | "evidence"
  | "map"
  | "report";

const project = {
  name: "Ward 7 Stormwater Drain Rehabilitation",
  code: "WD07-SD-2023-114",
  ward: "Ward 7 — Nandagiri",
  originalCost: 21000000,
  revisedCost: 30000000,
  originalScope: 2.4,
  revisedScope: 1.6,
  originalDuration: 6,
  revisedDuration: 9,
};

const documents = [
  {
    name: "Proposal.pdf",
    type: "Proposal",
    date: "April 2023",
    status: "Verified",
  },
  {
    name: "Budget Approval.pdf",
    type: "Budget approval",
    date: "May 2023",
    status: "Verified",
  },
  {
    name: "Tender.pdf",
    type: "Tender",
    date: "June 2023",
    status: "Verified",
  },
  {
    name: "Revised Work Order.pdf",
    type: "Revised work order",
    date: "January 2024",
    status: "Changed",
  },
  {
    name: "Progress Report.pdf",
    type: "Progress report",
    date: "October 2024",
    status: "Needs review",
  },
];

const evidence = [
  {
    label: "Proposal",
    status: "Found",
    detail: "Proposal.pdf, page 1",
  },
  {
    label: "Budget approval",
    status: "Found",
    detail: "Budget Approval.pdf, page 4",
  },
  {
    label: "Tender",
    status: "Found",
    detail: "Tender.pdf, page 2",
  },
  {
    label: "Payment record",
    status: "Missing",
    detail: "No matching record in demo dataset",
  },
  {
    label: "Completion certificate",
    status: "Missing",
    detail: "No matching record in demo dataset",
  },
  {
    label: "Traffic-diversion plan",
    status: "Needs review",
    detail: "Not clearly stated in available records",
  },
];

function formatCrore(value: number) {
  return `₹${(value / 10000000).toFixed(2)} crore`;
}

function percentageChange(oldValue: number, newValue: number) {
  return ((newValue - oldValue) / oldValue) * 100;
}

function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [reportVisible, setReportVisible] = useState(false);

  const costChange = useMemo(
    () => percentageChange(project.originalCost, project.revisedCost),
    [],
  );

  const scopeChange = useMemo(
    () => percentageChange(project.originalScope, project.revisedScope),
    [],
  );

  const durationChange =
    project.revisedDuration - project.originalDuration;

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "timeline", label: "Project Timeline" },
    { id: "analysis", label: "Change Analysis" },
    { id: "evidence", label: "Evidence Gaps" },
    { id: "map", label: "Impact Map" },
    { id: "report", label: "Generated Report" },
  ];

  return (
    <main className="app">
      <header className="header">
        <div>
          <div className="brand">CivicTrace</div>
          <div className="subtitle">
            MUNICIPAL RECORD COMPARISON
          </div>
        </div>

        <span className="badge">
          Synthetic demonstration data
        </span>
      </header>

      <nav className="nav">
        {tabs.map((item) => (
          <button
            key={item.id}
            className={
              tab === item.id
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="content">
        <p className="eyebrow">
          {project.code} · {project.ward}
        </p>

        <h1>{project.name}</h1>

        <p className="muted">
          Municipal Engineering Division (synthetic). Status on
          record: revised work order in force.
        </p>

        {tab === "dashboard" && (
          <>
            <div className="grid four">
              <Card
                title="Documents compared"
                value="5"
                detail="Proposal through progress report"
              />

              <Card
                title="Tracked changes"
                value="3"
                detail="Cost, scope and duration"
              />

              <Card
                title="Evidence gaps"
                value="3"
                detail="2 missing, 1 needs review"
              />

              <Card
                title="Record window"
                value="19 months"
                detail="April 2023 — October 2024"
              />
            </div>

            <div className="grid three">
              <Metric
                title="Cost change"
                value={`+${costChange.toFixed(2)}%`}
                detail={`${formatCrore(
                  project.originalCost,
                )} → ${formatCrore(project.revisedCost)}`}
              />

              <Metric
                title="Scope change"
                value={`${scopeChange.toFixed(2)}%`}
                detail={`${project.originalScope} km → ${
                  project.revisedScope
                } km`}
              />

              <Metric
                title="Duration change"
                value={`+${durationChange} months`}
                detail={`${project.originalDuration} → ${
                  project.revisedDuration
                } months`}
              />
            </div>

            <div className="notice">
              This prototype identifies document differences and
              evidence gaps. It does not determine wrongdoing or
              provide legal advice.
            </div>
          </>
        )}

        {tab === "timeline" && (
          <Panel title="Document timeline">
            <div className="timeline">
              {documents.map((document, index) => (
                <div
                  className="timeline-item"
                  key={document.name}
                >
                  <div className="timeline-dot">
                    {index + 1}
                  </div>

                  <div>
                    <h3>{document.type}</h3>

                    <p>
                      {document.name} · {document.date}
                    </p>

                    <span
                      className={`status ${document.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {document.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "analysis" && (
          <Panel title="Deterministic change analysis">
            <div className="analysis-row">
              <span>Cost</span>

              <strong>
                +{costChange.toFixed(2)}%
              </strong>

              <span>
                {formatCrore(project.originalCost)} →{" "}
                {formatCrore(project.revisedCost)}
              </span>
            </div>

            <div className="analysis-row">
              <span>Scope</span>

              <strong>
                {scopeChange.toFixed(2)}%
              </strong>

              <span>
                {project.originalScope} km →{" "}
                {project.revisedScope} km
              </span>
            </div>

            <div className="analysis-row">
              <span>Completion duration</span>

              <strong>
                +{durationChange} months
              </strong>

              <span>
                {project.originalDuration} →{" "}
                {project.revisedDuration} months
              </span>
            </div>

            <p className="source">
              Sources: Proposal.pdf, page 1 · Revised Work
              Order.pdf, page 2
            </p>
          </Panel>
        )}

        {tab === "evidence" && (
          <Panel title="Evidence status">
            <div className="evidence-list">
              {evidence.map((item) => (
                <div
                  className="evidence-item"
                  key={item.label}
                >
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.detail}</p>
                  </div>

                  <span
                    className={`status ${item.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "map" && (
          <Panel title="Impact map">
            <div className="map">
              <div className="ward">WARD 7</div>

              <div className="road original">
                Original scope · 2.4 km
              </div>

              <div className="road revised">
                Revised scope · 1.6 km
              </div>

              <div className="facility school">
                School
              </div>

              <div className="facility hospital">
                Clinic
              </div>
            </div>

            <p className="source">
              Mock coordinates for demonstration only.
            </p>
          </Panel>
        )}

        {tab === "report" && (
          <Panel title="Generated civic report">
            <button
              className="primary"
              onClick={() => setReportVisible(true)}
            >
              {reportVisible
                ? "Report generated"
                : "Generate report"}
            </button>

            {reportVisible && (
              <article className="report">
                <h2>
                  Ward 7 project verification report
                </h2>

                <h3>What changed?</h3>

                <p>
                  The revised work order lists a cost increase
                  of {costChange.toFixed(2)}%, a scope change of{" "}
                  {Math.abs(scopeChange).toFixed(2)}%, and a{" "}
                  {durationChange}-month increase in planned
                  duration.
                </p>

                <h3>What is verified?</h3>

                <p>
                  Proposal, budget approval, tender, revised work
                  order, and progress report records are present
                  in the synthetic dataset.
                </p>

                <h3>What should be checked?</h3>

                <ul>
                  <li>
                    Why did the project scope change from 2.4 km
                    to 1.6 km?
                  </li>

                  <li>
                    What explains the cost change?
                  </li>

                  <li>
                    Where is the payment record?
                  </li>

                  <li>
                    Has a completion certificate been issued?
                  </li>
                </ul>

                <p className="source">
                  Sources: Proposal.pdf, page 1 · Revised Work
                  Order.pdf, page 2
                </p>
              </article>
            )}
          </Panel>
        )}
      </section>
    </main>
  );
}

function Card({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="card">
      <p className="eyebrow">{title}</p>

      <div className="big-number">
        {value}
      </div>

      <p className="muted">{detail}</p>
    </div>
  );
}

function Metric({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="metric">
      <p className="eyebrow">{title}</p>

      <strong>{value}</strong>

      <p>{detail}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default App;