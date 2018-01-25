export default `
  type Query{
    getAllUsers: [User]
  },
  type User {
    email:String!
  }
`;
