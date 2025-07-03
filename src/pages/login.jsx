import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import bb from "./cc.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email above before resetting password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://doc-summarizer-plum.vercel.app/reset-password", // ⚠️ Change this for production
    });

    if (error) {
      alert("Failed to send reset link: " + error.message);
    } else {
      alert("Password reset link sent. Check your email.");
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat overflow-auto"
      style={{
        backgroundImage: `url(${bb})`, // ✅ correct
      }}
    >
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="bg-gray-800 text-white p-12 rounded-xl w-full max-w-2xl shadow-xl">
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-6 px-6 py-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 text-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-8 px-6 py-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 text-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-lg text-xl font-medium transition-colors duration-200 mb-6"
          >
            Login
          </button>

          <div className="text-center">
            <button
              onClick={handleForgotPassword}
              className="text-blue-400 hover:underline text-lg"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}