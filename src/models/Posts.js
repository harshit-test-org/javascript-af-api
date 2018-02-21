import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PostsSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String
  },
  {
    timestamps: true
  }
)

mongoose.model('Post', PostsSchema)
