import { useState } from 'react'

const BlogForm = (props) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    await props.createBlog(newBlog)

    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
          title: <input
          id='title-input'
          placeholder='title...'
          value={newTitle}
          onChange={handleTitleChange}/>
      </div>
      <div>
          author: <input
          id='author-input'
          placeholder='author...'
          value={newAuthor}
          onChange={handleAuthorChange} />
      </div>
      <div>
          url: <input
          id='url-input'
          placeholder='url...'
          value={newUrl}
          onChange={handleUrlChange} />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}
export default BlogForm