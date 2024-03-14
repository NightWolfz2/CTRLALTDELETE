require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('./middleware/requireAuth'); // Adjust the path as needed
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
const cors = require('cors');



// express app
const app = express();

// Add CORS configuration
app.use(cors({
  origin: process.env.DOMAIN_NAME, // Allow your frontend domain
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));

// middleware
app.use(express.json());

app.use((req, res, next) => {
  //console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/user', userRoutes);
app.use(requireAuth);
app.use('/api/tasks', taskRoutes);


// connect to db using .env file **add DB link to .env**
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  console.log('connected to database');
  // listen to port
  app.listen(process.env.PORT, () => {
    console.log('listening for requests on port', process.env.PORT);
  });
})
.catch((err) => {
  console.log(err);
});
