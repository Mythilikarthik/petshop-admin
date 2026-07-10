// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');
// const Offer = require('../Models/Offers'); // Import your new schema model
// const upload = multer({ dest: 'uploads/' }); 
// const Listing = require('../Models/Listing'); // Path to your Listing schema file
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffprobePath = require('@ffprobe-installer/ffprobe').path;
// const jwt = require("jsonwebtoken");
// const { verifyToken } = require('../middleware/authMiddleware');
// const User = require("../Models/User");

// // Automatically injects the correct paths across Windows, Mac, or Linux systems
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// // GET minimal business profiles list to populate the admin dropdown field
// router.get('/business/lookup', async (req, res) => {
//   try {
//     const listings = await Listing.find({ status: 'approved' })
//       .select('shopName bannerImage address city')
//       .populate('city', 'city'); // Assuming your City schema holds a "city" text string field
      
//     res.status(200).json({ success: true, listings });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // 1. Media Upload Route with 12-second Video Validation
// router.post('/upload-media', upload.single('file'), (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).json({ success: false, error: 'No file uploaded.' });

//   if (file.mimetype.startsWith('video/')) {
//     ffmpeg.ffprobe(file.path, (err, metadata) => {
//     //   if (err) return res.status(500).json({ success: false, error: 'Failed to parse video metadata.' });
//     if (err) {
//     // 🔹 Print the exact raw error to your terminal console logs
//     console.error("FFPROBE PARSE EXCEPTION LOG:", err); 
    
//     return res.status(500).json({ 
//       success: false, 
//       error: 'Failed to parse video metadata.',
//       details: err.message // Send the real message back to help you debug
//     });
//   }
      
//       const duration = metadata.format.duration;
//       if (duration > 122.5) {
//         return res.status(400).json({ success: false, error: 'Video duration exceeds maximum allowed limit of 12 seconds.' });
//       }
//       return res.status(200).json({ success: true, type: 'video', url: `uploads/${file.filename}` });
//     });
//   } else if (file.mimetype.startsWith('image/')) {
//     return res.status(200).json({ success: true, type: 'image', url: `uploads/${file.filename}` });
//   } else {
//     return res.status(400).json({ success: false, error: 'Invalid file format type.' });
//   }
// });

// // 2. GET All Offers
// router.get('/', async (req, res) => {
//   try {
//     const offers = await Offer.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, offers });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // 3. POST Create Offer
// router.post('/', async (req, res) => {
//   try {
//     const newOffer = new Offer(req.body);
//     await newOffer.save();
//     res.status(201).json({ success: true, offer: newOffer });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// // 4. PUT Update Offer
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedOffer) return res.status(404).json({ success: false, message: 'Offer not found' });
//     res.status(200).json({ success: true, offer: updatedOffer });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// // 5. DELETE Offer
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
//     if (!deletedOffer) return res.status(404).json({ success: false, message: 'Offer not found' });
//     res.status(200).json({ success: true, message: 'Offer deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
// // 1. 📈 TRACK VIEW: Increments view count when card mounts
// router.put('/:id/track-view', async (req, res) => {
//   try {
//     // Extract client IP address securely
//     const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

//     // $addToSet pushes to the array only if the IP doesn't exist yet
//     const updatedOffer = await Offer.findByIdAndUpdate(
//       req.params.id,
//       { $addToSet: { 'analytics.viewedByIPs': clientIp } },
//       { new: true }
//     );

//     res.status(200).json({ 
//       success: true, 
//       // Total views is simply the length of unique IPs collected
//       viewsCount: updatedOffer.analytics?.viewedByIPs?.length || 0 
//     });
//   } catch (err) {
//     console.error('View tracking error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // 2. 🖱️ TRACK BUTTON CLICK: Increments specific action click types
// router.post('/:id/track-click', async (req, res) => {
//   const { action } = req.body; // Expects 'call', 'whatsapp', 'book_now', or 'share'
  
