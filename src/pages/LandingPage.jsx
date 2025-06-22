import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // ✅ listener is an object, unsubscribe is a function returned separately
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe(); // ✅ correct
    };
    
  }, []);
  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    } else {
      console.log("✅ Logged out");
      setUser(null);
      navigate("/"); // Or reload window
    }
  };
  

  const handleContinue = () => {
    if (!user) {
      alert("Please log in to continue.");
      return;
    }
    navigate("/dashboard");
  };
  

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 to-black overflow-auto text-white">
      {/* Header if user is logged in */}
      {user && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2 text-gray-300">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" />
            </svg>
            <span>{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main container */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Smart Assistant
            </h1>
            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto">
              Your intelligent companion for text data and documents !
            </p>
          </div>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-transparent text-white border border-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-900/50 transition-all duration-300 text-lg font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-transparent text-white border border-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-900/50 transition-all duration-300 text-lg font-medium"
              >
                Login
              </button>
            </div>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative inline-flex justify-center bg-gray-950 px-4 text-gray-500">
             
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="group px-12 py-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-300 text-lg font-medium inline-flex items-center gap-2"
          >
            Continue to App
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] animate-float animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/2 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px] animate-float animation-delay-4000"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-100px) translateX(20px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
