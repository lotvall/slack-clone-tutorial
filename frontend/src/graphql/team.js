import gql from 'graphql-tag'

export const CREATE_TEAM_MUTATION = gql`
mutation($name: String!) {
    createTeam(name: $name) {
    ok
    team {
        id
    }
    errors {
        message
        path
    }
    }
}
`