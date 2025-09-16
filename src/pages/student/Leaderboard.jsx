import { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await studentService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        toast.error('Unable to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
          Student Leaderboard
        </h2>
        <p className="text-gray-600 mt-2">Top performers across coding, aptitude, and quizzes</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
            <tr>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-center">Coding</th>
              <th className="px-4 py-3 text-center">Aptitude</th>
              <th className="px-4 py-3 text-center">Quiz</th>
              <th className="px-4 py-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((entry, index) => (
                <tr
                  key={entry.studentId}
                  className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-3 font-medium text-blue-700">
                    {index === 0 ? (
                      <span className="bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">🥇 1</span>
                    ) : index === 1 ? (
                      <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">🥈 2</span>
                    ) : index === 2 ? (
                      <span className="bg-orange-300 text-orange-900 px-2 py-1 rounded-full text-xs font-bold">🥉 3</span>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{entry.studentName}</td>
                  <td className="px-4 py-3 text-center text-blue-600">{entry.codingScore}</td>
                  <td className="px-4 py-3 text-center text-indigo-600">{entry.aptitudeScore}</td>
                  <td className="px-4 py-3 text-center text-red-500">{entry.quizScore}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-700">{entry.totalScore}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
