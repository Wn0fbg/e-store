import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";
import { toggleAuthPopup, toggleSidebar } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState("");
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword());
  };

  if (!isAuthPopupOpen || !authUser) return null;

  return (
    <>
      {/* Overlay  */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Profile panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Profile</h2>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="size-5 text-primary" />
          </button>
        </div>

        <div className="p-6">
          {/* Avatar and basic info */}
          <div className="text-center mb-6">
            <img
              src={authUser?.avatar?.url || "/avatar-holder.avif"}
              alt={authUser?.name}
              className="size-20 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
            />
            <h3 className="text-lg font-semibold text-foreground">
              {authUser?.name}
            </h3>
            <p className="text-muted-foreground">{authUser?.email}</p>
          </div>

          {/* Profile update form */}
          {authUser && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-primary">
                Update Profile
              </h3>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                <Upload className="size-4 text-primary" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleUpdateProfile}
                className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
              >
                {isUpdatingProfile ? (
                  <>
                    <div
                      className={`size-5 border-2 border-white border-t-transparent rounded-full
                        animate-spin `}
                    />
                    <span>Updating Profie</span>
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          )}

          {/* Update password form */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">
              Update Password
            </h3>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              {showPassword ? (
                <EyeOff className="size-4 text-primary" />
              ) : (
                <Eye className="size-4 text-primary" />
              )}
              {showPassword ? "Hide" : "Show"} Passwords
            </button>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
            <button
              onClick={handleUpdatePassword}
              className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
            >
              {isUpdatingPassword ? (
                <>
                  <div
                    className={`size-5 border-2 border-white border-t-transparent rounded-full
                        animate-spin `}
                  />
                  <span>Updating password</span>
                </>
              ) : (
                "Update password"
              )}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className={`my-6 flex items-center space-x-3 p-3 rounded-lg
            glass-card hover:glow-on-hover text-destructive
            hover:text-destructive-foreground group w-full`}
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
