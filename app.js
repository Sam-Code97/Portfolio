const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3')
const connectSqlite3 = require('connect-sqlite3')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const port = 8080 // defines the port
const app = express() // creates the Express application
const db = new sqlite3.Database('portfolio2.db')

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// define static directory "public" to access css/ and img/
app.use(express.static('public'))

//store sessions in the database
const SQLiteStore = connectSqlite3(session)
//define the session
app.use(session({
  store: new SQLiteStore({db: session-db.db}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "m3@5y%s1&u!p43#er=s!32e¤c2r6e/t"
}))

// creates table projects at startup
db.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => {
  if (error) {
  // tests error: display error
  console.log("ERROR: ", error)
  } 
  else {
    // tests error: no error, the table has been created
    console.log("---> Table projects created!")

    const projects=[
      { "id":"1", "name":"Advanced Snake Game", "type":"Research", "desc": "Dive into a classic snake game with a twist! Implemented in C++ using the Qt framework, this game not only offers the traditional snake gameplay but also boasts an advanced pathfinding algorithm, ensuring a challenging and engaging experience.", "year": 2022, "dev":"C++ and Qt framework", 
      "url":"/img/counting.png"},
      { "id":"2", "name":"Paint App", "type":"Research", "desc": "Dive into a world of creativity with this simple painting application. Harnessing intricate algorithms, this app offers boundary-fill, flood-fill, and scan-line fill techniques to bring your artistic visions to life.", "year":
      2022, "url":"/img/medical.png" },
      { "id":"3", "name":"Calculation Algorithm", "type":"Education", "desc": "A sophisticated calculator algorithm developed in C++, showcasing a robust parsing mechanism to evaluate mathematical expressions. The project is designed with a clear focus on tokenization and operator precedence.", "year": 2022, "url":"/img/qcm07.png" },
      { "id":"4", "name":"BetterTicTacToe", "desc": "An enhanced version of the classic Tic Tac Toe game, developed in Java. The project showcases a strong Object-Oriented Design, with distinct classes representing game components, rules, and user interactions.", "year": 2023, "type":"Education", 
      "url":"/img/diaw02.png" },
      { "id":"5", "name":"Simple Notepad", "desc": "A lightweight notepad application developed in C++ using the Qt framework. It offers essential features like opening, saving, and clearing text files, all wrapped in a user-friendly graphical interface.", "year": 2022, "type":"Other", "url":"/img/management.png" },
      { "id":"6", "name":"Encryption Tool", "desc": "A robust encryption tool built in Java that offers both encryption and decryption functionalities. With a user-friendly GUI, users can easily input text and an encryption key to get the desired encrypted or decrypted output.", "year": 2023, "type":"Education", "url":"/img/management.png" }
    ]

    // inserts projects
    projects.forEach( (oneProject) => {
      db.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.name, 
      oneProject.year, oneProject.desc, oneProject.type, oneProject.url], (error) => {
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
      {"id":"1", "username":"sam", "password":"$2b$10$baQr.ebGvciUC7tM6ZcrUOmpQbbkPzsylf66tYQpa5UaMHNYJZYvW"},
      {"id":"2", "username":"lala", "password":"$2b$10$baQr.$2b$10$rNvdyomZeVKD0lCavWhBKOPrZOveItFW11PKRWG7vVTz3Uev.BfLq"},
      {"id":"3", "username":"TheKing", "password":"$$2b$10$0HYg9JazwX3Kk8LhNl5rQuZnJFYNJesTgqQjBH1If9AEyAr0BLJAC"},
      {"id":"4", "username":"Choko", "password":"$2b$10$1t2l7ywEkVdac1rQAz8Sae1g7rdxnE3oRLdjl8HLb9wxmkzrWS0mC"},
      {"id":"5", "username":"Sadio", "password":"$2b$10$6vhkGIX.kmHct035Ferf6O4aK3sSLdVNoPbsoMhNI33xoQG1HZKbW"},
      {"id":"6", "username":"Ronaldo", "password":"$2b$10$4XH2LmQOq3LIB7MnD4YxRegNNUKw5lMXyNVWXgN4f9/ZfIYM6C41W"},
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
    {"id":"1", "header": "The Future of Programming", "shortdesc": "Journey into the contrasting worlds of OOP and FP! Discover the philosophies, strengths, and challenges of both paradigms. Whether you're team objects or functions, this exploration promises insights and revelations. Dive in and pick your side in the age-old debate!",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
     "imgURL": "/img/bildss"},
     {"id":"2", "header": "OOP vs. FP: A Tale of Two Paradigms", "shortdesc": "In the vast universe of programming, two paradigms have consistently sparked debates among developers: Object-Oriented Programming (OOP) and Functional Programming (FP). Both have their merits, philosophies, and use-cases. Let's dive into the core differences and see what each brings to the table.",
     "secone": "In the vast universe of programming, two paradigms have consistently sparked debates among developers: Object-Oriented Programming (OOP) and Functional Programming (FP). Both have their merits, philosophies, and use-cases. Let's dive into the core differences and see what each brings to the table. Philosophical Foundations: OOP: At its heart, OOP is about encapsulating data and behavior into objects. It's like viewing the world as a collection of interacting entities, each with its attributes and actions. FP: FP, on the other hand, is all about immutability and statelessness. It treats computation as the evaluation of mathematical functions, avoiding changing state and mutable data. Main Constructs: OOP: Classes, objects, inheritance, polymorphism, encapsulation, and abstraction. FP: First-class functions, pure functions, higher-order functions, and recursion.",
      "sectwo": "Advantages: OOP: Provides a clear modular structure for programs, making it good for defining abstract datatypes. It's also more intuitive for modeling and organizing large systems. FP: Offers better predictability and is easier to test and debug. It's inherently more parallelizable, making it apt for today's multi-core processors. Challenges: OOP: Can lead to over-complication if not designed well. The mutable state can introduce bugs that are hard to trace. FP: Has a steeper learning curve for those accustomed to imperative styles. Some tasks can be more verbose in functional languages.",
      "secthree" : "Real-world Usage: OOP: Widely used in software engineering, especially in large systems where the organization is crucial. Examples include Java, C++, and Python. FP: Gaining traction in domains like data processing, concurrency, and where side effects need to be minimized. Languages like Haskell, Lisp, and Erlang champion this paradigm. In conclusion, neither OOP nor FP is universally superior. They offer different tools for different problems. The best developers understand the strengths and weaknesses of both and use them judiciously based on the task at hand.",
     "imgURL": "/img/bildss"},
     {"id":"3", "header": "Decoding the Mysteries of Recursive Functions", "shortdesc": "Ready to embark on a recursive adventure? Dive in and discover the power and beauty of functions that call upon themselves!",
     "secone": "Recursive functions are a fascinating concept in programming, often seen as a riddle waiting to be unraveled. At its essence, recursion is when a function calls itself in order to solve a larger problem by breaking it down into smaller, more manageable pieces. Think of it as a set of Russian nesting dolls, where each doll represents a function call, and opening one reveals a slightly smaller version inside. This technique is particularly useful for tasks like traversing tree structures, calculating factorials, or implementing algorithms like the Fibonacci sequence.",
      "sectwo": "While the elegance of recursive solutions can be alluring, it's essential to use them judiciously. Without proper base cases or termination conditions, recursive functions can lead to infinite loops or stack overflow errors. But, when wielded correctly, recursion can lead to clean, efficient, and intuitive code that's a joy to read and understand.",
      "secthree" : "Unearth the magic of recursive functions in programming! From elegant solutions to potential pitfalls, delve deep into this captivating concept. Whether you're a novice or a seasoned coder, this exploration promises a fresh perspective on a classic technique.",
     "imgURL": "/img/bildss"},
     {"id":"4", "header": "Unveiling the Magic Behind Machine Learning Libraries", "shortdesc": "Eager to unravel the complexities of ML libraries? Join us on this enlightening journey and elevate your understanding of the frameworks that are driving the next wave of AI innovations!",
     "secone": "Step into the intricate world of Machine Learning libraries! From TensorFlow's vast ecosystem to Scikit-learn's simplicity, uncover the secrets that power today's AI marvels. Whether you're an AI enthusiast or a seasoned developer, this exploration offers a deep dive into the tools that are shaping the future of technology.",
      "sectwo": "Machine Learning (ML) has undeniably become one of the most transformative technologies of our era. But beneath the surface of impressive AI-driven applications lies a world of intricate algorithms and sophisticated libraries that power these innovations. One might wonder, what makes these libraries so special? At the heart of popular ML libraries like TensorFlow, PyTorch, and Scikit-learn is a blend of optimized mathematical operations, data manipulation tools, and a plethora of algorithms ranging from regression models to deep neural networks. These libraries provide developers with a platform to design, train, and deploy ML models without delving deep into the underlying math. For instance, TensorFlow, developed by Google, offers a flexible ecosystem of tools and community resources that lets researchers push the boundaries of current ML paradigms, while also enabling developers to easily integrate AI into their applications.",
      "secthree" : "On the other hand, Scikit-learn, known for its simplicity, provides a wide array of tools for data mining and data analysis. It's built on foundational libraries like NumPy and SciPy, ensuring efficient computations. However, while these libraries simplify the ML process, understanding their intricacies and the principles of machine learning remains crucial. It allows developers to choose the right tools, optimize performance, and troubleshoot issues effectively. In essence, while ML libraries are a gateway to the world of artificial intelligence, a deep understanding of their workings amplifies their potential, bridging the gap between theoretical concepts and groundbreaking applications.",
     "imgURL": "/img/bildss"},
     {"id":"5", "header": "Demystifying the World of WebAssembly: Beyond JavaScript", "shortdesc": "Intrigued by the potential of WebAssembly? Embark on this exploratory voyage and witness firsthand the evolution of the web. Dive deep, and be part of the revolution that's reshaping the digital landscape!",
     "secone": "Venture into the groundbreaking realm of WebAssembly! Discover how this emerging technology is redefining the boundaries of web development, offering performance leaps and expanding the horizons beyond JavaScript. Whether you're a web developer or a tech aficionado, this deep dive promises to illuminate the future of browser-based applications.",
      "sectwo": "The realm of web development has long been dominated by JavaScript, the ubiquitous scripting language that powers interactivity on the web. However, as applications grow in complexity and demand more from our browsers, a new hero emerges on the horizon: WebAssembly (often abbreviated as WASM). But what exactly is WebAssembly, and why is it generating such a buzz? WebAssembly is a binary instruction format that allows code written in languages like C, C++, and Rust to run in the browser at near-native speed. It's not a replacement for JavaScript but rather a complementary tool, bringing performance optimizations and enabling the web to run languages previously confined to server-side or desktop applications. Imagine complex graphics rendering, real-time multiplayer games, or even machine learning models executing swiftly in your browser—that's the promise of WebAssembly. ",
      "secthree" : "Tools like Emscripten make it possible to compile code from supported languages into WASM, bridging the gap between traditional web development and high-performance applications. While WebAssembly is still in its nascent stages, its potential is undeniable. It promises a future where the web is not just a platform for information but a robust environment for powerful applications. However, like all technologies, it comes with its learning curve and challenges. Embracing WebAssembly requires understanding its architecture, integration points with JavaScript, and the nuances of memory management. In summary, WebAssembly is not just a new tool in the developer's toolkit; it's a paradigm shift, heralding a new era of web development where boundaries are continually pushed, and possibilities are endless.",
     "imgURL": "/img/bildss"},
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


// creates table projectsSkills at startup

// CONTROLLER (THE BOSS)
// defines route "/"
app.get('/', function(req, res){
  console.log("Session: ", req.session)
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('home.handlebars', model)
})

// defines route "/humans"
app.get('/projects', function(request, response){
  db.all("SELECT * FROM projects", function(error, theProjects){
    if(error){
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      // renders the page with the model
      response.render("projects.handlebars", model)
    }
    else{
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProjects,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      // renders the page with the model
      response.render("projects.handlebars", model)
    }
  })
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
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg,
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("INSERT INTO projects (pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
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
   req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg, id
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
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



app.get('/contact', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render("contact.handlebars", model)
})

app.get('/about', function(request, response){
  const model={
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
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
        isCreator: request.session.isAdmin
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
        isCreator: request.session.isAdmin
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
    isAdmin: req.session.isAdmin
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
app.listen(port, () => {
    console.log(`Server on an listening on port ${port} http://localhost:${port}`)
})

