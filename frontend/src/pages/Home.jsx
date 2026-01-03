import CardWrapper from "../components/CardWrapper";
import { useNavigate, useLocation } from 'react-router-dom';
// 1. Import useEffect and useRef
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const Home = () => {
  return (
    <div className="min-h-[90vh] bg-[#171C1C] text-white">
      <IntroSection />
    </div>
  );
};

const IntroSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Create a ref. This is like a "memory" for the component
  // that doesn't cause re-renders.
  const toastFired = useRef(false);

  // --- THIS IS THE FIX ---
  useEffect(() => {
    // 3. Check for the error AND check our "memory"
    if (location.state?.error && !toastFired.current) {
      // 4. Fire the toast
      toast.error(location.state.error);

      // 5. Set our "memory" to true so this never runs again
      toastFired.current = true;

      // 6. Clear the error from the location state
      navigate('.', { replace: true, state: {} });
    }
  }, [location, navigate]); // This hook will re-run, but step 3 will fail
  // -------------------------


  // --- (The rest of your component is below) ---

  const StudentIcon = () => (
    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.79l7 3.5a1 1 0 00.786 0l7-3.5a1 1 0 00.002-1.79l-7-3.5zM3 9.38l7 3.5 7-3.5v3.83l-7 3.5-7-3.5V9.38z"></path>
      <path d="M10 12.65l-7-3.5v.03A1.002 1.002 0 002 10v5a1 1 0 001 1h14a1 1 0 001-1v-5a1 1 0 00-.002-1.09v-.03l-7 3.5z"></path>
    </svg>
  );

  const AdminIcon = () => (
    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  );

  return (
    <section className="min-h-screen w-full py-6 text-center flex justify-center items-center">
      <div>
        <h1 className="text-2xl lg:text-5xl font-bold text-[#E9CD5F] m-auto w-full max-w-3xl">
          Empower Your Future with AI Internships
        </h1>
        <p className="mt-4 mb-8 w-[80%] lg:w-full m-auto text-sm lg:text-lg text-gray-200">
          Unlock government internships tailored to your skills and ambitions.
          <br />
          Powered by AI, built for students.
        </p>

        {/* --- PORTAL CARD SECTION --- */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center my-10">

          {/* Student Portal Card */}
          <div
            className="flex flex-col p-8 bg-[#2C2C2C] border border-gray-700 rounded-lg shadow-lg w-full max-w-sm text-center items-center h-80"
          >
            <div className="w-24 h-24 bg-[#3B4A4A] rounded-full flex items-center justify-center mb-4">
              <StudentIcon />
            </div>
            <h2 className="text-3xl font-semibold mb-3">For Students</h2>
            <p className="text-gray-300 mb-6 px-4">
              Build your profile, find top-matching internships, and start your government career journey.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="bg-[#E9CD5F] hover:bg-[#FFC300] text-black font-semibold py-3 px-6 rounded-lg text-lg transition-transform hover:scale-105"
            >
              Find Internships &rarr;
            </button>
          </div>

          {/* Admin Portal Card */}
          <div
            className="flex flex-col p-8 bg-[#2C2C2C] border border-gray-700 rounded-lg shadow-lg w-full max-w-sm text-center items-center h-80"
          >
            <div className="w-24 h-24 bg-[#3B4A4A] rounded-full flex items-center justify-center mb-4">
              <AdminIcon />
            </div>
            <h2 className="text-3xl font-semibold mb-3">For Admins</h2>
            <p className="text-gray-300 mb-6 px-4">
              Manage, approve, and add new internship opportunities.
            </p>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-[#E9CD5F] hover:bg-[#FFC300] text-black font-semibold py-3 px-6 rounded-lg text-lg transition-transform hover:scale-105"
            >
              Admin Portal &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;