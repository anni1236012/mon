"use client";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export interface Server {
  id: number;
  hostname: string;
  selected: boolean;
  metricbeat: boolean;
  filebeat: boolean;
  connectivityStatus: "pending" | "success" | "failed";
  logPaths: string[];
}

export interface Alert {
  name: string;
  type: string;
  enabled: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  processes?: string[];
  logKeywords?: LogAlert[];
}

// Add new interface for LogAlert
export interface LogAlert {
  keyword: string;
  severity: "warning" | "critical";
}

// Mock data
const mockServers: Server[] = [
  {
    id: 1,
    hostname: "prod-app-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 2,
    hostname: "prod-db-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 3,
    hostname: "prod-cache-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 4,
    hostname: "stage-app-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 5,
    hostname: "stage-db-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 6,
    hostname: "dev-app-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
  {
    id: 7,
    hostname: "dev-db-01.example.com",
    selected: false,
    metricbeat: false,
    filebeat: false,
    connectivityStatus: "pending",
    logPaths: [],
  },
];

const mockAlerts: Alert[] = [
  {
    name: "Memory Monitoring",
    type: "memory",
    enabled: false,
    warningThreshold: 80,
    criticalThreshold: 90,
  },
  {
    name: "CPU Monitoring",
    type: "cpu",
    enabled: false,
    warningThreshold: 70,
    criticalThreshold: 85,
  },
  {
    name: "Process Monitoring",
    type: "process",
    enabled: false,
    processes: [],
  },
  {
    name: "Log Monitoring",
    type: "log",
    enabled: false,
    logKeywords: [],
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Select Servers",
    "Check Connectivity",
    "Choose Services",
    "Configure Paths",
    "Setup Alerts",
  ];

  const handleServerSelection = (serverId: number) => {
    setServers(
      servers.map((server) =>
        server.id === serverId
          ? { ...server, selected: !server.selected }
          : server
      )
    );
  };

  const simulateConnectivity = () => {
    setServers(
      servers.map((server) => ({
        ...server,
        connectivityStatus: server.selected ? "success" : "pending",
      }))
    );
  };

  const handleServiceSelection = (
    serverId: number,
    service: "metricbeat" | "filebeat"
  ) => {
    setServers(
      servers.map((server) =>
        server.id === serverId
          ? { ...server, [service]: !server[service] }
          : server
      )
    );
  };

  const handleLogPathChange = (serverId: number, path: string) => {
    setServers(
      servers.map((server) =>
        server.id === serverId
          ? {
              ...server,
              logPaths: [...server.logPaths, path],
            }
          : server
      )
    );
  };

  const handleAlertChange = (alertType: string, field: string, value: any) => {
    setAlerts(
      alerts.map((alert) =>
        alert.type === alertType ? { ...alert, [field]: value } : alert
      )
    );
  };

  const handleLogKeywordAdd = (
    keyword: string,
    severity: "warning" | "critical"
  ) => {
    setAlerts(
      alerts.map((alert) =>
        alert.type === "log"
          ? {
              ...alert,
              logKeywords: [
                ...(alert.logKeywords || []),
                { keyword, severity },
              ],
            }
          : alert
      )
    );
  };

  const handleComplete = () => {
    setIsComplete(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (currentStep === 2 && isSimulating) {
      // First set all selected servers to pending
      setServers(
        servers.map((server) => ({
          ...server,
          connectivityStatus: server.selected
            ? "pending"
            : server.connectivityStatus,
        }))
      );

      // Then simulate success after delay
      const timer = setTimeout(() => {
        setServers(
          servers.map((server) => ({
            ...server,
            connectivityStatus: server.selected
              ? "success"
              : server.connectivityStatus,
          }))
        );
        setIsSimulating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isSimulating]);

  return (
    <main className="h-screen bg-[#0A0C10] text-gray-100 p-8 flex flex-col overflow-hidden">
      {!isComplete ? (
        // Application Title
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">
            InstaMonitor Onboarding
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Configure your monitoring setup
          </p>
        </div>
      ) : (
        // Add completion screen
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#4B7BF5]">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-400">
              You have successfully onboarded to InstaMonitor
            </p>
            <p className="text-gray-500">
              Your servers are now being monitored. You can access your
              dashboard to view metrics and alerts.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-3 bg-[#4B7BF5] text-white rounded-lg hover:bg-[#3D63C9] 
                transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Updated Stepper - centered with max-width */}
      <div className="mb-8 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center relative">
          {/* Progress line */}
          <div className="absolute h-0.5 bg-gray-700 top-6 left-0 right-0 -z-1" />
          <div
            className="absolute h-0.5 bg-[#4B7BF5] top-6 left-0 transition-all duration-300 -z-1"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                ${
                  currentStep > index + 1
                    ? "bg-[#4B7BF5] border-[#4B7BF5]"
                    : currentStep === index + 1
                    ? "bg-[#4B7BF5] border-[#4B7BF5]"
                    : "bg-[#1A1D24] border-gray-700"
                } text-white z-10 transition-all duration-300`}
              >
                {currentStep > index + 1 ? "✓" : index + 1}
              </div>
              <span
                className={`text-sm font-medium mt-8 w-32 text-center absolute top-4
                ${
                  currentStep >= index + 1 ? "text-[#4B7BF5]" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 mt-8 w-full max-w-6xl mx-auto bg-[#1A1D24] rounded-xl shadow-xl p-6 border border-gray-800 flex flex-col overflow-hidden">
        {/* Wrap step content in a div that scrolls - adjust padding bottom to account for buttons */}
        <div className="flex-1">
          {/* Step 1: Select Servers */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#4B7BF5] mb-4">
                Select Servers to Monitor
              </h2>
              <div
                className="grid grid-cols-1 gap-4 pb-16 max-h-[60vh] overflow-y-auto pr-2 
                scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
              >
                {servers.map((server) => (
                  <div
                    key={server.id}
                    onClick={() => handleServerSelection(server.id)}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        server.selected
                          ? "border-[#4B7BF5] bg-[#1E2128]"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center
                        ${
                          server.selected
                            ? "border-[#4B7BF5] bg-[#4B7BF5]"
                            : "border-gray-600"
                        }`}
                      >
                        {server.selected && (
                          <svg
                            className="w-4 h-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-white font-medium">
                        {server.hostname}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {server.hostname.includes("prod")
                          ? "Production"
                          : server.hostname.includes("stage")
                          ? "Staging"
                          : "Development"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Check Connectivity */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#4B7BF5] mb-6">
                Check Server Connectivity
              </h2>
              <div
                className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-16
                  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
              >
                {servers
                  .filter((server) => server.selected)
                  .map((server) => (
                    <div
                      key={server.id}
                      className="p-4 rounded-lg border border-gray-800 bg-[#1E2128]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">
                            {server.hostname}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {server.connectivityStatus === "pending"
                              ? "Checking Elasticsearch connectivity..."
                              : "Elasticsearch connection established"}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2
                        ${
                          server.connectivityStatus === "success"
                            ? "bg-green-900/50 text-green-300"
                            : server.connectivityStatus === "failed"
                            ? "bg-red-900/50 text-red-300"
                            : "bg-yellow-900/50 text-yellow-300"
                        }`}
                        >
                          {server.connectivityStatus === "pending" && (
                            <svg
                              className="animate-spin h-4 w-4 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          )}
                          <span className="capitalize">
                            {server.connectivityStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Step 3: Choose Services */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#4B7BF5] mb-6">
                Choose Services to Install
              </h2>
              <div
                className="grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto pr-2 pb-16
                  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
              >
                {servers
                  .filter((server) => server.selected)
                  .map((server) => (
                    <div
                      key={server.id}
                      className="p-6 rounded-lg border border-gray-800 bg-[#1E2128] hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {server.hostname}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Select monitoring services to install
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-sm">
                          Connected
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Metricbeat Card */}
                        <label className="cursor-pointer group">
                          <div
                            className={`p-4 rounded-lg border ${
                              server.metricbeat
                                ? "border-[#4B7BF5] bg-[#4B7BF5]/10"
                                : "border-gray-700 hover:border-gray-600"
                            } transition-all`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={server.metricbeat}
                                onChange={() =>
                                  handleServiceSelection(
                                    server.id,
                                    "metricbeat"
                                  )
                                }
                                className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                              />
                              <div>
                                <span className="text-white font-medium block">
                                  Metricbeat
                                </span>
                                <span className="text-gray-400 text-sm">
                                  System metrics monitoring
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>

                        {/* Filebeat Card */}
                        <label className="cursor-pointer group">
                          <div
                            className={`p-4 rounded-lg border ${
                              server.filebeat
                                ? "border-[#4B7BF5] bg-[#4B7BF5]/10"
                                : "border-gray-700 hover:border-gray-600"
                            } transition-all`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={server.filebeat}
                                onChange={() =>
                                  handleServiceSelection(server.id, "filebeat")
                                }
                                className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                              />
                              <div>
                                <span className="text-white font-medium block">
                                  Filebeat
                                </span>
                                <span className="text-gray-400 text-sm">
                                  Log file monitoring
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 pb-16 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {servers
                .filter((s) => s.selected && s.filebeat)
                .map((server) => (
                  <div
                    key={server.id}
                    className="p-6 rounded-lg bg-[#12141A] border border-gray-800"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {server.hostname}
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter log path"
                        className="w-full px-4 py-3 rounded-lg bg-[#2A2D35] border border-gray-700 
                          text-white placeholder-gray-400 focus:outline-none focus:border-[#4B7BF5] 
                          focus:ring-1 focus:ring-[#4B7BF5] transition-colors"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleLogPathChange(
                              server.id,
                              (e.target as HTMLInputElement).value
                            );
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <div className="mt-4 space-y-2">
                        {server.logPaths.map((path, index) => (
                          <div
                            key={index}
                            className="text-gray-400 text-sm pl-2 border-l-2 border-[#4B7BF5]"
                          >
                            {path}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Step 5: Setup Alerts */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#4B7BF5] mb-6 ">
                Configure Monitoring Alerts
              </h2>
              <div className="grid grid-cols-1 pb-16 gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {servers
                  .filter((server) => server.selected)
                  .map((server) => (
                    <div
                      key={server.id}
                      className="p-6 rounded-lg border border-gray-800 bg-[#1E2128]"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {server.hostname}
                      </h3>

                      {/* Metricbeat Alerts */}
                      {server.metricbeat && (
                        <div className="space-y-4 mb-6">
                          {/* Memory Monitoring */}
                          <div className="p-4 rounded bg-[#12141A]">
                            <div className="flex items-center justify-between mb-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    alerts.find((a) => a.type === "memory")
                                      ?.enabled
                                  }
                                  onChange={(e) =>
                                    handleAlertChange(
                                      "memory",
                                      "enabled",
                                      e.target.checked
                                    )
                                  }
                                  className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                                />
                                <span className="text-white font-medium">
                                  Memory Monitoring
                                </span>
                              </label>
                            </div>
                            {alerts.find((a) => a.type === "memory")
                              ?.enabled && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-400">
                                    Warning Threshold (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      alerts.find((a) => a.type === "memory")
                                        ?.warningThreshold
                                    }
                                    onChange={(e) =>
                                      handleAlertChange(
                                        "memory",
                                        "warningThreshold",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full mt-1 px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">
                                    Critical Threshold (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      alerts.find((a) => a.type === "memory")
                                        ?.criticalThreshold
                                    }
                                    onChange={(e) =>
                                      handleAlertChange(
                                        "memory",
                                        "criticalThreshold",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full mt-1 px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CPU Monitoring */}
                          <div className="p-4 rounded bg-[#12141A]">
                            <div className="flex items-center justify-between mb-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    alerts.find((a) => a.type === "cpu")
                                      ?.enabled
                                  }
                                  onChange={(e) =>
                                    handleAlertChange(
                                      "cpu",
                                      "enabled",
                                      e.target.checked
                                    )
                                  }
                                  className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                                />
                                <span className="text-white font-medium">
                                  CPU Monitoring
                                </span>
                              </label>
                            </div>
                            {alerts.find((a) => a.type === "cpu")?.enabled && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-400">
                                    Warning Threshold (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      alerts.find((a) => a.type === "cpu")
                                        ?.warningThreshold
                                    }
                                    onChange={(e) =>
                                      handleAlertChange(
                                        "cpu",
                                        "warningThreshold",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full mt-1 px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">
                                    Critical Threshold (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      alerts.find((a) => a.type === "cpu")
                                        ?.criticalThreshold
                                    }
                                    onChange={(e) =>
                                      handleAlertChange(
                                        "cpu",
                                        "criticalThreshold",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full mt-1 px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Process Monitoring */}
                          <div className="p-4 rounded bg-[#12141A]">
                            <div className="flex items-center justify-between mb-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    alerts.find((a) => a.type === "process")
                                      ?.enabled
                                  }
                                  onChange={(e) =>
                                    handleAlertChange(
                                      "process",
                                      "enabled",
                                      e.target.checked
                                    )
                                  }
                                  className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                                />
                                <span className="text-white font-medium">
                                  Process Monitoring
                                </span>
                              </label>
                            </div>
                            {alerts.find((a) => a.type === "process")
                              ?.enabled && (
                              <div>
                                <input
                                  type="text"
                                  placeholder="Enter process name and press Enter"
                                  className="w-full px-4 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      const currentProcesses =
                                        alerts.find((a) => a.type === "process")
                                          ?.processes || [];
                                      handleAlertChange(
                                        "process",
                                        "processes",
                                        [
                                          ...currentProcesses,
                                          e.currentTarget.value,
                                        ]
                                      );
                                      e.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <div className="mt-2 space-y-2">
                                  {alerts
                                    .find((a) => a.type === "process")
                                    ?.processes?.map((process, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-sm text-gray-300 bg-[#2A2D35] px-3 py-2 rounded"
                                      >
                                        {process}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Filebeat Alerts */}
                      {server.filebeat && (
                        <div className="p-4 rounded bg-[#12141A]">
                          <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={
                                  alerts.find((a) => a.type === "log")?.enabled
                                }
                                onChange={(e) =>
                                  handleAlertChange(
                                    "log",
                                    "enabled",
                                    e.target.checked
                                  )
                                }
                                className="form-checkbox h-5 w-5 text-[#4B7BF5] rounded border-gray-600 bg-gray-700"
                              />
                              <span className="text-white font-medium">
                                Log Monitoring
                              </span>
                            </label>
                          </div>
                          {alerts.find((a) => a.type === "log")?.enabled && (
                            <div>
                              <div className="flex gap-4">
                                <input
                                  type="text"
                                  placeholder="Enter keyword to monitor"
                                  className="flex-1 px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  id="keywordInput"
                                />
                                <select
                                  className="px-3 py-2 bg-[#2A2D35] rounded border border-gray-700 text-white"
                                  id="severitySelect"
                                  defaultValue="warning"
                                >
                                  <option value="warning">Warning</option>
                                  <option value="critical">Critical</option>
                                </select>
                                <button
                                  onClick={() => {
                                    const keyword = (
                                      document.getElementById(
                                        "keywordInput"
                                      ) as HTMLInputElement
                                    ).value;
                                    const severity = (
                                      document.getElementById(
                                        "severitySelect"
                                      ) as HTMLSelectElement
                                    ).value as "warning" | "critical";
                                    if (keyword) {
                                      handleLogKeywordAdd(keyword, severity);
                                      (
                                        document.getElementById(
                                          "keywordInput"
                                        ) as HTMLInputElement
                                      ).value = "";
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#4B7BF5] text-white rounded hover:bg-[#3D63C9]"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="mt-4 space-y-2">
                                {alerts
                                  .find((a) => a.type === "log")
                                  ?.logKeywords?.map((kw, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm bg-[#2A2D35] px-3 py-2 rounded"
                                    >
                                      <span className="text-gray-300">
                                        {kw.keyword}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded text-xs ${
                                          kw.severity === "warning"
                                            ? "bg-yellow-900/50 text-yellow-300"
                                            : "bg-red-900/50 text-red-300"
                                        }`}
                                      >
                                        {kw.severity}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - make them stick to bottom */}
        <div className="flex justify-between mt-auto pt-4 border-t border-gray-800 bg-[#1A1D24] sticky bottom-0">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2.5 bg-[#2A2D35] text-white rounded-lg hover:bg-[#353841] 
                transition-colors font-medium"
            >
              Previous
            </button>
          )}
          <button
            onClick={() => {
              if (currentStep === steps.length) {
                handleComplete();
              } else if (currentStep === 1) {
                setCurrentStep(2);
                setIsSimulating(true);
              } else {
                if (currentStep === 2) simulateConnectivity();
                setCurrentStep(currentStep + 1);
              }
            }}
            className="px-6 py-2.5 bg-[#4B7BF5] text-white rounded-lg hover:bg-[#3D63C9] 
              transition-colors font-medium ml-auto"
          >
            {currentStep === steps.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
