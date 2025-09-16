import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentService } from "../../services/studentService";

export default function TopicQuestionList() {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await studentService.getQuestionsByTopic(topic);
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch topic questions:", err);
      }
    }
    fetchQuestions();
  }, [topic]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Practice: {topic}</h2>

      {questions.length === 0 ? (
        <p className="text-center text-gray-600">No questions available for this topic.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2">{q.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Difficulty: {q.difficulty}</p>
              <button
                onClick={() => navigate(`/student/home/practice/${topic}/${q.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Solve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
