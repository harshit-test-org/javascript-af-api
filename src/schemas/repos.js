export default `
  type Query {
    getRepos: [Repo!]
  }
  type Mutation {
    createRepository(name:String!, nameWithOwner: String!, description: String!): Repo!
  }
  type Repo {
    owner: User!
    name: String!
    nameWithOwner: String
    url: String
    image: String
    _id: ID
    description: String
    starCount: Int
    posted: String
  }
`
