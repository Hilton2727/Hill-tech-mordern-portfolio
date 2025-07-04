import { useState, useEffect } from "react";
import { checkInstallStatus } from "@/services/api";

const tabs = [
  { key: "api", label: "API" },
  { key: "database", label: "Database" },
  { key: "host", label: "Host" },
];

export default function Status() {
  const [tab, setTab] = useState("api");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    checkInstallStatus()
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || "Failed to load status");
      })
      .catch((e) => setError(e.message || "Failed to load status"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 border-b pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-semibold rounded-t-lg ${tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading && <div>Loading status...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && data && (
        <>
          {tab === "api" && (
            <div>
              <h2 className="text-xl font-bold mb-4">API Endpoints (Unauthenticated)</h2>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2">Endpoint</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.api.map((api: any) => (
                    <tr key={api.endpoint}>
                      <td className="p-2 font-mono">{api.endpoint}</td>
                      <td className="p-2">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${api.status === "active" ? "bg-green-500" : "bg-yellow-400"}`}></span>
                        {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "database" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Database Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Total Tables</div>
                  <div className="text-2xl">{data.database.tables}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">SQL Version</div>
                  <div>{data.database.sqlVersion}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">DB IP / Location</div>
                  <div>{data.database.ip} ({data.database.location})</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Speed</div>
                  <div>{data.database.speed}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Memory Used</div>
                  <div>{data.database.memoryUsed}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Memory Remaining</div>
                  <div>{data.database.memoryRemain}</div>
                </div>
              </div>
            </div>
          )}
          {tab === "host" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Host Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Website IP</div>
                  <div>{data.host.websiteIp}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Host</div>
                  <div>{data.host.host}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">OS</div>
                  <div>{data.host.os}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">Uptime</div>
                  <div>{data.host.uptime}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">CPU</div>
                  <div>{data.host.cpu}</div>
                </div>
                <div className="bg-muted rounded p-4">
                  <div className="mb-2 font-semibold">RAM</div>
                  <div>{data.host.ram}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 