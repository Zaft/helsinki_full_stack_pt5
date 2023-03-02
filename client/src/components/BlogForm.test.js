import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('event handler is called with the correct properties when a blog is created', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)
    const createButton = screen.getByText('create')

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    await userEvent.type(titleInput, 'Awesome Blog Title')
    await userEvent.type(authorInput, 'Bobby Bloger')
    await userEvent.type(urlInput, 'www.bobbyblogger.com/blogpost12')

    await user.click(createButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    // console.log('createBlog mock calls', createBlog.mock.calls[0][0])
    expect(createBlog.mock.calls[0][0].title).toBe('Awesome Blog Title')
    expect(createBlog.mock.calls[0][0].author).toBe('Bobby Bloger')
    expect(createBlog.mock.calls[0][0].url).toBe('www.bobbyblogger.com/blogpost12')
  })
})