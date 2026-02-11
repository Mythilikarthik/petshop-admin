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
const MessageRoutes = require('./Routes/MessageRoutes');
const contactAdminRoutes = require("./Routes/ContactAdminRoutes");
const DirectoryBannerRoutes = require("./Routes/DirectoryBanner");
const BlogBannerRoutes = require("./Routes/BlogBanner");
const CityBannerRoutes = require("./Routes/CityBannerRoutes");
const path = require("path");



const http = require("http");
const { Server } = require("socket.io");


dotenv.config();
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // for parsing JSON
app.use("/uploads", express.static("uploads")); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));
const paymentRoutes = require("./Routes/paymentRoutes");
const ListingEnquiry = require('./Routes/ListingEnquiry');
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
app.use("/api/messages", MessageRoutes);
app.use("/api/contact-admin", contactAdminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/directory-banner", DirectoryBannerRoutes);
app.use("/api/blog-banner", BlogBannerRoutes);
app.use("/api/city-banner", CityBannerRoutes);
app.use("/api/enquiry", ListingEnquiry);




const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("message_read", ({ userId }) => {
    console.log(`📩 Message read by ${userId}`);
    // Broadcast instantly to that user's own room
    io.to(userId).emit("message_read_update");
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
  


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
