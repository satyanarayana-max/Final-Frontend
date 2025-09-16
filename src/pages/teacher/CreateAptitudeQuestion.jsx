import { useState } from "react";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";

export default function CreateAptitudeQuestion() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [section, setSection] = useState("");

  const handleSubmit = async () => {
    if (!question || correctIndex === null || options.some(opt => !opt) || !section) {
      toast.error("Please fill all fields including section");
      console.error("❌ Validation failed:", {
        question,
        options,
        correctIndex,
        section
      });
      return;
    }

    const correctOptionLetter = ["A", "B", "C", "D"][correctIndex];

    const payload = {
      section,
      questionText: question,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      correctOption: correctOptionLetter,
      marks: 10 // You can make this dynamic later
    };

    console.log("📦 Submitting payload:", payload);

    try {
      await teacherService.createAptitudeQuestion(payload);
      toast.success("Aptitude question created!");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(null);
      setSection("");
    } catch (err) {
      toast.error("Failed to create question");
      console.error("❌ Error creating aptitude question:", err);

      if (err.response) {
        console.error("🔍 Response data:", err.response.data);
        console.error("📦 Status code:", err.response.status);
        console.error("📨 Headers:", err.response.headers);
      } else if (err.request) {
        console.error("⚠️ No response received:", err.request);
      } else {
        console.error("⚙️ Request setup error:", err.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Aptitude Question</h2>

      {/* Section Dropdown */}
      <label className="block font-medium mb-2">Select Section</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      >
        <option value="">Choose section</option>
        <option value="Logical">Logical</option>
        <option value="Reasoning">Reasoning</option>
        <option value="Verbal">Verbal</option>
        <option value="Technical">Technical</option>
      </select>

      {/* Question Input */}
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={3}
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options with Radio Buttons */}
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            type="radio"
            name="correct"
            checked={correctIndex === idx}
            onChange={() => setCorrectIndex(idx)}
            className="mr-2"
          />
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder={`Option ${["A", "B", "C", "D"][idx]}`}
            value={opt}
            onChange={(e) => {
              const newOpts = [...options];
              newOpts[idx] = e.target.value;
              setOptions(newOpts);
            }}
          />
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Question
      </button>
    </div>
  );
}
