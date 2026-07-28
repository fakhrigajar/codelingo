import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { uploadImage } from "../lib/uploadImage";
import { useTheme } from "../lib/useTheme";
import Avatar from "../components/common/Avatar";
import Banner from "../components/common/Banner";
import Switch from "../components/common/Switch";

const SECTIONS = [
  {
    id: "profile",
    label: "Profile settings",
    hint: "Photo, banner, dark mode",
  },
  { id: "account", label: "User settings", hint: "Username, email, password" },
];

const GRADIENTS = [
  {
    id: "sunset",
    name: "Sunset",
    value: "linear-gradient(135deg, #8C7AE6, #FF6B5B)",
  },
  {
    id: "aurora",
    name: "Aurora",
    value: "linear-gradient(135deg, #2FC493, #8C7AE6)",
  },
  {
    id: "ember",
    name: "Ember",
    value: "linear-gradient(135deg, #FF6B5B, #FFC93C)",
  },
  {
    id: "lagoon",
    name: "Lagoon",
    value: "linear-gradient(135deg, #2FC493, #38BDF8)",
  },
  {
    id: "grape",
    name: "Grape",
    value: "linear-gradient(135deg, #7C3AED, #EC4899)",
  },
  {
    id: "citrus",
    name: "Citrus",
    value: "linear-gradient(135deg, #FACC15, #FB923C)",
  },
  {
    id: "berry",
    name: "Berry",
    value: "linear-gradient(135deg, #DB2777, #9333EA)",
  },
  {
    id: "skyline",
    name: "Skyline",
    value: "linear-gradient(135deg, #38BDF8, #6366F1)",
  },
  {
    id: "blaze",
    name: "Blaze",
    value: "linear-gradient(135deg, #F43F5E, #FB923C)",
  },
  {
    id: "emerald",
    name: "Emerald",
    value: "linear-gradient(135deg, #059669, #3B82F6)",
  },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function ImagePicker({
  label,
  hint,
  shape,
  preview,
  uploading,
  hasValue,
  onFile,
  onRemove,
  extraButton,
}) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFile(file);
  };

  return (
    <div className="mb-6">
      <label className="block font-bold text-sm mb-1.5 text-ink-soft dark:text-white/60">
        {label}
      </label>
      {hint && (
        <p className="text-[.78rem] text-ink-soft dark:text-white/50 mb-2.5">
          {hint}
        </p>
      )}
      <div
        className={
          shape === "banner" ? "flex flex-col gap-3" : "flex items-center gap-4"
        }
      >
        {preview}
        <div className="flex items-center gap-3 flex-wrap">
          {extraButton}
          <label
            className={`px-3.5 py-2 rounded-[10px] font-bold text-[.85rem] bg-white text-indigo-dark border-2 border-line dark:bg-white/10 dark:text-white dark:border-white/15 cursor-pointer hover:opacity-85 w-fit ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? "Uploading…" : hasValue ? "Change" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
              disabled={uploading}
            />
          </label>
          {hasValue && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[.82rem] font-bold text-coral hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomizeButton(props) {
  return (
    <button
      type="button"
      className="px-3.5 py-2 rounded-[10px] font-bold text-[.85rem] bg-white text-indigo-dark border-2 border-solid border-line dark:bg-white/10 dark:text-white dark:border-white/15 cursor-pointer hover:opacity-85 w-fit"
      {...props}
    >
      Customize
    </button>
  );
}

function GradientSwatches({ hint, value, onChange }) {
  return (
    <div className="-mt-3 mb-6">
      <p className="text-[.78rem] text-ink-soft dark:text-white/50 mb-2.5">
        {hint}
      </p>
      <div className="flex flex-wrap gap-3">
        {GRADIENTS.map((g) => (
          <button
            key={g.id}
            type="button"
            title={g.name}
            aria-label={g.name}
            onClick={() => onChange(g.value)}
            className={`w-10 h-10 rounded-full shrink-0 transition-transform hover:scale-110 ${
              value === g.value
                ? "ring-2 ring-offset-2 ring-violet dark:ring-offset-indigo-dark"
                : ""
            }`}
            style={{ background: g.value }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, updateAccount, saveCurrentUser } = useAuth();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const [section, setSection] = useState("profile");

  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
  const [avatarGradient, setAvatarGradient] = useState(
    currentUser.avatarGradient || GRADIENTS[0].value,
  );
  const [bannerUrl, setBannerUrl] = useState(currentUser.bannerUrl || "");
  const [bannerGradient, setBannerGradient] = useState(
    currentUser.bannerGradient || "",
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [showAvatarGradientPicker, setShowAvatarGradientPicker] =
    useState(false);
  const [showBannerGradientPicker, setShowBannerGradientPicker] =
    useState(false);
  const [profileError, setProfileError] = useState("");

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  const handleAvatarFile = async (file) => {
    setUploadingAvatar(true);
    try {
      const url = await uploadImage(await readFileAsDataUrl(file));
      setAvatarUrl(url);
    } catch (err) {
      toast(err.message || "Could not upload image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBannerFile = async (file) => {
    setUploadingBanner(true);
    try {
      const url = await uploadImage(await readFileAsDataUrl(file));
      setBannerUrl(url);
    } catch (err) {
      toast(err.message || "Could not upload image.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError("");
    saveCurrentUser({
      ...currentUser,
      avatarUrl,
      avatarGradient,
      bannerUrl,
      bannerGradient,
    });
    setShowAvatarGradientPicker(false);
    setShowBannerGradientPicker(false);
    toast("Profile updated!");
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountError("");

    const changingPassword = newPassword || confirmPassword || currentPassword;
    if (
      changingPassword &&
      (!newPassword || !confirmPassword || !currentPassword)
    ) {
      setAccountError(
        "Fill in all three password fields to change your password.",
      );
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setAccountError("New passwords don't match.");
      return;
    }

    setSavingAccount(true);
    const res = await updateAccount({
      displayName: currentUser.displayName,
      username,
      email,
      currentPassword,
      newPassword,
    });
    setSavingAccount(false);

    if (!res.ok) {
      setAccountError(res.error);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast("Account updated!");
  };

  return (
    <div className="py-5">
      <Link
        to="/profile"
        className="inline-block text-[.82rem] font-bold text-ink-soft dark:text-white/50 hover:text-violet mb-4"
      >
        ← Back to profile
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <nav className="w-full sm:w-[240px] shrink-0 bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[20px] p-3 sm:sticky sm:top-24">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`w-full text-left px-4 py-3 rounded-xl mb-1 last:mb-0 transition-colors ${
                section === s.id
                  ? "bg-mint/10 text-mint-dark dark:bg-mint/15 dark:text-mint"
                  : "text-ink-soft dark:text-white/60 hover:bg-bg dark:hover:bg-white/10"
              }`}
            >
              <span className="block font-bold text-[.88rem]">{s.label}</span>
              <span className="block font-normal text-[.72rem] mt-0.5 opacity-80">
                {s.hint}
              </span>
            </button>
          ))}
        </nav>

        <div className="flex-1 w-full bg-white dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-[20px] p-9">
          {section === "profile" ? (
            <form onSubmit={handleProfileSubmit}>
              <h1 className="text-[1.5rem] mb-1">Profile settings</h1>
              <p className="text-[.85rem] text-ink-soft dark:text-white/50 mb-6">
                This is what other learners see on your posts and profile.
              </p>

              {profileError && (
                <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">
                  {profileError}
                </div>
              )}

              <ImagePicker
                label="Profile photo"
                shape="avatar"
                hasValue={!!avatarUrl}
                uploading={uploadingAvatar}
                onFile={handleAvatarFile}
                onRemove={() => setAvatarUrl("")}
                preview={
                  <Avatar
                    user={{
                      avatarUrl,
                      avatarGradient,
                      displayName: currentUser.displayName,
                    }}
                    size={72}
                  />
                }
                extraButton={
                  <CustomizeButton
                    onClick={() => setShowAvatarGradientPicker((v) => !v)}
                  />
                }
              />

              {showAvatarGradientPicker && (
                <GradientSwatches
                  hint="Pick a background color for your initials bubble — used whenever you don't have a photo uploaded."
                  value={avatarGradient}
                  onChange={setAvatarGradient}
                />
              )}

              <ImagePicker
                label="Profile banner"
                shape="banner"
                hasValue={!!bannerUrl}
                uploading={uploadingBanner}
                onFile={handleBannerFile}
                onRemove={() => setBannerUrl("")}
                preview={
                  <Banner
                    user={{ bannerUrl, bannerGradient }}
                    className="w-full h-32 rounded-xl"
                  />
                }
                extraButton={
                  <CustomizeButton
                    onClick={() => setShowBannerGradientPicker((v) => !v)}
                  />
                }
              />

              {showBannerGradientPicker && (
                <GradientSwatches
                  hint="Pick a background color for your banner — used whenever you don't have a banner image uploaded."
                  value={bannerGradient}
                  onChange={setBannerGradient}
                />
              )}

              <div className="flex items-center justify-between gap-4 mb-6 py-1">
                <div>
                  <span className="block font-bold text-sm text-ink-soft dark:text-white/60">
                    Dark mode
                  </span>
                  <span className="block text-[.78rem] text-ink-soft dark:text-white/50 mt-0.5">
                    Switch between light and dark themes.
                  </span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                  label="Toggle dark mode"
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Save profile
              </button>
            </form>
          ) : (
            <form onSubmit={handleAccountSubmit}>
              <h1 className="text-[1.5rem] mb-1">User settings</h1>
              <p className="text-[.85rem] text-ink-soft dark:text-white/50 mb-6">
                Update your login and security details.
              </p>

              {accountError && (
                <div className="bg-[#FFEDEB] text-[#B23B2C] dark:bg-[#4A1F1A] dark:text-[#FCA5A5] px-3.5 py-2.5 rounded-xl text-[.85rem] mb-4">
                  {accountError}
                </div>
              )}

              <div className="field mb-4">
                <label>Username</label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  pattern="[A-Za-z0-9_]+"
                  title="Letters, numbers and underscore only"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field mb-4">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="my-6 border-t-2 border-line dark:border-white/10" />

              <div className="field mb-4">
                <label>New password</label>
                <input
                  type="password"
                  minLength={4}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="field mb-4">
                <label>Confirm new password</label>
                <input
                  type="password"
                  minLength={4}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="field mb-6">
                <label>Current password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Only required to change your password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={savingAccount}
              >
                Save account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
