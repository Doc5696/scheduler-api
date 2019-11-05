const mongoose = require('mongoose')
const express = require('express')
const Schema = mongoose.Schema
const cors = require('cors')

const app = express()
const jsonParser = express.json()

app.use(cors())

const postSchema = new Schema({
  headline: String,
  body: String
}, {versionKey: false})

const Post = mongoose.model('Post', postSchema)

mongoose.connect('mongodb://localhost:27017/scheduler', { useNewUrlParser: true }, function(err){
	if(err) return console.log(err)
    app.listen(8000, function(){
      console.log(`Server is runing on port 8000`)
    })
})

app.get('/api/posts', function(req, res){

	Post.find({}, function(err, posts){

    if(err) return console.log(err)
    console.log(`GET request | ${posts.length} returned`)
		res.send(posts)
	})
})

app.get('/api/posts/:id', function(req, res){

  const id = req.params.id
	Post.findOne({_id: id}, function(err, post){

    if(err) return console.log(err)
    res.send(post)
	})
})

app.post('/api/posts', jsonParser, function (req, res) {

  if(!req.body) return res.sendStatus(400)

  const postHeadline = req.body.headline
  const postBody = req.body.body
  const post = new Post({headline: postHeadline, body: postBody})

  post.save(function(err){
		if(err) return console.log(err)
    res.send(post)
    console.log(`POST request | new post created`)
	})
})

app.delete('/api/posts/:id', function(req, res){
        
  const id = req.params.id;
  Post.findByIdAndDelete(id, function(err, post){
               
    if(err) return console.log(err)
    res.send(post)
    console.log('DELETE request | the post was deleted')
  })
})

app.put('/api/posts/:id', jsonParser, function(req, res){
        
  if(!req.body) return res.sendStatus(400)
  const id = req.params.id
  const newHeadline = req.body.headline
  const newBody = req.body.body
	const newPost = {headline: newHeadline, body: newBody}

	Post.findOneAndUpdate({_id: id}, newPost, {new: true}, function(err, post){
    if(err) return console.log(err)
    res.send(post)
    console.log('PUT request | the post updated')
  })
})
