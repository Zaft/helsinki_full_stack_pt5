import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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