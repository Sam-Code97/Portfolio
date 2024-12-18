const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3')
const connectSqlite3 = require('connect-sqlite3')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const port = 8000 // defines the port
const app = express() // creates the Express application
const db = new sqlite3.Database('portfolio.db')

const helpers = {
  if_eq: function(a, b, opts) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  },
  eq: function(a, b, options) {
    return a === b ? options.fn(this) : '';
  },
};

const hbs = engine({
  helpers: helpers,
});
app.engine('handlebars', hbs); // defines handlebars engine
app.set('view engine', 'handlebars'); // defines the view engine to be handlebars
app.set('views', './views'); // defines the views directory

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))
//app.use(cookieParser())

//store sessions in the database
const SQLiteStore = connectSqlite3(session)
//define the session
app.use(session({
  store: new SQLiteStore({db: session-db.db}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "m3@5y%s1&u!p43#er=s!32e¤c2r6e/t"
}))




db.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptechdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL, github TEXT NOT NULL)", (error) => {
  if (error) {
  // tests error: display error
  console.log("ERROR: ", error)
  } 
  else {
    // tests error: no error, the table has been created
    console.log("---> Table projects created!")

    const projects=[
      { "id":"1", "name":"Advanced Snake Game", "type":"C++", "desc": "Dive into a classic snake game with a twist! Implemented in C++ using the Qt framework, this game not only offers the traditional snake gameplay but also boasts an advanced pathfinding algorithm, ensuring a challenging and engaging experience.", "year": 2022, "dev":"C++ and Qt framework", 
      "techdesc" : "The Snake Game project is a C++ application that utilizes the Qt framework for its GUI components. The game logic is encapsulated within various classes, including MainWindow, which handles the game's main interface and user interactions. The game's rendering is managed by the Drawing class, which interfaces with the IDrawingParent to handle pixel-level manipulations. Recursive algorithms are employed for specific game functionalities, as seen in the recursiveFill method. The project is structured with a clear separation of concerns, making it modular and maintainable.",
      "url":"/img/snake.png", "github":"https://github.com/Sam-Code97/snakeGame"},
      { "id":"2", "name":"BedTime iOS App", "desc": "Discover BedTime, a mobile . BedTime empowers parents to create custom children's stories tailored to teach lessons such as kindness and honesty, using the power of ChatGPT. This app is developed in collaboration with my colleague Omer Ammo", "year": 2023, "type":"Swift", 
        "techdesc" : "BedTime is built using SwiftUI, leveraging modern app development practices to deliver a clean and intuitive user experience. The app is structured with a clear MVVM architecture, ensuring modular and maintainable code. Core functionalities include: Custom Story Creation: Powered by the OpenAI API, enabling personalized story generation. UI Development: Designed in SwiftUI based on Figma prototypes, with smooth navigation using NavigationStack. Networking Integration: Supports fetching and parsing JSON data from external APIs. Unit Testing: Includes robust unit tests for Models, ViewModels, and networking layers to ensure reliability.",
        "url":"/img/bedtime.png" , "github":"https://github.com/JuIOS2024-bed-Time/BedTime"},
      { "id":"3", "name":"Paint App", "type":"C++", "desc": "Dive into a world of creativity with this simple painting application. Harnessing intricate algorithms, this app offers boundary-fill, flood-fill, and scan-line fill techniques to bring your artistic visions to life.", "year": 2022, 
      "techdesc" : "The Paint_App is a comprehensive painting application developed in C++. It leverages advanced algorithms for features like recursive and non-recursive filling.The core functionalities are encapsulated within classes such as Drawing and MainWindow, ensuring modularity and maintainability. The application uses Qt for its GUI, providing a seamless user experience. Notably, the fill algorithms, both recursive and non-recursive (using stacks and FIFOs), are implemented in the studentfill1.cpp and studentfill2.cpp files. The main interactions and GUI updates are managed in the mainwindow.cpp and drawing.cpp files.",
      "url":"/img/paint.png", "github":"https://github.com/Sam-Code97/Paint_App" },
      { "id":"4", "name":"FlexiCharge Project", "desc": "Explore an innovative mock-system for electric car users, developed in collaboration with Knowit as part of an educational project. As a developer in the cross-platform app team, I contributed to building a user-friendly app for electric vehicle users, focusing on essential features like mapping, geolocation, and charging functionality.", "year": 2024, "type":"Flutter", 
        "techdesc" : "This mock-system app leverages Flutter to deliver a unified experience across Android and iOS platforms. Its architecture ensures maintainability and scalability. Key contributions include the integration of the Google Maps API and the development of the main screen and map UI. I also implemented a charging system with an intuitive interface for entering codes and displaying nearby stations, alongside refining the model architecture for cleaner data handling.",
        "url":"/img/flexicharge.png" , "github":"https://github.com/Sam-Code97/"},
      {
        "id": "5",
        "name": "Weather App iOS",
        "desc": "Stay ahead of the weather with the Weather App for iOS. This app provides real-time weather updates as well as a 7-day forecast, all at your fingertips. It's designed to offer a seamless and informative weather tracking experience for users worldwide.",
        "year": 2024,
        "type": "iOS",
        "techdesc": "The Weather App iOS is developed using SwiftUI for a modern and efficient user interface, ensuring a smooth and responsive experience. It utilizes CoreLocation for accurate location tracking and fetching weather data relevant to the user's current location. The app integrates with the Open-Meteo API to provide current weather conditions, daily forecasts, and more. It features a clean and intuitive design, with support for widgets to quickly view weather updates from the home screen. The app's architecture is designed for scalability and maintainability, with a focus on clean code practices.",
        "url": "/img/weather.jpg",
        "github": "https://github.com/Sam-Code97/Weather-App-IOS"
      },
      { "id":"6", "name":"This Portfolio", "desc": "This is a personal portfolio website designed to showcase my projects and skills in a professional and visually appealing manner. The portfolio includes an interactive and user-friendly interface to engage visitors and effectively highlight my work as a developer.", "year": 2023, "type":"JavaScript/Handlebars", 
        "techdesc" : "This portfolio is developed using Node.js, Express.js, and Handlebars, with a focus on maintainability and scalability. It features a responsive CSS design to ensure an optimized experience across devices and uses SQLite for reliable data storage. The site includes a project showcase with detailed descriptions, a blog section for sharing updates, and user authentication for creating articles and writing comments. Admin tools allow for managing projects and posts dynamically, while custom error handling enhances usability. Its modular structure ensures smooth navigation and future scalability.",
        "url":"/img/portfolioImg.jpg" , "github":"https://github.com/Sam-Code97/Portfolio"},
  
      { "id":"7", "name":"Webstore Database", "desc": "Manage your online store efficiently with the Webstore Database, a structured SQL schema for product and order management.", "year": 2022, "type":"SQL", 
        "techdesc" : "The Webstore Database is an SQL-based schema designed for e-commerce platforms. It includes tables for customers, orders, products, sellers, and more, with intricate relationships and constraints to ensure data integrity. The schema supports complex queries for transactions, inventory management, and customer interactions. It is built with triggers for dynamic updates and is optimized for performance with proper indexing.",
        "url":"/img/webstore.png" , "github":"https://github.com/Sam-Code97/Webstore-Database"},
      {
        "id": "8",
        "name": "Ludo Game Android App",
        "desc": "Dive into the classic board game experience with the Ludo Game Android App. Developed as a collaborative project by me and my colleague Ahmednur (Link in Github), this app brings the fun of Ludo to your Android device, allowing for engaging gameplay with beautiful, modern UI.",
        "year": 2023,
        "type": "Kotlin",
        "techdesc": "The Ludo Game Android App is crafted using Kotlin, targeting the Android SDK with a minimum API level of 28 and aiming for API level 34. It features the use of AndroidX libraries and Jetpack Compose for UI development, ensuring a sleek and responsive user interface. The app integrates Navigation Component for smooth navigation.  A key feature is the integration of Supabase as the server backend, making online multiplayer gameplay possible and seamless. It is built with Gradle using Kotlin DSL for script writing, and it adopts Material Design 3 for a contemporary look and feel. The architecture promotes a clean codebase with a focus on maintainability and scalability.",
        "url": "/img/ludo.jpg",
        "github": "https://github.com/Sam-Code97/Ludo-Game--Android-"
      },
      { "id":"9", "name":"Notes Android App", "desc": "Organize your thoughts and tasks with the Notes Android App – a sleek, user-friendly mobile application for note-taking on the go.", "year": 2023, "type":"Kotlin", 
        "techdesc" : "The Notes Android App is developed in Kotlin, leveraging the Android SDK with a minimum API level of 28 and targeting API level 34. It utilizes AndroidX libraries, including Compose for UI, and integrates Navigation Component for seamless screen transitions. The app is built using Gradle with Kotlin DSL for script writing, and it employs Material Design 3 for a modern aesthetic. The architecture is modular, with clear separation of concerns for maintainability.",
        "url":"/img/noteapp.png" , "github":"https://github.com/Sam-Code97/Notes-Android-App"},
      { "id":"10", "name":"Calculation Algorithm", "type":"C++", "desc": "A sophisticated calculator algorithm developed in C++, showcasing a robust parsing mechanism to evaluate mathematical expressions. The project is designed with a clear focus on tokenization and operator precedence.", "year": 2022, 
      "techdesc" : "The Calculation_Algorithm is a C++ application designed to parse and evaluate mathematical expressions. It employs a token-based approach, as defined in the token.h file, to break down input strings into manageable units. The core algorithm, found in student6_calculator.cpp, uses stacks to handle values and operators, ensuring accurate evaluation of infix expressions. The application also incorporates a GUI, developed using the Qt framework, to provide a user-friendly interface for input and results.",
      "url":"/img/calculator.png", "github":"https://github.com/Sam-Code97/Calculation_Algorithm" },
      { "id":"11", "name":"BetterTicTacToe", "desc": "An enhanced version of the classic Tic Tac Toe game, developed in Java. The project showcases a strong Object-Oriented Design, with distinct classes representing game components, rules, and user interactions.", "year": 2023, "type":"Java", 
      "techdesc" : "BetterTicTacToe is a Java-based implementation of the Tic Tac Toe game, this project employs object-oriented principles to structure its game engine. It features an interface GameRules to define core game functionalities, with separate classes for different game rules like TicTacToeRules and ConnectFourRules. The game logic is managed by the GameEngine class, while the Controller class bridges the game logic and the user interface, implemented using Java Swing in the View class.",
      "url":"/img/tictactoe.png" , "github":"https://github.com/Sam-Code97/BetterTicTacToe"},
      { "id":"12", "name":"Simple Notepad", "desc": "A lightweight notepad application developed in C++ using the Qt framework. It offers essential features like opening, saving, and clearing text files, all wrapped in a user-friendly graphical interface.", "year": 2022, "type":"C++", 
      "techdesc" : "Simple_Notepad is developed in C++ with the Qt framework, this application provides a basic notepad functionality. The core logic is encapsulated within the SamMainWindow class, which manages user interactions like opening, saving, and clearing text files. The GUI, defined in sammainwindow.ui, offers a text edit area and essential menu options. The application's entry point is the main.cpp file, initializing the main window and executing the application loop.",
      "url":"/img/notepad.png" , "github":"https://github.com/Sam-Code97/Simple_Notepad"},
      { "id":"13", "name":"Encryption Tool", "desc": "Enhance your understanding of classic cryptography with the Encryption Tool, a Java application for Caesar cipher encryption and decryption.", "year": 2023, "type":"Java", 
      "techdesc" : "EncryptionTool: Developed in Java, this tool provides basic encryption and decryption functionalities. The core logic resides in the EncryptionEngine class, which employs a Caesar cipher-like approach, shifting characters based on a user-defined key. The Controller class manages the interaction between the user interface and the encryption engine. The GUI, defined in the View class, captures user inputs and displays results. Additionally, the project includes unit tests for the encryption engine in the EncryptionEngineTest class.",
      "url":"/img/encryp.png" , "github":"https://github.com/Sam-Code97/EncryptionTool"},
      
    ]

    // inserts projects
    projects.forEach( (oneProject) => {
      db.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptechdesc, ptype, pimgURL, github) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.name, 
      oneProject.year, oneProject.desc, oneProject.techdesc, oneProject.type, oneProject.url, oneProject.github], (error) => {
        if (error) {
        console.log("ERROR: ", error)
        } 
        else {
        console.log("Line added into the projects table!")
        }
      })
    })
  }
})

