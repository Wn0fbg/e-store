import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassoword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
    useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  // signin | signup | forgot | reset
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Detect reset password url and open popup with reset mode
  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("email", formData);
    data.append("password", formData.password);

    if (mode == "signup") data.append("name", formData.name);

    if (mode === "forgot") {
      dispatch(forgotPassoword({ email: formData.email })).then(() => {
        dispatch(toggleAuthPopup());
        setMode("signin");
      });
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      );
      return;
    }

    if (mode === "signup") {
      dispatch(register(data));
    } else {
      dispatch(login(data));
    }

    if (authUser) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }

    if (!isAuthPopupOpen || authUser) return null;
  };

  let isLoading = isSigningUp || isLoggingIn;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]">
          <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {mode === "reset"
                  ? "Reset Password"
                  : mode === "signup"
                    ? "Create Account"
                    : mode === "forgot"
                      ? "Forgot Password"
                      : "Welcome back"}
              </h2>
              <button
                onClick={() => dispatch(toggleAuthPopup())}
                className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
              >
                <X className="size-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
