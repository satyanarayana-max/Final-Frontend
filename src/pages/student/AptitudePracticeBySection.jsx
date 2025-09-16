import { useState } from "react";
import { studentService } from "../../services/studentService";
import toast from "react-hot-toast";

export default function AptitudePracticeBySection() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [alreadyCorrect, setAlreadyCorrect] = useState(false);

  const sections = ["Logical", "Reasoning", "Verbal", "Technical", "General"];

  const fetchQuestions = async (section) => {
    setLoading(true);
    setSelectedSection(section);
    try {
      const data = await studentService.getAptitudeQuestionsBySection(section);
      setQuestions(data);
    } catch (err) {
      toast.error("Failed to fetch questions");
      console.error(err);
    } finally {
      setLoading(false);
      resetState();
    }
  };

  const resetState = () => {
    setActiveQuestion(null);
    setSubmitted(false);
    setSelectedOption("");
    setIsCorrect(null);
    setScore(null);
    setAlreadyCorrect(false);
  };

  const handleQuestionClick = async (question) => {
    setActiveQuestion(question);
    setSelectedOption("");
    setSubmitted(false);
    setIsCorrect(null);
    setScore(null);

    try {
      const submission = await studentService.getSubmissionStatus(question.id);
      if (submission?.alreadySubmitted && submission.correct) {
        setAlreadyCorrect(true);
        setIsCorrect(true);
        setScore(submission.score);
        setSubmitted(true);
      } else {
        setAlreadyCorrect(false);
      }
    } catch (err) {
      console.error("Error checking submission status:", err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      toast("Please select an option");
      return;
    }

    try {
      const response = await studentService.submitAptitudeAnswer({
        questionId: activeQuestion.id,
        chosenOption: selectedOption,
      });

      setIsCorrect(response.correct);
      setScore(response.score);
      setSubmitted(true);
      setAlreadyCorrect(response.correct && response.score > 0);
      toast.success(`Answer submitted. You scored ${response.score} marks.`);
    } catch (err) {
      toast.error("Failed to submit answer");
      console.error("❌ Submission error:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
          Practice Aptitude Questions
        </h2>
        {selectedSection && !activeQuestion && (
          <button
            onClick={() => {
              setSelectedSection("");
              resetState();
            }}
           className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
>
            ⬅ Back to Sections
          </button>
        )}
      </div>

      {/* Section Cards */}
    {!selectedSection && (
  <>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-bold text-blue-700">Choose a Section</h3>
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
>
        ⬅ Back
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sections.map((section) => (
        <div
          key={section}
          onClick={() => fetchQuestions(section)}
          className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 hover:scale-105 transition-transform duration-300 p-6 rounded-xl shadow-lg text-center font-semibold text-blue-800"
        >
          {section} Section
        </div>
      ))}
    </div>
  </>
)}


      {/* Question List */}
      {selectedSection && !activeQuestion && (
        <>
          <h3 className="text-2xl font-bold text-blue-700 text-center">
            {selectedSection} Questions
          </h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-gray-500">No questions found for this section.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {questions.map((q) => (
                <li
                  key={q.id}
                  className="p-4 border rounded-xl bg-white shadow cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => handleQuestionClick(q)}
                >
                  <h3 className="font-semibold text-blue-800">{q.questionText}</h3>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Active Question View */}
      {activeQuestion && (
        <div className="mt-6 p-6 border rounded-xl bg-white shadow space-y-4">
          <h3 className="text-xl font-bold text-blue-800">{activeQuestion.questionText}</h3>
          <div className="space-y-3">
            {["A", "B", "C", "D"].map((opt) => (
              <label key={opt} className="block text-blue-700">
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selectedOption === opt}
                  onChange={() => setSelectedOption(opt)}
                  className="mr-2"
                  disabled={alreadyCorrect}
                />
                {opt}: {activeQuestion[`option${opt}`]}
              </label>
            ))}
          </div>

          {!submitted && !alreadyCorrect && (
            <button
              onClick={handleSubmitAnswer}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Submit Answer
            </button>
          )}

          {submitted && (
            <div className="mt-4 space-y-4">
              {isCorrect ? (
                <div className="text-green-600 font-semibold">
                  ✅ Correct! You scored {score} marks.
                  <p className="mt-2">Your answer is: <strong>{activeQuestion.correctOption}</strong></p>
                </div>
              ) : (
                <div className="text-red-600 font-semibold">
                  ❌ Incorrect. Correct answer is: <strong>{activeQuestion.correctOption}</strong>
                  {!alreadyCorrect && (
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSelectedOption("");
                      }}
                      className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={() => setActiveQuestion(null)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
>
                ⬅ Back to Questions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
