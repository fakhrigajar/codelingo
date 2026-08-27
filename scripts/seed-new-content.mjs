const API = process.env.SEED_API_BASE || "http://localhost:3001";

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function q(question, options, correct) {
  return { q: question, options, correct };
}

function lesson(title, subUnit, unitTitle, paragraphs, fact, quiz, minutes) {
  const blocks = [
    ...paragraphs.map((p) => ({ id: uid("block"), type: "body", value: p })),
    ...(fact ? [{ id: uid("block"), type: "fact", value: fact }] : []),
  ];
  return {
    id: uid("l"),
    type: "lesson",
    title,
    unit: 1,
    unitTitle,
    subUnit,
    blocks,
    points: 10,
    estimatedMinutes: minutes ?? 8,
    practiceQuiz: quiz,
  };
}

function mkLessons(unitTitle, defs) {
  return defs.map((d, i) =>
    lesson(
      d.title,
      `1.${i + 1}`,
      unitTitle,
      d.paragraphs,
      d.fact,
      d.quiz,
      d.minutes,
    ),
  );
}

function course({ title, level, color, about, order, lessons, unitTitle }) {
  return {
    id: uid("course"),
    title,
    icon: "",
    level,
    color,
    about,
    availability: "available",
    order,
    units: [{ number: 1, title: unitTitle }],
    lessons,
  };
}

// ---------------------------------------------------------------------------
// Existing course ids (already in the DB) — used to build paths below.
const EXISTING = {
  ESSENTIAL: "course-mrs03936-l0rqe",
  VSCODE: "course-mrs158yh-3jrdo",
  GIT: "course-mrs4oham-ermyq",
  CSS: "course-mrjpk0vs-8qe4l",
  HTML: "course-mrjn11jq-9p0xj",
  WORD: "course-mrjr8o64-9ykng",
  JS: "course-mrjpo8fa-860ru",
  PYTHON: "course-mrlo0anz-dkmrr",
};

// ---------------------------------------------------------------------------
// 20 new courses.
const COURSES = [];

