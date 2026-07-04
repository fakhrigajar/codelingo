// Default/seed content for ICT Quest.
// This is the initial data used the very first time the app runs.
// After that, everything the admin edits lives in localStorage
// (see src/context/ContentContext.jsx) and this file is only the
// "factory reset" fallback.

export const DEFAULT_COURSES = [
  {
    id: "computer-basics",
    title: "Computer Basics",
    icon: "🖥️",
    level: "Beginner",
    color: "red",
    blurb: "Meet the machine: parts, keyboard, mouse and files.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "What is a Computer?",
        body: "A computer is a machine that takes in information (input), works with it (processing), and shows you a result (output). The keyboard and mouse send input, the box or chip inside does the processing, and the screen shows the output. Every phone, tablet and laptop works this way!",
        fact: "The first electronic computers filled an entire room and were slower than a modern calculator.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Meet the Keyboard",
        body: "The keyboard is how you type letters, numbers and symbols. The middle row — A, S, D, F, J, K, L — is called the 'home row' because your fingers rest there. The space bar makes gaps between words, and Enter starts a new line.",
        fact: "QWERTY keyboards are named after the first six letters on the top row.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "Mouse Moves",
        body: "A mouse lets you point, click and drag things on the screen. A single click selects something, a double-click opens it, and dragging while holding the button moves it. On a laptop, the trackpad does the same job with your fingers.",
        fact: "The computer mouse got its name because the cord looked like a little tail.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "Files & Folders",
        body: "Files are like digital pieces of paper — a picture, a document, a song. Folders are like boxes that keep files organised. Giving files clear names (like 'homework_maths') makes them easy to find again later.",
        fact: "A folder can hold other folders inside it — these are called subfolders.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Computer Parts",
        questions: [
          {
            q: "Which part shows you the output?",
            options: ["Keyboard", "Screen", "Mouse"],
            correct: 1,
          },
          {
            q: "What is the middle row of keys called?",
            options: ["Home row", "Top row", "Number row"],
            correct: 0,
          },
          {
            q: "What do folders help you do?",
            options: ["Play games", "Organise files", "Connect to internet"],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "typing-ninjas",
    title: "Typing Ninjas",
    icon: "⌨️",
    level: "Beginner",
    color: "#FF6B5B",
    blurb: "Home row drills, finger placement and speed games.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "Home Row Heroes",
        body: "Rest your left fingers on A S D F and your right fingers on J K L ;. Feel the small bumps on F and J — those help you find home row without looking down!",
        fact: "Touch typists can type over 300 letters a minute without looking at the keys.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Finger Friends",
        body: "Each finger is responsible for certain keys nearby. Your thumbs always hit the space bar. Practising the right finger for each key helps you type faster and make fewer mistakes.",
        fact: "Your pinky fingers do the least typing work of all your fingers.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "Words on the Screen",
        body: "Start by typing short, simple words slowly and correctly. Speed comes naturally once accuracy feels comfortable — rushing early just creates habits you'll have to fix later.",
        fact: "Typing tests measure both speed (WPM) and accuracy together.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "Speed Challenge",
        body: "Try typing a full sentence three times, aiming to beat your own time each round. Small daily practice beats one long session — five minutes a day adds up fast.",
        fact: "WPM stands for 'words per minute', the standard way typing speed is measured.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Typing Basics",
        questions: [
          {
            q: "Which keys have bumps to help you find home row?",
            options: ["A and L", "F and J", "Space and Enter"],
            correct: 1,
          },
          {
            q: "What does WPM measure?",
            options: ["Words per minute", "Watts per motor", "Web page memory"],
            correct: 0,
          },
          {
            q: "What should you focus on before speed?",
            options: ["Loud typing", "Accuracy", "Long sessions"],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "code-sparks",
    title: "Code Sparks",
    icon: "🧩",
    level: "Intermediate",
    color: "#3DDC97",
    blurb: "Sequences, loops and debugging with block-style thinking.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "What is Code?",
        body: "Code is a list of instructions a computer follows, step by step, in order. If you tell a friend 'stand up, turn around, sit down', that's just like a tiny program — a sequence of clear steps.",
        fact: "The word 'bug' for a coding mistake comes from a real moth found stuck in an old computer in 1947.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Give Directions (Sequencing)",
        body: "Sequencing means putting steps in the right order. If you tell a robot to 'jump' before 'stand up', it might fall over! Computers do exactly what you say, in exactly the order you say it.",
        fact: "Even a simple task like making toast has a precise sequence a robot would need spelled out.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "Loop the Loop",
        body: "A loop repeats a set of steps so you don't have to write them again and again. Instead of writing 'clap' ten times, you can say 'repeat clap 10 times' — that's a loop!",
        fact: "Loops are one of the most powerful ideas in programming — they save huge amounts of code.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "Debug the Bug",
        body: "Debugging means finding and fixing mistakes in your instructions. Good coders don't panic when something breaks — they check each step calmly until they spot what went wrong.",
        fact: "Professional programmers spend a large part of their time debugging, not just writing new code.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Code Concepts",
        questions: [
          {
            q: "What is a loop used for?",
            options: [
              "Deleting files",
              "Repeating steps",
              "Turning off the computer",
            ],
            correct: 1,
          },
          {
            q: "What does 'sequencing' mean?",
            options: [
              "Random order",
              "Correct step order",
              "Only using one step",
            ],
            correct: 1,
          },
          {
            q: "What is 'debugging'?",
            options: [
              "Adding bugs",
              "Finding and fixing mistakes",
              "Making code longer",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "internet-explorers",
    title: "Internet Explorers",
    icon: "🌐",
    level: "Beginner",
    color: "#8C7AE6",
    blurb: "What the internet is, and how to stay safe on it.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "What is the Internet?",
        body: "The internet is a giant network that connects computers all over the world so they can share information. Websites, videos, games and messages all travel across this network.",
        fact: "No single company or country owns the whole internet — it's made of millions of connected networks.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Safe Searching",
        body: "Good searches use a few clear words, like 'planet Mars facts kids' instead of a whole sentence. Always check with a trusted adult before clicking links you don't recognise.",
        fact: "Search engines look through billions of web pages in less than a second.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "Strong Passwords",
        body: "A strong password mixes letters, numbers and symbols, and isn't something easy to guess like 'password123'. Never share your password with anyone except a trusted parent or guardian.",
        fact: "A long, random password can take a computer thousands of years to guess.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "Stranger Danger Online",
        body: "Not everyone online is who they say they are. Never share your full name, address, school or photos with people you've only met online, and always tell a trusted adult if something feels wrong.",
        fact: "Many trusted websites let you report or block anyone who makes you feel unsafe.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Stay Safe",
        questions: [
          {
            q: "What makes a password strong?",
            options: [
              "Your pet's name",
              "Mixing letters, numbers, symbols",
              "Using '1234'",
            ],
            correct: 1,
          },
          {
            q: "If a stranger online asks where you live, you should...",
            options: [
              "Tell them",
              "Ignore and tell a trusted adult",
              "Send a photo",
            ],
            correct: 1,
          },
          {
            q: "What is the internet?",
            options: [
              "One giant computer",
              "A network connecting computers",
              "A type of keyboard",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "pixel-art-studio",
    title: "Pixel Art Studio",
    icon: "🎨",
    level: "Beginner",
    color: "#FFC93C",
    blurb: "Digital canvases, colour theory and your first pixel art.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "Meet the Canvas",
        body: "A digital canvas is made of tiny squares called pixels. Zoom in on any photo and you'll see them! Digital art tools let you paint, erase and undo — perfect for experimenting without wasting paper.",
        fact: "'Pixel' comes from 'picture element' — the smallest building block of a digital image.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Color Magic",
        body: "Mixing red, green and blue light (RGB) can create almost any colour on a screen. Warm colours like red and orange feel energetic, while cool colours like blue and green feel calm.",
        fact: "Screens can display millions of different colours by mixing just red, green and blue light.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "Shapes & Pixels",
        body: "Simple shapes — squares, circles, triangles — combine to build bigger pictures. In pixel art, artists place one colored square at a time to build up a character or scene.",
        fact: "Classic video game characters were often designed using only a handful of pixel colours.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "My First Pixel Art",
        body: "Try planning a tiny 8x8 grid character on paper first — a heart, a star or a smiley face. Planning your picture before you draw makes the final result much neater.",
        fact: "Many professional game artists still start every character with a rough pixel sketch.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Digital Art",
        questions: [
          {
            q: "What does 'pixel' mean?",
            options: ["Picture element", "Paint tool", "Print error"],
            correct: 0,
          },
          {
            q: "Which three colours of light make screen colours?",
            options: [
              "Red, green, blue",
              "Red, yellow, blue",
              "Black, white, grey",
            ],
            correct: 0,
          },
          {
            q: "What should you do before drawing pixel art?",
            options: ["Plan the picture", "Skip planning", "Only use black"],
            correct: 0,
          },
        ],
      },
    ],
  },
  {
    id: "robo-builders",
    title: "Robo Builders",
    icon: "🤖",
    level: "Advanced",
    color: "#FF6B5B",
    blurb: "Sensors, logic and mission-based robot thinking.",
    lessons: [
      {
        id: "l1",
        type: "lesson",
        title: "What is a Robot?",
        body: "A robot is a machine that can sense its surroundings, make decisions, and take action — often without a person controlling every move. Robots can be as small as a toy or as big as a factory arm.",
        fact: "Some robots explore places too dangerous for humans, like volcanoes and deep ocean trenches.",
      },
      {
        id: "l2",
        type: "lesson",
        title: "Sensors & Senses",
        body: "Sensors are how robots 'see' and 'feel' the world — a light sensor detects brightness, a distance sensor detects nearby objects, like a robot's eyes and fingertips combined.",
        fact: "Some robot vacuum cleaners use over a dozen sensors just to avoid bumping into furniture.",
      },
      {
        id: "l3",
        type: "lesson",
        title: "If This Then That",
        body: "Robots often follow simple rules: 'if the sensor detects a wall, then turn left.' Chaining these if-then rules together lets a robot handle many different situations.",
        fact: "This 'if-then' idea is one of the most basic building blocks of all computer logic.",
      },
      {
        id: "l4",
        type: "lesson",
        title: "Build a Mission",
        body: "A robot mission breaks a big goal (like 'clean the room') into smaller steps a robot can actually follow, using sequences, loops and if-then rules together.",
        fact: "Robotics competitions for kids often ask teams to program a robot to complete a maze mission.",
      },
      {
        id: "q1",
        type: "quiz",
        title: "Quiz: Robot Logic",
        questions: [
          {
            q: "What do sensors let a robot do?",
            options: [
              "Sense its surroundings",
              "Charge faster",
              "Change colour",
            ],
            correct: 0,
          },
          {
            q: "What kind of rule is 'if wall, then turn'?",
            options: ["A loop", "An if-then rule", "A password"],
            correct: 1,
          },
          {
            q: "What is a robot mission?",
            options: [
              "A single random move",
              "A big goal broken into steps",
              "A type of sensor",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
];

export const DEFAULT_BADGES = [
  {
    id: "first-steps",
    icon: "🌱",
    name: "First Steps",
    desc: "Complete your first lesson",
  },
  {
    id: "course-champion",
    icon: "🏆",
    name: "Course Champion",
    desc: "Finish an entire course",
  },
  {
    id: "quiz-whiz",
    icon: "🧠",
    name: "Quiz Whiz",
    desc: "Pass your first quiz",
  },
  {
    id: "chatterbox",
    icon: "💬",
    name: "Chatterbox",
    desc: "Send your first community message",
  },
  {
    id: "triple-threat",
    icon: "⚡",
    name: "Triple Threat",
    desc: "Make progress in 3 different courses",
  },
];

export const DEFAULT_GRADES = [
  {
    id: "g1",
    label: "Grade 1",
    age: "6–7",
    topics: [
      {
        title: "Meet the Computer",
        desc: "What a computer actually does with the things you type and click.",
        source: { courseId: "computer-basics", lessonId: "l1" },
      },
      {
        title: "Mouse Moves",
        desc: "Point, click, double-click and drag — the four moves you'll use forever.",
        source: { courseId: "computer-basics", lessonId: "l3" },
      },
      {
        title: "Meet the Canvas",
        desc: "Digital pictures are built from tiny squares called pixels.",
        source: { courseId: "pixel-art-studio", lessonId: "l1" },
      },
      {
        title: "Color Magic",
        desc: "How screens mix red, green and blue light into every colour you see.",
        source: { courseId: "pixel-art-studio", lessonId: "l2" },
      },
    ],
  },
  {
    id: "g2",
    label: "Grade 2",
    age: "7–8",
    topics: [
      {
        title: "Meet the Keyboard",
        desc: "Home row, space bar and Enter — getting comfortable with the keys.",
        source: { courseId: "computer-basics", lessonId: "l2" },
      },
      {
        title: "Files & Folders",
        desc: "Keeping digital work organised, the same way you'd tidy a desk.",
        source: { courseId: "computer-basics", lessonId: "l4" },
      },
      {
        title: "Home Row Heroes",
        desc: "Finding A S D F and J K L ; without looking down.",
        source: { courseId: "typing-ninjas", lessonId: "l1" },
      },
      {
        title: "What is the Internet?",
        desc: "How millions of computers around the world talk to each other.",
        source: { courseId: "internet-explorers", lessonId: "l1" },
      },
    ],
  },
  {
    id: "g3",
    label: "Grade 3",
    age: "8–9",
    topics: [
      {
        title: "Finger Friends",
        desc: "Which finger types which key, and why it speeds you up.",
        source: { courseId: "typing-ninjas", lessonId: "l2" },
      },
      {
        title: "Words on the Screen",
        desc: "Typing full words calmly and correctly before chasing speed.",
        source: { courseId: "typing-ninjas", lessonId: "l3" },
      },
      {
        title: "Safe Searching",
        desc: "Picking good search words and checking with an adult before clicking.",
        source: { courseId: "internet-explorers", lessonId: "l2" },
      },
      {
        title: "Shapes & Pixels",
        desc: "Building bigger pictures out of small, simple shapes.",
        source: { courseId: "pixel-art-studio", lessonId: "l3" },
      },
    ],
  },
  {
    id: "g4",
    label: "Grade 4",
    age: "9–10",
    topics: [
      {
        title: "What is Code?",
        desc: "Code as a list of clear steps a computer follows in order.",
        source: { courseId: "code-sparks", lessonId: "l1" },
      },
      {
        title: "Give Directions",
        desc: "Why the order of your instructions changes what happens.",
        source: { courseId: "code-sparks", lessonId: "l2" },
      },
      {
        title: "Strong Passwords",
        desc: "What makes a password hard to guess, and why to keep it private.",
        source: { courseId: "internet-explorers", lessonId: "l3" },
      },
      {
        title: "My First Pixel Art",
        desc: "Planning a picture on a grid before you place a single pixel.",
        source: { courseId: "pixel-art-studio", lessonId: "l4" },
      },
    ],
  },
  {
    id: "g5",
    label: "Grade 5",
    age: "10–11",
    topics: [
      {
        title: "Loop the Loop",
        desc: "Repeating steps without writing them out again and again.",
        source: { courseId: "code-sparks", lessonId: "l3" },
      },
      {
        title: "Debug the Bug",
        desc: "Calmly finding and fixing a mistake in your instructions.",
        source: { courseId: "code-sparks", lessonId: "l4" },
      },
      {
        title: "Stranger Danger Online",
        desc: "What to keep private, and when to tell a trusted adult.",
        source: { courseId: "internet-explorers", lessonId: "l4" },
      },
      {
        title: "What is a Robot?",
        desc: "Machines that sense, decide and act — sometimes on their own.",
        source: { courseId: "robo-builders", lessonId: "l1" },
      },
    ],
  },
  {
    id: "g6",
    label: "Grade 6",
    age: "11–12",
    topics: [
      {
        title: "Sensors & Senses",
        desc: 'How a robot "sees" and "feels" the world around it.',
        source: { courseId: "robo-builders", lessonId: "l2" },
      },
      {
        title: "If This Then That",
        desc: "Simple rules that let a robot react to what it senses.",
        source: { courseId: "robo-builders", lessonId: "l3" },
      },
      {
        title: "Build a Mission",
        desc: "Combining sequences, loops and rules into one real goal.",
        source: { courseId: "robo-builders", lessonId: "l4" },
      },
      {
        title: "Speed Challenge",
        desc: "Putting every typing skill together and racing your own best time.",
        source: { courseId: "typing-ninjas", lessonId: "l4" },
      },
    ],
  },
];

export const DEFAULT_ROOMS = [
  { id: "general", name: "General Chat", sub: "Say hello to everyone" },
  {
    id: "homework-help",
    name: "Homework Help",
    sub: "Stuck on a lesson? Ask here",
  },
  { id: "show-and-tell", name: "Show & Tell", sub: "Share what you made" },
];

export const DEFAULT_PAGE_TEXT = {
  gradesTitle: "Grade roadmaps",
  gradesSubtitle:
    "Pick a grade to see its learning path. Tap any stop to read about it and jump to its source lesson.",
};

// Admin password for the demo admin route.
// Change this before deploying anywhere real.
export const ADMIN_PASSWORD = "ictquest-admin";
