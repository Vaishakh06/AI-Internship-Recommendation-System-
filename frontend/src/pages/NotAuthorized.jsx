// frontend/src/pages/NotAuthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// This is the SVG icon for a "lock"
const LockIcon = () => (
  <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
  </svg>
);

const NotAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#171C1C] text-white text-center p-6">
      <LockIcon />
      <h1 className="text-4xl font-bold text-red-500 mt-4 mb-4">
        Access Denied
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Whoops! You are not authorized to access this page.
      </p>
      <Link
        to="/"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg text-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotAuthorized;