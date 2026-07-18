import { resolveUploadUrl } from "../../lib/resolveUploadUrl";

// Shows a user's uploaded banner image, falling back to a custom gradient
// (picked in Settings) or the app default when neither is set.
export default function Banner({ user, className = "" }) {
  const style = user?.bannerUrl
    ? { backgroundImage: `url(${resolveUploadUrl(user.bannerUrl)})` }
    : user?.bannerGradient
      ? { background: user.bannerGradient }
      : undefined;

  const fallbackClass =
    !user?.bannerUrl && !user?.bannerGradient
      ? "bg-gradient-to-br from-violet/25 to-coral/25 dark:from-violet/15 dark:to-coral/15"
      : "";

  return (
    <div className={`bg-cover bg-center ${fallbackClass} ${className}`} style={style} />
  );
}
