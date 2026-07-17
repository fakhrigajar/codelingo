import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Rocket, BookOpen } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { listPosts } from "../lib/postApi";
import CourseCarousel, { ArrowIcon } from "../components/home/CourseCarousel";
import HeroFloatingLayer from "../components/home/HeroFloatingLayer";
import ThemedButton from "../components/common/ThemedButton";

const FEATURES = [
  {
    pad: "01",
    bg: "#FFF3D6",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.62127 6.3274C8.07174 4.12929 9.73425 2 12 2C14.2658 2 15.9283 4.12929 15.3787 6.3274L15.2106 7H17.75C19.2688 7 20.5 8.23122 20.5 9.75V17.25C20.5 19.8734 18.3734 22 15.75 22H6.25C4.73122 22 3.5 20.7688 3.5 19.25V16.75C3.5 16.519 3.6064 16.301 3.78844 16.1588C3.97048 16.0167 4.20785 15.9664 4.43191 16.0224L6.03624 16.4235C7.28762 16.7363 8.49982 15.7899 8.49982 14.5C8.49982 13.2101 7.28762 12.2637 6.03624 12.5765L4.43191 12.9776C4.20785 13.0336 3.97048 12.9833 3.78844 12.8412C3.6064 12.699 3.5 12.481 3.5 12.25V8.75C3.5 7.7835 4.2835 7 5.25 7H8.78942L8.62127 6.3274Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Learn by playing",
    body: "Every course mixes short reads with click-and-try activities and quick quizzes — no long lectures.",
  },
  {
    pad: "02",
    bg: "#E4FBF2",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.5 6.5C14.9142 6.5 15.25 6.83579 15.25 7.25V10.25C15.25 10.6642 14.9142 11 14.5 11H9.5C9.08579 11 8.75 10.6642 8.75 10.25V7.25C8.75 6.83579 9.08579 6.5 9.5 6.5H14.5Z"
          fill="#363538"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 2.75C17.2091 2.75 19 4.54086 19 6.75V17.25C19 19.4591 17.2091 21.25 15 21.25H9C6.79086 21.25 5 19.4591 5 17.25V6.75C5 4.54086 6.79086 2.75 9 2.75H15ZM9.25 17.5C8.83579 17.5 8.5 17.8358 8.5 18.25C8.5 18.6642 8.83579 19 9.25 19H9.25977C9.67398 19 10.0098 18.6642 10.0098 18.25C10.0098 17.8358 9.67398 17.5 9.25977 17.5H9.25ZM14.75 14.5C14.3358 14.5 14 14.8358 14 15.25V16H13.25C12.8358 16 12.5 16.3358 12.5 16.75C12.5 17.1642 12.8358 17.5 13.25 17.5H14V18.25C14 18.6642 14.3358 19 14.75 19C15.1642 19 15.5 18.6642 15.5 18.25V17.5H16.25C16.6642 17.5 17 17.1642 17 16.75C17 16.3358 16.6642 16 16.25 16H15.5V15.25C15.5 14.8358 15.1642 14.5 14.75 14.5ZM7.75488 15.9951C7.34067 15.9951 7.00488 16.3309 7.00488 16.7451V16.7549C7.00488 17.1691 7.34067 17.5049 7.75488 17.5049C8.1691 17.5049 8.50488 17.1691 8.50488 16.7549V16.7451C8.50488 16.3309 8.1691 15.9951 7.75488 15.9951ZM10.7549 15.9951C10.3407 15.9951 10.0049 16.3309 10.0049 16.7451V16.7549C10.0049 17.1691 10.3407 17.5049 10.7549 17.5049C11.1691 17.5049 11.5049 17.1691 11.5049 16.7549V16.7451C11.5049 16.3309 11.1691 15.9951 10.7549 15.9951ZM9.25 14.5C8.83579 14.5 8.5 14.8358 8.5 15.25C8.5 15.6642 8.83579 16 9.25 16H9.25977C9.67398 16 10.0098 15.6642 10.0098 15.25C10.0098 14.8358 9.67398 14.5 9.25977 14.5H9.25ZM9.5 5C8.25736 5 7.25 6.00736 7.25 7.25V10.25C7.25 11.4926 8.25736 12.5 9.5 12.5H14.5C15.7426 12.5 16.75 11.4926 16.75 10.25V7.25C16.75 6.00736 15.7426 5 14.5 5H9.5Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Badges & XP",
    body: "Finish lessons to earn XP and unlock badges like First Steps and Course Champion on your profile.",
  },
  {
    pad: "03",
    bg: "#F0EBFE",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 4H7C4.79086 4 3 5.79086 3 8V12.9888C3 14.6519 4.34815 16 6.01117 16C6.74366 16 7.45061 16.267 8 16.7503V12C8 10.3431 9.34315 9 11 9H18V8C18 5.79086 16.2091 4 14 4Z"
          fill="#363538"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 10H11C9.89543 10 9 10.8954 9 12V17.1911C9 18.5215 10.0785 19.6 11.4089 19.6C12.004 19.6 12.5781 19.8203 13.0204 20.2184L13.6621 20.7959C14.4227 21.4804 15.5773 21.4804 16.3379 20.7959L16.9796 20.2184C17.4219 19.8203 17.996 19.6 18.5911 19.6C19.9215 19.6 21 18.5215 21 17.1911V12C21 10.8954 20.1046 10 19 10ZM12.75 15.25C12.75 15.6642 12.4142 16 12 16C11.5858 16 11.25 15.6642 11.25 15.25C11.25 14.8358 11.5858 14.5 12 14.5C12.4142 14.5 12.75 14.8358 12.75 15.25ZM15 16C15.4142 16 15.75 15.6642 15.75 15.25C15.75 14.8358 15.4142 14.5 15 14.5C14.5858 14.5 14.25 14.8358 14.25 15.25C14.25 15.6642 14.5858 16 15 16ZM18.75 15.25C18.75 15.6642 18.4142 16 18 16C17.5858 16 17.25 15.6642 17.25 15.25C17.25 14.8358 17.5858 14.5 18 14.5C18.4142 14.5 18.75 14.8358 18.75 15.25Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Friendly community",
    body: "Share posts with fellow learners — text, images or documents — and reply, like or report what others share.",
  },
  {
    pad: "04",
    bg: "#FFEBE8",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.5 9C8.5 8.72386 8.72386 8.5 9 8.5H15C15.2761 8.5 15.5 8.72386 15.5 9V15C15.5 15.2761 15.2761 15.5 15 15.5H9C8.72386 15.5 8.5 15.2761 8.5 15V9Z"
          fill="#363538"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 1.75C8.41421 1.75 8.75 2.08579 8.75 2.5V4H9.75V2.5C9.75 2.08579 10.0858 1.75 10.5 1.75C10.9142 1.75 11.25 2.08579 11.25 2.5V4H12.75V2.5C12.75 2.08579 13.0858 1.75 13.5 1.75C13.9142 1.75 14.25 2.08579 14.25 2.5V4H15.25V2.5C15.25 2.08579 15.5858 1.75 16 1.75C16.4142 1.75 16.75 2.08579 16.75 2.5V4.0702C18.3577 4.37517 19.6248 5.64229 19.9298 7.25H21.5C21.9142 7.25 22.25 7.58579 22.25 8C22.25 8.41421 21.9142 8.75 21.5 8.75H20V9.75H21.5C21.9142 9.75 22.25 10.0858 22.25 10.5C22.25 10.9142 21.9142 11.25 21.5 11.25H20V12.75H21.5C21.9142 12.75 22.25 13.0858 22.25 13.5C22.25 13.9142 21.9142 14.25 21.5 14.25H20V15.25H21.5C21.9142 15.25 22.25 15.5858 22.25 16C22.25 16.4142 21.9142 16.75 21.5 16.75H19.9298C19.6248 18.3577 18.3577 19.6248 16.75 19.9298V21.5C16.75 21.9142 16.4142 22.25 16 22.25C15.5858 22.25 15.25 21.9142 15.25 21.5V20H14.25V21.5C14.25 21.9142 13.9142 22.25 13.5 22.25C13.0858 22.25 12.75 21.9142 12.75 21.5V20H11.25V21.5C11.25 21.9142 10.9142 22.25 10.5 22.25C10.0858 22.25 9.75 21.9142 9.75 21.5V20H8.75V21.5C8.75 21.9142 8.41421 22.25 8 22.25C7.58579 22.25 7.25 21.9142 7.25 21.5V19.9298C5.64229 19.6248 4.37517 18.3577 4.0702 16.75H2.5C2.08579 16.75 1.75 16.4142 1.75 16C1.75 15.5858 2.08579 15.25 2.5 15.25H4V14.25H2.5C2.08579 14.25 1.75 13.9142 1.75 13.5C1.75 13.0858 2.08579 12.75 2.5 12.75H4V11.25H2.5C2.08579 11.25 1.75 10.9142 1.75 10.5C1.75 10.0858 2.08579 9.75 2.5 9.75H4V8.75H2.5C2.08579 8.75 1.75 8.41421 1.75 8C1.75 7.58579 2.08579 7.25 2.5 7.25H4.0702C4.37517 5.64229 5.64229 4.37517 7.25 4.0702V2.5C7.25 2.08579 7.58579 1.75 8 1.75ZM7 9C7 7.89543 7.89543 7 9 7H15C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Real dev skills",
    body: "JavaScript, React, backend development, AI and more — all in one place, taught in bite-sized steps.",
  },
  {
    pad: "05",
    bg: "#E8F0FF",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 12C22 8.26154 22 6.3923 21.1962 5C20.6695 4.08788 19.9121 3.33046 19 2.80385C17.6077 2 15.7385 2 12 2C8.26154 2 6.3923 2 5 2.80385C4.08788 3.33046 3.33046 4.08788 2.80385 5C2 6.3923 2 8.26154 2 12C2 15.7385 2 17.6077 2.80385 19C3.33046 19.9121 4.08788 20.6695 5 21.1962C6.3923 22 8.26154 22 12 22C15.7385 22 17.6077 22 19 21.1962C19.9121 20.6695 20.6695 19.9121 21.1962 19C22 17.6077 22 15.7385 22 12ZM13 8.66406C12.5858 8.66406 12.25 8.99985 12.25 9.41406C12.25 9.82828 12.5858 10.1641 13 10.1641H14.0036L12 12.1676L11.0303 11.198C10.8897 11.0573 10.6989 10.9783 10.5 10.9783C10.3011 10.9783 10.1103 11.0573 9.96967 11.198L6.46967 14.698C6.17678 14.9909 6.17678 15.4657 6.46967 15.7586C6.76256 16.0515 7.23744 16.0515 7.53033 15.7586L10.5 12.789L11.4697 13.7586C11.7626 14.0515 12.2374 14.0515 12.5303 13.7586L15.0784 11.2105V12.2425C15.0784 12.6567 15.4142 12.9925 15.8284 12.9925C16.2426 12.9925 16.5784 12.6567 16.5784 12.2425V9.41406C16.5784 8.99985 16.2426 8.66406 15.8284 8.66406H13Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Track your progress",
    body: "Your profile shows completed lessons per course, so you always know what's next.",
  },
  {
    pad: "06",
    bg: "#FFF7E0",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2978 2.26308L5.29775 4.51309C4.51715 4.80581 4 5.55189 4 6.38558L4 11.9997C4.00002 15.5583 9.00282 19.1169 11.0961 20.4501C11.6561 20.8067 12.3538 20.8233 12.9271 20.4885C15.0339 19.2579 20 15.9392 20 11.9997V6.38559C20 5.5519 19.4829 4.80581 18.7023 4.51308L12.7023 2.26308C12.2495 2.09329 11.7505 2.0933 11.2978 2.26308ZM15.0211 10.5389C15.319 10.2511 15.3272 9.7763 15.0394 9.4784C14.7516 9.1805 14.2768 9.17232 13.9789 9.46012L11.397 11.9545L10.0234 10.6162C9.72673 10.3271 9.25189 10.3333 8.96283 10.63C8.67376 10.9266 8.67993 11.4015 8.9766 11.6905L10.8713 13.5367C11.1617 13.8196 11.6243 13.8206 11.9158 13.5389L15.0211 10.5389Z"
          fill="#363538"
        />
      </svg>
    ),
    title: "Your own account",
    body: "A simple sign-up keeps your progress, badges and posts saved between visits.",
  },
];

