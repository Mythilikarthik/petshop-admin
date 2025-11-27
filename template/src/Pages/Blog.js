import React, {useState, useEffect} from 'react'
import PetHealthTips from '../Components/PetHealthTips';
import AdSlider from '../Components/AdSlider';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Blog = () => {
    const pgname ="blog";
    const [blog, setBlog] = useState([]);
    const [topHomeAds, setTopHomeAds] = useState([]);
      const [bottomHomeAds, setBottomHomeAds] = useState([]);
      const [middleHomeAds, setMiddleHomeAds] = useState([]);
    const [adSettings, setAdSettings] = useState({ slideInterval: 5, maxImages: 5 });
    const blogData = async () => {
    try {
        const blogRes = await fetch(`${API_BASE}/api/blog`);
        const blogData = await blogRes.json();
        if(blogData.success) {
        //console.log("Blog Data:", blogData.blogs);
        setBlog(blogData.blogs);
        }
    } catch (err) {
        console.error("Error fetching blog data:", err);
    }
    };
    const fetchBottomHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/bottom/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setBottomHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
const fetchMiddleHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/middle/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setMiddleHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
    const fetchTopHomeAds = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/ads/top/${pgname}`);
    const data = await res.json();

    if (data.success) {
      // Apply the limit here
      const limitedAds = data.ads.slice(0, data.settings.maxImages);

      setTopHomeAds(limitedAds);
      setAdSettings(data.settings); 
    }
  } catch (err) {
    console.error("Error fetching home ads:", err);
  }
};
    useEffect(() => {
      fetchTopHomeAds();
    fetchBottomHomeAds();
    fetchMiddleHomeAds();
    blogData();
    }, []);
  return (
    <>
    {topHomeAds.length > 0 && (
      <AdSlider ads={topHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
    )}
    {middleHomeAds.length > 0 && (
            <AdSlider ads={middleHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} float={true}
      side="right" />
          )}
    <PetHealthTips blog={blog} showViewAll={false} />
     {bottomHomeAds.length > 0 && (
        <AdSlider ads={bottomHomeAds} maxImages={adSettings.maxImages} interval={adSettings.slideInterval} />
      )}
      </>
  )
}

export default Blog