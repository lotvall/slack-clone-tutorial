import React from 'react'

import AppLayout from '../components/AppLayout'

import Header from '../components/Header'
import Messages from '../components/Messages'
import SendMessage from '../components/SendMessage'
import Sidebar from '../containers/Sidebar'

import { Query } from 'react-apollo'
import findIndex from 'lodash/findIndex'
import decode from 'jwt-decode'
import { TEAMS_QUERY } from '../graphql/team'
import { Redirect } from 'react-router-dom'



const ViewTeam = ({match: { params: { teamId, channelId} }}) => {

    return (

        <Query query={TEAMS_QUERY}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return null
                        }
                        if (error) {
                            console.log(error)
                        }

                        if (data) {
                            console.log(data)

                            if(!data.allTeams.length) {
                                return <Redirect to="/create-team"/>
                            }
                            const teamIdInteger = parseInt(teamId, 10)
                            const teamIdx= teamIdInteger ? findIndex(data.allTeams,['id', teamIdInteger]) : 0
                            const selectedTeam = data.allTeams[teamIdx]
                            const teams = data.allTeams.map(team => ({
                                id: team.id,
                                letter: team.name.charAt(0).toUpperCase()
                            }))

                            const channelIdInteger = parseInt(channelId, 10)
                            const channelIdx = channelIdInteger ? findIndex(selectedTeam.channels, ['id', channelIdInteger]) : 0
                            const selectedChannel  = selectedTeam.channels[channelIdx]
                            console.log(selectedTeam, selectedTeam.channels)

                            let username =""
                            try {
                                const token = localStorage.getItem('token')
                                const { user } = decode(token)
                                username = user.username
                            } catch(error) {

                            }

                            return (

                                <AppLayout>
                                    <Sidebar
                                        team={selectedTeam}
                                        teams={teams}
                                        username={username}

                                    />
                                    { selectedChannel && <Header
                                        channelName={selectedChannel.name}
                                    /> }
                                    { selectedChannel && <Messages 
                                        channelId = { selectedChannel.id }
                                    /> }
                                    <SendMessage 
                                        channelName={selectedChannel.name}
                                    />
                                </AppLayout>

                            )
                        }
                    }
                }
        </Query>                
    )
}

export default ViewTeam