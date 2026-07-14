// const mongoose = require('mongoose');

// const Offer = new mongoose.Schema({
//   category: {
//     type: String,
//     required: true,
//     enum: ['Offers / Discounts', 'Events', 'Announcements'],
//     index: true
//   },
//   // 🔹 Updated from raw strings to a real relational Reference link
//   business: {
//     listingId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Listing", // References your business Listing schema
//       required: true 
//     },
//     name: { type: String, required: true },
//     // logo: { type: String, required: true },
//     neighborhood: { type: String, required: true },
//     city: { type: String, required: true }
//   },
//   title: { type: String, required: true, trim: true },
//   description: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true, index: true },
//   media: [{
//     type: { type: String, required: true, enum: ['image', 'video'] },
//     url: { type: String, required: true }
//   }],
//   primaryActions: [{
//     type: String,
//     enum: ['whatsapp', 'call', 'book_now']
//   }],
//   show: { type: Number, enum: [0, 1], default: 1 },

// // analytics: {
// //   viewedByIPs: [{ type: String }], // Array of unique IP string hashes
  
// //   // 🟢 ADD THIS LINE: Explicitly define the array of user references
// //   savedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  
// //   saves: { type: Number, default: 0 },
// //   clicks: {
// //     call: { type: Number, default: 0 },
// //     whatsapp: { type: Number, default: 0 },
// //     book_now: { type: Number, default: 0 },
// //     share: { type: Number, default: 0 }
// //   }
// // }
// analytics: {
//   viewedByIPs: [{ type: String }],
//   savedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
//   saves: { type: Number, default: 0 },
  
//   // 🏢 UPGRADED ACTION TRACKING
//   clicks: {
//     call: [{
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       clickedAt: { type: Date, default: Date.now }
//     }],
//     whatsapp: [{
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       clickedAt: { type: Date, default: Date.now }
//     }],
//     book_now: [{
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       clickedAt: { type: Date, default: Date.now }
//     }],
//     share: [{
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       clickedAt: { type: Date, default: Date.now }
//     }],
//     save_click_engagement: { type: Number, default: 0 }
//   }
// }
// }, { timestamps: true });

// module.exports = mongoose.model('Offer', Offer);

const mongoose = require('mongoose');

const Offer = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Offers / Discounts', 'Events', 'Announcements'],
    index: true
  },
  // Relational reference link to the business hosting this asset
  business: {
    listingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Listing", 
      required: true 
    },
    name: { type: String, required: true },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true, index: true },
  media: [{
    type: { type: String, required: true, enum: ['image', 'video'] },
    url: { type: String, required: true }
  }],
  primaryActions: [{
    type: String,
    enum: ['whatsapp', 'call', 'book_now']
  }],
  bookNowUrl: { 
    type: String, 
    default: "", 
    trim: true 
  }, // 🟢 Field added to save the Appointment/Booking custom redirection link
  show: { type: Number, enum: [0, 1], default: 1 },

  // 🏢 UPGRADED ACTION & SHARE ENGAGEMENT ANALYTICS
  analytics: {
    viewedByIPs: [{ type: String }],
    savedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    saves: { type: Number, default: 0 },
    
    clicks: {
      call: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clickedAt: { type: Date, default: Date.now }
      }],
      whatsapp: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clickedAt: { type: Date, default: Date.now }
      }],
      book_now: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clickedAt: { type: Date, default: Date.now }
      }],
      share: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clickedAt: { type: Date, default: Date.now }
      }],
      save_click_engagement: { type: Number, default: 0 }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', Offer);