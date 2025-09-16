import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import banner1 from '../../Images/Top-Banner1.avif';
import banner2 from '../../Images/Top-Banner2.avif';
import banner3 from '../../Images/Top-Banner3.avif';
import aiBanner from '../../Images/AI-ThumNail.webp';

export default function StudentDashboard() {
  const navigate = useNavigate();

 
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fade, setFade] = useState(true);

  const banners = [
  {
    image: banner1,
    title: "Welcome Back!",
    subtitle: "Continue learning, practicing, and growing your skills.",
  },
  {
    image: banner2,
    title: "Master New Skills",
    subtitle: "Explore top-rated courses and sharpen your expertise.",
  },
  {
    image: banner3,
    title: "Your Learning Journey",
    subtitle: "Track progress and stay motivated every step of the way.",
  },
];


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setFade(true); // Fade-in new image
      }, 500); // Duration of fade-out
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { label: 'My Courses', to: '/student/home/my-courses', icon: '🎓' },
    { label: 'Online Compiler', to: '/student/home/compiler', icon: '💻' },
    { label: 'Practice Questions', to: '/student/home/practice', icon: '📝' },
    { label: 'Leaderboard', to: '/student/home/Leaderboard', icon: '🏆' },
    { label: 'Performance', to: '/student/home/performance', icon: '📊' },
  ];

  const trendingSkills = [
    { category: 'ChatGPT', learners: '4,997,191' },
    { category: 'Development', learners: '49,224,835' },
    { category: 'Design', learners: '3,035,175' },
    { category: 'Business', learners: '2,728,520' },
  ];

  return (
    <div className="space-y-16 px-4 py-6 bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Hero Banner with Animation */}
    <div className="relative rounded-xl overflow-hidden shadow-lg w-full aspect-[20/9]">
  <img
    src={banners[currentBanner].image}
    alt="Learning Banner"
    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
  />
  <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white">
    <h1 className="text-4xl font-bold mb-2">{banners[currentBanner].title}</h1>
    <p className="text-lg">{banners[currentBanner].subtitle}</p>
  </div>
</div>





      {/* Quick Access */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-blue-900">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickLinks.map((link) => (
            <div
              key={link.label}
              onClick={() => navigate(link.to)}
              className="bg-blue-100 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-200 transition"
            >
              <div className="text-4xl mb-3">{link.icon}</div>
              <p className="text-base font-medium text-blue-900">{link.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-blue-900">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {trendingSkills.map((skill) => (
            <div key={skill.category} className="bg-blue-100 rounded-xl shadow p-6 text-center hover:bg-blue-200 transition">
              <h3 className="text-xl font-bold text-blue-900">{skill.category}</h3>
              <p className="text-sm text-blue-700">{skill.learners} learners</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI for Business Leaders */}
      <section className="flex flex-col lg:flex-row items-center gap-8 bg-blue-100 p-8 rounded-xl shadow-md">
        <img src={aiBanner} alt="AI for Business Leaders" className="w-full lg:w-1/3 rounded-xl object-cover" />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">AI for Business Leaders</h2>
          <p className="text-blue-800 mb-6">
            Build an AI-habit for you and your team that builds hands-on skills to help you lead effectively.
          </p>
          <button
            onClick={() => navigate('/student/home/ai-business-leaders')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Explore Course
          </button>
        </div>
      </section>

      {/* About Us */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">About LearnHub</h2>
        <p className="text-blue-700 text-lg leading-relaxed">
          LearnHub is your gateway to mastering skills that matter. We offer expert-led courses, interactive practice tools,
          and performance tracking to help you grow confidently. Whether you're a student, professional, or lifelong learner—
          we're here to support your journey.
        </p>
      </section>

      {/* Contact Us */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Contact Us</h2>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email ID"
            className="w-full border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Contact Number"
            className="w-full border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6 rounded-xl shadow-inner mt-12">
        <p className="text-sm">© 2025 LearnHub. All rights reserved.</p>
        <p className="text-sm">Designed and developed by LearnHub Team.</p>
      </footer>
    </div>
  );
}
