import { gql } from "apollo-server-express";

//decide whether to set start date and end date as mandatory

export default gql`
  type ProjectType {
    id: ID!
    ProjectName: String!
    ProjectDescription: String!
    ProjectStartDate: String
    ProjectEndDate: String
    createdAt: String
    updatedAt: String
  }
  extend type Query {
    Project(id: ID!): ProjectType @auth
    Projects: [ProjectType!]! @auth
  }
  extend type Mutation {
    CreateProject(
      ProjectName: String!
      ProjectDescription: String!
      ProjectStartDate: String!
    ): ProjectType @auth
    UpdateProject(
      id: ID!
      ProjectName: String!
      ProjectDescription: String!
      ProjectStartDate: String!
      ProjectEndDate: String
    ): ProjectType @auth
  }
`;
