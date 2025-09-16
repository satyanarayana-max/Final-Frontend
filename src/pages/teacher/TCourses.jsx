import { useState } from "react";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";

const steps = ["Course Info", "Lessons", "Videos", "Review & Publish"];

export default function TeacherCourseWizard() {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: null,
    banner: null,
    id: null,
  });
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", order: 1 });
  const [videos, setVideos] = useState({}); // { lessonId: [ {type, value, url/name/file} ] }

  // ----------------- API CALLS -----------------
  const createCourse = async () => {
    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("category", course.category);
      if (course.thumbnail) formData.append("thumbnail", course.thumbnail);
      if (course.banner) formData.append("banner", course.banner);

      const res = await teacherService.createCourse(formData);
      setCourse({ ...course, id: res.id });
      toast.success("Course created successfully!");
      setStep(2);
    } catch (error) {
      console.error("Create course error:", error);
      toast.error(error.response?.data?.message || "Error creating course");
    }
  };

  const addLesson = async () => {
    try {
      const res = await teacherService.addLesson(course.id, lessonForm);
      setLessons([...lessons, res]);
      setLessonForm({ title: "", description: "", order: lessons.length + 2 });
      toast.success("Lesson added!");
    } catch (error) {
      console.error("Add lesson error:", error);
      toast.error(error.response?.data?.message || "Error adding lesson");
    }
  };

  // const addVideo = async (lessonId, video, type) => {
  //   try {
  //     let res;
  //     if (type === "file") {
  //       const formData = new FormData();
  //       formData.append("file", video);
  //       res = await teacherService.uploadLessonVideo(lessonId, formData);
  //       // store file object for preview
  //       res.file = video;
  //     } else {
  //       res = await teacherService.addYoutubeVideo(lessonId, { url: video });
  //       res.url = video;
  //     }

  //     setVideos({ ...videos, [lessonId]: [...(videos[lessonId] || []), { ...res, type }] });
  //     toast.success("Video added!");
  //   } catch (error) {
  //     console.error("Add video error:", error);
  //     toast.error(error.response?.data?.message || "Error adding video");
  //   }
  // };


  const addVideo = async (lessonId, video) => {
  try {
    let res;

    if (video instanceof File) {
      const formData = new FormData();
      formData.append("file", video);
      res = await teacherService.uploadLessonVideo(lessonId, formData);
      res.file = video;
    } else if (typeof video === "string") {
      res = await teacherService.addYoutubeVideo(lessonId, { url: video });
      res.url = video;
    } else {
      throw new Error("Unsupported video format");
    }

    setVideos({
      ...videos,
      [lessonId]: [...(videos[lessonId] || []), res],
    });

    toast.success("Video added!");
  } catch (error) {
    console.error("Add video error:", error);
    toast.error(error.response?.data?.message || "Error adding video");
  }
};


  // ----------------- RENDER -----------------
  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-xl">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center 
              ${step === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {idx + 1}
            </div>
            <p className={`mt-2 text-sm ${step === idx + 1 ? "font-bold text-blue-600" : "text-gray-600"}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Course Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Step 1: Course Information</h2>
          <input
            className="w-full border p-2 rounded"
            placeholder="Course Title"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Category"
            value={course.category}
            onChange={(e) => setCourse({ ...course, category: e.target.value })}
          />
          <label className="block">
            Thumbnail:
            <input
              type="file"
              className="w-full border p-2 rounded mt-1"
              onChange={(e) => setCourse({ ...course, thumbnail: e.target.files[0] })}
            />
          </label>
          <label className="block">
            Banner:
            <input
              type="file"
              className="w-full border p-2 rounded mt-1"
              onChange={(e) => setCourse({ ...course, banner: e.target.files[0] })}
            />
          </label>
          <button
            onClick={createCourse}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Lessons */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Step 2: Add Lessons</h2>
          <div className="space-y-2 mb-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Lesson Title"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Lesson Description"
              value={lessonForm.description}
              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Order"
              value={lessonForm.order}
              onChange={(e) =>
                setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })
              }
            />
            <button
              onClick={addLesson}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              + Add Lesson
            </button>
          </div>
          <div className="space-y-2">
            {lessons.map((l) => (
              <div key={l.id} className="p-3 bg-white rounded shadow">
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-gray-600">{l.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Videos */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Step 3: Add Videos</h2>
          {lessons.map((l) => (
            <div key={l.id} className="p-4 mb-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">{l.title}</h3>
              <div className="mt-2 flex gap-2">
                <input
                  type="file"
                  onChange={(e) => addVideo(l.id, e.target.files[0], "file")}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  placeholder="YouTube URL"
                  className="border p-2 rounded w-1/2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addVideo(l.id, e.target.value, "youtube");
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              <ul className="mt-2 text-sm text-gray-600">
                {(videos[l.id] || []).map((v, i) => (
                  <li key={i}>
                    {v.type === "file" ? `📂 ${v.file?.name || v.title}` : `🎥 ${v.url}`}
                  </li>
                ))}
              </ul>


              
            </div>
          ))}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Step 4: Review & Publish</h2>

          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl font-bold">{course.title}</h3>
            <p>{course.description}</p>
            <p className="text-sm text-gray-500">Category: {course.category}</p>
            {course.thumbnail && <p>📸 Thumbnail: {course.thumbnail.name}</p>}
            {course.banner && <p>🖼️ Banner: {course.banner.name}</p>}
          </div>

          <div className="space-y-4">
            {lessons.map((l) => (
              <div key={l.id} className="p-3 bg-gray-100 rounded">
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-gray-600 mb-2">{l.description}</p>
                {/* <ul className="ml-4 text-sm">
                  {(videos[l.id] || []).map((v, i) => (
                    <li key={i}>{v.type === "file" ? `📂 ${v.file?.name || v.title}` : `🎥 ${v.url}`}</li>
                  ))}
                </ul> */}

                <ul className="mt-2 text-sm text-gray-600">
  {(videos[l.id] || []).map((v, i) => (
    <li key={i}>
      {v.file?.name ? `📂 ${v.file.name}` : v.url ? `🎥 ${v.url}` : `📎 ${v.title || "Unnamed Video"}`}
    </li>
  ))}
</ul>

              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg"
            >
              Back
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
              onClick={() => {
                // ✅ Show success toast on same page
                toast.success("Course created successfully! 🎉");
              }}
            >
              ✅ Publish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
