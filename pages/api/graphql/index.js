// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Cors from 'micro-cors';

const cors = Cors();

const typeDefs = gql`
  type Query {
    users: [User!]!
  }
  type User {
    name: String
  }
`;

const resolvers = {
  Query: {
    users(parent, args, context) {
      return [{ name: 'John Doe' }]
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})]
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  }
}

const startServer = apolloServer.start()

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer
  await apolloServer.getMiddleware({
    path: '/api/graphql'
  })(req, res)
});