const STEPS = [
  {
    num: "STEP 1",
    title: "Make an account",
    body: "Pick a username and jump in — takes ten seconds.",
  },
  {
    num: "STEP 2",
    title: "Pick a course",
    body: "Choose from JavaScript, React, backend dev, AI and more.",
  },
  {
    num: "STEP 3",
    title: "Complete lessons",
    body: "Read, try it yourself, then answer a quick quiz.",
  },
  {
    num: "STEP 4",
    title: "Earn & share",
    body: "Collect badges and share your work with the community.",
  },
];

export default function HomePage() {
  const { courses } = useContent();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    listPosts()
      .then((posts) => setPostCount(posts.length))
      .catch(() => {});
  }, []);

  const goAccountOrProfile = () =>
    navigate(currentUser ? "/profile" : "/account");

  return (
    <div>
      <section className="relative pt-32 pb-16 desktop:pt-24 desktop:pb-20">
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 z-0">
          <div className="hero-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
          <div className="pointer-events-none absolute top-6 left-[20%] w-56 h-56 sm:w-72 sm:h-72 bg-violet/20 rounded-full blur-3xl animate-blobDrift" />
          <div
            className="pointer-events-none absolute top-20 right-[20%] w-56 h-56 sm:w-72 sm:h-72 bg-mint/20 rounded-full blur-3xl animate-blobDrift"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-[44%] w-56 h-56 bg-coral/15 rounded-full blur-3xl animate-blobDrift"
            style={{ animationDelay: "1.5s" }}
          />
          <HeroFloatingLayer />
        </div>

        <div className="relative z-10 max-w-[640px] mx-auto text-center">
          <h1
            className="text-[2rem] sm:text-[2.4rem] desktop:text-[2.9rem] leading-tight font-bold text-indigo-dark animate-fadeUp"
            style={{ animationDelay: ".05s" }}
          >
            Boot up your brain.
            <br />
            Learn tech by doing.
          </h1>
          <p
            className="text-base sm:text-[1.15rem] max-w-[400px] sm:max-w-[500px] desktop:max-w-[600px] mx-auto dark:text-[#C4CCEB] text-indigo-dark my-4 mb-7 animate-fadeUp"
            style={{ animationDelay: ".18s" }}
          >
            Bite-sized courses in JavaScript, React, backend development, AI and
            more — guided by badges, and backed by a friendly community.
          </p>
          <div
            className="flex gap-3.5 flex-wrap justify-center mb-5 animate-fadeUp"
            style={{ animationDelay: ".3s" }}
          >
            <ThemedButton
              className="btn btn-primary"
              onClick={() => navigate("/courses")}
            >
              Start learning
            </ThemedButton>
            <button
              className="btn bg-coral border-coral-dark text-white"
              onClick={goAccountOrProfile}
            >
              Create free account
            </button>
          </div>
          <div
            className="flex gap-5 sm:gap-7 mt-6 flex-wrap justify-center font-mono animate-fadeUp"
            style={{ animationDelay: ".42s" }}
          >
            <div>
              <b className="block text-2xl dark:text-white">{courses.length}</b>
              <span className="text-[.78rem] text-[#8891C4]">
                course modules
              </span>
            </div>
            <div>
              <b className="block text-2xl dark:text-white">
                {courses.reduce((a, c) => a + c.lessons.length, 0)}+
              </b>
              <span className="text-[.78rem] text-[#8891C4]">
                bite-size lessons
              </span>
            </div>
            <div>
              <b className="block text-2xl dark:text-white">{postCount}</b>
              <span className="text-[.78rem] text-[#8891C4]">
                community posts
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-[640px] mx-auto mb-10 text-center">
          <div className="eyebrow mx-auto">
            <Zap size={13} /> what you get
          </div>
          <h2 className="text-[2.1rem]">
            Everything a young technologist needs
          </h2>
          <p className="text-ink-soft dark:text-white/60 text-[1.05rem]">
            Six features, wired together — click through any of them from the
            course or community pages.
          </p>
        </div>
        <div className="relative z-10 sm:grid-cols-3 grid gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.pad}
              className="bg-panel dark:bg-white/5 rounded-2xl px-6 pt-7 pb-6 border-2 border-line dark:border-white/10 relative transition-all hover:-translate-y-1.5 hover:border-mint hover:shadow-card"
            >
              <span className="font-mono text-[.7rem] text-[#9AA6C7] absolute top-3.5 right-4">
                {f.pad}
              </span>
              <div
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="text-[1.15rem] mb-2">{f.title}</h3>
              <p className="text-ink-soft dark:text-white/60 text-[.95rem] m-0">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[640px] mx-auto mb-10 text-center">
          <div className="eyebrow mx-auto">
            <Rocket size={13} /> how it works
          </div>
          <h2 className="text-[2.1rem]">Four steps to your first badge</h2>
        </div>
        <div className="grid sm:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-panel dark:bg-white/5 border-2 border-line dark:border-white/10 rounded-2xl p-5 text-left"
            >
              <span className="font-mono font-bold text-violet text-[.85rem] mb-2.5 block">
                {s.num}
              </span>
              <h4 className="text-[1.02rem] mb-1.5">{s.title}</h4>
              <p className="text-ink-soft dark:text-white/60 text-[.9rem] m-0">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[640px] mx-auto mb-10 text-center">
          <div className="eyebrow mx-auto">
            <BookOpen size={13} /> courses
          </div>
          <h2 className="text-[1.6rem] sm:text-[1.9rem] desktop:text-[2.1rem]">
            Peek at the course library
          </h2>
        </div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => carouselRef.current?.scrollPrev()}
              disabled={edges.atStart}
              aria-label="Previous courses"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-line dark:border-white/15 text-ink-soft dark:text-white/80 hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              onClick={() => carouselRef.current?.scrollNext()}
              disabled={edges.atEnd}
              aria-label="Next courses"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-line dark:border-white/15 text-ink-soft dark:text-white/80 hover:bg-[#EAF1FD] dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/courses")}
          >
            Explore courses →
          </button>
        </div>
        <CourseCarousel
          ref={carouselRef}
          courses={courses}
          onEdgeChange={setEdges}
        />
      </section>

      <div className="bg-indigo-dark rounded-[22px] p-12 flex justify-between items-center gap-6 flex-wrap [background-image:radial-gradient(circle_at_90%_10%,rgba(255,201,60,.18),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(140,122,230,.22),transparent_45%)]">
        <div>
          <h2 className="text-white text-[1.8rem] max-w-[460px]">
            Ready to power on?
          </h2>
          <p className="text-[#C4CCEB] max-w-[420px]">
            Create your free account and start your first lesson today.
          </p>
        </div>
        <button className="btn btn-primary" onClick={goAccountOrProfile}>
          Get started free →
        </button>
      </div>
    </div>
  );
}
