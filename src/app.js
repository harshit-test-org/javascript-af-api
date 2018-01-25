import express from 'express';
import morgan from 'morgan';
import { makeExecutableSchema } from 'graphql-tools';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import typeDefs from './schemas/schema';
import resolvers from './resolvers/resolvers';

const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(morgan('common'));

app.use(
  '/graphql',
  express.json(),
  graphqlExpress(() => ({
    schema
  }))
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
);

export default app;
