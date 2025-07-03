import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import bb from "./z.jpg";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkIfUserExists = async (email) => {
    const { data } = await supabase.rpc("check_user_exists", {
      input_email: email,
    });
    return data === true;
  };

  const handleSignUp = async () => {
    const exists = await checkIfUserExists(email);
    if (exists) {
      alert("Email is already registered. Please log in instead.");
      navigate("/"); // 👈 redirect to landing page
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("Sign-up failed: " + error.message);
    } else {
      alert("Thank you for Signing up");
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat overflow-auto"
    style={{
            backgroundImage: `url(${bb})`, // ✅ correct
          }}>
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="bg-gray-800 text-white p-12 rounded-xl w-full max-w-2xl shadow-xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Create Account
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-6 px-6 py-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-600 text-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-8 px-6 py-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-600 text-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignUp}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-lg text-xl font-medium transition-colors duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}