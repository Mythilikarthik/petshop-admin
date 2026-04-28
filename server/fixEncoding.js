const mongoose = require("mongoose");
const Listing = require("./Models/Listing"); // adjust path
const sanitizeText = require("./Utils/SanitizeText");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const fixData = async () => {
  try {
    const listings = await Listing.find({
      shopName: /�/
    });

    console.log(`Found ${listings.length} corrupted records`);

    for (const listing of listings) {
      const oldName = listing.shopName;
      const newName = sanitizeText(oldName);

      listing.shopName = newName;

      await listing.save();

      console.log(`✔ Fixed: "${oldName}" → "${newName}"`);
    }

    console.log("✅ Done fixing all records");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixData();