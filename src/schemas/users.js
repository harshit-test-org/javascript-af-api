export default `
  type Query{
    getAllUsers: [User],
    getUserById(id:ID!): User!
  },
  type User {
    _id: String!,
    name: String!,
    photoURL: String!,
    bio: String!
  }
`
