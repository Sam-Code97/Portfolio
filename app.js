const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3')
const connectSqlite3 = require('connect-sqlite3')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const port = 5000 // defines the port
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
  const numberPerPage = 3;

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

