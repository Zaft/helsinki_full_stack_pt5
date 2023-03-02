import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
// import _ from "lodash"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      setIsError(true)
      setMessage(
        'Wrong userame or password'
      )
      setTimeout(() => { setMessage(null)}, 5000)
    }
  }

  const createBlog = async (blog) => {
    // console.log('create blog', blog)
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
    }

    try {
      const result = await blogService.create(newBlog)
      setBlogs(blogs.concat(result))
      blogFormRef.current.toggleVisibility()
      setIsError(false)
      setMessage(
        `a new blog ${blog.title} by ${blog.author} was added`
      )
      setTimeout(() => { setMessage(null)}, 5000)

    } catch (err) {
      setIsError(true)
      setMessage(
        `Unable to add new blog: ${err}`
      )
      setTimeout(() => { setMessage(null)}, 5000)
    }
  }

  const updateBlog = async (blog) => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user,
    }

    try {
      await blogService.update(updatedBlog.id, updatedBlog)
      let blogs = await blogService.getAll()
      setBlogs(blogs)
      setIsError(false)
      setMessage(
        'Updated likes'
      )
      setTimeout(() => { setMessage(null)}, 5000)

    } catch(err) {
      setIsError(true)
      setMessage(
        `Unable to update likes: ${err}`
      )
      setTimeout(() => { setMessage(null)}, 5000)
    }
  }

  const removeBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        const blogId = blog.id
        await blogService.remove(blogId)
        setBlogs(blogs.filter(blog => blog.id !== blogId))
        setIsError(false)
        setMessage(
          'blog successfully removed'
        )
        setTimeout(() => { setMessage(null)}, 5000)

      } catch (error) {
        setIsError(true)
        setMessage(
          `Unable to delete blog: ${error}`
        )
        setTimeout(() => { setMessage(null)}, 5000)
      }
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('handleLogout')
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} isError={isError}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError}/>
      <p>
        {user.name} logged in
        <button id='logout-button'
          onClick={handleLogout}>log out</button>
      </p>
      <h3>Create New</h3>
      <Togglable
        classLabel="new-blog"
        buttonLabel="new blog"
        ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          className={blog}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App