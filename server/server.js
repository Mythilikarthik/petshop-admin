const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const AdminRoutes = require('./Routes/AdminRoutes');
const UserRoutes = require('./Routes/UserRoutes');
const CategoryRoutes = require('./Routes/CategoryRoutes');
const CityRoutes = require('./Routes/CityRoutes');
const PetCategoryRoutes = require('./Routes/PetCategoryRoutes');
const ListingRoutes = require('./Routes/ListingRoutes');
const BlogRoutes = require('./Routes/BlogRoutes');
const FaqRoutes = require('./Routes/FaqRoutes');
const AuthRoutes = require('./Routes/authRoute');
const ReviewRoutes = require('./Routes/ReviewRoutes');
const CustomPageRoutes = require('./Routes/CustomPageRoutes');
const HomePageRoutes = require('./Routes/HomePageRoutes')
const categoryPageRoutes = require("./Routes/CategoryPageRoutes");
const AdRoutes = require("./Routes/AdRoutes");
const ChartRoutes = require("./Routes/ChartRoutes");

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // for parsing JSON
app.use("/uploads", express.static("uploads")); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

app.use("/api/", AdminRoutes);

app.use("/api/user", UserRoutes);
app.use('/api/category', CategoryRoutes);
app.use('/api/city', CityRoutes);
app.use('/api/pet-category', PetCategoryRoutes);
app.use('/api/listing', ListingRoutes);
app.use('/api/blog', BlogRoutes);
app.use('/api/faq', FaqRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use("/api/custom-page", CustomPageRoutes);
app.use('/api/home-page', HomePageRoutes);
app.use("/api/categorypage", categoryPageRoutes);
app.use("/api/ads", AdRoutes);
app.use("/api/stats", ChartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