db.run("CREATE TABLE users (uid INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL)", (error) => {
  if (error) {
  console.log("ERROR: ", error)
  } 
  else {
    console.log("---> Table users created!")
    const users = [
      {"id":"1", "username":"sam", "password":"$2b$10$4M5cx6sDKrMJbfaKx1Jr8eQoBP1DL537xs8ANpCnP1UY17DMOf1.i"},
      {"id":"5", "username":"Sadio", "password":"$2b$10$6vhkGIX.kmHct035Ferf6O4aK3sSLdVNoPbsoMhNI33xoQG1HZKbW"},
      
    ]
    users.forEach( (oneUser) => {
      db.run("INSERT INTO users (uid, username, password) VALUES (?, ?, ?)", [oneUser.id, oneUser.username, oneUser.password], (error) => {
        if (error) {
        console.log("ERROR: ", error)
        } 
        else {
        console.log("Line added into the projects table!")
        }
      })
    })
  }
})

db.run("CREATE TABLE comments (cid INTEGER PRIMARY KEY, username TEXT NOT NULL, cbody TEXT NOT NULL, cdate TEXT NOT NULL)", (error) => {
  if (error) {
  console.log("ERROR: ", error)
  } 
  else {
    console.log("---> Table users created!")
    const comments = [
      {"id":"1", "username":"Admin", "body":"Hi, visitors! Please comment and let me know what you think about my work", "date" : "2023-11-15"}
    ]
    comments.forEach( (oneComment) => {
      db.run("INSERT INTO comments (cid, username, cbody, cdate) VALUES (?, ?, ?, ?)", [oneComment.id, oneComment.username, oneComment.body, oneComment.date], (error) => {
        if (error) {
        console.log("ERROR: ", error)
        } 
        else {
        console.log("Line added into the comments table!")
        }
      })
    })
  }
})



