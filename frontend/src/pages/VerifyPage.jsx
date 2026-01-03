import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");
    const verifiedOnce = useRef(false); // 👈 guard against multiple calls

    useEffect(() => {
        const verifyEmail = async () => {
            if (verifiedOnce.current) return; // prevents second call in Strict Mode
            verifiedOnce.current = true;

            try {
                const res = await axios.get(`http://localhost:8080/api/auth/verify/${token}`);
                if (res.status === 200) {
                    setStatus("success");
                }
            } catch (err) {
                console.error("Verification failed:", err);

                if (err.response?.data?.message?.includes("already verified")) {
                    setStatus("alreadyVerified");
                } else if (err.response?.status === 400) {
                    setStatus("alreadyVerified"); // handle gracefully
                } else {
                    setStatus("error");
                }
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#171C1C] text-white">
            <div className="bg-gray-800 p-10 rounded-lg shadow-lg text-center w-full max-w-md">
                {status === "loading" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                            Verifying your email...
                        </h2>
                        <p className="text-gray-400">
                            Please wait while we confirm your account.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-green-400">
                            ✅ Email Verified Successfully!
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Your account has been activated. You can now log in.
                        </p>
                        <Link
                            to="/login"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === "alreadyVerified" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">
                            ✅ Email Already Verified
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Your account is already active. You can log in now.
                        </p>
                        <Link
                            to="/login"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-red-500">
                            ❌ Verification Failed
                        </h2>
                        <p className="text-gray-400 mb-6">
                            This link is invalid or expired. Please register again.
                        </p>
                        <Link
                            to="/register"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                        >
                            Go to Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;
