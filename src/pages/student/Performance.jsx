import { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Performance() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await studentService.getMyLeaderboard();
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid performance data');
        }
        setStudentData(response);
      } catch (err) {
        toast.error('Unable to load performance');
        console.error('Failed to fetch performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  if (loading) return <Loader />;
  if (!studentData) {
    return (
      <p className="text-center mt-6 text-gray-500">
        No performance data available.
      </p>
    );
  }

  const codingScore = studentData.codingScore ?? 0;
  const aptitudeScore = studentData.aptitudeScore ?? 0;
  const quizScore = studentData.quizScore ?? 0;
  const totalScore = codingScore + aptitudeScore + quizScore;

  // 🎯 Feedback logic
  let feedbackMessage = '';
  if (codingScore >= 80 && aptitudeScore < 60) {
    feedbackMessage = "You're excelling in coding! Now's a great time to strengthen your aptitude skills.";
  } else if (aptitudeScore >= 80 && codingScore < 60) {
    feedbackMessage = "Your aptitude is solid—try dedicating more time to coding challenges.";
  } else if (quizScore >= 80 && codingScore < 60) {
    feedbackMessage = "Quiz performance looks great! Balance it out with more coding practice.";
  } else if (totalScore >= 240) {
    feedbackMessage = "Outstanding overall performance! Keep pushing toward mastery.";
  } else if (totalScore >= 180) {
    feedbackMessage = "You're on the right track. A bit more consistency will take you further.";
  } else {
    feedbackMessage = "Let’s build a stronger foundation. Focus on small wins across each area.";
  }

  const pieData = {
    labels: ['Coding', 'Aptitude', 'Quiz'],
    datasets: [
      {
        data: [codingScore, aptitudeScore, quizScore],
        backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
        },
      },
    },
    animation: {
      animateScale: true,
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
          My Performance
        </h2>
        <p className="text-gray-600 mt-2">Track your progress and get personalized feedback</p>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
          {studentData.studentName}
        </h3>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Pie Chart */}
          <div className="w-full lg:w-1/2">
            <Pie data={pieData} options={pieOptions} />
            <div className="mt-6 text-sm text-gray-700 text-center space-y-2">
              <p><strong>Coding:</strong> {codingScore}&nbsp;
              <strong>Aptitude:</strong> {aptitudeScore}&nbsp;
              <strong>Quiz:</strong> {quizScore}</p>
              <p className="font-semibold text-blue-600">
                Total Score: {totalScore}
              </p>
            </div>
          </div>

          {/* Feedback Box */}
          <div className="w-full lg:w-1/2 bg-blue-50 border border-blue-200 rounded-xl p-6 text-blue-800 shadow-sm">
            <h4 className="text-xl font-semibold mb-3">Personalized Feedback</h4>
            <p className="text-base leading-relaxed italic">
              {feedbackMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