// 
db.run("CREATE TABLE blog (bid INTEGER PRIMARY KEY, bheader TEXT NOT NULL, bshortdesc TEXT NOT NULL, bsecone TEXT NOT NULL, bsectwo TEXT NOT NULL, bsecthree TEXT NOT NULL, bimgURL TEXT NOT NULL)", (error) => {
  if (error) {
  // tests error: display error
  console.log("ERROR: ", error)
  } 
  else {
    // tests error: no error, the table has been created
    console.log("---> Table blog created!")
    const blogs=[
    {"id":"1", "header": "Will AI Ever Reach 'The Singularity'?", "shortdesc": "Embark on an exploratory journey into the realms of artificial intelligence as we dissect the possibilities and implications of AI reaching 'The Singularity.' Engage in a thought-provoking exploration of theories, predictions, and the ethical landscape surrounding this transformative event. Are we on the brink of AI transcendence or is it a futuristic myth? Join us to unravel the enigma.",
     "secone": "In the dynamic sphere of artificial intelligence, the concept of 'The Singularity' stands as a pivotal point of discussion and speculation. This section offers an insightful overview into what 'The Singularity' entails, setting the stage for a comprehensive analysis of its feasibility and potential impact on humanity and technology. We delve into the theoretical foundations of this phenomenon, examining its origins, definitions, and the diverse viewpoints that shape this intriguing topic.",
      "sectwo": "Advanced Machine Learning and Neural Networks: The rapid advancements in machine learning algorithms and neural networks suggest a future where AI systems can improve themselves autonomously, a key aspect of 'The Singularity.' Quantum Computing and AI: Quantum computing's potential to exponentially increase processing power could be a catalyst for AI systems, pushing them towards unprecedented capabilities. Ethical and Societal Implications: As we inch closer to 'The Singularity,' the ethical and societal ramifications of superintelligent AI become more pronounced. This section explores the moral dilemmas and societal changes that might accompany this transformative event. Predictions and Skepticism: Experts in the field offer varied predictions about the timeline and likelihood of reaching 'The Singularity.' We present a balanced view, juxtaposing optimistic forecasts with skeptical viewpoints to provide a holistic understanding.",
      "secthree" : "Regulatory Frameworks and Policies: As we approach a potential singularity, the need for robust regulatory frameworks to govern AI development becomes crucial. This section discusses current and proposed policies aimed at ensuring safe and ethical AI progression. Educational and Workforce Implications: 'The Singularity' could redefine job landscapes and educational requirements. We explore how society might adapt to these changes, focusing on the skills and knowledge necessary to thrive in a post-singularity world. Philosophical and Existential Questions: The prospect of reaching 'The Singularity' raises profound philosophical and existential questions about the nature of consciousness, identity, and the future of humanity in an AI-dominated world. Conclusion: The journey towards 'The Singularity' is fraught with uncertainties, challenges, and opportunities. As we stand at the crossroads of a potential AI revolution, it is imperative to engage in open, informed discussions and prepare for all possibilities, shaping a future that aligns with our collective values and aspirations.",
     "imgURL": "/img/img6.png"},
    {"id":"2", "header": "The Future of Programming", "shortdesc": "Journey into the contrasting worlds of OOP and FP! Discover the philosophies, strengths, and challenges of both paradigms. Whether you're team objects or functions, this exploration promises insights and revelations. Dive in and pick your side in the age-old debate!",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
     "imgURL": "/img/img1.png"},
     {"id":"3", "header": "OOP vs. FP: A Tale of Two Paradigms", "shortdesc": "In the vast universe of programming, two paradigms have consistently sparked debates among developers: Object-Oriented Programming (OOP) and Functional Programming (FP). Both have their merits, philosophies, and use-cases. Let's dive into the core differences and see what each brings to the table.",
     "secone": "In the vast universe of programming, two paradigms have consistently sparked debates among developers: Object-Oriented Programming (OOP) and Functional Programming (FP). Both have their merits, philosophies, and use-cases. Let's dive into the core differences and see what each brings to the table. Philosophical Foundations: OOP: At its heart, OOP is about encapsulating data and behavior into objects. It's like viewing the world as a collection of interacting entities, each with its attributes and actions. FP: FP, on the other hand, is all about immutability and statelessness. It treats computation as the evaluation of mathematical functions, avoiding changing state and mutable data. Main Constructs: OOP: Classes, objects, inheritance, polymorphism, encapsulation, and abstraction. FP: First-class functions, pure functions, higher-order functions, and recursion.",
      "sectwo": "Advantages: OOP: Provides a clear modular structure for programs, making it good for defining abstract datatypes. It's also more intuitive for modeling and organizing large systems. FP: Offers better predictability and is easier to test and debug. It's inherently more parallelizable, making it apt for today's multi-core processors. Challenges: OOP: Can lead to over-complication if not designed well. The mutable state can introduce bugs that are hard to trace. FP: Has a steeper learning curve for those accustomed to imperative styles. Some tasks can be more verbose in functional languages.",
      "secthree" : "Real-world Usage: OOP: Widely used in software engineering, especially in large systems where the organization is crucial. Examples include Java, C++, and Python. FP: Gaining traction in domains like data processing, concurrency, and where side effects need to be minimized. Languages like Haskell, Lisp, and Erlang champion this paradigm. In conclusion, neither OOP nor FP is universally superior. They offer different tools for different problems. The best developers understand the strengths and weaknesses of both and use them judiciously based on the task at hand.",
     "imgURL": "/img/img2.jpg"},
     {"id":"4", "header": "Decoding the Mysteries of Recursive Functions", "shortdesc": "Ready to embark on a recursive adventure? Dive in and discover the power and beauty of functions that call upon themselves!",
     "secone": "Recursive functions are a fascinating concept in programming, often seen as a riddle waiting to be unraveled. At its essence, recursion is when a function calls itself in order to solve a larger problem by breaking it down into smaller, more manageable pieces. Think of it as a set of Russian nesting dolls, where each doll represents a function call, and opening one reveals a slightly smaller version inside. This technique is particularly useful for tasks like traversing tree structures, calculating factorials, or implementing algorithms like the Fibonacci sequence.",
      "sectwo": "While the elegance of recursive solutions can be alluring, it's essential to use them judiciously. Without proper base cases or termination conditions, recursive functions can lead to infinite loops or stack overflow errors. But, when wielded correctly, recursion can lead to clean, efficient, and intuitive code that's a joy to read and understand.",
      "secthree" : "Unearth the magic of recursive functions in programming! From elegant solutions to potential pitfalls, delve deep into this captivating concept. Whether you're a novice or a seasoned coder, this exploration promises a fresh perspective on a classic technique.",
     "imgURL": "/img/img3.jpg"},
     {"id":"5", "header": "Unveiling the Magic Behind Machine Learning Libraries", "shortdesc": "Eager to unravel the complexities of ML libraries? Join us on this enlightening journey and elevate your understanding of the frameworks that are driving the next wave of AI innovations!",
     "secone": "Step into the intricate world of Machine Learning libraries! From TensorFlow's vast ecosystem to Scikit-learn's simplicity, uncover the secrets that power today's AI marvels. Whether you're an AI enthusiast or a seasoned developer, this exploration offers a deep dive into the tools that are shaping the future of technology.",
      "sectwo": "Machine Learning (ML) has undeniably become one of the most transformative technologies of our era. But beneath the surface of impressive AI-driven applications lies a world of intricate algorithms and sophisticated libraries that power these innovations. One might wonder, what makes these libraries so special? At the heart of popular ML libraries like TensorFlow, PyTorch, and Scikit-learn is a blend of optimized mathematical operations, data manipulation tools, and a plethora of algorithms ranging from regression models to deep neural networks. These libraries provide developers with a platform to design, train, and deploy ML models without delving deep into the underlying math. For instance, TensorFlow, developed by Google, offers a flexible ecosystem of tools and community resources that lets researchers push the boundaries of current ML paradigms, while also enabling developers to easily integrate AI into their applications.",
      "secthree" : "On the other hand, Scikit-learn, known for its simplicity, provides a wide array of tools for data mining and data analysis. It's built on foundational libraries like NumPy and SciPy, ensuring efficient computations. However, while these libraries simplify the ML process, understanding their intricacies and the principles of machine learning remains crucial. It allows developers to choose the right tools, optimize performance, and troubleshoot issues effectively. In essence, while ML libraries are a gateway to the world of artificial intelligence, a deep understanding of their workings amplifies their potential, bridging the gap between theoretical concepts and groundbreaking applications.",
     "imgURL": "/img/img4.jpg"},
     {"id":"6", "header": "Demystifying the World of WebAssembly: Beyond JavaScript", "shortdesc": "Intrigued by the potential of WebAssembly? Embark on this exploratory voyage and witness firsthand the evolution of the web. Dive deep, and be part of the revolution that's reshaping the digital landscape!",
     "secone": "Venture into the groundbreaking realm of WebAssembly! Discover how this emerging technology is redefining the boundaries of web development, offering performance leaps and expanding the horizons beyond JavaScript. Whether you're a web developer or a tech aficionado, this deep dive promises to illuminate the future of browser-based applications.",
      "sectwo": "The realm of web development has long been dominated by JavaScript, the ubiquitous scripting language that powers interactivity on the web. However, as applications grow in complexity and demand more from our browsers, a new hero emerges on the horizon: WebAssembly (often abbreviated as WASM). But what exactly is WebAssembly, and why is it generating such a buzz? WebAssembly is a binary instruction format that allows code written in languages like C, C++, and Rust to run in the browser at near-native speed. It's not a replacement for JavaScript but rather a complementary tool, bringing performance optimizations and enabling the web to run languages previously confined to server-side or desktop applications. Imagine complex graphics rendering, real-time multiplayer games, or even machine learning models executing swiftly in your browser—that's the promise of WebAssembly. ",
      "secthree" : "Tools like Emscripten make it possible to compile code from supported languages into WASM, bridging the gap between traditional web development and high-performance applications. While WebAssembly is still in its nascent stages, its potential is undeniable. It promises a future where the web is not just a platform for information but a robust environment for powerful applications. However, like all technologies, it comes with its learning curve and challenges. Embracing WebAssembly requires understanding its architecture, integration points with JavaScript, and the nuances of memory management. In summary, WebAssembly is not just a new tool in the developer's toolkit; it's a paradigm shift, heralding a new era of web development where boundaries are continually pushed, and possibilities are endless.",
     "imgURL": "/img/img5.png"},
    ]
    // inserts skills
    blogs.forEach( (blog) => {
      db.run("INSERT INTO blog (bid, bheader, bshortdesc, bsecone, bsectwo, bsecthree, bimgURL) VALUES (?, ?, ?, ?, ?, ?, ?)", [blog.id, blog.header, blog.shortdesc, blog.secone, blog.sectwo, blog.secthree,  blog.imgURL], (error) => {
        if (error) {
        console.log("ERROR: ", error)
        } 
        else {
        console.log("Line added into the skills table!")
        }             
      })
    })
  }
})




