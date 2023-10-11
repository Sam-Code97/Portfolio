const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 8080 // defines the port
const app = express() // creates the Express application

// MODEL (DATA)
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('portfolio1.db')

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public" to access css/ and img/
app.use(express.static('public'))

// MODEL (DATA)
const humans = [
    {"id": "0", "name": "Sam"}, 
    {"id": "1", "name": "Mira"},
    {"id": "2", "name": "Linus"}, 
    {"id": "3", "name": "Susanne"}, 
    {"id": "4", "name": "Jasmin"}, 
]

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
      { "id":"1", "name":"Advanced Snake Game", "type":"research", "desc": "Dive into a classic snake game with a twist! Implemented in C++ using the Qt framework, this game not only offers the traditional snake gameplay but also boasts an advanced pathfinding algorithm, ensuring a challenging and engaging experience.", "year": 2022, "dev":"C++ and Qt framework", 
      "url":"/img/counting.png" },
      { "id":"2", "name":"Paint App", "type":"research", "desc": "Dive into a world of creativity with this simple painting application. Harnessing intricate algorithms, this app offers boundary-fill, flood-fill, and scan-line fill techniques to bring your artistic visions to life.", "year":
      2022, "url":"/img/medical.png" },
      { "id":"3", "name":"Calculation Algorithm", "type":"Study", "desc": "A sophisticated calculator algorithm developed in C++, showcasing a robust parsing mechanism to evaluate mathematical expressions. The project is designed with a clear focus on tokenization and operator precedence.", "year": 2022, "url":"/img/qcm07.png" },
      { "id":"4", "name":"BetterTicTacToe", "desc": "An enhanced version of the classic Tic Tac Toe game, developed in Java. The project showcases a strong Object-Oriented Design, with distinct classes representing game components, rules, and user interactions.", "year": 2023, "type":"Study", 
      "url":"/img/diaw02.png" },
      { "id":"5", "name":"Simple Notepad", "desc": "A lightweight notepad application developed in C++ using the Qt framework. It offers essential features like opening, saving, and clearing text files, all wrapped in a user-friendly graphical interface.", "year": 2022, "type":"Study", "url":"/img/management.png" },
      { "id":"6", "name":"Encryption Tool", "desc": "A robust encryption tool built in Java that offers both encryption and decryption functionalities. With a user-friendly GUI, users can easily input text and an encryption key to get the desired encrypted or decrypted output.", "year": 2023, "type":"Study", "url":"/img/management.png" }
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


// creates skills projects at startup
db.run("CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)", (error) => {
  if (error) {
  // tests error: display error
  console.log("ERROR: ", error)
  } 
  else {
    // tests error: no error, the table has been created
    console.log("---> Table skills created!")
    const skills=[
    {"id":"1", "name": "PHP", "type": "Programming language", "desc": "Programming with PHP on the server side."},
    {"id":"2", "name": "Python", "type": "Programming language", "desc": "Programming with Python."},
    {"id":"3", "name": "Java", "type": "Programming language", "desc": "Programming with Java."},
    {"id":"4", "name": "ImageJ", "type": "Framework", "desc": "Java Framework for Image Processing."},
    {"id":"5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side."},
    {"id":"6", "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side."},
    {"id":"7", "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side."},
    {"id":"8", "name": "Scikit-image", "type": "Library", "desc": "A library for Image Processing with Python."},
    {"id":"9", "name": "OpenCV", "type": "Library", "desc": "A library for Image Processing with Python."},
    ]
    // inserts skills
    skills.forEach( (oneSkill) => {
      db.run("INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)", [oneSkill.id, oneSkill.name, oneSkill.desc, 
        oneSkill.type], (error) => {
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
db.run("CREATE TABLE projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid), FOREIGN KEY (sid) REFERENCES skills (sid))"
, (error) => {
  if (error) {
    // tests error: display error
    console.log("ERROR: ", error)
  } 
  else {
    // tests error: no error, the table has been created
    console.log("---> Table projectsSkills created!")
    const projectsSkills=[
    {"id":"1", "pid":"1", "sid": "2"},
    {"id":"2", "pid":"1", "sid": "8"},
    {"id":"3", "pid":"1", "sid": "9"},
    {"id":"4", "pid":"2", "sid": "3"},
    {"id":"5", "pid":"2", "sid": "4"},
    {"id":"6", "pid":"3", "sid": "1"},
    {"id":"7", "pid":"4", "sid": "2"},
    {"id":"8", "pid":"4", "sid": "8"},
    {"id":"9", "pid":"4", "sid": "9"},
    {"id":"10", "pid":"5", "sid": "1"}
    ]
    // inserts projectsSkills
    projectsSkills.forEach( (oneProjectSkill) => {
      db.run("INSERT INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)", [oneProjectSkill.id, oneProjectSkill.pid, 
        oneProjectSkill.sid], (error) => {
        if (error) {
        console.log("ERROR: ", error)
        } else {
        console.log("Line added into the projectsSkills table!")
        }
      })
    })
  }
})

// CONTROLLER (THE BOSS)
// defines route "/"
app.get('/', function(request, response){
  response.render('home.handlebars')
})

// defines route "/humans"
app.get('/projects', function(request, response){
  db.all("SELECT * FROM projects", function(error, theProjects){
    if(error){
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: []
      }
      // renders the page with the model
      response.render("projects.handlebars", model)
    }
    else{
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProjects
      }
      // renders the page with the model
      response.render("projects.handlebars", model)
    }
  })
})

app.get('/contact', function(request, response){
  response.render("contact.handlebars")
})

app.get('/about', function(request, response){
  response.render("about.handlebars")
})

app.get('/blog', function(request, response){
  response.render("blog.handlebars")
})

app.get('/login', function(request, response){
  response.render("login.handlebars")
})

app.get('/signup', function(request, response){
  response.render("signup.handlebars")
})


app.get('/humans/:id', function(request, response){
  // get the id on the dynamic route
  const id = request.params.id // E.g. “1”, “2”, “3”, …
  const model = humans[id];
  // do the job now!
  response.render('human.handlebars', model)
})

// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server on an listening on port ${port} http://localhost:${port}`)
})

