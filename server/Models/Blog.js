// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;


// const BlogSchema = new Schema({
//   title: { type: String, required: true, unique: true },
//   author: { type: String },
//   category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
//   date: { type: Date, default: Date.now },
//   status: { type: String, enum: ['draft', 'published'], default: 'draft' },
//   excerpt: { type: String, required: true },
//   content: { type: String, required: true },
//   bannerImage: { type: String, default: '' },   // URL or path to banner
//   contentImage: { type: String, default: '' } ,  // URL or path to content image
//   metaTitle: { type: String, trim: true },
//   metaDescription: { type: String },
//   metaKeyword: [{ type: String }],
// });


// module.exports = mongoose.model('Blog', BlogSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require("slugify");

const BlogSchema = new Schema({
  title: { type: String, required: true, unique: true },

  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  author: { type: String },

  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],

  date: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },

  excerpt: { type: String, required: true },

  content: { type: String, required: true },

  bannerImage: { type: String, default: '' },

  contentImage: { type: String, default: '' },

  metaTitle: { type: String, trim: true },

  metaDescription: { type: String },

  metaKeyword: [{ type: String }],
});
BlogSchema.pre("save", function(next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }

  next();
});
BlogSchema.pre("save", async function(next) {

  if (this.title) {

    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true
    });

    let slug = baseSlug;

    let counter = 1;

    while (
      await mongoose.models.Blog.findOne({
        slug,
        _id: { $ne: this._id }
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});
module.exports = mongoose.model('Blog', BlogSchema);