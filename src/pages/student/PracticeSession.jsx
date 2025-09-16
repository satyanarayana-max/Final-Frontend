import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import toast from "react-hot-toast";

export default function PracticeSession() {
  const [codingTopics, setCodingTopics] = useState([]);
  const [viewingCodingTopics, setViewingCodingTopics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTopics() {
      try {
        const topics = await studentService.getCodingTopics();
        setCodingTopics(topics);
      } catch (error) {
        toast.error("Unable to load coding topics");
        console.error("Error fetching topics:", error);
      }
    }
    loadTopics();
  }, []);

  const handlePracticeCoding = () => setViewingCodingTopics(true);
  const handlePracticeAptitude = () => navigate("/student/home/AptitudeQuestions");
  const handleViewLeaderboard = () => navigate("/student/home/Leaderboard");
  const handleTopicSelect = (topic) => navigate(`/student/home/practice/${topic}`);
  const handleBack = () => setViewingCodingTopics(false);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-center">
        Practice Session
      </h2>

      {/* Main Menu Cards */}
      {!viewingCodingTopics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
          <div
            onClick={handlePracticeCoding}
            className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 hover:scale-105 transition-transform duration-300 p-6 rounded-xl shadow-lg text-center font-semibold text-blue-800"
          >
            💻 Practice Coding Questions
          </div>
          <div
            onClick={handlePracticeAptitude}
            className="cursor-pointer bg-gradient-to-br from-green-100 to-green-200 hover:scale-105 transition-transform duration-300 p-6 rounded-xl shadow-lg text-center font-semibold text-green-800"
          >
            📐 Practice Aptitude Questions
          </div>
          <div
            onClick={handleViewLeaderboard}
            className="cursor-pointer bg-gradient-to-br from-purple-100 to-purple-200 hover:scale-105 transition-transform duration-300 p-6 rounded-xl shadow-lg text-center font-semibold text-purple-800"
          >
            🏆 View Leaderboard
          </div>
        </div>
      ) : (
        <>
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-700">Choose a Coding Topic</h3>
            <button
              onClick={handleBack}
             className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
>
              ⬅ Back
            </button>
          </div>

          {/* Topic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
            {codingTopics.map((topic) => (
              <div
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 hover:scale-105 transition-transform duration-300 p-4 rounded-xl shadow text-center font-medium text-blue-700"
              >
                {topic}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
