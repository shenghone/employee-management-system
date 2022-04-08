import { ApolloServer } from "apollo-server-express";
import express from "express";
import session from "express-session";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import mongoose from "mongoose";
import schemaDirectives from "./directives";
const MongoStore = require('connect-mongodb-session')(session)
//to disable the depreciate warning as mongoose documentation suggests
require("dotenv").config();
mongoose.set("useFindAndModify", false);
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
          //sameSite: "none",
          //secure: true
        }
      })
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
      introspection: true
    });

    const corsOptions = {
      origin: process.env.FRONT_END,
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
