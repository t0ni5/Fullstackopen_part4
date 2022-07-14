const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const result = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return result

}

const favouriteBlog = (blogs) => {
  const result = blogs.reduce((blogWithMostLikesForNow, blog) => {
    if (blog.likes > blogWithMostLikesForNow.likes) {
      return blog
    } else {
      return blogWithMostLikesForNow
    }
  }, blogs[0])

  const favBlog = {
    title: result.title,
    author: result.author,
    likes: result.likes
  }

  return favBlog
}

const mostBlogs = (blogs) => {
  const result = blogs.reduce((authors, blog) => {
    if (blog.author in authors) {
      authors[blog.author]++
    } else {
      authors[blog.author] = 1
    }

    return authors

  }, {})

  const listOfAuthors = Object.entries(result)

  const mostPopularAuthor = listOfAuthors.reduce((mostPopularTillNow, author) => {
    if (author[1] > mostPopularTillNow[1]) {
      return author
    } else {
      return mostPopularTillNow
    }
  })

  const mostPopularAuthorObj = {
    author: mostPopularAuthor[0],
    blogs: mostPopularAuthor[1]
  }


  return mostPopularAuthorObj

}

const mostLikes = (blogs) => {
  const result = blogs.reduce((authors, blog) => {
    if (blog.author in authors) {
      authors[blog.author] += blog.likes
    } else {
      authors[blog.author] = blog.likes
    }

    return authors

  }, {})

  const listOfAuthors = Object.entries(result)

  const authorWithMostLikes = listOfAuthors.reduce((mostPopularTillNow, author) => {
    if (author[1] > mostPopularTillNow[1]) {
      return author
    } else {
      return mostPopularTillNow
    }
  })

  const authorWithMostLikesObj = {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1]
  }

  return authorWithMostLikesObj
}




module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}