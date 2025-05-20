import React, { useEffect } from 'react'
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


const Editblog = () => {
  const [blog, setBlog] = useState('');
  const params = useParams();


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const defaultText = 'Write Description Here...';
  const [html, setHtml] = useState('');
  const [imageId, setImageId] = useState('');
  const navigate = useNavigate();
  function onChange(e) {
    setHtml(e.target.value);
  }


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:8000/api/save-temp-image/', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();

    if (result.status === false) {
      alert(result.errors.image);
      e.target.value = null;
    }


    setImageId(result.image.id);

  }


  const fetchBlog = async () => {
    const res = await fetch(`http://localhost:8000/api/blogs/${params.id}`);
    const result = await res.json();
    setHtml(result.data.description);
    setBlog(result.data);
    reset(result.data);

  }


  const formSubmit = async (data) => {
    const newData = { ...data, 'description': html, image_id: imageId };
    const res = await fetch(`http://localhost:8000/api/blogs/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    });

    toast("Blog Updated Successfully.");
    navigate('/');

    // console.log(newData);

  }

  useEffect(() => {
    fetchBlog();
  }, [])

  return (
    <div className="container mb-5">
      <div className="d-flex justify-content-between align-items-center pt-5 mb-4">
        <h4>Edit Blogs</h4>
        <a href="/" className="btn btn-dark">Back</a>
      </div>
      <div className="card border-0 shadow-lg">
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="card-body">
            <div className="mb-3">
              <label className='form-label'>Title</label>
              <input {...register('title', { required: true })}
                type="text"
                className={`form-control ${errors.title && 'is-invalid'}`}
                placeholder='Name' />
              {/* errors will return when field validation fails  */}
              {errors.title && <p className='invalid-feedback'>This field is required</p>}
            </div>
            <div className="mb-3">
              <label className='form-label'>Short Description</label>
              <textarea
                {...register('shortDesc')}
                cols='30'
                rows='5'
                className='form-control' />
            </div>

            <div className="mb-3">
              <label className='form-label'>Description</label>
              <Editor
                containerProps={{ style: { height: '700px' } }}
                value={html}
                placeholder={defaultText}
                onChange={onChange}
              />
              {/* <textarea className='form-control' name="" id="" cols="30" rows="10"></textarea> */}
            </div>


            <div className="mb-3">
              <label className='form-label'>Image</label> <br />
              <input
                onChange={handleFileChange}
                type="file" />
              <div className='mt-3'>
                <img
                  className="w-50"
                  src={blog.image ? `http://localhost:8000/uploads/blogs/${blog.image}` : 'https://placehold.co/600x400'}
                  alt={blog.title || 'Blog Image'}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className='form-label'>Author</label>
              <input
                {...register('author', { required: true })}
                type="text"
                className={`form-control ${errors.author && 'is-invalid'}`}
                placeholder='Author' />
              {/* errors will return when field validation fails  */}
              {errors.author && <p className='invalid-feedback'>Author field is required</p>}
            </div>

            <button className="btn btn-dark">Update Blog</button>

          </div>
        </form>

      </div>
    </div>
  )
}

export default Editblog