app.get('/', function(req, res){
  console.log("Session: ", req.session)
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
    currentPage: 'Home'
  }
  res.render('home.handlebars', model)
})

app.get('/manage', (req, res)=>{
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.all("SELECT * FROM users", (error, theUsers)=>{
      if(error){
        console.log("Database error: ", error);
        const model={
          users: [],
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render('usermanagement.handlebars', model);
      }
      else{
        const model={
          users: theUsers,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render('usermanagement.handlebars', model);
      }
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/user/new', (req, res) => {
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('usermanagement.handlebars', model)
  }
  else{
    res.redirect('/login')
  }
});

app.post('/user/new', (req, res) => {
  const un = req.body.un;
  const pw = req.body.pw;
  const hash = bcrypt.hashSync(pw, 10);
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [un, hash], (error) => {
      if(error){
        console.log("ERROR: ", error)
      }
      else{
        console.log("Line added into the users table!")
      }
      res.redirect('/manage')
    })
  }
  else{
    res.redirect('/login')
  }
})


app.get('/user/edit/:id', (req, res) => {
  const id = req.params.id
  console.log("Update: ", id)
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.get("SELECT * FROM users WHERE uid=?", [id], (error, theUser) => {
      if(error){
        console.log("ERROR: ", error)
        const model = {
          dbError: true, theError: error,
          user: {},
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render("usermanagement.handlebars", model)
      }
      else{
        console.log("MODIFY: ", JSON.stringify(theUser))
        console.log("MODIFY: ", theUser)
        const model = {
          dbError: false, theError: "",
          user: theUser,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("usermanagement.handlebars", model)
      }
    })
  }
  else{
    res.redirect('/login')
  }
})

app.post('/user/edit/:id', (req, res) => {
const id = req.params.id
const un = req.body.un;
const pw = req.body.pw;
const hash = bcrypt.hashSync(pw, 10);

console.log("Received username:", req.body.un);
console.log("Received password:", req.body.pw);

if(req.session.isLoggedIn==true && req.session.isAdmin==true){
  db.run("UPDATE users SET username=?, password=? WHERE uid=?", [un, hash, id], (error) => {
    if(error){
      console.log("ERROR: ", error)
    }
    else{
      console.log("user updated!")
    }
    res.redirect('/manage')
  })
}
else{
  res.redirect('/login')
}
})

app.get('/user/delete/:id', (req, res) => {
  const id = req.params.id
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.run("DELETE FROM users WHERE uid=?", [id], (error, theUser) => {
      if(error){
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          user: theUser,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render("home.handlebars", model)
      }
      else{
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        console.log("user deleted")
        res.redirect('/manage')
      }
    })
  }
  else{
    res.redirect('/login')
  }
})


app.get('/projects', function(request, response){
  response.redirect('/projects/1');
})

app.get('/projects/delete/:id', (req, res) => {
  const id = req.params.id
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.run("DELETE FROM projects WHERE pid=?", [id], (error, theProjects) => {
      if(error){
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render("home.handlebars", model)
      }
      else{
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.redirect('/projects')
      }
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/projects/new', (req, res) => {
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('newproject.handlebars', model)
  }
  else{
    res.redirect('/login')
  }
});

app.post('/projects/new', (req, res) => {
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.techdesc, req.body.projtype, req.body.projimg, req.body.github
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("INSERT INTO projects (pname, pyear, pdesc, ptechdesc, ptype, pimgURL, github) VALUES (?, ?, ?, ?, ?, ?, ?)", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      }
      else{
        console.log("Line added into the projects table!")
      }
      res.redirect('/projects')
    })
  }
  else{
    res.redirect('/login')
  }
})

