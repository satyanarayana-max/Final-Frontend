import { useState } from "react";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



export default function CreateCodingQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      topic: "Math", // You can make this dynamic later
      difficulty,
      sampleInput: inputFormat.trim(),
      sampleOutput: outputFormat.trim(),
      testCases: validTestCases
    };

    if (
      !payload.title ||
      !payload.description ||
      !payload.sampleInput ||
      !payload.sampleOutput ||
      !payload.difficulty ||
      payload.testCases.length === 0
    ) {
      toast.error("Please fill all fields and add at least one valid test case");
      return;
    }

    console.log("Submitting payload:", payload); // ✅ Debug log

    try {
      await teacherService.createCodingQuestion(payload);
     toast.success("Coding question created!");
     navigate("/questions");


      // Reset form
      setTitle("");
      setDescription("");
      setInputFormat("");
      setOutputFormat("");
      setDifficulty("");
      setTestCases([{ input: "", output: "" }]);
    } catch (err) {
      console.error("❌ Error creating coding question:", err);
      if (err.response) {
        console.error("🔍 Response data:", err.response.data);
        console.error("📦 Status code:", err.response.status);
        console.error("📨 Headers:", err.response.headers);
      } else if (err.request) {
        console.error("⚠️ No response received:", err.request);
      } else {
        console.error("⚙️ Request setup error:", err.message);
      }
      toast.error("Failed to create coding question");
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Coding Question</h2>

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded mb-3"
        rows={3}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Input Format"
        value={inputFormat}
        onChange={(e) => setInputFormat(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Output Format"
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value)}
      />

      <label className="block font-medium mb-1">Difficulty</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Select difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <h3 className="font-semibold mb-2">Test Cases</h3>
      {testCases.map((tc, idx) => (
        <div key={idx} className="mb-2">
          <input
            className="w-full p-2 border rounded mb-1"
            placeholder={`Input ${idx + 1}`}
            value={tc.input}
            onChange={(e) => {
              const updated = [...testCases];
              updated[idx].input = e.target.value;
              setTestCases(updated);
            }}
          />
          <input
            className="w-full p-2 border rounded"
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
        className="mt-2 mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        + Add Test Case
      </button>

      {/* Preview Card */}
      {(title || description || inputFormat || outputFormat || testCases.length > 0) && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <p><strong>Title:</strong> {title || "—"}</p>
          <p><strong>Description:</strong> {description || "—"}</p>
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
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Question
      </button>
    </div>
  );
}
