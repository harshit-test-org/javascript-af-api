export default `
  type Query{
    getFeed: [Feed]
  }
  type Feed {
    _id: ID!,
    text: String!,
    authorId: ID!,
    created_at: String!,
    author: User!
  }
`
