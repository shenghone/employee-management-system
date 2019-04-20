import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    Position(id: ID!): PositionType @auth
    Positions: [PositionType!]!
  }
  extend type Mutation {
    CreatePosition(
      PositionName: String!
      PositionDescription: String!
      PositionBaseSalary: Int!
    ): PositionType @auth
    UpdatePosition(
      id: ID!
      PositionName: String!
      PositionDescription: String!
      PositionBaseSalary: Int!
    ): PositionType @auth
  }
  type PositionType {
    id: ID!
    PositionName: String!
    PositionDescription: String!
    PositionBaseSalary: Int!
  }
`;