app.post('/projects/addcomment', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const newc = [
    req.session.name, req.body.commenttext, currentDate
  ]
  if(req.session.isLoggedIn==true){
    db.run("INSERT INTO comments (username, cbody, cdate) VALUES (?, ?, ?)", newc, (error) => {
      if(error){
        console.log("ERROR: ", error)
      }
      else{
        console.log("Line added into the comments table!")
      }
      res.redirect('/projects')
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/projects/update/:id', (req, res) => {
    const id = req.params.id
    console.log("Update: ", id)

    db.get("SELECT * FROM projects WHERE pid=?", [id], (error, theProject) => {
      if(error){
        console.log("ERROR: ", error)
        const model = {
          dbError: true, theError: error,
          project: {},
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin
        }
        res.render("modifyproject.handlebars", model)
      }
      else{
        console.log("MODIFY: ", JSON.stringify(theProject))
        console.log("MODIFY: ", theProject)
        const model = {
          dbError: false, theError: "",
          project: theProject,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          helpers: {
            theTypeR(value) { return value == "Research";},
            theTypeE(value) { return value == "Education";},
            theTypeO(value) { return value == "Other";},
          }
        }
        res.render("modifyproject.handlebars", model)
      }
    })
})

app.post('/projects/update/:id', (req, res) => {
  const id = req.params.id
  const newp = [
   req.body.projname, req.body.projyear, req.body.projdesc, req.body.techdesc, req.body.projtype, req.body.projimg, id
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptechdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      }
      else{
        console.log("Project updated!")
      }
      res.redirect('/projects')
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/projects/:page', (req, res) => {
  console.log("inside rout projects/page");
  const page = parseInt(req.params.page);
  const numberPerPage = 14;

  db.get("SELECT COUNT(*) as total FROM projects", (error, row) => {
    if(error){
      console.log("Database error: ", error);
    }
    else{
      const numberOfProjects = row.total;
      console.log("numberOfProjects: ", numberOfProjects);
      const lastPg = Math.ceil(numberOfProjects / numberPerPage);
      console.log("lastPage: ", lastPg);
      if(page > lastPg){
        res.redirect('/projects/' + lastPg);
        return;
      }
      if(page <= 0){
        res.redirect('/projects/1');
        return;
      }
      const offset = (page - 1) * numberPerPage;
      console.log("offset: ", offset);

      const currentPage1= page;
      const nextPage1 =  (page + 1 > lastPg) ? null : page + 1;
      const prevPage1 = (page - 1 <= 0) ? null : page - 1;
      console.log("currentPage: ", currentPage1);
      console.log("nextPage: ", nextPage1);
      console.log("prevPage: ", prevPage1);
      console.log("lastPage: ", lastPg);
      db.all("SELECT * FROM projects LIMIT ? OFFSET ?", [numberPerPage, offset], (error, theProjects)=>{
        if(error){
          console.log("Database error: ", error);
          return;
        }
        else{
          db.all("SELECT * FROM comments", (error, theComments) => {
            if(error){
              console.log("ERROR: ", error);
              return;
            }
            else{
              let pagesArray = [];
              for (let i = 1; i <= lastPg; i++) {
                  pagesArray.push(i);
              }

              console.log("red the comments: ", theComments);
              /*console.log("red the comments: ", stringify(theComments));*/
              const model = {
                projects: theProjects,
                comments: theComments,
                currentPage: 'projects',
                pages: pagesArray,
                nextPage: (page + 1 > lastPg) ? null : page + 1,
                prevPage: (page - 1 <= 0) ? null : page - 1,
                lastPage: lastPg,
                firstPage: 1,
                isMoreThanOnePage: lastPg > 1,
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
                projectPage: page
              };
              res.render("projects.handlebars", model);
            }
          })
        }
      })
    }
  });
});


app.get('/comment/delete/:id', (req, res)=>{
  const id = req.params.id

  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.run("DELETE FROM comments WHERE cid=?", [id], (error, theComments)=>{
      if(error){
        console.log("Database error: ", error)
        return;
      }
      else{
        const model = {
          comments: theComments,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.redirect('/projects');
      }
    })
  }
  else{
    res.redirect('/login')
  }
})




app.get('/contact', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin,
    currentPage: 'contact'
  }
  response.render("contact.handlebars", model)
})

