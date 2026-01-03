const NotFoundPage = () => {
  const handleGoBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-white px-4">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
        🚫 Whoops! This internship seems to have ghosted us. Maybe it’s hiding
        from students like you? 😅
      </h1>
      <p className="mb-6 text-center text-sm text-gray-300">
        Don’t worry, no interns were harmed in the making of this page.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-3 bg-[#FFE066] text-black font-semibold cursor-pointer rounded-md hover:bg-yellow-400 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;