//   // Guard against unexpected action types to protect DB paths
//   const allowedActions = ['call', 'whatsapp', 'book_now', 'share'];
//   if (!allowedActions.includes(action)) {
//     return res.status(400).json({ success: false, message: 'Invalid action type' });
//   }

//   try {
//     // Dynamic field path update syntax based on action argument string passed
//     const updateField = `analytics.clicks.${action}`;

//     await Offer.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { [updateField]: 1 } }
//     );
//     res.status(200).json({ success: true, message: `${action} click tracked successfully` });
//   } catch (err) {
//     console.error('Click tracking error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // 3. ❤️ TRACK SAVE: Toggles addition or subtraction of save state 
// // 3. ❤️ TRACK SAVE: Handles authenticated save/unsave toggles reliably
// router.put('/:id/track-save', verifyToken, async (req, res) => {
//   const { isSaving } = req.body; 
//   const userId = req.userId;
  
//   if (!userId) {
//     return res.status(401).json({ success: false, message: "Authentication required" });
//   }

//   try {
//     let updatedOffer;

//     if (isSaving) {
//       // 1. Add offer to User's wishlist array safely
//       await User.findByIdAndUpdate(userId, { 
//         $addToSet: { wishlist: req.params.id } 
//       });

//       // 2. Add userId to Offer's savedByUsers array, then recalculate total saves count
//       updatedOffer = await Offer.findByIdAndUpdate(
//         req.params.id,
//         { $addToSet: { 'analytics.savedByUsers': userId } },
//         { new: true }
//       );

//     } else {
//       // 1. Remove offer from User's wishlist array
//       await User.findByIdAndUpdate(userId, { 
//         $pull: { wishlist: req.params.id } 
//       });

//       // 2. Remove userId from Offer's savedByUsers array
//       updatedOffer = await Offer.findByIdAndUpdate(
//         req.params.id,
//         { $pull: { 'analytics.savedByUsers': userId } },
//         { new: true }
//       );
//     }

//     // Fallback recalculation just in case analytics fields aren't completely updated
//     const finalSavesCount = updatedOffer.analytics?.savedByUsers?.length || 0;
    
//     // Explicitly override or pass back the exact calculated metrics to the frontend
//     const cleanAnalytics = {
//       ...updatedOffer.analytics?.toObject(),
//       saves: finalSavesCount
//     };

//     return res.status(200).json({ 
//       success: true, 
//       message: isSaving ? 'Offer saved to profile' : 'Offer removed from profile', 
//       updatedAnalytics: cleanAnalytics 
//     });

//   } catch (err) {
//     console.error('Save tracking error:', err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const Offer = require('../Models/Offers'); 
const upload = multer({ dest: 'uploads/' }); 
const Listing = require('../Models/Listing'); 
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const jwt = require("jsonwebtoken");
const { verifyToken } = require('../middleware/authMiddleware');
const User = require("../Models/User");

// Automatically injects the correct paths across Windows, Mac, or Linux systems
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// GET minimal business profiles list to populate the admin dropdown field
router.get('/business/lookup', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'approved' })
      .select('shopName bannerImage address city')
      .populate('city', 'city'); 
      
    res.status(200).json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 1. Media Upload Route with 12-second Video Validation
router.post('/upload-media', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, error: 'No file uploaded.' });

  if (file.mimetype.startsWith('video/')) {
    ffmpeg.ffprobe(file.path, (err, metadata) => {
      if (err) {
        console.error("FFPROBE PARSE EXCEPTION LOG:", err); 
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to parse video metadata.',
          details: err.message 
        });
      }
      
      const duration = metadata.format.duration;
      if (duration > 122.5) {
        return res.status(400).json({ success: false, error: 'Video duration exceeds maximum allowed limit of 12 seconds.' });
      }
      return res.status(200).json({ success: true, type: 'video', url: `uploads/${file.filename}` });
    });
  } else if (file.mimetype.startsWith('image/')) {
    return res.status(200).json({ success: true, type: 'image', url: `uploads/${file.filename}` });
  } else {
    return res.status(400).json({ success: false, error: 'Invalid file format type.' });
  }
});

