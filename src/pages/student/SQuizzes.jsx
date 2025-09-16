import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

export default function SQuizzes() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizzes = await studentService.getQuizzesByCourse(courseId);
      if (!quizzes?.length) {
        toast.error('No quizzes available for this course');
        navigate(-1);
        return;
      }

      const selectedQuiz = quizzes[0];
      setQuizId(selectedQuiz.id);

      // Try to fetch submission first
      try {
        const submission = await studentService.getQuizSubmission(selectedQuiz.id);
        toast('You’ve already taken this quiz');
        setResult(submission);
      } catch (err) {
        if (err.response?.status === 404) {
          // No submission found — load quiz for attempt
          const quizData = await studentService.takeQuiz(selectedQuiz.id);
          setQuiz(quizData);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      toast.error('Failed to load quiz');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  loadQuiz();
}, [courseId, navigate]);


  const handleAnswer = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const payload = { quizId, answers };
      const res = await studentService.submitQuiz(payload);
      setResult(res);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!quiz && !result) return <p className="text-center mt-6">Quiz not found.</p>;

  const renderQuestions = () => {
    if (result) {
      return result.results.map((r, idx) => (
        <div key={idx} className="mb-6 p-4 border rounded shadow-sm bg-gray-50">
          <p className="font-medium mb-2">{r.question}</p>
          <p className="text-sm text-gray-700">
            <strong>Your answer:</strong> {r.yourAnswer}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Correct answer:</strong> {r.correctAnswer}
          </p>
          <p className="text-sm">
            <strong>Status:</strong> {r.isCorrect ? '✅ Correct' : '❌ Wrong'}
          </p>
        </div>
      ));
    }

    return quiz.questions.map((q) => (
      <div key={q.id} className="mb-6 p-4 border rounded shadow-sm bg-gray-50">
        <p className="font-medium mb-2">{q.question}</p>
        <div className="space-y-2">
          {['optionA', 'optionB', 'optionC', 'optionD'].map((opt) => (
            <label key={opt} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleAnswer(q.id, opt)}
                className="accent-blue-600"
              />
              <span>{q[opt]}</span>
            </label>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {result?.title || quiz?.title}
      </h2>

      {renderQuestions()}

      {!result && (
        <button
          onClick={submitQuiz}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Quiz
        </button>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Results</h3>
          <p className="mt-2">Score: {result.score}%</p>
          <p>Total Questions: {result.totalQuestions}</p>
          <p>Correct Answers: {result.correctAnswers}</p>

          <button
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            onClick={() => navigate(-1)}
          >
            Back to Course
          </button>
        </div>
      )}
    </div>
  );
}
