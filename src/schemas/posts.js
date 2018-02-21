export default `
  type Query{
    getFeed: [Feed]
  }
  type Mutation{
    setPost(authorId:ID!,text:String!): SetPostResponse!
  }
  type Feed {
    _id: ID!,
    text: String!,
    authorId: ID!,
    createdAt: String!,
    author: User!
  }
  type SetPostResponse {
    ok: Boolean!,
    message: String
  }
`
