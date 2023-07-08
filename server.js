require('dotenv').config();
const express = require('express')
const app = express()
const session=require('express-session')
const PORT = process.env.PORT || 5500;

const server = require('http').Server(app)
const { Server } = require("socket.io");
const io = new Server(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

process.env.NODE_ENV = 'development';
const passport = require('passport');

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/error', (req, res) => res.send("error logging in"));

require('./passport-setup');

 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/google/callback', 
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/error' }));

function isAuthenticated(req, res, next) {
  // console.log('isAuthenticated');
  if (req.isAuthenticated()) {
    return next();
  }
  // User is not authenticated, redirect to login page
  // res.render('index.ejs', { user: false });
  res.redirect('/');
}


app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('index', {user: req.user});
  } else {
    res.render('index.ejs', { user: false });
  }
})

app.get('/room', isAuthenticated, (req,res) => {
  res.redirect(`/room/${uuidV4()}`)
})

app.get('/board/:room', isAuthenticated, (req, res) => {
  res.render('whiteBoard', {user: req.user})
})

//   app.get('/logout', (req, res) => {
//     res.render('logout')
//   })
app.get('/room/:room', isAuthenticated, (req, res) => {
  res.render('room', { roomId: req.params.room, user: req.user })
})

app.get('/left/:room', isAuthenticated, (req, res) => {
  res.render('logout', { roomId: req.params.room, user: req.user })
})

app.get('*', (req, res) => {
  res.send('<h1>404 not found <h1>');
})

let connections = [];

io.on('connect', socket => {
  connections.push(socket)
  console.log(`${socket.id} connected`)

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
    })

    //whiteboardwindow
    socket.on('openBoard', () => {
      connections.forEach((con) => {
        con.emit('boardOpen')
      })
    })

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })

  socket.on('draw', (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('onDraw', { x: data.x, y: data.y })
      }
    });
  });

  socket.on('erase', (data) => {
    connections.forEach((con) => {
      if(con.id !== socket.id) {
        con.emit('onErase', { x: data.x, y: data.y })
      }
    })
  })

  socket.on('clear', () => {
    connections.forEach((con) => {
      if(con.id !== socket.id) {
        con.emit('onClear')
      }
    })
  })

  socket.on('mouseDown', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('onDown', { x: data.x, y: data.y })
      }
    })
  })

  socket.on('disconnect', () => {
    connections = connections.filter((con) => con.id !== socket.id)
  })
})


server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});