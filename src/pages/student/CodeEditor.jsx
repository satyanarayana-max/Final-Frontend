import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { studentService } from "../../services/studentService";
import toast from "react-hot-toast";

export default function CodeEditor() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python3");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

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

  const versionMap = {
    python3: "3",
    java: "4",
    cpp: "6",
    c: "6",
    nodejs: "4",
  };

  const monacoLangMap = {
    python3: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    nodejs: "javascript",
  };

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const q = await studentService.getQuestionDetails(questionId);
        setQuestion(q);
        setCode(starterCode[language]);
      } catch (err) {
        console.error("Error loading question:", err);
        toast.error("Failed to load question");
      }
    };
    loadQuestion();
  }, [questionId, language]);

  const normalizeOutput = (str) =>
    str.trim().replace(/\r\n/g, "\n").replace(/\s+/g, " ");

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/compiler/run",
        {
          script: code,
          language,
          versionIndex: versionMap[language],
          stdin: userInput,
        }
      );
      const result = normalizeOutput(data.output || "");
      setOutput(result);
    } catch (err) {
      console.error("Error executing code:", err);
      setOutput("⚠️ Error executing code");
    }
    setLoading(false);
  };

const handleSubmit = async () => {
  setLoading(true);
  setOutput("");
  setScore(null);
  setResults([]);

  // simple sleep utility
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // wrapper to call compiler/run with retry/backoff
  const runWithRetry = async (stdin) => {
    let attempt = 0;
    while (attempt < 5) {
      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/compiler/run",
          {
            script:       code,
            language,
            versionIndex: versionMap[language],
            stdin,
          }
        );
        return data;
      } catch (err) {
        // if rate-limited, wait longer then retry
        if (err.response?.status === 429) {
          attempt++;
          const delay = attempt * 1000;      // 1s, 2s, 3s, …
          console.warn(`429 received. retry #${attempt} in ${delay}ms`);
          await sleep(delay);
        } else {
          throw err;  // some other error
        }
      }
    }
    throw new Error("Max retries reached for run /compiler/run");
  };

  try {
    const testCases = question.testCases || [];
    let passed = 0;
    const caseResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(`🚀 Running Test Case ${i+1}`, tc.inputData);

      // call the wrapper instead of axios.post directly
      const data = await runWithRetry(tc.inputData);
      const actual   = normalizeOutput(data.output || "");
      const expected = normalizeOutput(tc.expectedOutput);
      const isCorrect = actual === expected;

      if (isCorrect) passed++;

      caseResults.push({
        input:     tc.inputData,
        expected,
        actual,
        isCorrect,
        hidden:    tc.hidden,
      });

      // small fixed delay to avoid bursts (optional)
      await sleep(200);
    }

    const total         = testCases.length;
    const computedScore = passed * 10;
    const correct       = passed === total;

    setResults(caseResults);
    setScore(computedScore);
    setOutput(`✅ Passed ${passed} / ${total} test cases`);

    // now send final payload
    const payload = {
      questionId:      question.id,
      code,
      totalTestCases:  total,
      passedTestCases: passed,
      score:           computedScore,
      correct,
    };
    const saved = await studentService.submitCode(payload);
    console.log("Submission saved:", saved);

    toast.success(`Submission evaluated! You scored ${computedScore} points`);
  } catch (err) {
    console.error("Error during submission:", err);
    setOutput("⚠️ Error during submission");
    toast.error("Submission failed");
  } finally {
    setLoading(false);
  }
};



  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterCode[lang]);
  };

  if (!question) {
    return <p className="text-center mt-6">Loading question…</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
      <p className="mb-6">{question.description}</p>

      <div className="mb-4">
        <strong>Sample Input:</strong>
        <pre className="bg-gray-100 p-2 rounded">{question.sampleInput}</pre>
        <strong>Sample Output:</strong>
        <pre className="bg-gray-100 p-2 rounded">{question.sampleOutput}</pre>
      </div>

      <div className="mb-4">
        <label className="font-medium">Language:</label>
        <select
          className="ml-2 p-2 border rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="python3">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="nodejs">JavaScript</option>
        </select>
      </div>

      <div className="border rounded mb-4 overflow-hidden">
        <Editor
          height="350px"
          language={monacoLangMap[language]}
          value={code}
          onChange={(v) => setCode(v || "")}
          theme="vs-dark"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Custom Input:</label>
        <textarea
          rows={3}
          className="w-full border p-2 rounded"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter custom stdin here…"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={runCode}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {loading ? "Running…" : "▶ Run with Input"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting…" : "Submit to Test Cases"}
        </button>
      </div>

      {output && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Result</h3>
          <p>{output}</p>
          {score !== null && (
            <p className="mt-2">
              <strong>Score:</strong> {score} /{" "}
              {question.testCases.length * 10}
            </p>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Test Case Details</h3>
          <ul className="space-y-3">
            {results.map((r, i) => (
              <li
                key={i}
                className="border p-3 rounded bg-white shadow-sm"
              >
                <p>
                  <strong>Input:</strong> {r.input}
                </p>
                <p>
                  <strong>Expected:</strong> {r.expected}
                </p>
                <p>
                  <strong>Actual:</strong> {r.actual}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {r.isCorrect ? "✅ Pass" : "❌ Fail"}{" "}
                  {r.hidden && (
                    <span className="text-gray-500">(Hidden)</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
