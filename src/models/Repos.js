import mongoose from 'mongoose'
import { distanceInWordsToNow } from 'date-fns'
const Schema = mongoose.Schema

const RepoSchema = new Schema(
  {
    name: String,
    nameWithOwner: String,
    url: String,
    imageURL: String,
    description: String,
    starCount: Number,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
)

RepoSchema.pre('find', function() {
  this.populate('owner')
})

RepoSchema.virtual('posted').get(function() {
  return distanceInWordsToNow(this.createdAt, {
    addSuffix: true
  })
})

mongoose.model('Repo', RepoSchema)
