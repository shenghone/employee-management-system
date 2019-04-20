import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    Team(id: String!): TeamType @auth
    Teams: [TeamType!]! @auth
  }

  extend type Mutation {
    CreateTeam(
      TeamName: String!
      ProjectIds: [ID!]!
      EmployeeIds: [ID!]!
      TeamLeadId: ID!
    ): TeamType @auth
    UpdateTeam(
      id: ID!
      TeamName: String!
      ProjectIds: [ID!]!
      EmployeeIds: [ID!]!
      TeamLeadId: ID!
    ): TeamType @auth
  }

  type TeamType {
    id: ID!
    TeamName: String!
    Projects: [ProjectType!]!
    Employees: [EmployeeType!]!
    TeamLead: EmployeeType!
    createdAt: String
    updatedAt: String
  }
`;
