// middleware/checkPremium.js
const User = require("../Models/User");

const checkPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next();

    if (
      user.isPremium &&
      user.premiumEndDate &&
      new Date() > new Date(user.premiumEndDate)
    ) {
      // Expired plan — downgrade user
      user.isPremium = false;
      user.premiumPlan = null;
      user.premiumStartDate = null;
      user.premiumEndDate = null;
      await user.save();
      console.log(`⏳ Premium expired for user ${user.email}`);
    }
    next();
  } catch (err) {
    console.error("Error checking premium:", err);
    next();
  }
};

module.exports = checkPremium;
