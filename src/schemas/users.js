export default `
  type Query{
    getAllUsers: [User],
    getUserById(id:ID!): User!
    getUserGithubRepos: [Repo!]
  },
  type User {
    _id: String!,
    username: String!,
    name: String!,
    photoURL: String!,
    bio: String
  }
`
