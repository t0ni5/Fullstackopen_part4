const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const { send } = require('express/lib/response')
const { createIndexes } = require('../models/blog')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const initialBlogs = [
  {
    title: 'google\'s blog',
    author: 'Google',
    url: 'google.com',
    likes: 5,
  },
  {
    title: 'cat\'s blog',
    author: 'cat',
    url: 'cats.com',
    likes: 1000,
  },
]

const userForTesting = {
  username: 'testUser',
  name: 'user',
  password: 'test'
}


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  await User.deleteMany({})


}, 15000)





test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)


  expect(result).toBe(1)

})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })


})

describe('blogs with biggest properties', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]

  test('blog with most likes', () => {
    const favBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }

    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(favBlog)
  })

  test('authors with most blogs', () => {
    const authorWithMostBlogs = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(authorWithMostBlogs)
  })

  test('authors with most likes', () => {
    const authorWithMostBlogs = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(authorWithMostBlogs)
  })
})

test('blog list application returns the correct amount of blog posts in the JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialBlogs.length)
}, 10000)

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })

})

test('POST request  successfully creates a new blog post', async () => {
  const res = await api
    .post('/api/users')
    .send(userForTesting)
    .expect(201)

  const user = res.body

  const loginResponse = await api
    .post('/api/login')
    .send(userForTesting)
    .expect(200)

  const token = loginResponse.body.token



  const newBlog = {
    title: 'dog\'s blog',
    author: 'dog',
    url: 'dogs.com',
    likes: 10000,
    user: {
      id: user.id,
      name: user.name,
      username: user.username

    }
  }




  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  newBlog.id = response.body[response.body.length - 1].id
  expect(response.body).toContainEqual(newBlog)
})

test('if the likes prop is missing, it will be 0', async () => {
  const res = await api
    .post('/api/users')
    .send(userForTesting)
    .expect(201)

  const user = res.body

  const loginResponse = await api
    .post('/api/login')
    .send(userForTesting)
    .expect(200)

  const token = loginResponse.body.token
  const newBlog = {
    title: 'dog\'s blog',
    author: 'dog',
    url: 'dogs.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  expect(response.body.likes).toEqual(0)

})

test('if title and url are missing backend responds with 400 Bad Request', async () => {
  const res = await api
    .post('/api/users')
    .send(userForTesting)
    .expect(201)

  const user = res.body

  const loginResponse = await api
    .post('/api/login')
    .send(userForTesting)
    .expect(200)

  const token = loginResponse.body.token

  const newBlog = {
    author: 'dog',
    likes: 10000,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)


}, 10000)

test('delete succeeds with status code 204 if id is valid', async () => {
  const res = await api
    .post('/api/users')
    .send(userForTesting)
    .expect(201)

  const user = res.body

  const loginResponse = await api
    .post('/api/login')
    .send(userForTesting)
    .expect(200)

  const token = loginResponse.body.token

  const dataForBlogToDelete =
  {
    title: 'Blog To Delete',
    author: 'tester',
    url: 'test.com',
    likes: '55'
  }


  const createdBlogToDelete = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(dataForBlogToDelete)
    .expect(201)


  const blogToDelete = createdBlogToDelete.body

  const blogs = await api.get('/api/blogs')

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs/')

  expect(blogsAtEnd.body).toHaveLength(
    initialBlogs.length
  )

  const titles = blogsAtEnd.body.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)

}
)


test('update succeeds with status code 200 if id is valid', async () => {
  const blogs = await api.get('/api/blogs')
  const blogToUpdate = blogs.body[0]

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: 555 })
    .expect(200)


  expect(response.body.likes).toEqual(555)
})

test('adding blog fails with status 401 if token is not provied', async () => {


  const res = await api
    .post('/api/users')
    .send(userForTesting)
    .expect(201)

  const user = res.body


  const newBlog = {
    title: 'dog\'s blog',
    author: 'dog',
    url: 'dogs.com',
    likes: 10000,
    user: {
      id: user.id,
      name: user.name,
      username: user.username

    }
  }



  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
  expect(response.body).not.toContainEqual(newBlog)
})

describe('tests of validation of /api/users', () => {
  test('invalid u/p is not added and returns correct status code and error message', async () => {
    const credentialsWithInvalidUsername = {
      username: 'AJ',
      password: 'ACDC'
    }
    const credentialsWithInvalidPassword = {
      username: 'AJC',
      password: 'AC'
    }

    const resultWithUsername = await api
      .post('/api/users')
      .send(credentialsWithInvalidUsername)
      .expect(400)

    expect(resultWithUsername.body.error).toContain('username and password must be at least 3 characters long')

    const resultWithPass = await api
      .post('/api/users')
      .send(credentialsWithInvalidUsername)
      .expect(400)
    expect(resultWithPass.body.error).toContain('username and password must be at least 3 characters long')

  })

  test('if u/p is missing returns correct status code and error message', async () => {
    const credentialsWithMissingUsername = {
      password: 'ACDC'
    }
    const credentialsWithMissingPassword = {
      username: 'AJC',
    }

    const resultWithMissingUsername = await api
      .post('/api/users')
      .send(credentialsWithMissingUsername)
      .expect(400)

    expect(resultWithMissingUsername.body.error).toContain('username and password must be given')

    const resultWithMissingPass = await api
      .post('/api/users')
      .send(credentialsWithMissingPassword)
      .expect(400)
    expect(resultWithMissingPass.body.error).toContain('username and password must be given')
  })

  test('if username already exists server returns correct status code and error message', async () => {
    const credentials = {
      username: 'Victor',
      password: 'wefwefwf1'
    }

    const users = await User.find({})

    const r = await api
      .post('/api/users')
      .send(credentials)
      .expect(201)





    const result = await api
      .post('/api/users')
      .send(credentials)
      .expect(400)

    expect(result.body.error).toContain('username must be unique')
  })

})

afterAll(() => {
  mongoose.connection.close()
})

