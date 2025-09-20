import { useState } from "react";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateCodingQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState(""); // ✅ Manual topic input
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const validTestCases = testCases
      .filter(tc => tc.input.trim() && tc.output.trim())
      .map(tc => ({
        inputData: tc.input.trim(),
        expectedOutput: tc.output.trim(),
        hidden: false
      }));

    const payload = {
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      difficulty,
      sampleInput: inputFormat.trim(),
      sampleOutput: outputFormat.trim(),
      testCases: validTestCases
    };

    if (
      !payload.title ||
      !payload.description ||
      !payload.topic ||
      !payload.sampleInput ||
      !payload.sampleOutput ||
      !payload.difficulty ||
      payload.testCases.length === 0
    ) {
      toast.error("Please fill all fields and add at least one valid test case");
      return;
    }

    try {
      await teacherService.createCodingQuestion(payload);
      toast.success("Coding question created!");
      navigate("/questions");

      // Reset form
      setTitle("");
      setDescription("");
      setTopic("");
      setInputFormat("");
      setOutputFormat("");
      setDifficulty("");
      setTestCases([{ input: "", output: "" }]);
    } catch (err) {
      console.error("❌ Error creating coding question:", err);
      toast.error("Failed to create coding question");
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-blue-700 text-center">Create Coding Question</h2>

      <input
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Topic (e.g., Math, Strings, Arrays)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Input Format"
        value={inputFormat}
        onChange={(e) => setInputFormat(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Output Format"
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Difficulty (Easy, Medium, Hard)"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />

      <h3 className="text-lg font-semibold text-gray-700">Test Cases</h3>
      {testCases.map((tc, idx) => (
        <div key={idx} className="mb-4 space-y-2">
          <input
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Input ${idx + 1}`}
            value={tc.input}
            onChange={(e) => {
              const updated = [...testCases];
              updated[idx].input = e.target.value;
              setTestCases(updated);
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Output ${idx + 1}`}
            value={tc.output}
            onChange={(e) => {
              const updated = [...testCases];
              updated[idx].output = e.target.value;
              setTestCases(updated);
            }}
          />
        </div>
      ))}

      <button
        onClick={addTestCase}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
      >
        + Add Test Case
      </button>

      {/* Preview Card */}
      {(title || description || inputFormat || outputFormat || testCases.length > 0) && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Preview</h3>
          <p><strong>Title:</strong> {title || "—"}</p>
          <p><strong>Description:</strong> {description || "—"}</p>
          <p><strong>Topic:</strong> {topic || "—"}</p>
          <p><strong>Input Format:</strong> {inputFormat || "—"}</p>
          <p><strong>Output Format:</strong> {outputFormat || "—"}</p>
          <p><strong>Difficulty:</strong> {difficulty || "—"}</p>

          <div className="mt-3">
            <strong>Test Cases:</strong>
            <ul className="list-disc list-inside mt-1">
              {testCases.map((tc, idx) => (
                <li key={idx}>
                  <code>{tc.input || "—"}</code> → <code>{tc.output || "—"}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
      >
        Submit Question
      </button>
    </div>
  );
}
