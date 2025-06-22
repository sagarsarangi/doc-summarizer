import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading)
    return <div className="text-white p-4">Checking authentication...</div>;

  return user ? children : <Navigate to="/" replace />;
}
