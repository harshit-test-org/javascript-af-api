import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RepoSchema = new Schema(
  {
    name: String,
    nameWithOwner: String,
    url: String,
    imageURL: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

RepoSchema.pre('find', function () {
  this.populate('owner')
})

mongoose.model('Repo', RepoSchema)
