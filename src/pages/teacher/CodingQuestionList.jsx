import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";

export default function CodingQuestionList() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await teacherService.getAllCodingQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err);
      }
    }

    fetchQuestions();
  }, []);

const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this question?");
  if (!confirm) return;

  try {
    await teacherService.deleteCodingQuestion(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast.success("Coding question deleted successfully!");
  } catch (err) {
    console.error("❌ Failed to delete question:", err);
    toast.error("Failed to delete coding question. Please try again.");
  }
};


  const handleUpdate = (id) => {
    navigate(`/teacher/home/practice/update-coding/${id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Coding Questions</h2>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="p-4 border rounded bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg">{q.title}</h3>
              <p><strong>Topic:</strong> {q.topic}</p>
              <p><strong>Difficulty:</strong> {q.difficulty}</p>
              <p><strong>Description:</strong> {q.description}</p>
              <p><strong>Sample Input:</strong> <code>{q.sampleInput}</code></p>
              <p><strong>Sample Output:</strong> <code>{q.sampleOutput}</code></p>

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
