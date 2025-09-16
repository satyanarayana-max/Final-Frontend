import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";

export default function AptitudeQuestionListBySection() {
  const [section, setSection] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async (selectedSection) => {
    setLoading(true);
    try {
      const data = await teacherService.getAptitudeQuestionsBySection(selectedSection);
      console.log("📥 Response from backend:", data);
      setQuestions(data);
    } catch (err) {
      toast.error("Failed to fetch questions");
      console.error("❌ Error fetching aptitude questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section) {
      fetchQuestions(section);
    } else {
      setQuestions([]);
    }
  }, [section]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this question?");
    if (!confirm) return;

    try {
      await teacherService.deleteAptitudeQuestion(id);
      toast.success("Question deleted successfully");
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      toast.error("Failed to delete question");
      console.error("❌ Error deleting question:", err);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/teacher/home/aptitude/update/${id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Aptitude Questions by Section</h2>

      <select
        className="w-full p-2 border rounded mb-6"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      >
        <option value="">Select Section</option>
        <option value="Logical">Logical</option>
        <option value="Reasoning">Reasoning</option>
        <option value="Verbal">Verbal</option>
        <option value="Technical">Technical</option>
      </select>

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions found for this section.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="p-4 border rounded bg-gray-50 shadow-sm">
              <h3 className="font-semibold">{q.questionText}</h3>
              <ul className="list-disc list-inside mt-2">
                <li><strong>A:</strong> {q.optionA}</li>
                <li><strong>B:</strong> {q.optionB}</li>
                <li><strong>C:</strong> {q.optionC}</li>
                <li><strong>D:</strong> {q.optionD}</li>
              </ul>
              <p className="mt-2"><strong>Correct Option:</strong> {q.correctOption}</p>
              <p><strong>Marks:</strong> {q.marks}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdate(q.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
