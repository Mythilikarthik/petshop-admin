import React, {useState, useEffect} from 'react'
import PetHealthTips from '../Components/PetHealthTips';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Blog = () => {
    
    const [blog, setBlog] = useState([]);
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
    useEffect(() => {
    blogData();
    }, []);
  return (
    <PetHealthTips blog={blog} showViewAll={false} />
  )
}

export default Blog