app.get('/about', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin,
    currentPage: 'about'
  }
  response.render("about.handlebars", model)
})

app.get('/blog', function(request, response){

  db.all("SELECT * FROM blog", function(error, theBlogs){
    if(error){
      const model = {
        hasDatabaseError: true,
        theError: error,
        blog: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        isCreator: request.session.isAdmin,
        currentPage: 'blog'
      }
      // renders the page with the model
      response.render("blog.handlebars", model)
    }
    else{
      const model = {
        hasDatabaseError: false,
        theError: "",
        blog: theBlogs,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        isCreator: request.session.isAdmin,
        currentPage: 'blog'
      }
      // renders the page with the model
      response.render("blog.handlebars", model)
    }
  })
})

app.get('/blog/article/:id', (request, response) => {
  const id = request.params.id
  console.log("visiting blog: ", id)
  db.get("SELECT * FROM blog WHERE bid=?", [id], function(error, theBlogs){
    if(error){
      const model = {
        hasDatabaseError: true,
        theError: error,
        blog: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        isCreator: request.session.isAdmin
      }
      response.render("fullblog.handlebars", model)
    }
    else{
      const model = {
        hasDatabaseError: false,
        theError: "",
        blog: theBlogs,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        isCreator: request.session.isAdmin
      }
      response.render("fullblog.handlebars", model)
    }
  })
})

