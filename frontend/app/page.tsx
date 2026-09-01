"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type KPI = {
  deliveries: number;
  delivery_cost: number;
  on_time_rate: number;
  avg_delivery_time: number;
  avg_rating: number;
  partners: number;
  regions: number;
};

type Partner = {
  delivery_partner: string;
  deliveries: number;
  avg_cost: number;
  avg_delivery_time: number;
  on_time_rate: number;
  avg_rating: number;
  delay_rate: number;
};

type Region = {
  region: string;
  deliveries: number;
  avg_cost: number;
  avg_delivery_time: number;
  on_time_rate: number;
  avg_rating: number;
  delay_rate: number;
};

type Recommendation = {
  region: string;
  delivery_partner: string;
  decision_score: number;
  avg_cost: number;
  avg_delivery_time: number;
  on_time_rate: number;
  avg_rating: number;
};

type Simulation = {
  region: string;
  current_partner: string;
  new_partner: string;
  shift_percentage: number;
  shifted_deliveries: number;
  current_cost: number;
  new_cost: number;
  projected_savings: number;
  current_on_time_rate: number;
  new_on_time_rate: number;
  projected_on_time_rate: number;
  current_delivery_time: number;
  new_delivery_time: number;
  projected_delivery_time: number;
};

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

export default function Home() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [region, setRegion] = useState("south");
  const [currentPartner, setCurrentPartner] =
    useState("delhivery");
  const [newPartner, setNewPartner] = useState("fedex");
  const [shift, setShift] = useState(50);

  const [simulation, setSimulation] =
    useState<Simulation | null>(null);

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          kpiResponse,
          partnersResponse,
          regionsResponse,
          recommendationsResponse,
        ] = await Promise.all([
          fetch(`${API}/api/kpis`),
          fetch(`${API}/api/partners`),
          fetch(`${API}/api/regions`),
          fetch(`${API}/api/recommendations`),
        ]);

        if (
          !kpiResponse.ok ||
          !partnersResponse.ok ||
          !regionsResponse.ok ||
          !recommendationsResponse.ok
        ) {
          throw new Error("Unable to load dashboard data");
        }

        setKpi(await kpiResponse.json());
        setPartners(await partnersResponse.json());
        setRegions(await regionsResponse.json());
        setRecommendations(
          await recommendationsResponse.json()
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "API unavailable"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function runSimulation() {
    try {
      setSimulating(true);
      setSimulation(null);

      const response = await fetch(`${API}/api/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region,
          current_partner: currentPartner,
          new_partner: newPartner,
          shift_percentage: shift,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Simulation failed"
        );
      }

      setSimulation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Simulation failed"
      );
    } finally {
      setSimulating(false);
    }
  }

  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <div className="eyebrow">
            DELIVERY OPERATIONS
          </div>

          <h1>Decision Intelligence</h1>

          <p>
            Data-driven delivery partner selection,
            regional performance analysis and what-if
            decision simulation.
          </p>
        </div>

        <div className="status">
          <span className="statusDot" />
          System Operational
        </div>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading decision intelligence data...
        </div>
      ) : (
        <>
          {/* KPI SECTION */}

          <section className="kpiGrid">
            <KpiCard
              label="Total Deliveries"
              value={kpi?.deliveries.toLocaleString() ?? "—"}
              subtitle="Across all regions"
            />

            <KpiCard
              label="Delivery Cost"
              value={
                kpi ? money(kpi.delivery_cost) : "—"
              }
              subtitle="Total logistics cost"
            />

            <KpiCard
              label="On-Time Rate"
              value={
                kpi
                  ? `${kpi.on_time_rate.toFixed(2)}%`
                  : "—"
              }
              subtitle="Overall performance"
            />

            <KpiCard
              label="Avg Delivery Time"
              value={
                kpi
                  ? `${kpi.avg_delivery_time.toFixed(2)}h`
                  : "—"
              }
              subtitle="Average delivery duration"
            />

            <KpiCard
              label="Average Rating"
              value={
                kpi ? kpi.avg_rating.toFixed(2) : "—"
              }
              subtitle="Customer delivery rating"
            />

            <KpiCard
              label="Delivery Partners"
              value={kpi?.partners ?? "—"}
              subtitle="Available partners"
            />

            <KpiCard
              label="Operating Regions"
              value={kpi?.regions ?? "—"}
              subtitle="Covered zones"
            />
          </section>

          {/* RECOMMENDATIONS */}

          <section className="section">
            <div className="sectionHeader">
              <div>
                <div className="eyebrow">
                  DECISION ENGINE
                </div>
                <h2>Recommended Partner by Region</h2>
                <p>
                  Best partner based on cost, delivery
                  speed, reliability and rating.
                </p>
              </div>
            </div>

            <div className="recommendationGrid">
              {recommendations.map((item) => (
                <div
                  className="recommendationCard"
                  key={item.region}
                >
                  <div className="regionName">
                    {item.region.toUpperCase()}
                  </div>

                  <div className="recommendedPartner">
                    {item.delivery_partner}
                  </div>

                  <div className="score">
                    Decision Score{" "}
                    <strong>
                      {item.decision_score.toFixed(2)}
                    </strong>
                  </div>

                  <div className="metrics">
                    <Metric
                      label="Cost"
                      value={money(item.avg_cost)}
                    />
                    <Metric
                      label="On-time"
                      value={`${item.on_time_rate.toFixed(
                        2
                      )}%`}
                    />
                    <Metric
                      label="Time"
                      value={`${item.avg_delivery_time.toFixed(
                        2
                      )}h`}
                    />
                    <Metric
                      label="Rating"
                      value={item.avg_rating.toFixed(2)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PARTNER PERFORMANCE */}

          <section className="section">
            <div className="sectionHeader">
              <div>
                <div className="eyebrow">
                  PERFORMANCE
                </div>
                <h2>Delivery Partner Performance</h2>
                <p>
                  Compare all delivery partners across
                  operational metrics.
                </p>
              </div>
            </div>

            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Deliveries</th>
                    <th>Avg Cost</th>
                    <th>Avg Time</th>
                    <th>On-Time</th>
                    <th>Rating</th>
                    <th>Delay</th>
                  </tr>
                </thead>

                <tbody>
                  {partners.map((partner) => (
                    <tr
                      key={
                        partner.delivery_partner
                      }
                    >
                      <td className="partnerCell">
                        {partner.delivery_partner}
                      </td>

                      <td>
                        {partner.deliveries.toLocaleString()}
                      </td>

                      <td>
                        {money(partner.avg_cost)}
                      </td>

                      <td>
                        {partner.avg_delivery_time.toFixed(
                          2
                        )}
                        h
                      </td>

                      <td>
                        <span className="good">
                          {partner.on_time_rate.toFixed(
                            2
                          )}
                          %
                        </span>
                      </td>

                      <td>
                        {partner.avg_rating.toFixed(2)}
                      </td>

                      <td>
                        <span className="bad">
                          {partner.delay_rate.toFixed(2)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* REGIONAL PERFORMANCE */}

          <section className="section">
            <div className="sectionHeader">
              <div>
                <div className="eyebrow">
                  REGIONAL ANALYSIS
                </div>
                <h2>Zone Performance</h2>
                <p>
                  Understand how delivery operations
                  perform across regions.
                </p>
              </div>
            </div>

            <div className="regionGrid">
              {regions.map((item) => (
                <div
                  className="regionCard"
                  key={item.region}
                >
                  <div className="regionTop">
                    <h3>{item.region}</h3>

                    <span>
                      {item.deliveries.toLocaleString()}{" "}
                      deliveries
                    </span>
                  </div>

                  <div className="barContainer">
                    <div
                      className="bar"
                      style={{
                        width: `${item.on_time_rate}%`,
                      }}
                    />
                  </div>

                  <div className="regionStats">
                    <Metric
                      label="On-Time"
                      value={`${item.on_time_rate.toFixed(
                        2
                      )}%`}
                    />

                    <Metric
                      label="Delay"
                      value={`${item.delay_rate.toFixed(
                        2
                      )}%`}
                    />

                    <Metric
                      label="Avg Cost"
                      value={money(item.avg_cost)}
                    />

                    <Metric
                      label="Rating"
                      value={item.avg_rating.toFixed(
                        2
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SIMULATION */}

          <section className="section simulator">
            <div className="sectionHeader">
              <div>
                <div className="eyebrow">
                  WHAT-IF ANALYSIS
                </div>

                <h2>Delivery Partner Simulator</h2>

                <p>
                  Estimate the operational impact of
                  shifting deliveries between partners.
                </p>
              </div>
            </div>

            <div className="simulationControls">
              <label>
                Region
                <select
                  value={region}
                  onChange={(e) =>
                    setRegion(e.target.value)
                  }
                >
                  {regions.map((r) => (
                    <option
                      key={r.region}
                      value={r.region}
                    >
                      {r.region}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Current Partner
                <select
                  value={currentPartner}
                  onChange={(e) =>
                    setCurrentPartner(e.target.value)
                  }
                >
                  {partners.map((p) => (
                    <option
                      key={p.delivery_partner}
                      value={p.delivery_partner}
                    >
                      {p.delivery_partner}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                New Partner
                <select
                  value={newPartner}
                  onChange={(e) =>
                    setNewPartner(e.target.value)
                  }
                >
                  {partners.map((p) => (
                    <option
                      key={p.delivery_partner}
                      value={p.delivery_partner}
                    >
                      {p.delivery_partner}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Shift Deliveries
                <div className="rangeRow">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={shift}
                    onChange={(e) =>
                      setShift(Number(e.target.value))
                    }
                  />

                  <strong>{shift}%</strong>
                </div>
              </label>

              <button
                onClick={runSimulation}
                disabled={simulating}
              >
                {simulating
                  ? "Calculating..."
                  : "Run Simulation"}
              </button>
            </div>

            {simulation && (
              <div className="simulationResult">
                <div className="simulationTitle">
                  Simulation Result
                </div>

                <div className="simulationSummary">
                  Moving{" "}
                  <strong>
                    {simulation.shifted_deliveries.toLocaleString()}
                  </strong>{" "}
                  deliveries from{" "}
                  <strong>
                    {simulation.current_partner}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {simulation.new_partner}
                  </strong>{" "}
                  in the{" "}
                  <strong>{simulation.region}</strong>{" "}
                  region.
                </div>

                <div className="resultGrid">
                  <ResultCard
                    label="Projected Cost Impact"
                    value={
                      simulation.projected_savings >= 0
                        ? `+${money(
                            simulation.projected_savings
                          )} savings`
                        : `${money(
                            Math.abs(
                              simulation.projected_savings
                            )
                          )} additional cost`
                    }
                    positive={
                      simulation.projected_savings >= 0
                    }
                  />

                  <ResultCard
                    label="Projected On-Time Rate"
                    value={`${simulation.projected_on_time_rate.toFixed(
                      2
                    )}%`}
                    positive={
                      simulation.projected_on_time_rate >=
                      simulation.current_on_time_rate
                    }
                  />

                  <ResultCard
                    label="Projected Delivery Time"
                    value={`${simulation.projected_delivery_time.toFixed(
                      2
                    )}h`}
                    positive={
                      simulation.projected_delivery_time <=
                      simulation.current_delivery_time
                    }
                  />
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function KpiCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="kpiCard">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiSubtitle">{subtitle}</div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="metricLabel">{label}</div>
      <div className="metricValue">{value}</div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="resultCard">
      <div className="metricLabel">{label}</div>

      <div
        className={
          positive ? "resultValue positive" : "resultValue negative"
        }
      >
        {value}
      </div>
    </div>
  );
}