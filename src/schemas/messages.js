export default `
  type Subscription {
    msg(channelId: ID!): Message!
  }
  type Query {
    getUserChannels: Channels!
  }
  type Message {
    channelId: ID!
    text: String!
    created_at: String!
  }
  type Mutation {
    createMessage(text: String!, channelId:ID!): Message!
  }
  type Channels{
    global: [Channel],
    dms: [Channel]
  }
  type Channel{
    _id: ID!
    name: String!,
    imageURL: String
  }
`
