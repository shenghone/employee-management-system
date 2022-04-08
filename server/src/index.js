import { ApolloServer } from "apollo-server-express";
import express from "express";
import session from "express-session";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import mongoose from "mongoose";
import cors from "cors";
import schemaDirectives from "./directives";
const MongoStore = require('connect-mongodb-session')(session)
//to disable the depreciate warning as mongoose documentation suggests
require("dotenv").config();
const PORT = process.env.PORT || 8083;
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
          maxAge: parseInt(process.env.SESS_LIFETIME),
          sameSite: false,
          secure: true
        }
      })
    );
    const corsOptions = {
      origin: "https://employee-management-system-iota.vercel.app",
      credentials: true,
    };
    app.use(cors(corsOptions));
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: true,
      fetchOptions: {
       credentials: "include",
     },
      context: ({ req, res }) => ({ req, res }),
      introspection: true
    });


    server.applyMiddleware({
      app,
      cors: false
    });

    app.listen(PORT, () => {
      console.log(
        `🚀 Server is ready`
      );
    });
  } catch (err) {
    console.error(err);
  }
})();
