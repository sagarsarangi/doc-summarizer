import { supabase } from "../utils/supabaseClient";

export default function GoogleAuthButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-md border border-border !bg-blue-600 hover:!bg-blue-700 transition-colors duration-200  "
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-8 h-8 p-1 !bg-white"
        />
        <span className="text-card-foreground font-medium">
          Continue with Google
        </span>
      </button>
    </div>
  );
}