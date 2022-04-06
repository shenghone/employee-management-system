import { ApolloServer } from "apollo-server-express";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import mongoose from "mongoose";
import schemaDirectives from "./directives";
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(
     `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
       process.env.DB_HOST
     }/${process.env.DB_NAME}?retryWrites=true&w=majority`,
     { useNewUrlParser: true }
   );
    const path = "/graphql";
    const app = express();
    app.disable("x-powered-by");
    const RedisStore = connectRedis(session);
    const store = new MongoStore({
        uri: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
          process.env.DB_HOST}`,
        databaseName: process.env.DB_NAME,
        collection: 'team-api-sessions',
    })

    app.use(
      session({
        store,
        name: process.env.SESS_NAME,
        secret: process.env.SESS_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
          masAge: parseInt(process.env.SESS_LIFETIME),
          sameSite: false,
          secure: false
        }
      })
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: false,
      context: ({ req, res }) => ({ req, res }),
      introspection: true
    });

    const corsOptions = {
      origin: "https://management-demo-app.surge.sh",
      credentials: true
    };

    server.applyMiddleware({
      app,
      path,
      cors: corsOptions
    });
    const PORT = process.env.PORT || 8083;
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${process.env.APP_PORT}${
          server.graphqlPath
        }`
      );
    });
  } catch (err) {
    console.error(err);
  }
})();
