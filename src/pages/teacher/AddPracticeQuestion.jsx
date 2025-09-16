import { useNavigate } from "react-router-dom";

export default function AddPracticeQuestion() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Practice Question</h2>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/teacher/home/practice/add-coding")}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700"
        >
          Add Coding Question
        </button>
        <button
          onClick={() => navigate("/teacher/home/practice/add-aptitude")}
          className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700"
        >
          Add Aptitude Question
        </button>
        <button
          onClick={() => navigate("/teacher/home/questions")}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700"
        >
          View Coding Questions
        </button>

         <button
          onClick={() => navigate("/teacher/home/aptitudequestions")}
          className="w-full bg-red-600 text-white py-3 px-4 rounded hover:bg-purple-700"
        >
          View Aptitude Questions
        </button>
      </div>
    </div>
  );
}
