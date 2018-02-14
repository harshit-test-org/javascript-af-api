import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PostsSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String,
  created_at: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('Post', PostsSchema)
