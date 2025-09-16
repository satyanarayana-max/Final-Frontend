// import { useEffect, useState } from 'react';
// import { studentService } from '../../services/studentService';
// import toast from 'react-hot-toast';
// import Loader from '../../components/Loader';
// import { Link } from 'react-router-dom';

// export default function AllCourses() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const data = await studentService.listCourses();
//       setRows(data);
//     } catch {
//       toast.error('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load() }, []);

//   if (loading) return <Loader />;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {rows.map(c => (
//         <div key={c.id} className="bg-white rounded shadow p-4">
//           <div className="font-medium">{c.title}</div>
//           <div className="text-sm text-gray-600">{c.description}</div>
//           <Link
//             to={`/student/home/courses/${c.id}`} // ✅ Updated to match nested route
//             className="mt-3 inline-block px-3 py-1 bg-green-600 text-white rounded"
//           >
//             View Details
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }



//-----------------------

import { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await studentService.listCourses();

        // ✅ Debug: print all courses in console
        console.log("Fetched all courses:", data);

        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <Loader />;

  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No courses available.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
          >
            {/* Banner/Thumbnail */}
            <img
              src={course.bannerUrl || course.thumbnailUrl || '/default-course.jpg'}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            {/* Course Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {course.description || 'No description available.'}
              </p>
              <button
                onClick={() => navigate(`/student/home/courses/${course.id}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