// 2. GET All Offers
router.get('/admin/all', async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    // 🟢 Filter: Only fetch offers where endDate is in the future (or is right now)
    const offers = await Offer.find({
      endDate: { $gte: new Date() } ,
      show: 1,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST Create Offer
router.post('/', async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    await newOffer.save();
    res.status(201).json({ success: true, offer: newOffer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 4. PUT Update Offer
router.put('/:id', async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOffer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.status(200).json({ success: true, offer: updatedOffer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. DELETE Offer
router.delete('/:id', async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 1. 📈 TRACK VIEW: Increments view count when card mounts
router.put('/:id/track-view', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { 'analytics.viewedByIPs': clientIp } },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      viewsCount: updatedOffer.analytics?.viewedByIPs?.length || 0 
    });
  } catch (err) {
    console.error('View tracking error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 🖱️ TRACK BUTTON CLICK: Increments specific action click types
// 🖱️ TRACK BUTTON CLICK: Records specific user details on action clicks
router.post('/:id/track-click', verifyToken, async (req, res) => {
  const { action } = req.body; // Expects 'call', 'whatsapp', 'book_now', or 'share'
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Authentication required to track action" });
  }
  
  const allowedActions = ['call', 'whatsapp', 'book_now', 'share'];
  if (!allowedActions.includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action type' });
  }

  try {
    // Path inside the document array to push the new log object
    const updateField = `analytics.clicks.${action}`;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          [updateField]: { userId: userId, clickedAt: new Date() } 
        } 
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: `${action} click tracked successfully for this user.`
    });
  } catch (err) {
    console.error('Click tracking error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// Admin Route Example to View Analytics
router.get('/admin/offers/:id/analytics', async (req, res) => {
  try {
    const offerAnalytics = await Offer.findById(req.params.id)
      .populate('analytics.savedByUsers', 'name email phone') // Get specific user fields
      .populate('analytics.clicks.call.userId', 'name email phone')
      .populate('analytics.clicks.whatsapp.userId', 'name email phone')
      .populate('analytics.clicks.book_now.userId', 'name email phone');

    res.status(200).json({ success: true, data: offerAnalytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. ❤️ TRACK SAVE: Handles authenticated save/unsave toggles reliably
router.put('/:id/track-save', verifyToken, async (req, res) => {
  const { isSaving } = req.body; 
  const userId = req.userId;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    // 1. First sync the user collection array update
    if (isSaving) {
      await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: req.params.id } });
    } else {
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: req.params.id } });
    }

    // 2. Modify the offer array tracking context
    // Inside your router.put('/:id/track-save'...)
const arrayOperator = isSaving ? '$addToSet' : '$pull';

let updatedOffer = await Offer.findByIdAndUpdate(
  req.params.id,
  { 
    [arrayOperator]: { 'analytics.savedByUsers': userId },
    $inc: { 'analytics.clicks.save_click_engagement': 1 } // 📈 Increments every single click
  },
  { new: true }
);

const finalSavesCount = updatedOffer.analytics?.savedByUsers?.length || 0;

updatedOffer = await Offer.findByIdAndUpdate(
  req.params.id,
  { $set: { 'analytics.saves': finalSavesCount } },
  { new: true }
);

    return res.status(200).json({ 
      success: true, 
      message: isSaving ? 'Offer saved to profile' : 'Offer removed from profile', 
      updatedAnalytics: updatedOffer.analytics
    });

  } catch (err) {
    console.error('Save tracking error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/listing/:listingId', async (req, res) => {
  try {
    const listingOffers = await Offer.find({ 
      'business.listingId': req.params.listingId,
      show: 1 // Only show active items
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, offers: listingOffers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;