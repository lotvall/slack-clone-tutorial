import React from 'react'

import AppLayout from '../components/AppLayout'

import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'


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

                            const teams =[...data.allTeams, ...data.invitedTeams]

                            if(!teams.length) {
                                return <Redirect to="/create-team"/>
                            }

                            const teamIdInteger = parseInt(teamId, 10)
                            const teamIdx= teamIdInteger ? findIndex(teams,['id', teamIdInteger]) : 0
                            const selectedTeam = teamIdx === -1 ?  teams[0] : teams[teamIdx]

                            const sidebarTeams =  teams.map(team => ({
                                id: team.id,
                                letter: team.name.charAt(0).toUpperCase()
                            }))
                    

                            const channelIdInteger = parseInt(channelId, 10)
                            const channelIdx = channelIdInteger ? findIndex(selectedTeam.channels, ['id', channelIdInteger]) : 0
                            const selectedChannel  = channelIdx===-1 ? selectedTeam.channels[0] : selectedTeam.channels[channelIdx]

                            let username =""
                            let isOwner = false
                            try {
                                const token = localStorage.getItem('token')
                                const { user } = decode(token)
                                username = user.username
                                isOwner = user.id === selectedTeam.owner
                            } catch(error) {

                            }

                            return (

                                <AppLayout>
                                    <Sidebar
                                        team={selectedTeam}
                                        teams={sidebarTeams}
                                        username={username}
                                        isOwner={isOwner}

                                    />
                                    { selectedChannel && 
                                    <Header
                                        channelName={selectedChannel.name}
                                    /> 
                                    }
                                    { selectedChannel && 
                                    <MessageContainer channelId = { selectedChannel.id }/>
                                    }
                                    <SendMessage 
                                        channelName={selectedChannel.name}
                                        channelId={selectedChannel.id}
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