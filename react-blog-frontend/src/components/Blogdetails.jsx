import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Blogdetails = () => {

    const [blog, setBlog] = useState('');
    const params = useParams();

    const fetchBlog = async () => {
        const res = await fetch(`http://localhost:8000/api/blogs/${params.id}`);
        const result = await res.json();
        setBlog(result.data);
        // console.log(params.id);

    }

    useEffect(() => {
        fetchBlog();
    }, [])

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center pt-5 mb-4">
                <h4>{blog.title}</h4>
                <div>
                    <a href="/" className="btn btn-dark">back to blogs</a>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <p>by <strong>{blog.author}</strong> on {blog.date}</p>

                    <img
                        className="w-50"
                        src={blog.image ? `http://localhost:8000/uploads/blogs/${blog.image}` : 'https://placehold.co/600x400'}
                        alt={blog.title || 'Blog Image'}
                    />

                    <div>
                        {blog.description && <div className='mt-5' dangerouslySetInnerHTML={{ __html: blog.description }}></div>}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Blogdetails