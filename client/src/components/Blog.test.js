import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {

  test('renders content', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Bobby Author',
      url: 'www.superblogs.com/blog1',
      likes: 11,
      user: ''
    }

    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library'
    )
    expect(div).toHaveTextContent(
      'Bobby Author'
    )
    expect(div).toHaveTextContent(
      'www.superblogs.com/blog1'
    )
    expect(div).toHaveTextContent(
      '11'
    )
  })

  test('at start the children are not displayed', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Bobby Author',
      url: 'www.superblogs.com/blog1',
      likes: 11,
      user: ''
    }
    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Bobby Author',
      url: 'www.superblogs.com/blog1',
      likes: 11,
      user: ''
    }

    const { container } = render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)
    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking the button twice, event handle is called twice', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Bobby Author',
      url: 'www.superblogs.com/blog1',
      likes: 11,
      user: ''
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})