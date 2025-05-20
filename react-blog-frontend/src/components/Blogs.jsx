import { Blogcard } from './Blogcard';
import { useState, useEffect } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState('');

  const fetchBlogs = async () => {
    const res = await fetch('http://localhost:8000/api/blogs');
    const result = await res.json();
    setBlogs(result.data);
  };

  const resetSearch = async () => {
    setKeyword('');
    const res = await fetch('http://localhost:8000/api/blogs');
    const result = await res.json();
    setBlogs(result.data);
  }

  const searchBlogs = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/blogs?keyword=${keyword}`);
    const result = await res.json();
    setBlogs(result.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container">
      <form onSubmit={searchBlogs}>
        <div className="d-flex justify-content-center align-items-center pt-5 mb-4">
          <div className='d-flex'>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='form-control'
              placeholder='Search Blogs'
            />
            <button className='btn btn-dark ms-2'>Search</button>
            <button type='button' onClick={()=> resetSearch()} className='btn btn-success ms-2'>Reset</button>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center pt-5 mb-4">
        <h4>Blogs</h4>
        <a href="/create" className="btn btn-dark">Create</a>
      </div>

      <div className="row">
        {blogs && blogs.map((blog) => (
          <Blogcard
            key={blog.id}
            blog={blog}
            blogs={blogs}
            setblogs={setBlogs}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
