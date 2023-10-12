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
const db = new sqlite3.Database('portfolio.db')

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
    {"id":"1", "header": "The Future of Programming", "shortdesc": "Dive into the exhilarating future of programming! From quantum computing to AI-driven development, explore the trends that will redefine the coding landscape. Join us on a journey to tomorrow's code, where ethics meets innovation, and possibilities are boundless.",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
     "imgURL": "/img/bildss"},
     {"id":"2", "header": "The Future of Programming", "shortdesc": "Dive into the exhilarating future of programming! From quantum computing to AI-driven development, explore the trends that will redefine the coding landscape. Join us on a journey to tomorrow's code, where ethics meets innovation, and possibilities are boundless.",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
     "imgURL": "/img/bildss"},
     {"id":"3", "header": "The Future of Programming", "shortdesc": "Dive into the exhilarating future of programming! From quantum computing to AI-driven development, explore the trends that will redefine the coding landscape. Join us on a journey to tomorrow's code, where ethics meets innovation, and possibilities are boundless.",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
     "imgURL": "/img/bildss"},
     {"id":"4", "header": "The Future of Programming", "shortdesc": "Dive into the exhilarating future of programming! From quantum computing to AI-driven development, explore the trends that will redefine the coding landscape. Join us on a journey to tomorrow's code, where ethics meets innovation, and possibilities are boundless.",
     "secone": "The Future of Programming: A Glimpse into Tomorrow's Code In the ever-evolving world of technology, programming has always been at the forefront, driving innovation and shaping the digital landscape. As we stand on the cusp of a new era, it's essential to ponder what the future holds for programming. Here's a brief look into the exciting prospects that await.",
      "sectwo": "Quantum Computing: Traditional bits will give way to qubits, opening doors to unimaginable computational power. Quantum programming languages and frameworks will become mainstream, solving problems deemed unsolvable today. AI-Driven Development: Artificial Intelligence will play a pivotal role in code generation, debugging, and optimization. Developers will collaborate with AI assistants, making the coding process more efficient and error-free. Augmented Reality (AR) and Virtual Reality (VR): As AR and VR technologies mature, there will be a surge in demand for immersive experiences. This will necessitate new programming paradigms and tools tailored for these realities. No-Code/Low-Code Platforms: Simplifying the development process, these platforms will empower non-developers to create applications. While they won't replace traditional coding, they'll democratize app development.",
      "secthree" : "Sustainable Coding: With growing concerns about energy consumption, there will be a push towards writing energy-efficient code. Developers will need to be conscious of the environmental impact of their applications. Cross-Platform Development: As the number of devices and platforms grows, there will be a stronger emphasis on writing code that runs everywhere. Frameworks that allow for seamless integration across platforms will be in high demand.Ethical Programming: With technology deeply embedded in our lives, ethical considerations in programming will become paramount. Developers will need to ensure that their code respects user privacy, equity, and societal values. In conclusion, the future of programming is bright, filled with opportunities and challenges. As developers, it's our responsibility to adapt, innovate, and drive the next wave of technological advancements.",
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
        res.render("home.handlebars", model)
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

app.get('/blog/delete/:id', (req, res) => {
  const id = req.params.id
  if( req.session.isLoggedIn == true && (req.session.isAdmin == true || req.session.isCreator == true) ){
    db.run("DELETE FROM blog WHERE pid=?", [id], (error, theBlogs) => {
      if(error){
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isCreator: req.session.isAdmin
        }
        res.render("blog.handlebars", model)
      }
      else{
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isCreator: req.session.isAdmin
        }
        res.render("blog.handlebars", model)
      }
    })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/blog/:id', (request, response) => {
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

app.delete()

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

