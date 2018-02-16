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
    created_at: String!,
    author: User!
  }
  type SetPostResponse {
    ok: Boolean!,
    message: String
  }
`
