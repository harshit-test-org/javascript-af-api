export default `
  type Subscription {
    msg(channelId: ID!): Message!
  }
  type Query {
    getUserChannels: Channels!
    getMessages(channelId: ID! offset:Int): [Message!]
  }
  type Message {
    _id: ID!
    uid: ID
    channelId: ID!
    text: String!
    createdAt: String!
    author: User!
  }
  type Mutation {
    createMessage(text: String!, channelId:ID!, uid: ID!): Message!
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