app.get('/blog/article/delete/:id', (req, res) => {
  const id = req.params.id
  if( req.session.isLoggedIn == true && (req.session.isAdmin == true || req.session.isCreator == true) ){
    db.run("DELETE FROM blog WHERE bid=?", [id], (error, theBlogs) => {
      if(error){
        console.log("Error Deleting")
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isCreator: req.session.isAdmin
        }
        res.redirect("blog.handlebars", model)
      }
      else{
        console.log("supposedly Deleting")
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isCreator: req.session.isAdmin
        }
        //res.render("blog.handlebars", model)
        res.redirect('/blog')
      }
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/blog/new', (req, res) => {
  if(req.session.isLoggedIn==true){
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('newblog.handlebars', model)
  }
  else{
    res.redirect('/login')
  }
});

app.post('/blog/new', (req, res) => {
  const newp = [
    req.body.blogheader, req.body.bshortdesc, req.body.bsecone, req.body.bsectwo, req.body.bsecthree, req.body.bimg
  ]
  if(req.session.isLoggedIn==true){
    db.run("INSERT INTO blog (bheader, bshortdesc, bsecone, bsectwo, bsecthree, bimgURL) VALUES (?, ?, ?, ?, ?, ?)", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      }
      else{
        console.log("Line added into the Blog table!")
      }
      res.redirect('/blog')
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/blog/article/update/:id', (req, res) => {
  const id = req.params.id
  console.log("Update: ", id)

  db.get("SELECT * FROM blog WHERE bid=?", [id], (error, theBlog) => {
    if(error){
      console.log("ERROR: ", error)
      const model = {
        dbError: true, theError: error,
        blog: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("modifyarticle.handlebars", model)
    }
    else{
      console.log("MODIFY: ", JSON.stringify(theBlog))
      console.log("MODIFY: ", theBlog)
      const model = {
        dbError: false, theError: "",
        blog: theBlog,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value) { return value == "Research";},
          theTypeE(value) { return value == "Education";},
          theTypeO(value) { return value == "Other";},
        }
      }
      res.render("modifyarticle.handlebars", model)
    }
  })
})

app.post('/blog/article/update/:id', (req, res) => {
const id = req.params.id
const newp = [
  req.body.blogheader, req.body.bshortdesc, req.body.bsecone, req.body.bsectwo, req.body.bsecthree, req.body.bimg, id
]
if(req.session.isLoggedIn==true){
  db.run("UPDATE blog SET bheader=?, bshortdesc=?, bsecone=?, bsectwo=?, bsecthree=?, bimgURL=?  WHERE bid=?", newp, (error, theBlog) => {
    if(error){
      console.log("ERROR: ", error)
    }
    else{
      console.log("Article updated!")
    }
    res.redirect('/blog')
  })
}
else{
  res.redirect('/login')
}
})


app.get('/login', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin,
    currentPage: 'login'
  }
  response.render("login.handlebars", model)
})

