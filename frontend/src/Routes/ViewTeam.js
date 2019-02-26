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

                            const teamIdx= !!teamId ? findIndex(data.allTeams,['id', parseInt(teamId, 10)]) : 0
                            const selectedTeam = data.allTeams[teamIdx]
                            const teams = data.allTeams.map(team => ({
                                id: team.id,
                                letter: team.name.charAt(0).toUpperCase()
                            }))
                            const channelIdx = !!channelId ? findIndex(selectedTeam.channels, ['id', parseInt(channelId, 10)]) : 0
                            const selectedChannel  = selectedTeam.channels[channelIdx]
                            console.log(channelIdx, selectedTeam, selectedChannel)
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
                                    <Header
                                        channelName={selectedChannel.name}
                                    />
                                    <Messages 
                                        channelId = { selectedChannel.id }
                                    />
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