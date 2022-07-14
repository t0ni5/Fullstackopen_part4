const blogsRouter = require('express').Router()
const { isValidObjectId } = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')




blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const token = request.token
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  const user = request.user


  if (body.title === undefined && body.url === undefined) {
    response.status(400).end()

  } else {

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
})


blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blogToUpdate = await Blog.findById(request.params.id)


  const blog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: body.likes,
    id: blogToUpdate.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog)



})
module.exports = blogsRouter
