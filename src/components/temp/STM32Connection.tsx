// src/components/temp/STM32Connection.tsx
import { useState, useEffect } from "react";
import { STM32UARTConnection } from "../../utils/stm32UART";
import type { STM32Response } from "../../utils/stm32UART";

interface CircuitData {
  powerSource: {
    type: string;
    voltage: number;
    current: number;
    image: string;
  } | null;
  components: Array<{
    id: string;
    type: string;
    value: string;
    image: string;
    mode: string;
  }>;
}

interface STM32ConnectionProps {
  circuitData?: CircuitData;
  circuitStructure?: string;
  onCircuitGenerated?: (success: boolean, message: string) => void;
  onPrevious?: () => void;
  handleResetCircuit?: () => void;
}

export default function STM32Connection({
  circuitData,
  circuitStructure,
  onCircuitGenerated,
  onPrevious,
  handleResetCircuit,
}: STM32ConnectionProps) {
  const [uart, setUart] = useState<STM32UARTConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [receivedData, setReceivedData] = useState<STM32Response[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "connecting" | "generating" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (uart) {
      uart.onData((data: STM32Response) => {
        console.log("Received from STM32:", data);
        setReceivedData((prev) => [...prev, data]);

        // Handle different response types
        if (data.status === "success" && data.message?.includes("circuit")) {
          setGenerationStatus("success");
          setIsGenerating(false);
          onCircuitGenerated?.(true, data.message);
        } else if (data.status === "error") {
          setGenerationStatus("error");
          setIsGenerating(false);
          onCircuitGenerated?.(false, data.message || "Generation failed");
        }
      });

      uart.onError((error: string) => {
        setConnectionStatus(`Error: ${error}`);
        setGenerationStatus("error");
        setIsGenerating(false);
        console.error("STM32 Error:", error);
      });
    }
  }, [uart, onCircuitGenerated]);

  const connectToSTM32 = async () => {
    setConnectionStatus("Connecting...");
    setGenerationStatus("connecting");

    const stm32Connection = new STM32UARTConnection({
      baudRate: 115200, // STM32F446RE default
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: "none",
    });

    const success = await stm32Connection.connect();

    if (success) {
      setUart(stm32Connection);
      setIsConnected(true);
      setConnectionStatus("Connected to STM32F446RE");
      setGenerationStatus("idle");
    } else {
      setConnectionStatus("Connection failed");
      setGenerationStatus("error");
    }
  };

  const disconnectFromSTM32 = async () => {
    if (uart) {
      await uart.disconnect();
      setUart(null);
      setIsConnected(false);
      setConnectionStatus("Disconnected");
      setGenerationStatus("idle");
      setReceivedData([]);
    }
  };

  const generateCircuit = async () => {
    if (!uart || !isConnected || !circuitStructure) {
      console.error("Cannot generate circuit: not connected or no structure");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("generating");
    setReceivedData([]);

    try {
      // Only send raw circuit structure
      await uart.sendCircuitStructure(circuitStructure);

      console.log("Raw circuit structure sent to STM32F446RE");
    } catch (error) {
      console.error("Error sending circuit structure:", error);
      setGenerationStatus("error");
      setIsGenerating(false);
      onCircuitGenerated?.(false, "Failed to send circuit structure");
    }
  };

  const resetChip = async () => {
    if (!uart || !isConnected || !circuitStructure) {
      console.error("Cannot generate circuit: not connected or no structure");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("connecting");
    setReceivedData([]);

    try {
      // Only send raw circuit structure
      await uart.sendCircuitStructure("RRRRRRRRRRRRRRRRR"); // Reset signal
      if (handleResetCircuit) {
        await handleResetCircuit();
      }

      console.log("Reset signal sent to STM32F446RE");
    } catch (error) {
      console.error("Error sending circuit structure:", error);
      setGenerationStatus("error");
      setIsGenerating(false);
      onCircuitGenerated?.(false, "Failed to send circuit structure");
    }
  };

  const getStatusIcon = () => {
    switch (generationStatus) {
      case "connecting":
        return (
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        );
      case "generating":
        return (
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        );
      case "success":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    switch (generationStatus) {
      case "connecting":
        return "Connecting to STM32F446RE...";
      case "generating":
        return "Generating circuit on STM32F446RE...";
      case "success":
        return "Circuit generated successfully!";
      case "error":
        return "Error occurred during generation";
      default:
        return "Ready to generate circuit";
    }
  };

  return (
    <div className="space-y-6">
      {/* Circuit Summary */}
      {circuitData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Circuit to Generate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {circuitData.powerSource && (
              <div className="flex items-center space-x-3">
                <img
                  src={circuitData.powerSource.image}
                  alt={circuitData.powerSource.type}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {circuitData.powerSource.type}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {circuitData.powerSource.voltage}V,{" "}
                    {circuitData.powerSource.current}A
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {circuitData.components.length} Components
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {circuitData.components.map((c) => c.type).join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            STM32F446RE Connection
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connectionStatus}
            </span>
          </div>
        </div>

        <div className="flex space-x-4">
          {!isConnected ? (
            <button
              onClick={connectToSTM32}
              disabled={generationStatus === "connecting"}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                generationStatus === "connecting"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Connect to STM32F446RE
            </button>
          ) : (
            <button
              onClick={disconnectFromSTM32}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Generation Status */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Circuit Generation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusText()}
            </p>
          </div>
        </div>

        {isConnected && circuitData && (
          <>
            <button
              onClick={generateCircuit}
              disabled={isGenerating || generationStatus === "success"}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isGenerating || generationStatus === "success"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isGenerating
                ? "Generating..."
                : generationStatus === "success"
                  ? "Circuit Generated!"
                  : "Generate Circuit"}
            </button>

            <button
              onClick={resetChip}
              className={`ml-5 px-6 py-3 rounded-lg font-medium transition-colors bg-red-500 text-white-500`}
            >
              Reset Chip
            </button>
          </>
        )}

        {generationStatus === "success" && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800 dark:text-green-200 font-medium">
                Circuit has been successfully generated on your STM32F446RE!
              </span>
            </div>
          </div>
        )}

        {generationStatus === "error" && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 dark:text-red-200 font-medium">
                Failed to generate circuit. Please check your connection and try
                again.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Communication Log */}
      {
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Communication Log
          </h3>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {receivedData.map((data, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    [{new Date(data.timestamp).toLocaleTimeString()}]
                  </span>
                  <span
                    className={`ml-2 ${
                      data.status === "success"
                        ? "text-green-600"
                        : data.status === "error"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {data.status}
                  </span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {JSON.stringify(data.data || data.message)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>

        {generationStatus === "success" && (
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
