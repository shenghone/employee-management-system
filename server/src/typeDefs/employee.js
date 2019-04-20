import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    Me: EmployeeType @auth
    Employee(id: ID!): EmployeeType @auth
    Employees: [EmployeeType!]! @auth
    EmployeeEmails: [EmployeeType!]!
  }
  extend type Mutation {
    SignUp(
      FirstName: String!
      LastName: String!
      AddressStreet: String!
      AddressState: String!
      AddressCity: String!
      AddressZip: String!
      Password: String!
      Email: String!
      Username: String!
      Position: ID!
      PhoneNum: String!
      HireDate: String!
      Extension: Int
    ): EmployeeType @guest
    SignIn(Email: String!, Password: String!): EmployeeType @guest
    SignOut: Boolean @auth
    UpdateEmployee(
      id: ID!
      FirstName: String!
      LastName: String!
      AddressStreet: String!
      AddressState: String!
      AddressCity: String!
      AddressZip: String!
      Username: String!
      Position: String!
      Email: String!
      SalaryBonus: Int
      HireDate: String!
      PhoneNum: String!
      Extension: Int!
    ): EmployeeType @auth
  }
  type EmployeeType {
    id: ID!
    Position: PositionType!
    FirstName: String!
    LastName: String!
    AddressStreet: String!
    AddressState: String!
    AddressCity: String!
    AddressZip: String!
    Email: String
    Username: String
    PhoneNum: String!
    Extension: Int
    HireDate: String!
    SalaryBonus: Int
    createdAt: String
    updatedAt: String
  }
`;
