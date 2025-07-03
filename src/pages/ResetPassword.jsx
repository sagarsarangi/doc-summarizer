import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import bb from "./cc.jpg";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Password reset failed: " + error.message);
    } else {
      alert("Password has been reset. Please log in.");
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
            Reset Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-8 px-6 py-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 text-lg"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            onClick={handlePasswordReset}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-lg text-xl font-medium transition-colors duration-200"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}