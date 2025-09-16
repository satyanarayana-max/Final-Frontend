import { Routes, Route, Navigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Layout from '../../components/Layout';

import TeacherDashboard from './TeacherDashboard';
import TStudents from './TStudents';
import TCourses from './TCourses';
import TQuizzes from './TQuizzes';
import Monitor from './Monitor';
import CourseOutline from './CourseOutline';
import MyCourses from './MyCourses';
import TAllCourses from './TAllCourses'; // ✅ new import
import CourseDetails from './CourseDetails';
import AddPracticeQuestion from './AddPracticeQuestion';
import CreateCodingQuestion from './CreateCodingQuestion';
import CreateAptitudeQuestion from './CreateAptitudeQuestion';
import AptitudeQuestionListBySection from './AptitudeQuestionListBySection';

import CodingQuestionList from './CodingQuestionList';


export default function TeacherHome() {
  const items = [
    { label: 'Dashboard', to: '/teacher/home' },
    { label: 'Students', to: '/teacher/home/students' },
    { label: 'Courses', to: '/teacher/home/courses' },
    { label: 'My Courses', to: '/teacher/home/mycourses' },
    { label: 'All Courses', to: '/teacher/home/allcourses' }, // ✅ new sidebar link
    { label: 'Quizzes', to: '/teacher/home/quizzes' },
    { label: 'Monitor Student', to: '/teacher/home/monitor' },
    { label: 'Add Practice Question', to: '/teacher/home/practice' },

  ];

  return (
    <Layout sidebar={<Sidebar items={items} role="TEACHER" />}>
      <Routes>
        <Route index element={<TeacherDashboard />} />
        <Route path="students" element={<TStudents />} />
        <Route path="courses" element={<TCourses />} />
        <Route path="mycourses" element={<MyCourses />} />
        <Route path="allcourses" element={<TAllCourses />} /> {/* ✅ new route */}
        <Route path="courses/:courseId/outline" element={<CourseOutline />} />
        <Route path="/course-details/:courseId" element={<CourseDetails />} />
        <Route path="quizzes" element={<TQuizzes />} />
        <Route path="monitor" element={<Monitor />} />
        <Route path="*" element={<Navigate to="/teacher/home" />} />
        <Route path="practice" element={<AddPracticeQuestion />} />
        <Route path="practice/add-coding" element={<CreateCodingQuestion />} />
        <Route path="practice/add-aptitude" element={<CreateAptitudeQuestion />} />
        <Route path="questions" element={<CodingQuestionList />} />
        <Route path="aptitudequestions" element={<AptitudeQuestionListBySection />} />


      </Routes>
    </Layout>
  );
}
