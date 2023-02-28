import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  // const hideWhenVisible = { display : visible ? 'none' : ''}
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdateLikes = async () => {

    const likes = blog.likes + 1
    const newBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes,
      user: blog.user ? blog.user.id : null
    }

    await updateBlog(newBlog)
  }

  const handleRemoveBlog = async (blog) => {
    await removeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => toggleVisibility()}>{visible ? 'Hide' : 'View'}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          Likes: {blog.likes}
          <button onClick={() => handleUpdateLikes()}>Like</button>
        </div>
        <div>{blog.user ? blog.user.name : ''}</div>
        <button onClick={() => handleRemoveBlog(blog)}>remove</button>
      </div>
    </div>
  )
}

export default Blog