describe('Blog app', () => {
  beforeEach( function() {
    // reset db
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    // set up user
    const user = {
      name: 'tom',
      username: 'admin',
      password: 'admin'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('it succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('admin')
      cy.get('#login-button').click()
      cy.contains('tom logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').contains('Wrong userame or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const credentials = { username:'admin', password: 'admin' }
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, credentials)
        .then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('')
        })
    })

    it('A blog can be created', function() {
      cy.contains('Create New')
      cy.contains('new blog').click()

      cy.get('#title-input').type('Sick Blog')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog1')

      cy.contains('create').click()

      cy.get('.success').contains('a new blog Sick Blog by Tom Blogger was added')
    })

    it('A user can like a blog', function() {
      cy.contains('Create New')
      cy.contains('new blog').click()

      cy.get('#title-input').type('Sick Blog')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog1')

      cy.contains('create').click()

      cy.get('.success').contains('a new blog Sick Blog by Tom Blogger was added')
      cy.contains('View').click()
      cy.get('.like-button').click()
      cy.contains('Updated likes')
      cy.contains('Likes').contains('1')
    })

    it('A user who created a blog can delete it', function() {
      cy.contains('Create New')
      cy.contains('new blog').click()

      cy.get('#title-input').type('Sick Blog')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog1')

      cy.contains('create').click()

      cy.get('.success').contains('a new blog Sick Blog by Tom Blogger was added')
      cy.contains('View').click()
      cy.get('#remove-button').click()
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Remove Sick Blog by Tom Bloggerzzz')
      })
      cy.get('.success').contains('blog successfully removed')
    })

    it('The remove blog button is not visible to user who did not create it', function() {
      cy.contains('Create New')
      cy.contains('new blog').click()

      cy.get('#title-input').type('Sick Blog')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog1')

      cy.contains('create').click()

      cy.get('.success').contains('a new blog Sick Blog by Tom Blogger was added')
      cy.contains('View').click()
      cy.contains('remove')
      cy.get('#logout-button').click()

      // create user
      const user2 = {
        name: 'tim',
        username: 'timmy',
        password: 'timmy'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
      cy.visit('')
      // login
      const credentials = { username:'timmy', password: 'timmy' }
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, credentials)
        .then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('')
        })
      cy.contains('View').click()
      cy.get('#remove-button').should('not.be.visible')
    })

    it('blog list is ordered be number of likes in descending order', function() {
      cy.contains('Create New')

      // create 3 blogs
      cy.contains('new blog').click()
      cy.get('#title-input').type('Sick Blog')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog1')
      cy.contains('create').click()
      cy.get('.success').contains('a new blog Sick Blog by Tom Blogger was added')

      cy.get('.new-blog').click()
      cy.get('#title-input').type('Sick Blog2')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog2')
      cy.contains('create').click()
      cy.get('.success').contains('a new blog Sick Blog2 by Tom Blogger was added')

      cy.get('.new-blog').click()
      cy.get('#title-input').type('Sick Blog3')
      cy.get('#author-input').type('Tom Blogger')
      cy.get('#url-input').type('www.tomblogger.com/blog3')
      cy.contains('create').click()
      cy.get('.success').contains('a new blog Sick Blog3 by Tom Blogger was added')

      // distribute likes accross blogs
      // Add like to Sick Blog3
      cy.get('.view-blog-button').eq(2).click()
      cy.get('.like-button').eq(2).click()

      // add one like to Sick Blog2
      cy.get('.view-blog-button').eq(1).click()
      cy.get('.like-button').eq(1).click()

      // add second like to Sick Blog3
      // Note the indexing for a specific blog changes because
      // the order is adjusted as they recieve likes.
      cy.get('.view-blog-button').eq(1).click()
      cy.get('.like-button').eq(1).click()

      cy.get('.blog').eq(0).should('contain', 'Sick Blog3')
      cy.get('.blog').eq(1).should('contain', 'Sick Blog2')
      cy.get('.blog').eq(2).should('contain', 'Sick Blog')
    })
  })
})