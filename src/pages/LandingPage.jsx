import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import GoogleAuthButton from "../components/GoogleAuthButton";
import logo from "./b.png";
import Spline from "@splinetool/react-spline";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loadedModels, setLoadedModels] = useState({
    leftMedium: false,
    rightMedium: false,
    leftLarge: false,
    rightLarge: false,
  });
  const [screenSize, setScreenSize] = useState("small");
  const [showContent, setShowContent] = useState(false);

  // Determine screen size
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth >= 1360) {
        setScreenSize("large");
      } else if (window.innerWidth >= 1090) {
        setScreenSize("medium");
      } else {
        setScreenSize("small");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const handleSplineLoad = (modelType) => {
    setLoadedModels((prev) => ({
      ...prev,
      [modelType]: true,
    }));
  };

  // Check if all required models for current screen size are loaded
  const areRequiredModelsLoaded = useCallback(() => {
    if (screenSize === "small") {
      return true; // No models needed for small screens
    } else if (screenSize === "medium") {
      return loadedModels.leftMedium && loadedModels.rightMedium;
    } else if (screenSize === "large") {
      return loadedModels.leftLarge && loadedModels.rightLarge;
    }
    return false;
  }, [screenSize, loadedModels]);

  useEffect(() => {
    if (areRequiredModelsLoaded() && !showContent) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [areRequiredModelsLoaded, showContent]); // Now we can safely include areRequiredModelsLoaded

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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("🧠 Session before logout:", session);

    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    } else {
      setUser(null);
      navigate("/");
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {!showContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
          <div className="animate-pulse text-2xl">Loading experience...</div>
        </div>
      )}

      {/* Header if user is logged in */}
      {user && showContent && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-[25rem] px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl z-50 h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300">
              <img src={logo} alt="Smart Assistant Logo" className="w-8 h-8" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1 !bg-red-500 hover:!bg-red-500 rounded text-gray-100 hover:scale-106"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div
        className={`${
          !areRequiredModelsLoaded()
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-100"
        }`}
      >
        {/* Main container */}
        <div className="flex items-center justify-center min-h-[calc(100vh)] z-10">
          <div className="w-full max-w-6xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-9xl sm:text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight bg-gradient-to-r from-gray-500 to-white bg-clip-text text-transparent">
                Smart Assistant
              </h1>
              <p className="mt-6 text-xl text-white font-light max-w-3xl mx-auto">
                Your intelligent companion for text data and documents
              </p>
            </div>

            {!user && (
              <div className="flex flex-col gap-4 justify-center items-center mb-12">
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full px-8 py-4 border-gray-600 !text-xl hover:border-gray-400 transition-all duration-300 font-medium !rounded-3xl !bg-orange-400 hover:!bg-orange-600 hover:scale-104"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-8 py-4 !bg-pink-500 text-white border border-gray-600 !rounded-3xl hover:border-gray-400 hover:!bg-pink-600 transition-all duration-300 !text-xl !font-large hover:scale-104"
                  >
                    Login
                  </button>
                </div>

                {/* Google button below login/signup */}
                <div className="w-full max-w-md rounded-3xl hover:scale-104">
                  <GoogleAuthButton />
                </div>
              </div>
            )}

            <div className="relative my-8 left-1/2 -translate-x-1/2 w-screen">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative inline-flex justify-center bg-gray-950 px-4 text-gray-500 w-full"></div>
            </div>

            <button
              onClick={handleContinue}
              className="group px-12 py-4 ease-in-out !bg-green-400 hover:scale-110 rounded-lg transition-all duration-300 text-lg font-medium inline-flex items-center gap-2 text-black"
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

          {/* Left Spline - Shows only between 1090px and 1360px (medium screens) */}
          <div className="fixed left-10 w-70 h-300 hidden [@media(min-width:1090px)]:block [@media(min-width:1360px)]:hidden">
            <Spline
              scene="https://prod.spline.design/CjDsD8tqkdCOdO8W/scene.splinecode"
              onLoad={() => handleSplineLoad("leftMedium")}
            />
          </div>

          {/* Left Spline - Shows only above 1360px (large screens) */}
          <div className="fixed left-10 w-130 h-300 hidden [@media(min-width:1360px)]:block">
            <Spline
              scene="https://prod.spline.design/CjDsD8tqkdCOdO8W/scene.splinecode"
              onLoad={() => handleSplineLoad("leftLarge")}
            />
          </div>

          {/* Right Spline - Shows only between 1090px and 1360px (medium screens) */}
          <div className="fixed right-10 w-70 h-200 hidden [@media(min-width:1090px)]:block [@media(min-width:1360px)]:hidden">
            <Spline
              scene="https://prod.spline.design/CjDsD8tqkdCOdO8W/scene.splinecode"
              onLoad={() => handleSplineLoad("rightMedium")}
            />
          </div>

          {/* Right Spline - Shows only above 1360px (large screens) */}
          <div className="fixed right-10 w-130 h-200 hidden [@media(min-width:1360px)]:block">
            <Spline
              scene="https://prod.spline.design/CjDsD8tqkdCOdO8W/scene.splinecode"
              onLoad={() => handleSplineLoad("rightLarge")}
            />
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
    </div>
  );
}
