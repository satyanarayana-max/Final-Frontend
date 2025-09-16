import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function OnlineCompiler() {
  const starterCode = {
    python3: 'print("Hello, World!")',
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    nodejs: 'console.log("Hello, World!");',
  };

  const [code, setCode] = useState(starterCode.python3);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python3");
  const [userInput, setUserInput] = useState(""); // ✅ User input
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await axios.post("http://localhost:8080/api/compiler/run", {
        script: code,
        language: language,
        versionIndex: "0",
        stdin: userInput, // ✅ Pass user input
      });

      const data = response.data;
      if (typeof data === "string") {
        setOutput(data);
      } else if (data.output) {
        setOutput(data.output);
      } else {
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(err);
      setOutput("⚠️ Error executing code");
    }

    setLoading(false);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(starterCode[selectedLang]);
  };

  return (
    <div className="flex justify-center items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Student Portal Online Compiler
        </h2>

        {/* Language Selector */}
        <div className="flex items-center mb-4">
          <label className="font-medium text-gray-700">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="python3">Python 3</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="nodejs">JavaScript</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>

        {/* User Input */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Custom Input (stdin):</label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter input values here..."
          />
        </div>

        {/* Run Button */}
        <div className="text-center">
          <button
            onClick={runCode}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Running..." : "▶ Run Code"}
          </button>
        </div>

        {/* Output Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Output:</h3>
          <pre className="bg-black text-green-400 p-4 rounded-lg min-h-[150px] overflow-auto">
            {output || ">> Your program output will appear here"}
          </pre>
        </div>
      </div>
    </div>
  );
}
