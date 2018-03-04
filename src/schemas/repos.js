export default `
  type Query {
    getRepos: [Repo!]
  }
  type Repo {
    owner: User!
    name: String!
    imageURL: String!
    _id: ID!
    description: String
  }
`
