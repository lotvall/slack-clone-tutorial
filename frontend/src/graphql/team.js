import gql from 'graphql-tag'

export const TEAMS_QUERY = gql`
    query {
        allTeams {
            id
            name
            owner
            channels {
                id
                name
            }
        }
        invitedTeams {
            id
            name
            owner
            channels {
                id
                name
            }
        }
    }    
`

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