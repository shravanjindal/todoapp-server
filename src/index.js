import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

// GraphQL schema
const typeDefs = `#graphql
  type TODO {
    id: Int!
    title: String!
    descrption: String
    week: String
    completed: Boolean
    createdAt: String
    updatedAt: String
  }

  type Query {
    todos: [TODO]
    todo(id: Int!): TODO
  }

  type Mutation {
    addTodo(title: String!, descrption: String, week: String): TODO
    updateTodo(id: Int!, title: String, descrption: String, week: String, completed: Boolean): TODO
    updateTodoStatus(id: Int!, completed: Boolean!): TODO
    deleteTodo(id: Int!): TODO
  }
`;

// Resolvers
const resolvers = {
  Query: {
    todos: async () => await prisma.todos.findMany(),
    todo: async (_, { id }) => await prisma.todos.findUnique({ where: { id } }),
  },
  Mutation: {
    addTodo: async (_, args) => await prisma.todos.create({ data: args }),
    updateTodo: async (_, { id, ...data }) => await prisma.todos.update({ where: { id }, data }),
    updateTodoStatus: async (_, {id, completed}) => await prisma.todos.update({ where: { id }, data: { completed } }),
    deleteTodo: async (_, { id }) => await prisma.todos.delete({ where: { id } }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({
      token: req.headers.authorization,
    }),
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