//check log in and password of a user
app.post('/login', function(req, res){
  const un = req.body.un
  const pw = req.body.pw
  const hash = bcrypt.hashSync(pw, 10)

  db.get("SELECT * FROM users WHERE username=?", [un], (error, user)=>{
    if(error){
      console.log("ERROR: ", error)
    }
    else if(!user){
      console.log("User Not Found!")
      res.render('login.handlebars', { errorMessage: 'Incorrect password or username' });  
    }
    
    else{
      const result = bcrypt.compareSync(pw, user.password);
      if(result){
        
        if(un=="sam"){
          console.log("Admin is logged in!")
          req.session.isAdmin = true
          req.session.isLoggedIn = true
          req.session.name = "Admin"
          res.redirect('/')
        }
        
        else{
          console.log('user found in users table')
          req.session.isAdmin = false
          req.session.isLoggedIn = true
          req.session.name = un
          res.redirect('/')
        }
      }
      else{
        console.log('Incorrect password or username');  
        res.render('login.handlebars', { errorMessage: 'Incorrect password or username' });  
      }
    }


  })
})

app.get('/logout', (req, res) => {
  req.session.destroy( (err) => {
    console.log("Error while destroying the session: ", err)
  })
  console.log("Logged out...")
  res.redirect('/')
})

app.get('/signup', function(req, res){
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
    currentPage: 'signup'
  }
  if(req.session.isLoggedIn==true)
    res.redirect('/')
  else{
    res.render("signup.handlebars", model)
  }
})

app.post('/signup', (req, res) => {
  
  const un = req.body.un;
  const pw = req.body.pw;
  const hash = bcrypt.hashSync(pw, 10)
  
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [un, hash], (error)=>{
    if(error){
      console.log("ERROR: ", error)
    }
    else{
      console.log("User is added")
      req.session.isAdmin = false
      req.session.isLoggedIn = true
      req.session.name = un
      res.redirect('/')
    }
  })
})

// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(process.env.PORT || port, () => {
    console.log(`Server on an listening on port ${port} http://localhost:${port}`)
})

