"use client";

import { useState } from "react";
import yaml from "js-yaml";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async () => {
    try {
      // Load the config.yaml file dynamically
      const configRes = await fetch("/config.yaml");
      const configText = await configRes.text();
      const config = yaml.load(configText) as { backend_url: string; api_key: string };

      const { backend_url, api_key } = config;

      // Make the API call with the correct header name
      const response = await fetch(`${backend_url}/test-communication`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key, // Use "api-key" with a dash to match the backend
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data.message); // Expecting "Hallo World!" from the backend
      setError(null);
    } catch (err: any) {
      setApiResponse(null);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <button
        onClick={callApi}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Call Backend API
      </button>
      {apiResponse && <p className="mt-4 text-green-500">Response: {apiResponse}</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}
    </div>
  );
}
