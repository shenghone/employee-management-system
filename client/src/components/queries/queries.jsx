import { gql } from "apollo-boost";

//mutations
const signUpMutation = gql`
  mutation SignUp(
    $AddressStreet: String!
    $AddressState: String!
    $AddressCity: String!
    $AddressZip: String!
    $Password: String!
    $Email: String!
    $Username: String!
    $Position: ID!
    $PhoneNum: String!
    $HireDate: String!
    $Extension: Int
    $FirstName: String!
    $LastName: String!
  ) {
    SignUp(
      AddressStreet: $AddressStreet
      AddressState: $AddressState
      FirstName: $FirstName
      LastName: $LastName
      AddressCity: $AddressCity
      AddressZip: $AddressZip
      Password: $Password
      Email: $Email
      Username: $Username
      Position: $Position
      PhoneNum: $PhoneNum
      HireDate: $HireDate
      Extension: $Extension
    ) {
      id
      FirstName
    }
  }
`;

/*
    AddressStreet:$AddressStreet,
     AddressState:$AddressState,
     FirstName:$FirstName,
     LastName:$LastName,

     AddressCity:$AddressCity,
     AddressZip:$AddressZip,
     Password:$Password,
     Email:$Email,
     Username:$Username,
     Position:$ Position,
     PhoneNum:$PhoneNum,
     HireDate:$HireDat,
     Extension:$Extension,
     FirstName:$FirstName,
     LastName:$LastName,

*/

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    SignIn(Email: $email, Password: $password) {
      FirstName
      LastName
      Email
    }
  }
`;

const signOutMutation = gql`
  mutation {
    SignOut
  }
`;

const createTeamMutation = gql`
  mutation CreateTeam(
    $TeamName: String!
    $ProjectIds: [ID!]!
    $EmployeeIds: [ID!]!
    $TeamLeadId: ID!
  ) {
    CreateTeam(
      TeamName: $TeamName
      ProjectIds: $ProjectIds
      EmployeeIds: $EmployeeIds
      TeamLeadId: $TeamLeadId
    ) {
      id
      TeamName
    }
  }
`;

const updateTeamMutation = gql`
  mutation UpdateTeam(
    $id: ID!
    $TeamName: String!
    $ProjectIds: [ID!]!
    $EmployeeIds: [ID!]!
    $TeamLeadId: ID!
  ) {
    UpdateTeam(
      id: $id
      TeamName: $TeamName
      EmployeeIds: $EmployeeIds
      TeamLeadId: $TeamLeadId
      ProjectIds: $ProjectIds
    ) {
      id
      TeamName
      Employees {
        id
      }
      Projects {
        id
      }
    }
  }
`;

const updateProjectMutation = gql`
  mutation UpdateProject(
    $id: ID!
    $ProjectName: String!
    $ProjectDescription: String!
    $ProjectStartDate: String!
    $ProjectEndDate: String!
  ) {
    UpdateProject(
      id: $id
      ProjectDescription: $ProjectDescription
      ProjectStartDate: $ProjectStartDate
      ProjectName: $ProjectName
      ProjectEndDate: $ProjectEndDate
    ) {
      id
      ProjectStartDate
      ProjectEndDate
      ProjectDescription
      ProjectName
    }
  }
`;

const updateEmployeeMutation = gql`
  mutation UpdateEmployee(
    $id: ID!
    $HireDate: String!
    $AddressStreet: String!
    $AddressCity: String!
    $AddressState: String!
    $AddressZip: String!
    $PhoneNum: String!
    $Extension: Int!
    $FirstName: String!
    $LastName: String!
    $SalaryBonus: Int!
    $Email: String!
    $Username: String!
    $Position: String!
  ) {
    UpdateEmployee(
      id: $id
      Position: $Position
      AddressStreet: $AddressStreet
      AddressCity: $AddressCity
      AddressState: $AddressState
      AddressZip: $AddressZip
      PhoneNum: $PhoneNum
      Extension: $Extension
      Email: $Email
      SalaryBonus: $SalaryBonus
      HireDate: $HireDate
      Username: $Username
      FirstName: $FirstName
      LastName: $LastName
    ) {
      id
      AddressStreet
      AddressCity
      AddressState
      AddressZip
      PhoneNum
      Extension
      Email
      SalaryBonus
      HireDate
      Username
      FirstName
      LastName
    }
  }
`;

const createProjectMutation = gql`
  mutation CreateProject(
    $ProjectName: String!
    $ProjectDescription: String!
    $ProjectStartDate: String!
  ) {
    CreateProject(
      ProjectName: $ProjectName
      ProjectDescription: $ProjectDescription
      ProjectStartDate: $ProjectStartDate
    ) {
      id
      ProjectName
      ProjectDescription
      ProjectStartDate
    }
  }
`;

//queries

/*const positionQuery = gql`
  query($id: String!) {
    Position(id: $id) {
      id
      PositionName
      PositionBaseSalary
      PositionDescription
    }
  }
`;*/

const employeeEmailsQuery = gql`
  query {
    EmployeeEmails {
      Email
    }
  }
`;
const employeesQuery = gql`
  {
    Employees {
      id
      Position {
        id
        PositionDescription
        PositionBaseSalary
        PositionName
      }
      FirstName
      LastName
      AddressStreet
      AddressState
      AddressCity
      AddressZip
      Email
      Username
      PhoneNum
      Extension
      HireDate
      SalaryBonus
      createdAt
      updatedAt
    }
  }
`;
const teamsQuery = gql`
  {
    Teams {
      id
      TeamName
      TeamLead {
        FirstName
        LastName
      }
      Projects {
        ProjectName
        id
      }
      Employees {
        FirstName
        LastName
      }
    }
  }
`;

const teamQuery = gql`
  query($id: String!) {
    Team(id: $id) {
      id
      TeamName
      TeamLead {
        id
        FirstName
        LastName
      }
      Projects {
        ProjectName
        ProjectDescription
        id
      }
      Employees {
        id
        FirstName
        LastName
      }
    }
  }
`;

const meQuery = gql`
  {
    Me {
      FirstName
      LastName
      Email
      Position {
        PositionDescription
      }
    }
  }
`;

const projectsQuery = gql`
  {
    Projects {
      id
      ProjectName
      ProjectDescription
      ProjectStartDate
      ProjectEndDate
    }
  }
`;

const projectQuery = gql`
  query($id: ID!) {
    Project(id: $id) {
      id
      ProjectName
      ProjectDescription
      ProjectStartDate
      ProjectEndDate
    }
  }
`;

const employeeQuery = gql`
  query($id: ID!) {
    Employee(id: $id) {
      FirstName
      LastName
      id
      SalaryBonus
      Email
      Username
      AddressStreet
      AddressCity
      AddressState
      AddressZip
      Position {
        id
        PositionDescription
        PositionBaseSalary
        PositionName
      }
      Extension
      HireDate
      PhoneNum
      Extension
    }
  }
`;

const positionsQuery = gql`
  {
    Positions {
      id
      PositionName
      PositionBaseSalary
      PositionDescription
    }
  }
`;

export {
  loginMutation,
  signOutMutation,
  meQuery,
  employeeQuery,
  employeeEmailsQuery,
  employeesQuery,
  updateEmployeeMutation,
  projectQuery,
  projectsQuery,
  updateProjectMutation,
  createProjectMutation,
  teamsQuery,
  teamQuery,
  updateTeamMutation,
  createTeamMutation,
  positionsQuery,
  signUpMutation
};
