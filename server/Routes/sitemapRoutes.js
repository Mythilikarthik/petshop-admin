// // Routes/sitemapRoutes.js
// const express = require('express');
// const router = express.Router();
// const { SitemapStream, streamToPromise } = require('sitemap');
// const { Readable } = require('stream');

// // --- Import your existing Mongoose Models here ---
// const Blog = require('../Models/Blog'); // Adjust paths/names to match your exact files
// const Listing = require('../Models/Listing');
// const City = require('../Models/City');
// const Category = require('../Models/Category');
// const CustomPage = require('../Models/CustomPage');

// router.get('/sitemap.xml', async (req, res) => {
//   try {
//     const BASE_URL = 'https://www.vetandpets.in'; // Change to your production frontend URL

//     // 1. Core static structural pages
//     const links = [
//       { url: '/', changefreq: 'daily', priority: 1.0 },
//       { url: '/blog', changefreq: 'daily', priority: 0.8 },
//       { url: '/contact-us', changefreq: 'monthly', priority: 0.4 },
//     ];

//     // 2. Fetch Dynamic Data concurrently to maximize performance
//     const [blogs, listings, cities, categories, customPages] = await Promise.all([
//       Blog.find({ isPublished: true }, 'slug updatedAt'), // Replace 'isPublished' if you don't use status flags
//       Listing.find({}, 'slug updatedAt'),
//       City.find({}, 'slug'),
//       Category.find({}, 'slug'),
//       CustomPage.find({}, 'slug updatedAt')
//     ]);

//     // 3. Push Dynamic routes into array maps matching your React Frontend paths
//     blogs.forEach(blog => {
//       links.push({ url: `/blog/${blog.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: blog.updatedAt });
//     });

//     listings.forEach(item => {
//       links.push({ url: `/listing/${item.slug}`, changefreq: 'daily', priority: 0.8, lastmod: item.updatedAt });
//     });

//     cities.forEach(city => {
//       links.push({ url: `/city/${city.slug}`, changefreq: 'weekly', priority: 0.6 });
//     });

//     categories.forEach(cat => {
//       links.push({ url: `/category/${cat.slug}`, changefreq: 'weekly', priority: 0.6 });
//     });

//     customPages.forEach(page => {
//       links.push({ url: `/${page.slug}`, changefreq: 'monthly', priority: 0.5, lastmod: page.updatedAt });
//     });

//     // 4. Create and stream the structured XML mapping
//     const stream = new SitemapStream({ hostname: BASE_URL });
//     res.header('Content-Type', 'application/xml');

//     const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
//     res.send(xml);

//   } catch (error) {
//     console.error('Sitemap Generation Error:', error);
//     res.status(500).end();
//   }
// });

// module.exports = router;
// Routes/sitemapRoutes.js
const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// --- Import your existing Mongoose Models here ---
const Blog = require('../Models/Blog'); 
const Listing = require('../Models/Listing');
const City = require('../Models/City');
const Category = require('../Models/Category');
const CustomPage = require('../Models/CustomPage');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const BASE_URL = 'https://www.vetandpets.in'; 

    // 1. Core static structural pages
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/pet-grooming', changefreq: 'daily', priority: 0.9 },
      { url: '/pet-boarding', changefreq: 'daily', priority: 0.9 },
      { url: '/pet-shops', changefreq: 'daily', priority: 0.9 },
      { url: '/blog', changefreq: 'daily', priority: 0.8 },
      { url: '/contact-us', changefreq: 'monthly', priority: 0.4 },
    ];

    // 2. Fetch Dynamic Data concurrently
    const [blogs, listings, cities, categories, customPages] = await Promise.all([
      Blog.find({ isPublished: true }, 'slug updatedAt'), 
      Listing.find({}, 'slug updatedAt'),
      City.find({}, 'slug'),
      Category.find({}, 'slug'),
      CustomPage.find({}, 'slug updatedAt')
    ]);

    // 3. Push Dynamic routes with explicit verification checks (Prevents "undefined")
    blogs.forEach(blog => {
      if (blog && blog.slug) {
        links.push({ url: `/blog/${blog.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: blog.updatedAt });
      }
    });

    listings.forEach(item => {
      if (item && item.slug) {
        links.push({ url: `/listing/${item.slug}`, changefreq: 'daily', priority: 0.8, lastmod: item.updatedAt });
      }
    });

    cities.forEach(city => {
      if (city && city.slug) {
        links.push({ url: `/city/${city.slug}`, changefreq: 'weekly', priority: 0.6 });
      } else {
        // 💡 Useful debug help: if you see this in your terminal, your City model doesn't use "slug"
        console.warn(`Warning: Found a City document without a slug property: ID ${city._id}`);
      }
    });

    categories.forEach(cat => {
      if (cat && cat.slug) {
        links.push({ url: `/category/${cat.slug}`, changefreq: 'weekly', priority: 0.6 });
      } else {
        console.warn(`Warning: Found a Category document without a slug property: ID ${cat._id}`);
      }
    });

    customPages.forEach(page => {
      if (page && page.slug) {
        links.push({ url: `/${page.slug}`, changefreq: 'monthly', priority: 0.5, lastmod: page.updatedAt });
      }
    });

    // 4. Create and stream the structured XML mapping
    const stream = new SitemapStream({ hostname: BASE_URL });
    res.header('Content-Type', 'application/xml');

    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
    res.send(xml);

  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).end();
  }
});

module.exports = router;