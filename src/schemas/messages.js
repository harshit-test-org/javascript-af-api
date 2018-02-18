export default `
  type Subscription {
    msg(channelId: ID!): Message!
  }
  type Message {
    channelId: ID!
    text: String!
    created_at: String!
  }
  type Mutation {
    createMessage(text: String!, channelId:ID!): Message!
  }
`
