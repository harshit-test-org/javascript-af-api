export default `
  type Query {
    getRepos: [Repo!]
  }
  type Repo {
    owner: User!
    name: String!
    nameWithOwner: String!
    url: String
    imageURL: String
    _id: ID
    description: String
    starCount: Int
  }
`
