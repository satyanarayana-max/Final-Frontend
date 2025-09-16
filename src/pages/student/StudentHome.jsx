import { Routes, Route, Navigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Layout from '../../components/Layout';
import StudentDashboard from './StudentDashboard';
import AllCourses from './AllCourses';
import MyCourses from './MyCourses';
import SQuizzes from './SQuizzes';
import Performance from './Performance';
import CourseDetails from './CourseDetails';
import OnlineCompiler from './OnlineCompiler';
import PracticeSession from './PracticeSession';
import TopicQuestionList from './TopicQuestionList';
import CodeEditor from './CodeEditor';
import AptitudePracticeBySection from './AptitudePracticeBySection';
import Leaderboard from './Leaderboard';

export default function StudentHome() {
  const items = [
    { label: 'Dashboard', to: '/student/home' },
    { label: 'Courses', to: '/student/home/courses' },
    { label: 'My Courses', to: '/student/home/my-courses' },
    { label: 'Performance', to: '/student/home/performance' },
    { label: 'Online Compiler', to: '/student/home/compiler' },
    { label: 'Practice Questions', to: '/student/home/practice' },
    { label: 'Leaderboard', to: '/student/home/Leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <Layout topNav={<TopNav items={items} role="STUDENT" />}>
        <div className="bg-white rounded-xl shadow-lg p-6 mt-4 mx-4">
          <Routes>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<AllCourses />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="quizzes/:courseId" element={<SQuizzes />} />
            <Route path="performance" element={<Performance />} />
            <Route path="compiler" element={<OnlineCompiler />} />
            <Route path="practice" element={<PracticeSession />} />
            <Route path="practice/:topic" element={<TopicQuestionList />} />
            <Route path="practice/:topic/:questionId" element={<CodeEditor />} />
            <Route path="AptitudeQuestions" element={<AptitudePracticeBySection />} />
            <Route path="Leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/student/home" />} />
          </Routes>
        </div>
      </Layout>
    </div>
  );
}
