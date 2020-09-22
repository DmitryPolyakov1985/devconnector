const express = require("express");
const app = express();
const connectDB = require('./config/db');

// connect MongoDB
connectDB();

// middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running");
});

// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));