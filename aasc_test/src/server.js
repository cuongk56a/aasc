const express = require('express');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const requisiteRoutes = require('./routes/requisiteRoutes');
require('dotenv').config();

const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Để xử lý query từ Bitrix24

// Route mặc định để tránh ngrok hiển thị "Visit Site"
app.get('/', (req, res) => {
    res.send('Welcome to Bitrix24 OAuth App');
});

// Sử dụng routes cho OAuth
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/requisite', requisiteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});