COURSES.push(
  course({
    title: "TypeScript",
    level: "Intermediate",
    color: "#3178C6",
    order: 5,
    about:
      "TypeScript adds a static type system on top of JavaScript, catching whole categories of bugs before your code ever runs and making large codebases much easier to navigate. This course covers why TypeScript exists, its basic types, and how to describe object shapes with interfaces.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Why TypeScript?",
        minutes: 7,
        paragraphs: [
          "JavaScript is dynamically typed — a variable can hold a string one moment and a number the next, and the language won't stop you. That flexibility is great for quick scripts, but on a large codebase it means typos and mismatched data often aren't caught until the code actually runs, sometimes in production.",
          "TypeScript is a superset of JavaScript that adds optional type annotations. You write TypeScript in .ts files, and the TypeScript compiler (tsc) checks your types and then compiles everything down to plain JavaScript that runs anywhere JavaScript already runs — browsers, Node.js, wherever.",
        ],
        fact: "TypeScript was created at Microsoft by Anders Hejlsberg, who also designed C# and Turbo Pascal, and it first shipped publicly in 2012.",
        quiz: [
          q(
            "What does the TypeScript compiler ultimately produce?",
            [
              "A standalone .exe file",
              "Plain JavaScript",
              "Bytecode for a TypeScript VM",
              "WebAssembly",
            ],
            1,
          ),
          q(
            "Why is JavaScript's dynamic typing risky on large codebases?",
            [
              "It makes code run slower",
              "Type-related mistakes may not be caught until runtime",
              "It prevents using functions",
              "It disables debugging tools",
            ],
            1,
          ),
          q(
            "TypeScript is best described as a:",
            [
              "Replacement for JavaScript",
              "Superset of JavaScript with optional types",
              "Database query language",
              "CSS preprocessor",
            ],
            1,
          ),
        ],
      },
      {
        title: "Basic Types & Type Inference",
        minutes: 9,
        paragraphs: [
          'TypeScript lets you annotate a variable\'s type directly: `let age: number = 30;` or `let name: string = "Ada";`. Arrays get a type too, like `number[]` for an array of numbers. If a value could be one of several types, you can express that with a union, like `string | number`.',
          "You don't have to annotate everything by hand — TypeScript is good at inferring types from how a variable is initialized. If you write `let age = 30`, TypeScript already knows `age` is a `number` and will flag it if you later try to assign a string to it. Annotations matter most for function parameters and empty variables, where there's nothing to infer from.",
        ],
        fact: "TypeScript's `any` type turns off type checking for that value entirely — it's occasionally useful for gradually migrating JavaScript code, but overusing it defeats the purpose of using TypeScript at all.",
        quiz: [
          q(
            "In `let age = 30;`, how does TypeScript know `age` is a number?",
            [
              "You must always annotate it manually",
              "It infers the type from the initial value",
              "All variables default to number",
              "It asks the compiler at runtime",
            ],
            1,
          ),
          q(
            "Which type annotation describes a value that could be either a string or a number?",
            [
              "string & number",
              "string[number]",
              "string | number",
              "string+number",
            ],
            2,
          ),
          q(
            "What's a downside of overusing the `any` type?",
            [
              "It makes code run slower",
              "It disables type checking for that value",
              "It's not valid TypeScript syntax",
              "It only works with arrays",
            ],
            1,
          ),
        ],
      },
      {
        title: "Interfaces and Type Aliases",
        minutes: 9,
        paragraphs: [
          "An `interface` describes the shape an object must have. For example, `interface User { name: string; age: number; }` means any value typed as `User` must have a `name` string and an `age` number. If a function expects a `User`, TypeScript will complain if you pass an object missing one of those fields.",
          'You can mark a property optional with a `?`, like `email?: string`, meaning it may or may not be present. `type` aliases work similarly and can also name unions, like `type Status = "idle" | "loading" | "done"` — useful for restricting a value to a fixed set of allowed strings instead of any string at all.',
        ],
        fact: "Interfaces in TypeScript are purely a compile-time concept — they add zero bytes to the compiled JavaScript output, since there's nothing left to check once your code has already been type-checked.",
        quiz: [
          q(
            "What does `interface User { name: string; age: number; }` require of a `User` object?",
            [
              "Only a name property",
              "A name string and an age number",
              "Any two properties",
              "Nothing, it's just documentation",
            ],
            1,
          ),
          q(
            "What does a `?` after a property name mean, like `email?: string`?",
            [
              "The property is required",
              "The property is optional",
              "The property is read-only",
              "The property must be a string or number",
            ],
            1,
          ),
          q(
            "Why don't interfaces add anything to the compiled JavaScript output?",
            [
              "They're compiled into comments",
              "They're a compile-time-only type check",
              "They get converted into classes",
              "They're stored in a separate file",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "SQL & Databases",
    level: "Beginner",
    color: "#00758F",
    order: 6,
    about:
      "SQL is the language you use to store, query, and manage structured data in a relational database — the backbone of almost every app's backend. This course covers how relational tables are organized and how to write SELECT queries to filter, sort, and summarize data.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Tables, Rows and Columns",
        minutes: 7,
        paragraphs: [
          "A relational database organizes data into tables, similar to a spreadsheet. Each table has a fixed set of columns describing what kind of data it holds — a `users` table might have `id`, `name`, and `email` columns — and each row is one individual record, like one specific user.",
          "Every table usually has a primary key: a column (often called `id`) whose value uniquely identifies each row, guaranteed never to repeat. Primary keys are what let one table reference a row in another table — for example, an `orders` table might have a `user_id` column pointing back to the `users` table, linking an order to the person who placed it.",
        ],
        fact: "The relational model — organizing data into tables with rows and columns — was first described by IBM researcher Edgar F. Codd in a 1970 paper, decades before most of today's databases existed.",
        quiz: [
          q(
            "In a database table, what does one row typically represent?",
            [
              "One column of data",
              "One entire table",
              "One individual record",
              "One database",
            ],
            2,
          ),
          q(
            "What is a primary key used for?",
            [
              "Formatting the table's text",
              "Uniquely identifying each row",
              "Encrypting the data",
              "Deleting old rows automatically",
            ],
            1,
          ),
          q(
            "How does an `orders` table typically link to the `users` table?",
            [
              "By having identical table names",
              "Through a user_id column referencing a user's primary key",
              "Tables can't reference each other",
              "By storing users inside the orders table",
            ],
            1,
          ),
        ],
      },
      {
        title: "The SELECT Statement",
        minutes: 8,
        paragraphs: [
          "The `SELECT` statement is how you read data out of a table. `SELECT name, email FROM users;` returns just the `name` and `email` columns for every row in the `users` table. Using `SELECT * FROM users;` returns every column instead — handy while exploring, but usually best avoided in real code since it pulls more data than you need.",
          "To narrow results down, add a `WHERE` clause: `SELECT * FROM users WHERE age >= 18;` only returns rows where that condition is true. You can combine conditions with `AND` and `OR`, like `WHERE age >= 18 AND country = 'US'`, and use `=`, `!=`, `>`, `<` to compare values.",
        ],
        fact: "SQL keywords like SELECT and WHERE are traditionally written in uppercase by convention, but SQL itself is case-insensitive for keywords — it's purely a readability habit, not a rule the database enforces.",
        quiz: [
          q(
            "What does `SELECT * FROM users;` return?",
            [
              "Nothing, it's invalid",
              "Every column for every row in users",
              "Only the first row",
              "Only the id column",
            ],
            1,
          ),
          q(
            "Which clause filters which rows are returned?",
            ["FROM", "SELECT", "WHERE", "ORDER"],
            2,
          ),
          q(
            "How do you combine two conditions that must both be true in a WHERE clause?",
            [
              "Separate them with a comma",
              "Use the AND keyword",
              "Use two WHERE clauses",
              "Use a semicolon between them",
            ],
            1,
          ),
        ],
      },
      {
        title: "Sorting, Limiting and Aggregating",
        minutes: 8,
        paragraphs: [
          "`ORDER BY` sorts your results: `SELECT * FROM users ORDER BY age DESC;` returns rows sorted oldest-first (`DESC` for descending; leave it off, or use `ASC`, for ascending). `LIMIT` caps how many rows come back, useful for things like showing only the 10 most recent posts.",
          "Aggregate functions summarize many rows into one number: `COUNT(*)` counts rows, `SUM(price)` adds up a column, `AVG(rating)` averages it. Paired with `GROUP BY`, you can summarize per category — `SELECT country, COUNT(*) FROM users GROUP BY country;` returns one row per country with how many users are in it.",
        ],
        fact: "GROUP BY has to come after WHERE but before ORDER BY in a query — SQL clauses have a fixed order (SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT) that the database expects even though it doesn't execute them in that exact sequence internally.",
        quiz: [
          q(
            "What does `ORDER BY age DESC` do?",
            [
              "Filters out young users",
              "Sorts results oldest-first",
              "Deletes the age column",
              "Groups users by age",
            ],
            1,
          ),
          q(
            "Which function would you use to count how many rows matched a query?",
            ["SUM(*)", "AVG(*)", "COUNT(*)", "LIMIT(*)"],
            2,
          ),
          q(
            "What does GROUP BY let you do?",
            [
              "Sort rows alphabetically",
              "Summarize rows per category, like one row per country",
              "Delete duplicate rows permanently",
              "Rename a column",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Java",
    level: "Intermediate",
    color: "#E76F00",
    order: 7,
    about:
      "Java is a statically-typed, object-oriented language that powers everything from Android apps to enterprise backends, prized for running the same compiled code on any machine with a JVM installed. This course covers the Java platform, core syntax, and the basics of writing your own classes.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "The Java Platform & Your First Program",
        minutes: 8,
        paragraphs: [
          "Java code isn't compiled straight to machine code for one specific computer. Instead, the Java compiler turns your `.java` files into bytecode, which the Java Virtual Machine (JVM) then runs. Because every major OS has its own JVM, the exact same compiled bytecode runs unchanged on Windows, macOS, or Linux — the idea behind Java's old slogan, \"write once, run anywhere.\"",
          'Every Java program needs a class containing a `main` method as its entry point: `public class Hello { public static void main(String[] args) { System.out.println("Hello"); } }`. `public static void main(String[] args)` is boilerplate the JVM looks for specifically to know where to start running your program.',
        ],
        fact: 'Java was originally developed at Sun Microsystems in the mid-1990s under the project name "Oak", named after an oak tree outside the lead developer\'s office, before being renamed Java before its public release.',
        quiz: [
          q(
            "What does the Java compiler turn your source code into?",
            [
              "Machine code for one specific OS",
              "Bytecode run by the JVM",
              "Plain text",
              "A .exe file directly",
            ],
            1,
          ),
          q(
            "What lets the same compiled Java program run on Windows, macOS, and Linux unchanged?",
            [
              "Java code is never actually compiled",
              "Each OS has its own JVM that runs the same bytecode",
              "Java automatically rewrites itself per OS",
              "It doesn't — you must recompile per OS",
            ],
            1,
          ),
          q(
            "What is `main` in a Java program?",
            [
              "A comment",
              "The program's entry point",
              "A built-in variable",
              "An optional class name",
            ],
            1,
          ),
        ],
      },
      {
        title: "Variables, Types and Control Flow",
        minutes: 8,
        paragraphs: [
          "Java is statically typed, meaning you declare a variable's type up front and it can never change: `int age = 30;`, `double price = 9.99;`, `boolean isActive = true;`. Trying to later assign a String to that `age` variable is a compile error, not something that only shows up when the code runs.",
          "Control flow works much like other C-family languages: `if (age >= 18) { ... } else { ... }` for branching, and `for (int i = 0; i < 10; i++) { ... }` or `while (condition) { ... }` for loops. Curly braces `{}` mark the start and end of each block.",
        ],
        fact: "Unlike JavaScript's single Number type, Java has several distinct numeric types (int, long, float, double) with different sizes and precision, so choosing the right one actually matters for memory use and accuracy.",
        quiz: [
          q(
            "In Java, once you declare `int age = 30;`, what happens if you later try to assign a String to age?",
            [
              "It works fine, Java converts it",
              "It's a compile-time type error",
              "It silently becomes 0",
              "It only fails when the program runs",
            ],
            1,
          ),
          q(
            "Which keyword starts a loop that repeats while a condition stays true?",
            ["for", "while", "if", "switch"],
            1,
          ),
          q(
            "What do curly braces {} mark in Java control flow?",
            [
              "Comments",
              "The start and end of a block of code",
              "Optional decoration with no effect",
              "String boundaries",
            ],
            1,
          ),
        ],
      },
      {
        title: "Classes, Objects and Methods",
        minutes: 9,
        paragraphs: [
          "Java is object-oriented: you model real-world things as classes, which are blueprints, and objects, which are specific instances built from that blueprint. A `Car` class might define fields like `color` and `speed`, plus methods like `accelerate()` that act on those fields. `Car myCar = new Car();` creates one actual object from the `Car` blueprint.",
          "A constructor is a special method, matching the class name, that runs automatically when you create an object with `new` — it's typically used to set up a new object's starting values. Methods marked `public` can be called from outside the class; `private` fields and methods are only usable from inside the class itself.",
        ],
        fact: 'The relationship between a class and its objects is often summed up as "a class is a blueprint, an object is the house built from it" — you can build many different houses (objects) from the same blueprint (class).',
        quiz: [
          q(
            "What's the relationship between a class and an object?",
            [
              "They're the same thing",
              "A class is a blueprint; an object is an instance built from it",
              "An object contains many classes",
              "A class can only ever have one object",
            ],
            1,
          ),
          q(
            "What does a constructor do?",
            [
              "Deletes an object",
              "Runs automatically to set up a new object's starting state",
              "Compiles the class",
              "Only works on private fields",
            ],
            1,
          ),
          q(
            "What's the difference between a public and a private field?",
            [
              "No difference in Java",
              "Public fields can be accessed from outside the class; private ones can't",
              "Private fields are always numbers",
              "Public fields are always constants",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "C++",
    level: "Intermediate",
    color: "#00599C",
    order: 8,
    about:
      "C++ gives you fine-grained control over memory and performance, and still powers game engines, operating systems, and other performance-critical software today. This course covers compiling a C++ program, pointers and memory, and the basics of writing your own classes.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Compiling Your First C++ Program",
        minutes: 7,
        paragraphs: [
          "Unlike JavaScript, C++ is a compiled language — a compiler like g++ or clang translates your `.cpp` source file directly into machine code for a specific platform before it can run. That extra compile step is why C++ programs tend to run very fast: there's no interpreter or virtual machine translating instructions on the fly.",
          '`#include <iostream>` pulls in the standard library code needed for console input/output, and every program needs a `main()` function as its entry point, just like Java. A minimal C++ program looks like: `#include <iostream>` then `int main() { std::cout << "Hello"; return 0; }`.',
        ],
        fact: 'C++ was created by Bjarne Stroustrup starting in 1979 as an extension of the C language originally called "C with Classes", adding object-oriented features on top of C\'s low-level control.',
        quiz: [
          q(
            "Why does C++ need a separate compile step before running?",
            [
              "It's an interpreted language like Python",
              "It's translated directly into machine code for speed, unlike interpreted languages",
              "It only runs inside a browser",
              "It doesn't — it runs instantly like JavaScript",
            ],
            1,
          ),
          q(
            "What does `#include <iostream>` do?",
            [
              "Starts the main function",
              "Pulls in the standard library for console input/output",
              "Deletes unused variables",
              "Compiles the program",
            ],
            1,
          ),
          q(
            "What does every C++ program need as its entry point?",
            [
              "A class named Main",
              "A function called main()",
              "An #include statement only",
              "A return statement at the top",
            ],
            1,
          ),
        ],
      },
      {
        title: "Variables, Pointers and Memory",
        minutes: 9,
        paragraphs: [
          "Normal variables in C++ live on the stack, a region of memory that's automatically managed — space is freed the moment the variable goes out of scope. A pointer is a variable that instead stores a memory address: `int x = 5; int* p = &x;` makes `p` point to `x`'s address, and `*p` gives you back the value stored there.",
          "This matters because C++ also lets you allocate memory on the heap with `new`, which stays around until you explicitly `delete` it — unlike the stack, nothing frees it automatically. Forgetting to `delete` heap memory you're done with is called a memory leak, one of the classic bugs C++ programmers have to watch for.",
        ],
        fact: 'Modern C++ (C++11 and later) added "smart pointers" like `std::unique_ptr`, which automatically delete their memory when they go out of scope — largely solving the manual new/delete memory-leak problem for code that uses them.',
        quiz: [
          q(
            "What does a pointer variable store?",
            [
              "A copy of another variable's value",
              "A memory address",
              "A function name",
              "A file path",
            ],
            1,
          ),
          q(
            "What's the key difference between stack and heap memory in C++?",
            [
              "There is no difference",
              "Stack memory is freed automatically; heap memory must be freed manually with delete",
              "Heap memory is always faster",
              "Stack memory can only hold numbers",
            ],
            1,
          ),
          q(
            "What is a memory leak?",
            [
              "A syntax error",
              "Heap memory that was allocated with new but never delete-d",
              "A pointer pointing to zero",
              "A variable declared twice",
            ],
            1,
          ),
        ],
      },
      {
        title: "Classes and Object-Oriented C++",
        minutes: 9,
        paragraphs: [
          "Like Java, C++ supports classes: `class Car { public: void accelerate(); private: int speed; };` bundles data (`speed`) and behavior (`accelerate()`) together. `public` members are accessible from outside the class, while `private` members — the default if you don't specify — can only be used from inside the class's own methods.",
          "A constructor, named the same as the class, runs automatically when you create an object: `Car() { speed = 0; }`. A destructor, written `~Car()`, runs automatically when the object is destroyed — commonly used to clean up any heap memory the object allocated, tying back to the manual memory management from the previous lesson.",
        ],
        fact: "C++ class members default to private if you don't specify an access level, while the closely related `struct` keyword defaults to public — the two are otherwise nearly identical under the hood.",
        quiz: [
          q(
            "What does the `public:` label control?",
            [
              "Which members can be accessed from outside the class",
              "How much memory the class uses",
              "Whether the class compiles",
              "The order methods run in",
            ],
            0,
          ),
          q(
            "When does a class's constructor run?",
            [
              "Only when explicitly called by name",
              "Automatically when an object of that class is created",
              "Only at program startup",
              "Never in C++",
            ],
            1,
          ),
          q(
            "What is a destructor commonly used for?",
            [
              "Creating new objects",
              "Cleaning up resources, like heap memory, when an object is destroyed",
              "Renaming a class",
              "Compiling faster",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "PHP",
    level: "Beginner",
    color: "#777BB4",
    order: 9,
    about:
      "PHP is a server-side scripting language that still powers a huge share of the web, including WordPress. This course covers embedding PHP in a web page, working with variables and arrays, and reading data submitted from an HTML form.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "PHP in a Web Page",
        minutes: 6,
        paragraphs: [
          "PHP code runs on the server, not in the visitor's browser. A `.php` file can mix regular HTML with PHP code wrapped in `<?php ... ?>` tags — the server executes whatever's inside those tags and sends the resulting plain HTML to the browser, which never sees the PHP itself.",
          '`echo` is how you output text from PHP: `<?php echo "Hello, " . $name; ?>` prints "Hello, " followed by whatever\'s stored in the `$name` variable (the `.` joins, or "concatenates", the two pieces of text together). Every PHP variable name starts with a `$` sign.',
        ],
        fact: 'PHP originally stood for "Personal Home Page" when Rasmus Lerdorf created it in 1994 as a small set of tools for his own website — it was later reinterpreted as the recursive acronym "PHP: Hypertext Preprocessor".',
        quiz: [
          q(
            "Where does PHP code actually execute?",
            [
              "In the visitor's browser",
              "On the server, before the page is sent to the browser",
              "Inside a database",
              "It doesn't execute, it's just markup",
            ],
            1,
          ),
          q(
            "What symbol does every PHP variable name start with?",
            ["#", "@", "$", "%"],
            2,
          ),
          q(
            "What does `echo` do in PHP?",
            [
              "Deletes a variable",
              "Outputs text",
              "Connects to a database",
              "Starts a loop",
            ],
            1,
          ),
        ],
      },
      {
        title: "Variables, Arrays and Loops",
        minutes: 8,
        paragraphs: [
          'PHP variables don\'t need a declared type — `$age = 30;` just works, and PHP figures out it\'s a number. Arrays can be indexed by number, like `$colors = ["red", "green", "blue"];`, or by named keys, called an associative array: `$user = ["name" => "Ada", "age" => 30];`.',
          "`foreach` is the most common way to loop over an array: `foreach ($colors as $color) { echo $color; }` runs the loop body once per item. For an associative array, `foreach ($user as $key => $value) { ... }` gives you both the key and the value on each pass.",
        ],
        fact: 'PHP arrays are actually "ordered maps" internally — even a plain numbered array like ["red","green"] is stored the same way as an associative array under the hood, just with integer keys 0, 1, 2 assigned automatically.',
        quiz: [
          q(
            'What is `["name" => "Ada", "age" => 30]` an example of?',
            [
              "A numbered array",
              "An associative array",
              "A PHP class",
              "A string",
            ],
            1,
          ),
          q(
            "Which loop is most commonly used to iterate over a PHP array?",
            ["while", "foreach", "do", "switch"],
            1,
          ),
          q(
            "What does `foreach ($user as $key => $value)` give you on each pass?",
            [
              "Only the key",
              "Only the value",
              "Both the key and the value",
              "Neither, it's invalid syntax",
            ],
            2,
          ),
        ],
      },
      {
        title: "Handling Form Data with $_GET and $_POST",
        minutes: 8,
        paragraphs: [
          'When a visitor submits an HTML `<form>`, PHP automatically collects the submitted fields into a superglobal array — `$_POST` if the form\'s method is `post`, or `$_GET` if it\'s `get`. A form field `<input name="email">` submitted via POST becomes available in PHP as `$_POST["email"]`.',
          "GET data is appended to the URL (like `?email=ada@example.com`) and is visible in the address bar and browser history, so it's suited to things like search queries. POST data is sent in the request body instead, invisible in the URL, and is the right choice for anything sensitive, like a login form's password.",
        ],
        fact: '$_GET and $_POST are two of PHP\'s "superglobals" — built-in arrays that are automatically available in every scope of your script, no `global` keyword required, unlike a normal PHP variable defined inside a function.',
        quiz: [
          q(
            "If an HTML form's method is 'post', where does PHP put the submitted data?",
            ["$_GET", "$_POST", "$_FORM", "$_DATA"],
            1,
          ),
          q(
            "Why is GET unsuitable for a login form's password field?",
            [
              "GET doesn't support text input",
              "GET data appears in the URL and browser history",
              "GET only works with numbers",
              "PHP can't read GET data",
            ],
            1,
          ),
          q(
            "What's a superglobal in PHP?",
            [
              "A variable only available inside one function",
              "A built-in array automatically available everywhere in your script",
              "A type of loop",
              "A database connection",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Data Structures & Algorithms",
    level: "Advanced",
    color: "#E63946",
    order: 10,
    about:
      "Understanding how data structures and algorithms work — and how to reason about their efficiency — is what separates code that works from code that scales. This course covers Big-O notation, the trade-offs between arrays and linked lists, and the basics of searching and sorting.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Big-O Notation: Measuring Efficiency",
        minutes: 9,
        paragraphs: [
          "Big-O notation describes how an algorithm's running time (or memory use) grows as its input gets bigger, ignoring machine-specific constants. `O(1)` means constant time — the same speed no matter the input size, like looking up an array element by index. `O(n)` means linear time — doubling the input roughly doubles the work, like scanning every item in a list once.",
          "`O(n²)` (quadratic) shows up in algorithms with nested loops over the same data, like comparing every item to every other item — it gets slow fast as `n` grows. `O(log n)` (logarithmic) is far better, growing very slowly as input size increases — binary search is the classic example, since it can discard half the remaining data with each comparison.",
        ],
        fact: 'The name "Big-O" comes from the mathematical "O" for "order of", borrowed from a notation Paul Bachmann introduced in 1894, long before computer science existed as a field.',
        quiz: [
          q(
            "What does O(1) mean for an algorithm?",
            [
              "It never finishes",
              "It takes constant time regardless of input size",
              "It takes exactly 1 second",
              "It only works on 1 item",
            ],
            1,
          ),
          q(
            "Doubling the input size roughly doubles an O(n) algorithm's work. What best describes O(n²)?",
            [
              "It's always faster than O(n)",
              "Its work grows much faster than input size, often from nested loops",
              "It's the same as O(1)",
              "It only applies to sorting",
            ],
            1,
          ),
          q(
            "Why is binary search described as O(log n)?",
            [
              "It checks every item one by one",
              "It discards half the remaining data with each comparison",
              "It only works on 2 items",
              "It's slower than checking every item",
            ],
            1,
          ),
        ],
      },
      {
        title: "Arrays vs Linked Lists",
        minutes: 8,
        paragraphs: [
          "An array stores its elements in one contiguous block of memory, which is what makes `array[5]` an O(1) operation — the computer can jump straight to that memory address by doing simple math. The trade-off is that inserting an element in the middle means shifting every element after it over by one, which is O(n).",
          "A linked list instead stores each element (a \"node\") separately in memory, with each node holding a pointer to the next one. Inserting or removing a node in the middle is fast, O(1), once you're already there, since it's just rewiring a couple of pointers — but you lose direct index access; finding the 5th node means walking the list one node at a time from the start, which is O(n).",
        ],
        fact: "Because array elements sit next to each other in memory, modern CPUs can often read them noticeably faster in practice than an equivalent linked list, thanks to how CPU caches load nearby memory ahead of time — an effect Big-O notation alone doesn't capture.",
        quiz: [
          q(
            "Why is `array[5]` an O(1) operation?",
            [
              "Arrays are always small",
              "Elements sit in contiguous memory, so the address can be computed directly",
              "The computer guesses the answer",
              "Arrays don't actually store data",
            ],
            1,
          ),
          q(
            "What's the main trade-off of a linked list compared to an array?",
            [
              "It uses more memory but has the same speed everywhere",
              "It has fast middle insert/remove but slow indexed access",
              "It's always faster in every case",
              "It can't store more than 10 items",
            ],
            1,
          ),
          q(
            "Why is inserting into the middle of an array O(n)?",
            [
              "It requires shifting every subsequent element over by one",
              "Arrays can't be modified",
              "It requires rewriting the whole array from scratch every time, randomly",
              "Insertion isn't possible in arrays",
            ],
            0,
          ),
        ],
      },
      {
        title: "Searching and Sorting Basics",
        minutes: 9,
        paragraphs: [
          "Linear search checks every element one by one until it finds a match (or reaches the end) — simple, and it works on unsorted data, but it's O(n). Binary search is much faster, O(log n), but only works on already-sorted data: it checks the middle element, and depending on whether the target is smaller or larger, discards the half that can't contain it, repeating on the remaining half.",
          "Bubble sort is one of the simplest sorting algorithms to understand: it repeatedly steps through the list, swapping any two adjacent elements that are out of order, until a full pass makes no swaps. It's easy to reason about but O(n²), which is why real-world code almost always reaches for a language's built-in sort instead, which typically uses a much faster algorithm behind the scenes.",
        ],
        fact: "Because binary search requires sorted data, there's often a real trade-off: sorting the data first costs time upfront, but if you'll search it many times afterward, that upfront cost usually pays for itself many times over.",
        quiz: [
          q(
            "What must be true of the data for binary search to work correctly?",
            [
              "It must be sorted",
              "It must contain only numbers",
              "It must have fewer than 100 items",
              "Nothing, it works on any data",
            ],
            0,
          ),
          q(
            "What does bubble sort repeatedly do?",
            [
              "Deletes the smallest element",
              "Swaps adjacent out-of-order elements until a pass makes no swaps",
              "Splits the array in half",
              "Randomly shuffles the array",
            ],
            1,
          ),
          q(
            "Why do real-world programs rarely hand-write bubble sort for large datasets?",
            [
              "It's illegal to implement",
              "It's O(n²) and much slower than built-in sorts on large data",
              "It only works on strings",
              "It requires a linked list",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "React",
    level: "Intermediate",
    color: "#61DAFB",
    order: 11,
    about:
      "React is the most widely used JavaScript library for building interactive user interfaces out of small, reusable components. This course covers writing components with JSX, passing data down through props, and managing changing state with the useState hook.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Components and JSX",
        minutes: 8,
        paragraphs: [
          "A React component is just a JavaScript function that returns some UI to display. By convention its name starts with a capital letter: `function Welcome() { return <h1>Hello!</h1>; }`. That `<h1>Hello!</h1>` isn't a string or HTML — it's JSX, a syntax extension that lets you write markup-like code directly inside JavaScript.",
          "JSX gets compiled into regular JavaScript function calls before it ever reaches the browser, so under the hood it's just JavaScript the whole time. You can embed any JavaScript expression inside JSX using curly braces: `<h1>Hello, {userName}!</h1>` inserts the value of the `userName` variable right into the markup.",
        ],
        fact: "JSX isn't required to use React — it's entirely optional syntactic sugar over plain `React.createElement()` calls — but almost every real React codebase uses it because it's dramatically easier to read than the equivalent function calls.",
        quiz: [
          q(
            "What is a React component, fundamentally?",
            [
              "An HTML file",
              "A JavaScript function that returns UI",
              "A CSS class",
              "A database table",
            ],
            1,
          ),
          q(
            "What does JSX get compiled into before running in the browser?",
            [
              "Plain HTML files",
              "Regular JavaScript function calls",
              "CSS",
              "Nothing, browsers run JSX directly",
            ],
            1,
          ),
          q(
            "How do you embed a JavaScript variable's value inside JSX markup?",
            [
              "With parentheses ()",
              "With curly braces {}",
              "With square brackets []",
              "You can't, JSX only accepts static text",
            ],
            1,
          ),
        ],
      },
      {
        title: "Props: Passing Data Down",
        minutes: 7,
        paragraphs: [
          'Props (short for "properties") are how a parent component passes data down to a child component — much like arguments passed into a function. `<Greeting name="Ada" />` passes a prop called `name` with the value `"Ada"` into the `Greeting` component, which reads it as `props.name`.',
          "Props are read-only from the child's perspective — a component should never modify the props it receives, only read them. This one-way, top-down data flow is deliberate: it makes it much easier to trace where any given piece of data actually came from in a large app, since it can only have come from a parent.",
        ],
        fact: 'Because props flow only one direction — parent to child — React apps are sometimes described as having "unidirectional data flow", a design choice that trades a bit of convenience for making large apps much easier to debug.',
        quiz: [
          q(
            "What are props used for in React?",
            [
              "Storing a component's internal secrets",
              "Passing data from a parent component down to a child",
              "Styling components with CSS",
              "Connecting to a database",
            ],
            1,
          ),
          q(
            "Can a child component modify the props it receives?",
            [
              "Yes, freely",
              "No, props are read-only from the child's side",
              "Only string props",
              "Only if wrapped in useState",
            ],
            1,
          ),
          q(
            "What does 'unidirectional data flow' mean in React?",
            [
              "Data can flow in any direction between components",
              "Props flow only one way, from parent to child",
              "Only one component can exist per app",
              "State updates happen only once",
            ],
            1,
          ),
        ],
      },
      {
        title: "State with useState",
        minutes: 9,
        paragraphs: [
          "Props are read-only, but a component often needs to track data that changes over time — like a counter, or whether a checkbox is checked. The `useState` hook gives a component that: `const [count, setCount] = useState(0);` creates a piece of state called `count`, starting at `0`, plus a function `setCount` to update it.",
          "Calling `setCount(count + 1)` doesn't just change a variable — it tells React to re-run the component function and re-render the UI with the new value. That's the core React model: state changes, the component re-renders, the UI updates to match. Event handlers, like `onClick={() => setCount(count + 1)}`, are the usual way state gets updated in response to user interaction.",
        ],
        fact: 'useState is called a "hook" because React hooks must always be called at the top level of a component, in the same order every render — never inside a loop, condition, or nested function — which is how React keeps track of which state belongs to which useState call.',
        quiz: [
          q(
            "What does `useState(0)` return?",
            [
              "Just the current value",
              "An array with the current value and a function to update it",
              "A promise",
              "Nothing, it only sets a default",
            ],
            1,
          ),
          q(
            "What actually happens when you call the setter function returned by useState?",
            [
              "Nothing visible happens",
              "React re-renders the component with the updated value",
              "The page reloads",
              "It only works once per component",
            ],
            1,
          ),
          q(
            "Where must React hooks like useState be called?",
            [
              "Anywhere, including inside loops",
              "At the top level of a component, in the same order every render",
              "Only inside event handlers",
              "Only in class components",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Node.js",
    level: "Intermediate",
    color: "#3C873A",
    order: 12,
    about:
      "Node.js lets you run JavaScript outside the browser, making it possible to build servers, APIs, and command-line tools with one language end to end. This course covers how the Node runtime works, using modules and npm packages, and building a basic HTTP server.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "What Is Node.js?",
        minutes: 7,
        paragraphs: [
          "Node.js is a JavaScript runtime built on Chrome's V8 engine — the same engine that runs JavaScript inside Chrome — but packaged to run outside the browser, directly on your computer or a server. That's what makes it possible to write a file-reading script, a command-line tool, or a full web server, all in JavaScript.",
          "Node is built around non-blocking, asynchronous I/O: when you ask it to read a file or query a database, it doesn't freeze and wait — it kicks off the operation and keeps handling other work, then runs a callback (or resolves a promise) once the result is ready. This event-driven model is what lets a single Node process handle many simultaneous requests efficiently.",
        ],
        fact: "Node.js was created by Ryan Dahl in 2009, partly out of frustration with how traditional web servers handled slow operations like file uploads by blocking — dedicating an entire thread to just wait around.",
        quiz: [
          q(
            "What JavaScript engine does Node.js run on?",
            [
              "SpiderMonkey",
              "V8, the same engine Chrome uses",
              "A custom Node-only engine",
              "Node doesn't use an engine",
            ],
            1,
          ),
          q(
            "What does 'non-blocking I/O' mean?",
            [
              "Node freezes until every operation finishes",
              "Node kicks off slow operations and keeps handling other work while waiting",
              "Node can only do one thing ever",
              "I/O is disabled in Node",
            ],
            1,
          ),
          q(
            "What made Node.js possible to run outside the browser?",
            [
              "Rewriting JavaScript from scratch",
              "Packaging the V8 engine to run standalone",
              "It doesn't run outside the browser",
              "Using a different language entirely",
            ],
            1,
          ),
        ],
      },
      {
        title: "Modules and npm Packages",
        minutes: 8,
        paragraphs: [
          'Node code is organized into modules — separate files that export functionality for other files to import. Using ES module syntax: `export function add(a, b) { return a + b; }` in one file, then `import { add } from "./math.js";` in another. Every Node project also has a `package.json` file listing its dependencies and basic metadata.',
          "npm (Node Package Manager) is how you install other people's code as a dependency: `npm install express` downloads the `express` package into a `node_modules` folder and records it in `package.json`. This ecosystem of shared, reusable packages — hundreds of thousands of them — is one of the biggest reasons Node became so popular so fast.",
        ],
        fact: "npm's public registry is the largest software package registry in the world by number of packages, with well over a million published packages available to install.",
        quiz: [
          q(
            "What does `export function add(...) {...}` let you do?",
            [
              "Delete the function",
              "Make the function usable from other files via import",
              "Run the function automatically",
              "Convert it to CSS",
            ],
            1,
          ),
          q(
            "What does `npm install express` do?",
            [
              "Deletes the express package",
              "Downloads the express package and records it as a dependency",
              "Runs your program",
              "Compiles your code",
            ],
            1,
          ),
          q(
            "What file lists a Node project's dependencies?",
            ["index.js", "package.json", "node_modules", "README.md"],
            1,
          ),
        ],
      },
      {
        title: "Building a Basic HTTP Server",
        minutes: 9,
        paragraphs: [
          '`http.createServer((req, res) => { res.end("Hello"); })` uses Node\'s built-in `http` module to create a web server without any external packages, defining what happens on every incoming request — here, `req` describes the incoming request and `res` is used to send a response back.',
          "Calling `server.listen(3001)` starts the server listening for connections on port 3001; visiting `http://localhost:3001` in a browser then triggers that callback function. In practice, most real projects use a framework like Express on top of the raw `http` module, since it adds convenient routing (matching different URLs to different handler functions) without you having to parse the request URL by hand.",
        ],
        fact: "A port number identifies which specific program on a machine a connection is meant for — a single computer can run many servers at once, each listening on its own port, which is why local dev servers commonly pick unusual numbers like 3000 or 8080 to avoid clashing with other software.",
        quiz: [
          q(
            "What does `server.listen(3001)` do?",
            [
              "Deletes the server",
              "Starts the server listening for connections on port 3001",
              "Sends a response immediately",
              "Stops all other servers",
            ],
            1,
          ),
          q(
            "In `(req, res) => {...}`, what does `res` represent?",
            [
              "The incoming request",
              "The response, used to send data back to the client",
              "A database connection",
              "A file path",
            ],
            1,
          ),
          q(
            "Why do most real Node projects use a framework like Express instead of the raw http module alone?",
            [
              "The http module doesn't work",
              "Express adds convenient routing and other conveniences on top",
              "Express is required to use JavaScript",
              "http module is deprecated",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Tailwind CSS",
    level: "Beginner",
    color: "#14B8A6",
    order: 13,
    about:
      "Tailwind CSS lets you style elements directly in your markup with small, composable utility classes instead of writing separate CSS files by hand. This course covers the utility-first workflow, Tailwind's built-in spacing/color/typography scales, and responsive design with breakpoint prefixes.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Utility-First Styling",
        minutes: 6,
        paragraphs: [
          'Traditional CSS means writing a custom class in a separate stylesheet, like `.card { padding: 16px; font-weight: bold; color: #2563eb; }`, then applying `class="card"` in your HTML. Tailwind flips this: instead of naming and writing a new CSS rule for every style, you apply small, single-purpose utility classes directly in your markup, like `class="p-4 font-bold text-blue-600"`.',
          "Each utility class does exactly one thing — `p-4` sets padding, `font-bold` sets font weight, `text-blue-600` sets text color — so you compose a final look by combining several of them, without ever leaving your HTML or naming a new CSS class.",
        ],
        fact: "Tailwind's utility classes are generated ahead of time from a config file and then optimized by a build step that strips out every class you never actually used, so the CSS shipped to users only ever contains the utilities your project actually references.",
        quiz: [
          q(
            "What does 'utility-first' mean in Tailwind?",
            [
              "You write custom CSS classes for everything",
              "You compose styles from small, single-purpose classes applied directly in markup",
              "Tailwind has no classes at all",
              "You must use JavaScript to style anything",
            ],
            1,
          ),
          q(
            "What does the class `p-4` do?",
            [
              "Sets a paragraph tag",
              "Sets padding",
              "Sets font size",
              "Sets a color",
            ],
            1,
          ),
          q(
            "In traditional CSS, where would you typically define a style like a blue bold heading?",
            [
              "Directly in the HTML tag only",
              "In a separate stylesheet, under a named class",
              "It's impossible in CSS",
              "Only in a database",
            ],
            1,
          ),
        ],
      },
      {
        title: "Spacing, Color and Typography Scales",
        minutes: 7,
        paragraphs: [
          "Instead of letting you pick arbitrary pixel values everywhere, Tailwind ships with fixed, consistent scales. Spacing utilities like `p-1`, `p-2`, `p-4`, `p-8` map to a set progression of sizes (based on a 0.25rem step), so paddings and margins across your whole app naturally line up instead of every developer picking slightly different numbers.",
          "Colors work the same way: `text-blue-500`, `bg-blue-100`, `border-blue-700` all reference the same blue color family at different shades (100 = lightest, 900 = darkest), keeping a project's palette consistent. Typography utilities like `text-sm`, `text-lg`, `text-2xl` work identically for font size.",
        ],
        fact: 'Tailwind\'s default spacing and color scales are fully customizable in a config file, so a team can redefine "blue-500" to be their exact brand blue and every utility using it updates automatically, project-wide.',
        quiz: [
          q(
            "Why does Tailwind use fixed scales for spacing instead of arbitrary pixel values?",
            [
              "To make the CSS file bigger",
              "To keep spacing and sizing consistent across a whole project",
              "Because arbitrary values are impossible in CSS",
              "To slow down development",
            ],
            1,
          ),
          q(
            "In a class like `bg-blue-700`, what does the 700 represent?",
            [
              "A pixel size",
              "How dark or light that shade of blue is",
              "The number of elements it applies to",
              "A font weight",
            ],
            1,
          ),
          q(
            "Can Tailwind's default color/spacing scales be customized?",
            [
              "No, they're fixed forever",
              "Yes, via a config file",
              "Only spacing, not colors",
              "Only by editing Tailwind's source code",
            ],
            1,
          ),
        ],
      },
      {
        title: "Responsive Design with Breakpoint Prefixes",
        minutes: 7,
        paragraphs: [
          'Tailwind handles responsive design with breakpoint prefixes you add before a utility class: `md:text-xl` applies `text-xl` only once the screen is at least the "md" breakpoint wide (768px by default) — below that width, it\'s simply ignored. Combine several: `class="text-base md:text-lg lg:text-xl"` grows the text at each breakpoint.',
          "Tailwind is mobile-first: an unprefixed class like `text-base` applies at every screen size unless overridden by a breakpoint-prefixed class at a wider size. This means you design the small-screen layout first with plain utilities, then layer on prefixed overrides for larger screens, rather than the other way around.",
        ],
        fact: "Tailwind's default breakpoints — sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) — are based on common device widths, but like the color and spacing scales, a project can redefine them in its config.",
        quiz: [
          q(
            "What does the `md:` prefix in `md:text-xl` mean?",
            [
              "Apply text-xl only below the md breakpoint",
              "Apply text-xl only at the md breakpoint and wider",
              "Apply text-xl to every element named 'md'",
              "It has no effect",
            ],
            1,
          ),
          q(
            "What does 'mobile-first' mean in Tailwind's responsive system?",
            [
              "Unprefixed classes apply at every size unless overridden by a wider breakpoint",
              "Only mobile devices can use Tailwind",
              "You must write desktop styles first",
              "Mobile screens are ignored by default",
            ],
            0,
          ),
          q(
            "Which of these correctly grows text size as the screen gets wider?",
            [
              "text-xl md:text-lg lg:text-base",
              "text-base md:text-lg lg:text-xl",
              "md:text-base lg:text-base",
              "text-base lg:text-base md:text-base",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Command Line Basics",
    level: "Beginner",
    color: "#37474F",
    order: 14,
    about:
      "The command line is one of the most powerful tools a developer has for navigating files, running programs, and automating tasks that would take far longer by clicking through a file manager. This course covers navigating the filesystem, managing files, and a few habits that make you faster.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Navigating the Filesystem",
        minutes: 6,
        paragraphs: [
          "`pwd` (print working directory) shows you the full path of the folder you're currently in. `ls` lists what's inside the current folder. `cd` changes which folder you're in — `cd Documents` moves into a subfolder named Documents, while `cd ..` moves up one level to the parent folder.",
          "A path can be absolute — starting from the very root of the filesystem, like `/Users/ada/Documents` — or relative, described starting from wherever you currently are, like `Documents/notes.txt`. `cd ~` is a shortcut that always jumps straight to your home folder, no matter where you currently are.",
        ],
        fact: 'The `..` shortcut for "parent folder" and `.` for "current folder" work identically across virtually every major operating system\'s command line, both dating back to the very earliest Unix systems in the 1970s.',
        quiz: [
          q(
            "What does the `pwd` command show?",
            [
              "A list of files",
              "The full path of your current folder",
              "Your username",
              "A password prompt",
            ],
            1,
          ),
          q(
            "What does `cd ..` do?",
            [
              "Deletes the current folder",
              "Moves up one level to the parent folder",
              "Creates a new folder",
              "Lists hidden files",
            ],
            1,
          ),
          q(
            "What's the difference between an absolute and a relative path?",
            [
              "No difference",
              "An absolute path starts from the filesystem root; a relative path starts from your current location",
              "Relative paths only work on Windows",
              "Absolute paths are always shorter",
            ],
            1,
          ),
        ],
      },
      {
        title: "Creating, Moving and Deleting Files",
        minutes: 7,
        paragraphs: [
          "`mkdir project` creates a new folder called `project`. `touch notes.txt` creates a new empty file (on macOS/Linux). `cp source.txt copy.txt` copies a file, while `mv old.txt new.txt` renames it — or moves it to a different folder if you give it a folder path instead.",
          "`rm file.txt` permanently deletes a file — there's no recycle bin to rescue it from on the command line, so it's worth double-checking the filename before hitting enter. `rm -r folder` deletes an entire folder and everything inside it, recursively; that `-r` flag is what makes it work on folders instead of just single files.",
        ],
        fact: "Because `rm` deletes files immediately and permanently with no trash bin to recover from, it's one of the most common sources of the classic developer horror story — losing work to a single mistyped command.",
        quiz: [
          q(
            "What does `mkdir project` do?",
            [
              "Deletes a folder named project",
              "Creates a new folder named project",
              "Moves into the project folder",
              "Renames a file to project",
            ],
            1,
          ),
          q(
            "What's the key risk of using `rm` on the command line?",
            [
              "It only works on folders",
              "It permanently deletes files with no recycle bin to recover from",
              "It requires admin permission every time",
              "It only deletes empty files",
            ],
            1,
          ),
          q(
            "What does the `-r` flag do when used with `rm -r folder`?",
            [
              "Renames the folder",
              "Makes rm delete the folder and everything inside it recursively",
              "Restores deleted files",
              "Nothing, it's optional decoration",
            ],
            1,
          ),
        ],
      },
      {
        title: "Useful Shortcuts and Habits",
        minutes: 7,
        paragraphs: [
          "Tab-completion is one of the biggest time-savers: start typing a file or folder name and hit Tab, and the shell fills in the rest (or shows you the possibilities if there's more than one match) — far faster and less error-prone than typing a long name out by hand. Pressing the up-arrow key cycles back through your previous commands, so you rarely need to retype something you already ran.",
          '`ls | grep notes` sends the output of one command straight into another as input using the pipe operator `|`, letting you chain small tools together — here, listing files and then filtering that list down to only the ones containing "notes". When you\'re unsure how a command works, `man ls` (or `ls --help` on many systems) opens its manual page.',
        ],
        fact: "The idea of piping one small program's output into another as input — rather than building one giant program that does everything — is a foundational Unix philosophy dating back to 1973, still very much alive in how developers use the command line today.",
        quiz: [
          q(
            "What does pressing Tab while typing a filename typically do?",
            [
              "Deletes the filename",
              "Auto-completes it, or shows matching possibilities",
              "Runs the command immediately",
              "Opens a new terminal",
            ],
            1,
          ),
          q(
            "What does the up-arrow key do in most command-line shells?",
            [
              "Scrolls the current output up",
              "Cycles back through previously run commands",
              "Moves the cursor up a folder",
              "Nothing by default",
            ],
            1,
          ),
          q(
            "What does the pipe operator `|` do?",
            [
              "Comments out the rest of the line",
              "Sends one command's output into another command as input",
              "Deletes output",
              "Ends the current command",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Docker",
    level: "Intermediate",
    color: "#2496ED",
    order: 15,
    about:
      "Docker packages an application together with everything it needs to run into a portable container, so 'it works on my machine' stops being an excuse. This course covers the difference between images and containers, writing a Dockerfile, and running and managing containers.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Images vs Containers",
        minutes: 7,
        paragraphs: [
          "A Docker image is a read-only blueprint — a packaged snapshot containing your application's code plus every dependency, library, and system tool it needs to run, all bundled together. A container is a running instance of that image, similar to how a class relates to an object: you can start multiple containers from the very same image.",
          'Because an image bundles the entire environment an app needs, a container built from it behaves the same way on any machine that has Docker installed — your laptop, a teammate\'s laptop, or a production server — eliminating a huge class of "works on my machine" bugs caused by differing installed versions or missing dependencies.',
        ],
        fact: "Docker containers share the host machine's operating system kernel rather than emulating an entire separate OS the way a traditional virtual machine does, which is a big part of why containers start in a second or two instead of the minute or more a VM often takes to boot.",
        quiz: [
          q(
            "What is a Docker image?",
            [
              "A running process",
              "A read-only blueprint bundling an app and everything it needs to run",
              "A type of database",
              "A network configuration file",
            ],
            1,
          ),
          q(
            "What is a container, relative to an image?",
            [
              "They're identical concepts",
              "A running instance created from an image",
              "A container creates images, not the other way around",
              "A backup copy of an image",
            ],
            1,
          ),
          q(
            "Why do Docker containers start much faster than a traditional virtual machine?",
            [
              "They don't actually run any code",
              "They share the host OS's kernel instead of booting a separate OS",
              "They're smaller in file size only",
              "They use less RAM only",
            ],
            1,
          ),
        ],
      },
      {
        title: "Writing a Dockerfile",
        minutes: 8,
        paragraphs: [
          "A Dockerfile is a text file with step-by-step instructions for building an image. `FROM node:20` starts from an existing base image (here, one with Node.js 20 pre-installed) rather than building an operating system from scratch. `COPY . .` copies your project's files into the image, and `RUN npm install` executes a command during the build, like installing dependencies.",
          '`CMD ["node", "server.js"]` specifies the command that runs when a container starts from this image — unlike `RUN`, which executes once while building the image, `CMD` only runs when the container actually starts. Each instruction in a Dockerfile creates a new cached layer, so Docker can skip re-running steps that haven\'t changed since the last build, speeding up future builds.',
        ],
        fact: 'Ordering matters in a Dockerfile: putting `COPY package.json .` and `RUN npm install` before copying the rest of your source code means Docker can reuse the cached "install dependencies" layer on future builds as long as package.json hasn\'t changed, even if your actual application code has.',
        quiz: [
          q(
            "What does `FROM node:20` do in a Dockerfile?",
            [
              "Deletes any existing Node installation",
              "Starts the image build from an existing base image with Node 20 pre-installed",
              "Runs a Node script called 20",
              "Copies files named node20",
            ],
            1,
          ),
          q(
            "What's the difference between RUN and CMD in a Dockerfile?",
            [
              "They're the same instruction",
              "RUN executes during the image build; CMD runs when a container starts",
              "CMD runs during build; RUN runs at container start",
              "Neither actually executes anything",
            ],
            1,
          ),
          q(
            "Why does instruction order in a Dockerfile affect build speed?",
            [
              "It doesn't matter at all",
              "Each instruction creates a cached layer, and unchanged early layers can be reused on rebuilds",
              "Only the last instruction ever runs",
              "Docker always rebuilds everything regardless of order",
            ],
            1,
          ),
        ],
      },
      {
        title: "Running and Managing Containers",
        minutes: 8,
        paragraphs: [
          "`docker build -t myapp .` builds an image from the Dockerfile in the current folder and tags it `myapp`. `docker run -p 3000:3000 myapp` then starts a container from that image, mapping port 3000 inside the container to port 3000 on your machine (`-p host:container`) so you can actually reach it in a browser.",
          "`docker ps` lists currently running containers, along with their IDs — useful when you need to stop one with `docker stop <id>`. Because containers are meant to be disposable, it's common to remove one entirely with `docker rm <id>` once you're done with it, rather than reusing the same container over and over.",
        ],
        fact: "The `-p 3000:3000` port mapping format is host-port:container-port — they don't have to match, so `-p 8080:3000` would let you reach a container's internal port 3000 by visiting port 8080 on your own machine instead.",
        quiz: [
          q(
            "What does `-p 3000:3000` do when running a container?",
            [
              "Sets a password for the container",
              "Maps port 3000 on the host machine to port 3000 inside the container",
              "Limits the container to 3000 processes",
              "Sets the container's memory to 3000MB",
            ],
            1,
          ),
          q(
            "What does `docker ps` show?",
            [
              "Every image ever built",
              "Currently running containers",
              "Your Dockerfile's contents",
              "Available disk space",
            ],
            1,
          ),
          q(
            "In `-p 8080:3000`, which port do you actually visit in your browser on your own machine?",
            [
              "3000",
              "8080",
              "Both work identically",
              "Neither, this syntax is invalid",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "RESTful APIs",
    level: "Intermediate",
    color: "#FF6B6B",
    order: 16,
    about:
      "REST is the convention most web APIs follow to let a frontend talk to a backend over plain HTTP in a predictable way. This course covers modeling resources and endpoints, the meaning of each core HTTP method, and how status codes and JSON responses communicate what happened.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Resources and Endpoints",
        minutes: 7,
        paragraphs: [
          'A RESTful API is organized around resources — nouns representing the things your app manages, like `courses`, `users`, or `posts` — rather than actions. Each resource type gets its own URL path, called an endpoint: `/api/courses` represents "the collection of all courses", and `/api/courses/:id` represents "one specific course", identified by its id.',
          "This resource-based naming is deliberate: instead of an endpoint like `/getAllCourses` or `/deleteCourseById`, REST expresses the action through the HTTP method used on the same URL — the next lesson covers exactly how. Nesting can express relationships too, like `/api/courses/:courseId/lessons/:lessonId` for a lesson that belongs to a specific course.",
        ],
        fact: 'REST stands for "Representational State Transfer", a term coined by Roy Fielding in his 2000 doctoral dissertation, which described the architectural style already emerging in how the web itself worked, rather than inventing something entirely new.',
        quiz: [
          q(
            "In REST, what does a URL like `/api/courses` typically represent?",
            [
              "A single course",
              "The collection of all courses",
              "A database table name only",
              "A CSS file",
            ],
            1,
          ),
          q(
            "Why does REST favor endpoints named after nouns like /courses over verbs like /getAllCourses?",
            [
              "Verbs are technically invalid in URLs",
              "The action is instead expressed through the HTTP method used on that URL",
              "Nouns are shorter to type",
              "There's no real reason, it's arbitrary",
            ],
            1,
          ),
          q(
            "What might `/api/courses/:courseId/lessons/:lessonId` represent?",
            [
              "A course with no lessons",
              "A specific lesson that belongs to a specific course",
              "A list of every lesson in every course",
              "An error page",
            ],
            1,
          ),
        ],
      },
      {
        title: "HTTP Methods: GET, POST, PUT, DELETE",
        minutes: 8,
        paragraphs: [
          "GET requests fetch data without changing anything on the server — safe to call repeatedly with no side effects, like `GET /api/courses` to list every course. POST creates something new: `POST /api/courses` with a course's data in the request body creates a brand-new course record.",
          "PUT typically updates an existing resource, replacing it with the data you send: `PUT /api/courses/:id` updates that specific course. DELETE removes a resource: `DELETE /api/courses/:id` deletes that course. Together, these four methods map neatly onto the classic CRUD operations — Create, Read, Update, Delete.",
        ],
        fact: 'GET requests are meant to be "safe" (no server-side side effects) and "idempotent" (calling it many times has the same effect as calling it once) — which is exactly why browsers freely prefetch, cache, and re-request GET URLs without worrying about accidentally triggering an action twice.',
        quiz: [
          q(
            "Which HTTP method is used to fetch data without changing anything on the server?",
            ["POST", "GET", "DELETE", "PUT"],
            1,
          ),
          q(
            "Which HTTP method typically creates a brand-new resource?",
            ["GET", "POST", "DELETE", "OPTIONS"],
            1,
          ),
          q(
            "GET, POST, PUT and DELETE map onto which classic set of operations?",
            [
              "Import, Export, Backup, Restore",
              "Create, Read, Update, Delete (CRUD)",
              "Start, Stop, Pause, Resume",
              "Login, Logout, Register, Delete",
            ],
            1,
          ),
        ],
      },
      {
        title: "Status Codes and JSON Responses",
        minutes: 8,
        paragraphs: [
          "Every HTTP response includes a status code summarizing what happened. Codes in the 200s mean success — `200 OK` for a normal successful response, `201 Created` specifically after successfully creating something new. Codes in the 400s mean the client made a mistake — `400 Bad Request` for malformed input, `404 Not Found` when the requested resource doesn't exist.",
          "`500 Internal Server Error` means something went wrong on the server's end, unrelated to what the client sent. Most modern APIs return their data as JSON — a lightweight, text-based format that's easy for both humans to read and programs in virtually any language to parse, which is why it became the standard over older formats like XML.",
        ],
        fact: "Status code ranges follow a simple pattern: 1xx is informational, 2xx is success, 3xx is redirection, 4xx is a client-side error, and 5xx is a server-side error — so even a status code you've never seen before, like 418, tells you roughly what category it falls into just from its first digit.",
        quiz: [
          q(
            "What does a status code of 201 typically mean?",
            [
              "The request failed",
              "A resource was successfully created",
              "The server crashed",
              "The client is not authorized",
            ],
            1,
          ),
          q(
            "What does 404 mean?",
            [
              "Success",
              "The server made a mistake",
              "The requested resource wasn't found",
              "The request timed out",
            ],
            2,
          ),
          q(
            "What does the first digit of an HTTP status code tell you?",
            [
              "Nothing, it's random",
              "The general category of the response, like success (2xx) or client error (4xx)",
              "The exact error message",
              "The server's response time",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Software Testing & Debugging",
    level: "Intermediate",
    color: "#9C27B0",
    order: 17,
    about:
      "Writing tests and knowing how to debug systematically save far more time than they cost, catching bugs before your users do. This course covers why testing matters, writing your first automated unit test, and a practical step-by-step process for tracking down bugs.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Why Test? Manual vs Automated",
        minutes: 6,
        paragraphs: [
          "Manual testing means a person clicking through the app to check that things work — useful, but slow, easy to forget parts of, and something that has to be redone from scratch every time the code changes. Automated tests are code that checks other code: once written, they can be run in seconds, as often as you like, catching a whole class of bugs called regressions — something that used to work breaking because of an unrelated later change.",
          "The real value of a good automated test suite isn't just catching today's bugs — it's the confidence it gives you to change or refactor code later without fear of silently breaking something else. Without tests, developers often become reluctant to touch old code at all, since there's no fast way to check they haven't broken it.",
        ],
        fact: 'A "regression" gets its name from the bug regressing — reappearing after it was already fixed once, usually because an unrelated code change reintroduced the same old problem without anyone noticing.',
        quiz: [
          q(
            "What is a 'regression' bug?",
            [
              "A bug that was never fixed",
              "A previously fixed bug reappearing after a later, unrelated change",
              "A bug only found in production",
              "A bug in the test suite itself",
            ],
            1,
          ),
          q(
            "What's a key advantage of automated tests over manual testing?",
            [
              "They're always 100% bug-free",
              "They can be run quickly and repeatedly with no extra manual effort",
              "They replace the need to write code",
              "They only need to be written once, ever, project-wide",
            ],
            1,
          ),
          q(
            "Why does a good test suite give developers confidence to refactor old code?",
            [
              "It doesn't, refactoring is always risky",
              "Running the tests quickly reveals if a change silently broke existing behavior",
              "Tests automatically fix bugs they find",
              "It removes the need to understand the code",
            ],
            1,
          ),
        ],
      },
      {
        title: "Writing Your First Unit Test",
        minutes: 8,
        paragraphs: [
          'A unit test checks one small piece of code — often a single function — in isolation. Most tests follow the "arrange, act, assert" pattern: arrange sets up whatever input you need, act calls the function you\'re testing, and assert checks the actual result matches what you expected.',
          "For a function `function add(a, b) { return a + b; }`, a test might read: arrange `a = 2, b = 3`; act `result = add(a, b)`; assert `result should equal 5`. If a later code change breaks `add` so it returns the wrong value, this test fails immediately, pointing straight at the problem instead of leaving it to be discovered somewhere else, much later.",
        ],
        fact: '"Arrange, Act, Assert" is sometimes shortened to the "AAA pattern", and following it consistently is one of the simplest ways to keep even a large test suite easy to read at a glance, since every test has the same predictable three-part shape.',
        quiz: [
          q(
            "What does a unit test typically check?",
            [
              "The entire application at once",
              "One small piece of code, often a single function, in isolation",
              "Only the user interface",
              "The server's uptime",
            ],
            1,
          ),
          q(
            "In the 'arrange, act, assert' pattern, what does 'act' refer to?",
            [
              "Setting up test input",
              "Calling the function being tested",
              "Checking the result matches expectations",
              "Deleting the test afterward",
            ],
            1,
          ),
          q(
            "Why is it useful for a test to fail immediately when a function breaks?",
            [
              "It isn't useful",
              "It points directly at the problem instead of it being discovered much later",
              "It automatically fixes the bug",
              "Tests can't actually fail",
            ],
            1,
          ),
        ],
      },
      {
        title: "A Practical Debugging Process",
        minutes: 8,
        paragraphs: [
          "The first step in debugging is reliably reproducing the bug — if you can't make it happen on demand, it's very hard to know when you've actually fixed it. Once you can reproduce it, isolate the problem by narrowing down exactly which part of the code is responsible, rather than guessing at the whole system.",
          "Sprinkling `console.log()` statements (or setting breakpoints in a debugger) at different points lets you inspect what the code's variables actually contain at each step, compared to what you expected. A useful technique for a large chunk of unfamiliar code is a kind of binary search: check the halfway point, see if the bug shows up before or after it, and repeat on the half that still contains the problem — narrowing it down fast instead of reading line by line.",
        ],
        fact: "Breakpoints, which pause a program mid-execution so you can inspect its exact state, generally give you far more information per step than console.log statements — but console.log wins for speed on very simple bugs since there's no debugger to attach.",
        quiz: [
          q(
            "What's the first step in a practical debugging process?",
            [
              "Rewriting the whole function",
              "Reliably reproducing the bug",
              "Deleting the failing code",
              "Asking a teammate to fix it",
            ],
            1,
          ),
          q(
            "What does 'isolating' a bug mean?",
            [
              "Ignoring it until later",
              "Narrowing down exactly which part of the code is responsible",
              "Deleting all related code",
              "Running the whole test suite",
            ],
            1,
          ),
          q(
            "How does a 'binary search' debugging technique work?",
            [
              "Randomly guessing where the bug is",
              "Checking the halfway point of the code and repeating on whichever half still shows the bug",
              "Only works on numbers",
              "Requires rewriting the code in binary",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Microsoft Excel",
    level: "Beginner",
    color: "#1D6F42",
    order: 18,
    about:
      "Excel is the standard tool for organizing data, doing calculations, and building at-a-glance reports across almost every industry. This course covers the grid of cells, essential formulas, and basic sorting, filtering and charts.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Cells, Rows and Sheets",
        minutes: 6,
        paragraphs: [
          'An Excel file (a "workbook") is made of one or more sheets, each laid out as a grid of cells. Columns are labeled with letters (A, B, C...) and rows with numbers (1, 2, 3...), so every cell has a unique reference like `B3` — column B, row 3 — that you can point at from a formula elsewhere in the sheet.',
          "You can type text, numbers, or a formula into any cell. A formula always starts with `=`, like `=A1+A2`, which tells Excel to calculate the sum of whatever's in cells A1 and A2 and display the result — and if you later change A1's value, that formula automatically recalculates.",
        ],
        fact: "Excel's very first version shipped for the Apple Macintosh in 1985, two full years before a Windows version existed — Microsoft built Mac software first partly to strengthen its relationship with Apple while Windows was still young.",
        quiz: [
          q(
            "What does the cell reference B3 mean?",
            [
              "Row B, column 3",
              "Column B, row 3",
              "Sheet number 3",
              "Cell number 3 in the workbook",
            ],
            1,
          ),
          q(
            "What must every Excel formula start with?",
            ["A letter", "The = sign", "A number", "A colon :"],
            1,
          ),
          q(
            "What happens to a formula like =A1+A2 if you change the value in A1?",
            [
              "Nothing, formulas don't update",
              "It automatically recalculates with the new value",
              "It shows an error",
              "You must retype the formula",
            ],
            1,
          ),
        ],
      },
      {
        title: "Essential Formulas",
        minutes: 8,
        paragraphs: [
          '`=SUM(A1:A10)` adds up every value in the range from A1 through A10, saving you from writing `=A1+A2+A3...` by hand. `=AVERAGE(A1:A10)` does the same but returns the mean instead of the total. The colon `:` in `A1:A10` means "this whole range", not just those two individual cells.',
          "By default, a cell reference in a formula is relative — if you copy `=A1+B1` from row 1 down to row 2, it automatically becomes `=A2+B2`, adjusting to match. Sometimes you don't want that: writing `$A$1` (with dollar signs) makes it an absolute reference, so copying the formula elsewhere keeps pointing at that exact same cell, A1, no matter where you paste it.",
        ],
        fact: 'The dollar sign in an absolute reference like $A$1 can be applied to just the column ($A1), just the row (A$1), or both ($A$1) — a mixed reference locks only the part you "pinned" while the other still shifts when copied.',
        quiz: [
          q(
            "What does =SUM(A1:A10) calculate?",
            [
              "Only the values in A1 and A10",
              "The total of every value from A1 through A10",
              "The average of A1 and A10",
              "Nothing, it's invalid syntax",
            ],
            1,
          ),
          q(
            "If you copy the formula =A1+B1 from row 1 down to row 2, what does it normally become?",
            [
              "It stays exactly =A1+B1",
              "It automatically becomes =A2+B2",
              "It becomes an error",
              "It becomes =A1+B2",
            ],
            1,
          ),
          q(
            "What does writing $A$1 instead of A1 in a formula do?",
            [
              "Deletes the cell",
              "Makes it an absolute reference that doesn't shift when copied",
              "Doubles the value",
              "Makes it a text value instead of a number",
            ],
            1,
          ),
        ],
      },
      {
        title: "Sorting, Filtering and Simple Charts",
        minutes: 8,
        paragraphs: [
          "Selecting your data and choosing Sort from the Data tab lets you reorder rows by any column — for example, sorting a list of orders from newest to oldest, or highest to lowest total. Filtering shows only the rows matching a condition you set, temporarily hiding the rest without deleting any data — useful for focusing on, say, only orders from one specific country.",
          "To visualize your data, select a range of cells and choose a chart type from the Insert tab — a bar chart to compare categories side by side, or a line chart to show a trend over time. Excel automatically builds the chart from whichever data you had selected, and updates it if that underlying data later changes.",
        ],
        fact: "Filtering in Excel never deletes or permanently changes your underlying data — it only temporarily hides the rows that don't match your criteria, and clearing the filter instantly brings every row back exactly as it was.",
        quiz: [
          q(
            "What does filtering data in Excel actually do to the hidden rows?",
            [
              "Permanently deletes them",
              "Temporarily hides them without deleting anything",
              "Moves them to a new sheet",
              "Converts them to text",
            ],
            1,
          ),
          q(
            "Which chart type is best suited to showing a trend over time?",
            [
              "A line chart",
              "A pie chart only",
              "No chart can show trends",
              "A bar chart is the only option",
            ],
            0,
          ),
          q(
            "What happens to a chart if you later change the underlying data it was built from?",
            [
              "Nothing, it stays frozen",
              "The chart automatically updates to reflect the new data",
              "You must rebuild the chart from scratch",
              "The chart is deleted",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Microsoft PowerPoint",
    level: "Beginner",
    color: "#B7472A",
    order: 19,
    about:
      "PowerPoint turns your ideas into a clear visual story for presentations, pitches, and lessons. This course covers working with slides, layouts and themes, adding text and media, and presenting with confidence.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Slides, Layouts and Themes",
        minutes: 6,
        paragraphs: [
          "A presentation is made of slides, shown one after another. Each slide can use a different layout — a predefined arrangement of placeholder boxes for things like a title, body text, or an image — so you don't have to position everything from scratch on every single slide.",
          "A theme controls the overall look of the whole presentation at once: its fonts, color palette, and background style. Changing the theme instantly restyles every slide consistently, which is why it's worth picking a theme early rather than manually styling each slide individually and then having to redo it all later.",
        ],
        fact: 'The "slide master" is a special template slide that controls the default styling for every layout in a presentation — editing it once, like changing the default heading font, automatically updates that same element across every slide using that layout, instead of requiring dozens of individual edits.',
        quiz: [
          q(
            "What does a slide's layout provide?",
            [
              "The presentation's file name",
              "A predefined arrangement of placeholder boxes for content",
              "A password for the file",
              "The presenter's speaker notes",
            ],
            1,
          ),
          q(
            "What does changing a presentation's theme do?",
            [
              "Only affects the current slide",
              "Restyles fonts, colors and background consistently across every slide",
              "Deletes all existing content",
              "Only changes the file name",
            ],
            1,
          ),
          q(
            "What is the 'slide master' used for?",
            [
              "Recording a video of the presentation",
              "Controlling default styling across every slide using a given layout",
              "Only used for the title slide",
              "Printing handouts",
            ],
            1,
          ),
        ],
      },
      {
        title: "Adding Text, Images and Transitions",
        minutes: 7,
        paragraphs: [
          "Placeholder boxes on a layout are ready to hold specific content — click into a title placeholder and just start typing. To add your own image, use Insert > Pictures, then drag its corner handles to resize it, keeping the shape locked so it doesn't stretch and distort.",
          "Transitions are the animation that plays as you move from one slide to the next, found under the Transitions tab. It's worth using them sparingly and consistently — a single subtle transition applied throughout feels professional, while a different flashy effect on every slide quickly becomes distracting rather than impressive.",
        ],
        fact: "Presentation designers often follow a rule of thumb that a slide's image should be the largest, most eye-catching element on the page whenever the point is to make an emotional impression — text-heavy slides tend to have far less impact than a strong visual paired with a short spoken explanation.",
        quiz: [
          q(
            "What is a placeholder box on a slide layout meant for?",
            [
              "Decoration only, it can't hold content",
              "Ready-made space for specific content like a title or image",
              "Only for storing speaker notes",
              "A hidden area not shown when presenting",
            ],
            1,
          ),
          q(
            "What's a recommended approach to using slide transitions?",
            [
              "Use a different flashy transition on every slide",
              "Use one subtle transition consistently throughout",
              "Never use any transitions ever",
              "Transitions must be added to every single slide element",
            ],
            1,
          ),
          q(
            "When resizing an inserted image, what should you do to avoid distorting it?",
            [
              "Drag the edges freely without locking anything",
              "Keep its proportions locked using the corner handles",
              "Only resize using the keyboard",
              "Images can't be resized in PowerPoint",
            ],
            1,
          ),
        ],
      },
      {
        title: "Presenting with Confidence",
        minutes: 7,
        paragraphs: [
          "Speaker notes, added below each slide in the Notes pane, let you jot down reminders or extra detail you plan to say out loud without cluttering the slide itself. Presenter View shows you those notes, plus a timer and a preview of the next slide, on your own screen — while the audience only ever sees the clean slide itself on the projected display.",
          "A common guideline for slide text is the \"6x6 rule\": aim for no more than about six bullet points per slide, and six words per bullet. It's a loose guideline rather than a strict law, but it pushes you toward slides that support what you're saying out loud, rather than slides so packed with text that the audience just reads instead of listening.",
        ],
        fact: "Presenter View has to be explicitly enabled and requires the computer to be connected to two displays (or configured to simulate two) — one showing your notes and the next slide, the other showing only the plain slide to the audience.",
        quiz: [
          q(
            "What does the Notes pane let you add to a slide?",
            [
              "A password",
              "Speaker notes only visible to you in Presenter View",
              "A background image",
              "A new layout",
            ],
            1,
          ),
          q(
            "What does the '6x6 rule' suggest?",
            [
              "Six slides total maximum",
              "Roughly six bullet points per slide, six words per bullet",
              "Six fonts per presentation",
              "Six minutes per slide",
            ],
            1,
          ),
          q(
            "What does Presenter View show that the audience's screen doesn't?",
            [
              "Nothing, they're identical",
              "Your speaker notes, a timer, and a preview of the next slide",
              "The presentation's file size",
              "A list of past presentations",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Introduction to Machine Learning",
    level: "Advanced",
    color: "#6236FF",
    order: 20,
    about:
      "Machine learning lets computers find patterns in data instead of following rules a person writes by hand. This course covers what makes an approach 'machine learning', the difference between training and testing data, and a simple worked example: linear regression.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "What Is Machine Learning?",
        minutes: 8,
        paragraphs: [
          "In traditional programming, a person writes explicit rules — if this condition, do that. Machine learning flips this: instead of hand-writing the rules, you give an algorithm a large set of examples, and it works out the pattern connecting them itself. A spam filter built the old way would need someone to list every possible spam phrase; a machine-learned one instead learns the pattern from thousands of examples of real spam and real non-spam.",
          'Supervised learning is the most common starting point: you give the algorithm labeled examples — data paired with the correct answer, like an email marked "spam" or "not spam" — and it learns to predict that label on new, unseen data. Unsupervised learning instead works on unlabeled data, looking for structure or groupings on its own, with no "correct answer" provided up front.',
        ],
        fact: 'The term "machine learning" was coined by Arthur Samuel in 1959 while working at IBM on a program that learned to play checkers by playing games against itself, gradually improving without a person reprogramming its strategy by hand.',
        quiz: [
          q(
            "How does machine learning fundamentally differ from traditional rule-based programming?",
            [
              "It's not actually different",
              "Instead of hand-written rules, the algorithm learns patterns from examples",
              "It requires no data at all",
              "It only works for games",
            ],
            1,
          ),
          q(
            "What defines supervised learning?",
            [
              "It uses no data",
              "It learns from labeled examples paired with the correct answer",
              "It never makes predictions",
              "It only works on images",
            ],
            1,
          ),
          q(
            "What does unsupervised learning work with?",
            [
              "Labeled data only",
              "Unlabeled data, looking for structure with no given correct answer",
              "No data at all",
              "Only numerical data",
            ],
            1,
          ),
        ],
      },
      {
        title: "Training, Testing and Overfitting",
        minutes: 8,
        paragraphs: [
          "Before evaluating a model, you split your data into a training set and a separate testing set that the model never sees while learning. This matters because a model's whole point is to generalize — to make good predictions on new data it hasn't seen before, not just to memorize the examples it was shown.",
          "Overfitting happens when a model learns the training data too precisely, including its noise and quirks, instead of the real underlying pattern — it performs great on training data but poorly on the held-out test data, revealing it never actually generalized. Checking performance on a separate test set is exactly how you catch overfitting before deploying a model.",
        ],
        fact: "A classic overfitting analogy is memorizing the exact answers to last year's practice exam instead of actually understanding the subject — you'd ace that specific old exam, but do poorly on this year's exam covering the same material with different questions.",
        quiz: [
          q(
            "Why is data split into separate training and testing sets?",
            [
              "To make the model train faster",
              "To check the model generalizes to data it hasn't seen, not just memorized examples",
              "Testing data is unnecessary in ML",
              "To reduce the file size",
            ],
            1,
          ),
          q(
            "What is overfitting?",
            [
              "A model that trains too slowly",
              "A model that learned the training data's noise too precisely instead of the real pattern",
              "A model with too little data",
              "A model that only works on images",
            ],
            1,
          ),
          q(
            "How would overfitting typically show up when comparing training vs test performance?",
            [
              "Both scores are always identical",
              "Great performance on training data but poor performance on test data",
              "Poor performance on both",
              "Overfitting has no measurable effect",
            ],
            1,
          ),
        ],
      },
      {
        title: "A Simple Example: Linear Regression",
        minutes: 9,
        paragraphs: [
          'Linear regression is one of the simplest machine learning techniques: given examples of an input (a "feature", like a house\'s square footage) paired with a known output (a "label", like its sale price), it finds the straight line that best fits those points, so that predicting a new house\'s price is just a matter of reading its value off that line.',
          "\"Best fits\" usually means minimizing the total distance between the line and each actual data point — the model adjusts the line's slope and starting point until that overall error is as small as it can get. Even though it's simple, linear regression is still widely used today whenever the relationship between input and output is roughly straight-line shaped and easy to interpret.",
        ],
        fact: 'Despite the name, linear regression isn\'t limited to a single input feature — "multiple linear regression" fits a flat plane (or higher-dimensional equivalent) through many features at once, like square footage, number of bedrooms, and location, all predicting the same price together.',
        quiz: [
          q(
            "What does linear regression find, given feature/label example pairs?",
            [
              "A random guess",
              "The straight line that best fits the data points",
              "A list of if/else rules",
              "A grouping of similar data points",
            ],
            1,
          ),
          q(
            "What does 'best fits' typically mean for the line linear regression finds?",
            [
              "The steepest possible line",
              "Minimizing the overall distance between the line and the actual data points",
              "The line closest to zero",
              "Whichever line is drawn first",
            ],
            1,
          ),
          q(
            "Can linear regression use more than one input feature at once?",
            [
              "No, only ever one feature",
              "Yes, multiple linear regression fits many features at once",
              "Only with images",
              "Only in unsupervised learning",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "UI/UX Design Fundamentals",
    level: "Beginner",
    color: "#A259FF",
    order: 21,
    about:
      "Good design is about how something works for the person using it, not just how it looks. This course covers the difference between UI and UX, core usability principles, and why wireframing before you design saves time.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "UI vs UX: What's the Difference?",
        minutes: 6,
        paragraphs: [
          "UI, user interface, is the actual surface someone interacts with — the buttons, colors, layout, and typography on screen. UX, user experience, is the bigger picture: the entire journey someone has using your product, including how easy it is to figure out, how it makes them feel, and whether it actually solves their problem.",
          "A product can have a beautiful UI and still have terrible UX — a gorgeous checkout screen buried five confusing steps deep is bad UX with good UI. Conversely, a plain-looking form that's fast and obvious to fill out can have great UX despite unremarkable visuals. The two work together, but they're solving different problems.",
        ],
        fact: 'The term "user experience" was popularized by Don Norman in the early 1990s while he worked at Apple, specifically because he felt "usability" was too narrow a word to capture everything that shapes how someone actually feels using a product.',
        quiz: [
          q(
            "What does UI refer to?",
            [
              "The entire customer journey",
              "The actual visual/interactive surface — buttons, layout, colors",
              "Backend server code",
              "A marketing strategy",
            ],
            1,
          ),
          q(
            "Can a product have good UI but bad UX?",
            [
              "No, they're always identical",
              "Yes — for example, a beautiful screen buried in a confusing multi-step flow",
              "UX doesn't exist without UI",
              "Only in mobile apps",
            ],
            1,
          ),
          q(
            "What does UX (user experience) encompass beyond visuals?",
            [
              "Nothing beyond visuals",
              "The whole journey and feeling of using a product, including ease and usefulness",
              "Only the loading speed",
              "Only the color scheme",
            ],
            1,
          ),
        ],
      },
      {
        title: "Core Usability Principles",
        minutes: 7,
        paragraphs: [
          "Consistency means similar things should look and behave similarly throughout a product — if one page's \"Save\" button is blue and another's identical action is a different color in a different spot, users have to relearn the interface on every screen instead of building one reliable mental model.",
          "Feedback means the interface should always confirm that an action was received — a button that visibly presses, a spinner while something loads, a confirmation message after a form submits. Without feedback, users are left unsure whether their click actually did anything, and often click again, sometimes causing the action to happen twice.",
        ],
        fact: "Visual hierarchy — making the most important element on a screen the biggest, boldest, or highest-contrast one — works because people scan a screen before they read it in detail, so the design itself should guide their eyes to what matters most first.",
        quiz: [
          q(
            "Why does consistency matter in interface design?",
            [
              "It doesn't matter",
              "It lets users build one reliable mental model instead of relearning each screen",
              "It only matters for color schemes",
              "Consistency slows down development",
            ],
            1,
          ),
          q(
            "What problem does 'feedback' (like a spinner or confirmation message) solve?",
            [
              "It makes the app slower on purpose",
              "It confirms an action was received, so users aren't left unsure if their click worked",
              "It's purely decorative",
              "It replaces the need for a UI entirely",
            ],
            1,
          ),
          q(
            "What is 'visual hierarchy'?",
            [
              "Alphabetizing menu items",
              "Making the most important element the biggest/boldest to guide the eye first",
              "A type of database structure",
              "Sorting colors by hue",
            ],
            1,
          ),
        ],
      },
      {
        title: "Wireframing Before You Design",
        minutes: 7,
        paragraphs: [
          "A wireframe is a rough, low-fidelity sketch of a screen's layout — boxes and labels showing roughly where a header, a list, or a button will go, deliberately without colors, fonts, or polished visuals. The point is to validate the structure and flow of a screen cheaply, before investing time into a fully designed, pixel-perfect version.",
          "Because a wireframe is quick and rough by design, it's cheap to throw away and redo if it turns out the layout doesn't work — a five-minute sketch getting rejected costs almost nothing, while a two-day fully polished design getting rejected for the same structural reason is a much bigger loss.",
        ],
        fact: 'Wireframes get their name from a similar concept in 3D computer graphics — a "wireframe model" shows an object\'s basic edges and structure with no surface color or texture applied yet, exactly the same idea applied to interface layout.',
        quiz: [
          q(
            "What is a wireframe?",
            [
              "A fully polished, final design",
              "A rough, low-fidelity sketch showing a screen's structure and layout",
              "A type of programming language",
              "A marketing document",
            ],
            1,
          ),
          q(
            "Why deliberately leave out colors and polished visuals from a wireframe?",
            [
              "It's impossible to add them at that stage",
              "To keep the focus on validating layout and flow cheaply, before investing more time",
              "Wireframes are only used after the final design",
              "Colors always confuse designers",
            ],
            1,
          ),
          q(
            "What's the main benefit of catching a structural problem at the wireframe stage instead of after a full design?",
            [
              "There's no benefit",
              "It's far cheaper to change a rough sketch than a fully polished design",
              "Wireframes can't have structural problems",
              "Full designs are always correct",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Cybersecurity Basics",
    level: "Beginner",
    color: "#C62828",
    order: 22,
    about:
      "Understanding common attacks and defenses helps you build safer software and avoid becoming an easy target yourself. This course covers passwords and authentication, recognizing phishing, and everyday security habits worth building as a developer.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "Passwords and Authentication",
        minutes: 7,
        paragraphs: [
          "A weak or reused password is one of the most common ways accounts get broken into — if one site you use gets breached and your password leaks, an attacker will try that same email/password pair on lots of other sites, a technique called credential stuffing. A password manager solves this by generating and remembering a long, unique, random password for every single site, so you only need to remember one master password.",
          "Two-factor authentication (2FA) adds a second proof of identity beyond just a password — usually a time-limited code from an app on your phone, or a physical security key. Even if an attacker steals your password, they still can't log in without also having that second factor, which is why enabling 2FA on important accounts matters so much.",
        ],
        fact: "Credential stuffing attacks are possible at massive scale because so many people reuse the same password across multiple sites — a single leaked database from one breached, unrelated website can be used to try logging into millions of accounts on completely different services.",
        quiz: [
          q(
            "What is 'credential stuffing'?",
            [
              "A way to strengthen passwords",
              "Trying a leaked email/password pair across many other sites, hoping it was reused",
              "A type of encryption",
              "A password manager feature",
            ],
            1,
          ),
          q(
            "What problem does a password manager solve?",
            [
              "It makes websites load faster",
              "It generates and remembers a unique strong password per site so you don't have to reuse one",
              "It removes the need for any password at all",
              "It only works for email accounts",
            ],
            1,
          ),
          q(
            "What does two-factor authentication (2FA) add?",
            [
              "A second, different proof of identity beyond just the password",
              "A second password identical to the first",
              "Nothing extra, it's just a longer password",
              "A requirement to change your password weekly",
            ],
            0,
          ),
        ],
      },
      {
        title: "Recognizing Phishing and Social Engineering",
        minutes: 7,
        paragraphs: [
          "Phishing is a fake message — usually email — designed to trick you into revealing sensitive information or clicking a malicious link, often by impersonating someone trustworthy like your bank, your employer's IT department, or a well-known company. Social engineering is the broader term for manipulating people (rather than hacking a system directly) into giving up access or information.",
          "Common red flags include urgent or threatening language pushing you to act immediately without thinking, a sender address that looks almost-but-not-quite right, and a link whose actual destination (visible by hovering over it) doesn't match what the message claims. When in doubt, it's far safer to navigate to a company's site directly yourself, rather than clicking a link in an unexpected message.",
        ],
        fact: 'Phishing gets its name from "fishing", with the ph- spelling borrowed from earlier hacker slang like "phreaking" (phone hacking) — the metaphor being that attackers cast out bait messages hoping someone bites.',
        quiz: [
          q(
            "What is phishing?",
            [
              "A type of firewall",
              "A fake message designed to trick you into revealing information or clicking a malicious link",
              "A password strength checker",
              "A method of encrypting files",
            ],
            1,
          ),
          q(
            "What's a common red flag of a phishing message?",
            [
              "A calm, no-rush tone",
              "Urgent language pressuring you to act immediately",
              "A sender you've emailed for years about routine topics",
              "Correct spelling throughout",
            ],
            1,
          ),
          q(
            "What's the safer alternative to clicking a link in an unexpected, suspicious message?",
            [
              "Clicking it quickly before it expires",
              "Navigating to the company's site directly yourself instead",
              "Replying to ask if it's real",
              "Forwarding it to friends first",
            ],
            1,
          ),
        ],
      },
      {
        title: "Everyday Security Habits for Developers",
        minutes: 7,
        paragraphs: [
          "Never commit secrets — API keys, database passwords, tokens — directly into your code or a public repository. Once something is pushed to a public Git history, it can be considered compromised even if you delete it in a later commit, since the old commit (and the secret inside it) is often still reachable in the repository's history. Use environment variables or a dedicated secrets manager instead.",
          "Keep your project's dependencies up to date — a huge share of real-world breaches exploit known, already-patched vulnerabilities in outdated libraries that nobody got around to updating. And always use HTTPS rather than plain HTTP for anything handling sensitive data, since HTTPS encrypts traffic in transit, while plain HTTP sends it as readable plain text anyone on the same network could intercept.",
        ],
        fact: "Even deleting a secret in a later Git commit doesn't remove it from the repository's history — the old commit still exists and is reachable, which is why a leaked API key should always be rotated (replaced with a new one) immediately, not just \"removed\" from the latest code.",
        quiz: [
          q(
            "Why is committing a secret like an API key to a public Git repository risky, even if you delete it in a later commit?",
            [
              "It isn't risky, deleting fixes it",
              "The old commit containing the secret is often still reachable in the repository's history",
              "Git automatically encrypts all commits",
              "Public repositories can't be searched",
            ],
            1,
          ),
          q(
            "Why does keeping dependencies up to date matter for security?",
            [
              "It doesn't affect security",
              "Many real-world breaches exploit known vulnerabilities in outdated, unpatched libraries",
              "Updates always add new security features only",
              "Old libraries are always safer",
            ],
            1,
          ),
          q(
            "Why is HTTPS preferred over plain HTTP for sensitive data?",
            [
              "HTTPS is just a faster protocol",
              "HTTPS encrypts traffic in transit; HTTP sends it as readable plain text",
              "There's no real difference",
              "HTTP doesn't work for web pages at all",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Agile & Scrum Fundamentals",
    level: "Beginner",
    color: "#FFB300",
    order: 23,
    about:
      "Agile and Scrum are how most modern software teams plan and ship work in short, adaptable cycles instead of one long rigid plan made upfront. This course covers the Agile mindset, Scrum's core roles, and how a sprint actually runs from start to finish.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "The Agile Mindset",
        minutes: 6,
        paragraphs: [
          'Traditional "waterfall" project planning tries to define every requirement upfront, then build the whole thing in one long stretch before showing it to anyone — which works poorly when requirements change partway through, as they very often do. Agile instead delivers working software in short, repeated cycles, getting real feedback early and often, and adjusting the plan as you learn more.',
          "This shows up directly in the Agile Manifesto's values, like valuing \"responding to change over following a rigid plan\" — not that planning is bad, but that a plan should flex as reality teaches you things the original plan couldn't have known. Shipping a smaller, working piece of a product sooner and learning from it beats spending months building the whole thing blind.",
        ],
        fact: "The Agile Manifesto was written in 2001 by seventeen software developers meeting at a ski resort in Utah, distilling values they'd each separately arrived at from years of frustration with traditional, rigid project planning.",
        quiz: [
          q(
            "What's a key drawback of traditional 'waterfall' planning that Agile addresses?",
            [
              "It's too fast",
              "It defines everything upfront, which handles changing requirements poorly",
              "It has no drawbacks",
              "It only applies to hardware projects",
            ],
            1,
          ),
          q(
            "What does 'responding to change over following a rigid plan' mean?",
            [
              "Never plan anything at all",
              "A plan should adapt as you learn more, rather than being followed rigidly no matter what",
              "Planning is forbidden in Agile",
              "Change requests should always be rejected",
            ],
            1,
          ),
          q(
            "What is a core idea behind delivering software in short, repeated cycles?",
            [
              "To make the project take longer on purpose",
              "To get real feedback early and adjust, instead of building the whole thing blind",
              "To avoid ever talking to users",
              "To skip testing entirely",
            ],
            1,
          ),
        ],
      },
      {
        title: "Scrum Roles: Product Owner, Scrum Master, Team",
        minutes: 7,
        paragraphs: [
          "Scrum is one specific, popular framework for putting Agile ideas into practice, built around three core roles. The Product Owner represents what the business and users actually need — deciding what gets built and in what priority order, owning a prioritized list of work called the backlog.",
          "The Scrum Master isn't a traditional manager — their job is to help the team follow the Scrum process smoothly and remove obstacles blocking progress, not to assign individual tasks. The Development Team is everyone actually building the product, self-organizing to decide how best to get the chosen work done within each cycle.",
        ],
        fact: "Despite the name, a Scrum Master has no formal authority to assign work to the team — their role is closer to a facilitator or coach protecting the team's process than to a traditional project manager giving out orders.",
        quiz: [
          q(
            "What does the Product Owner primarily decide?",
            [
              "How the code is written line by line",
              "What gets built and in what priority order",
              "The team's salaries",
              "Which programming language to use",
            ],
            1,
          ),
          q(
            "What is the Scrum Master's main job?",
            [
              "Assigning individual tasks like a traditional manager",
              "Helping the team follow the process smoothly and removing obstacles",
              "Writing all the code personally",
              "Approving the company's budget",
            ],
            1,
          ),
          q(
            "Who decides how the chosen work actually gets done within a cycle?",
            [
              "Only the Product Owner",
              "The self-organizing Development Team",
              "An outside consultant",
              "It's decided randomly",
            ],
            1,
          ),
        ],
      },
      {
        title: "How a Sprint Works",
        minutes: 8,
        paragraphs: [
          "A sprint is a fixed, short time period — commonly two weeks — during which the team builds a chosen slice of work. It starts with sprint planning, where the team picks items from the backlog they believe they can realistically complete, and ends with a demo of whatever got finished, called the sprint review.",
          "Each day during the sprint, the team holds a short daily standup — typically 15 minutes — where everyone briefly shares what they did yesterday, what they're doing today, and anything blocking them, keeping the whole team in sync without a long meeting. After the sprint review, the team holds a retrospective: a dedicated conversation about what went well and what to improve for the next sprint.",
        ],
        fact: "The daily standup gets its name from teams literally standing up during the meeting — a small deliberate discomfort meant to naturally keep the meeting short, since standing for a long meeting gets uncomfortable fast.",
        quiz: [
          q(
            "What happens during sprint planning?",
            [
              "The team demos finished work",
              "The team picks backlog items they believe they can realistically complete during the sprint",
              "The team is assigned salaries",
              "The sprint is cancelled",
            ],
            1,
          ),
          q(
            "What is the daily standup meant to keep short?",
            [
              "The sprint length",
              "A brief daily sync on progress and blockers, typically around 15 minutes",
              "The entire project timeline",
              "Code review time",
            ],
            1,
          ),
          q(
            "What is a sprint retrospective for?",
            [
              "Demoing new features to stakeholders",
              "Reflecting on what went well and what to improve for the next sprint",
              "Assigning the next sprint's tasks",
              "Deleting old code",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

COURSES.push(
  course({
    title: "Linux Fundamentals",
    level: "Intermediate",
    color: "#E95420",
    order: 24,
    about:
      "Linux runs the vast majority of the world's servers, so knowing your way around it is a core skill for backend and DevOps work alike. This course covers the filesystem hierarchy, file permissions and ownership, and managing running processes and installed packages.",
    unitTitle: "Fundamentals",
    lessons: mkLessons("Fundamentals", [
      {
        title: "The Linux Filesystem Hierarchy",
        minutes: 7,
        paragraphs: [
          "Unlike Windows, which has a separate drive letter per disk (C:, D:...), Linux organizes everything under one single root, written `/`. Every file and folder on the system, no matter which physical disk it actually lives on, fits somewhere underneath that one root.",
          "A few key folders show up in nearly every Linux system: `/home` holds each user's personal files, `/etc` holds system-wide configuration files, and `/var` holds data that changes often, like logs. On Linux, almost everything is treated as a file, even things you might not expect — a connected device often shows up as a file too, which is part of what makes the system so consistent to work with.",
        ],
        fact: 'The "everything is a file" philosophy traces back to the original Unix operating system from the early 1970s, and Linux, built decades later as a Unix-inspired system, deliberately carried that same design idea forward.',
        quiz: [
          q(
            "How does Linux's filesystem structure differ from Windows' drive-letter system?",
            [
              "They're identical",
              "Linux organizes everything under one single root (/), regardless of physical disk",
              "Linux has no filesystem structure",
              "Windows also uses a single root by default",
            ],
            1,
          ),
          q(
            "What does the /home folder typically contain?",
            [
              "System-wide configuration files",
              "Each user's personal files",
              "Log files only",
              "Installed programs only",
            ],
            1,
          ),
          q(
            "What does the 'everything is a file' philosophy mean in Linux?",
            [
              "Only text documents count as files",
              "Even things like connected devices are represented and accessed as files",
              "It's a marketing slogan with no real meaning",
              "Only .txt files are supported",
            ],
            1,
          ),
        ],
      },
      {
        title: "File Permissions and Ownership",
        minutes: 8,
        paragraphs: [
          "Every file on Linux has an owner (a specific user) and a group, plus a separate set of permissions for the owner, the group, and everyone else. Running `ls -l` shows this as a string like `-rwxr-xr--`: r (read), w (write), and x (execute), repeated three times for owner, group, and others respectively.",
          "`chmod` changes a file's permissions — `chmod 755 script.sh` sets owner to read/write/execute (7), and group plus others to read/execute only (5 each), using a numeric shorthand where read=4, write=2, execute=1, added together. `chown` changes who owns a file: `chown ada file.txt` makes the user `ada` the new owner.",
        ],
        fact: "In the numeric chmod shorthand, each digit is a sum: 7 (rwx) = 4+2+1, 5 (r-x) = 4+0+1, 6 (rw-) = 4+2+0 — memorizing just those few sums is enough to construct almost any permission combination you'll ever need.",
        quiz: [
          q(
            "What does the permission string -rwxr-xr-- represent, reading left to right after the first character?",
            [
              "Three unrelated random flags",
              "Permissions for owner, group, and others, in that order",
              "Only the file's size",
              "The file's creation date",
            ],
            1,
          ),
          q(
            "What does chmod 755 grant to the group and others?",
            [
              "Full read/write/execute access, same as owner",
              "Read and execute access only, no write",
              "No access at all",
              "Write access only",
            ],
            1,
          ),
          q(
            "What does chown do?",
            [
              "Changes a file's permissions",
              "Changes a file's owner",
              "Deletes a file",
              "Compresses a file",
            ],
            1,
          ),
        ],
      },
      {
        title: "Processes and Package Management",
        minutes: 8,
        paragraphs: [
          "Every running program on Linux is a process, and `ps` lists the ones currently running, while `top` (or the more modern `htop`) shows them updating live, along with how much CPU and memory each is using. If a process is stuck or misbehaving, `kill <pid>` sends it a signal asking it to stop, using the process ID number you'd find from `ps` or `top`.",
          "Rather than downloading and installing software manually, most Linux distributions use a package manager to handle installing, updating, and removing software along with its dependencies automatically. Debian-based systems (like Ubuntu) use `apt`, so `apt install nginx` installs the nginx web server plus anything it needs, while Red Hat-based systems typically use `yum` or the newer `dnf` instead.",
        ],
        fact: 'The `kill` command\'s name is a bit misleading — by default it sends a polite "please terminate gracefully" signal (SIGTERM) that a program can still choose to handle and clean up after; `kill -9` sends a much more forceful signal (SIGKILL) that a process cannot ignore or catch at all.',
        quiz: [
          q(
            "What does the `ps` command show?",
            [
              "A list of installed packages",
              "A list of currently running processes",
              "The filesystem hierarchy",
              "Network connections only",
            ],
            1,
          ),
          q(
            "What is a package manager like apt used for?",
            [
              "Managing user permissions",
              "Installing, updating and removing software along with its dependencies",
              "Writing new code",
              "Formatting hard drives",
            ],
            1,
          ),
          q(
            "What's the difference between a normal kill command and kill -9?",
            [
              "No difference",
              "Plain kill asks a process to terminate gracefully; kill -9 forces immediate termination it can't ignore",
              "kill -9 is gentler",
              "kill only works on files, not processes",
            ],
            1,
          ),
        ],
      },
    ]),
  }),
);

// ---------------------------------------------------------------------------
// 15 learning paths, grouping the new courses with the existing catalog.
// Looked up by title (rather than hardcoding generated ids) so this stays
// correct regardless of the uid() values COURSES ended up with above.
const byTitle = Object.fromEntries(COURSES.map((c) => [c.title, c.id]));
const NEW = {
  TS: byTitle["TypeScript"],
  SQL: byTitle["SQL & Databases"],
  JAVA: byTitle["Java"],
  CPP: byTitle["C++"],
  PHP: byTitle["PHP"],
  DSA: byTitle["Data Structures & Algorithms"],
  REACT: byTitle["React"],
  NODE: byTitle["Node.js"],
  TAILWIND: byTitle["Tailwind CSS"],
  CLI: byTitle["Command Line Basics"],
  DOCKER: byTitle["Docker"],
  REST: byTitle["RESTful APIs"],
  TESTING: byTitle["Software Testing & Debugging"],
  EXCEL: byTitle["Microsoft Excel"],
  PPT: byTitle["Microsoft PowerPoint"],
  ML: byTitle["Introduction to Machine Learning"],
  UIUX: byTitle["UI/UX Design Fundamentals"],
  CYBER: byTitle["Cybersecurity Basics"],
  AGILE: byTitle["Agile & Scrum Fundamentals"],
  LINUX: byTitle["Linux Fundamentals"],
};

function path(label, level, courseIds) {
  return { id: uid("path"), label, level, courseIds };
}

const PATHS = [
  path("Frontend Web Developer", "Beginner", [
    EXISTING.ESSENTIAL,
    EXISTING.VSCODE,
    EXISTING.HTML,
    EXISTING.CSS,
    EXISTING.JS,
    NEW.TAILWIND,
  ]),
  path("Frontend Engineer (React & TypeScript)", "Intermediate", [
    EXISTING.HTML,
    EXISTING.CSS,
    EXISTING.JS,
    NEW.TS,
    NEW.TAILWIND,
    NEW.REACT,
  ]),
  path("Full-Stack JavaScript Developer", "Intermediate", [
    EXISTING.HTML,
    EXISTING.CSS,
    EXISTING.JS,
    NEW.NODE,
    NEW.SQL,
    NEW.REST,
    NEW.REACT,
  ]),
  path("Backend Developer", "Intermediate", [
    EXISTING.JS,
    NEW.NODE,
    NEW.SQL,
    NEW.REST,
    NEW.DOCKER,
  ]),
  path("Python Developer", "Beginner", [
    EXISTING.ESSENTIAL,
    EXISTING.PYTHON,
    NEW.SQL,
    NEW.DSA,
  ]),
  path("Java Developer", "Intermediate", [
    EXISTING.ESSENTIAL,
    NEW.JAVA,
    NEW.DSA,
    NEW.SQL,
  ]),
  path("C++ & Systems Programming", "Advanced", [
    EXISTING.ESSENTIAL,
    NEW.CLI,
    NEW.CPP,
    NEW.DSA,
    NEW.LINUX,
  ]),
  path("PHP Web Developer", "Beginner", [
    EXISTING.HTML,
    EXISTING.CSS,
    NEW.PHP,
    NEW.SQL,
  ]),
  path("DevOps Fundamentals", "Intermediate", [
    NEW.CLI,
    EXISTING.GIT,
    NEW.LINUX,
    NEW.DOCKER,
    NEW.REST,
  ]),
  path("Software Delivery & Agile Teams", "Intermediate", [
    EXISTING.GIT,
    NEW.TESTING,
    NEW.AGILE,
    NEW.REST,
  ]),
  path("UI/UX Designer", "Beginner", [
    NEW.UIUX,
    EXISTING.HTML,
    EXISTING.CSS,
    NEW.TAILWIND,
  ]),
  path("Data & Analytics Foundations", "Beginner", [
    NEW.EXCEL,
    NEW.SQL,
    NEW.DSA,
  ]),
  path("Machine Learning Foundations", "Advanced", [
    EXISTING.PYTHON,
    NEW.SQL,
    NEW.DSA,
    NEW.ML,
  ]),
  path("Cybersecurity Fundamentals", "Beginner", [
    EXISTING.ESSENTIAL,
    NEW.CLI,
    NEW.LINUX,
    NEW.CYBER,
  ]),
  path("Digital Office Skills", "Beginner", [
    EXISTING.WORD,
    NEW.EXCEL,
    NEW.PPT,
  ]),
];

// ---------------------------------------------------------------------------
async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `POST ${path} failed (${res.status}): ${data?.error || "unknown error"}`,
    );
  }
  return data;
}

async function main() {
  console.log(`Seeding against ${API} ...`);

  console.log(`\nCreating ${COURSES.length} courses...`);
  for (const c of COURSES) {
    await post("/api/courses", c);
    console.log(`  + ${c.title} (${c.id})`);
  }

  console.log(`\nCreating ${PATHS.length} paths...`);
  for (const p of PATHS) {
    await post("/api/paths", p);
    console.log(`  + ${p.label} (${p.courseIds.length} courses)`);
  }

  console.log("\nDone.");
}

// Guarded so this module can be imported (e.g. to validate COURSES/PATHS)
// without triggering the actual API calls — only running main() when this
// file is executed directly.
import { fileURLToPath } from "node:url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error("\nSeeding failed:", err.message);
    process.exit(1);
  });
}

export { COURSES, PATHS, EXISTING, NEW, course, mkLessons, q, uid, API };
