import React from 'react'
import { TEAM_MEMBERS_QUERY } from '../graphql/team'
import { Query } from 'react-apollo';
import { Dropdown } from 'semantic-ui-react'

const SelectMultiUsers = ({ teamId, selectedMembers, handleChange, placeholder }) => (
  <Query query={TEAM_MEMBERS_QUERY} variables={{teamId}}>
    {
      ({loading, error, data: { getTeamMembers }}) => {
        if (loading) return null
        console.log(selectedMembers)
        return (
          <Dropdown
            placeholder={placeholder}
            value={selectedMembers}
            onChange={handleChange}
            fluid
            multiple
            search
            selection
            options={getTeamMembers.map(m => ({key: m.id, value: m.id, text: m.username}))}
          />
        )
        
      }
    }

  </Query>
)

export default SelectMultiUsers