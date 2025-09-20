import { useState } from "react";
import { teacherService } from "../../services/teacherService";
import toast from "react-hot-toast";
import { marked } from "marked";
import DOMPurify from "dompurify";

const steps = ["Course Info", "Lessons", "Videos", "Review & Publish"];

marked.setOptions({
  gfm: true,
  breaks: true,
});

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
  const [videos, setVideos] = useState({}); // { lessonId: [ {type, url, file, title, ...} ] }

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
    if (!course.id) {
      toast.error("Create the course first");
      return;
    }
    if (!lessonForm.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    try {
      const res = await teacherService.addLesson(course.id, lessonForm);
      // keep server response; if server doesn't return full lesson, merge what we have
      const lessonSaved = { ...lessonForm, id: res.id ?? Date.now(), ...res };
      setLessons([...lessons, lessonSaved]);
      setLessonForm({ title: "", description: "", order: lessons.length + 2 });
      toast.success("Lesson added!");
    } catch (error) {
      console.error("Add lesson error:", error);
      toast.error(error.response?.data?.message || "Error adding lesson");
    }
  };

  const addVideo = async (lessonId, video) => {
    try {
      let res;

      if (video instanceof File) {
        const formData = new FormData();
        formData.append("file", video);
        res = await teacherService.uploadLessonVideo(lessonId, formData);
        // attach client File reference and some metadata for UI
        res = { ...res, type: "file", file: video, title: video.name };
      } else if (typeof video === "string") {
        // assume YouTube URL or embed URL
        res = await teacherService.addYoutubeVideo(lessonId, { url: video });
        res = { ...res, type: "youtube", url: video, title: res.title || video };
      } else {
        throw new Error("Unsupported video format");
      }

      setVideos((prev) => ({
        ...prev,
        [lessonId]: [...(prev[lessonId] || []), res],
      }));

      toast.success("Video added!");
    } catch (error) {
      console.error("Add video error:", error);
      toast.error(error.response?.data?.message || "Error adding video");
    }
  };

  // helper to convert markdown -> sanitized HTML
  const renderMarkdown = (text) => {
    if (!text) return "";
    const html = marked(text);
    return DOMPurify.sanitize(html);
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
            className="w-full border p-2 rounded h-40"
            placeholder="Description (supports Markdown)"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          {/* Live preview for course description */}
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">Preview</div>
            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
            ></div>
          </div>

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
          <div className="flex gap-2">
            <button
              onClick={createCourse}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
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
              className="w-full border p-2 rounded h-40"
              placeholder="Lesson Description (supports Markdown)"
              value={lessonForm.description}
              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
            />
            {/* Live preview for lesson description */}
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">Preview</div>
              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(lessonForm.description) }}
              ></div>
            </div>

            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Order"
              value={lessonForm.order}
              onChange={(e) =>
                setLessonForm({ ...lessonForm, order: parseInt(e.target.value || "1") })
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
                <div
                  className="text-sm text-gray-600 mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(l.description) }}
                ></div>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addVideo(l.id, file);
                    e.target.value = "";
                  }}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  placeholder="YouTube URL"
                  className="border p-2 rounded w-1/2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addVideo(l.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              <ul className="mt-2 text-sm text-gray-600">
                {(videos[l.id] || []).map((v, i) => (
                  <li key={i} className="py-1">
                    {v.type === "file" ? `📂 ${v.file?.name || v.title}` : `🎥 ${v.url || v.title}`}
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

          <div className="bg-white p-4 rounded shadow space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
              ></div>
            </div>

            <div>
              <h4 className="font-semibold">Lessons</h4>
              <div className="space-y-2 mt-2">
                {lessons.map((l) => (
                  <div key={l.id} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{l.title}</div>
                    <div
                      className="prose prose-sm max-w-none text-gray-700 mt-1"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(l.description) }}
                    ></div>

                    <div className="mt-2">
                      <strong>Videos</strong>
                      <ul className="mt-1 text-sm text-gray-600">
                        {(videos[l.id] || []).map((v, idx) => (
                          <li key={idx} className="py-1">
                            {v.type === "file" ? `📂 ${v.file?.name || v.title}` : `🎥 ${v.url || v.title}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(3)} className="px-6 py-2 bg-gray-400 text-white rounded-lg">
                Back
              </button>
              <button
                onClick={async () => {
                  try {
                   
                    toast.success("Course published");
                  } catch (err) {
                    console.error(err);
                    toast.error("Publish failed");
                  }
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
