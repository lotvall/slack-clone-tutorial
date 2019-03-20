import React from 'react'

import AppLayout from '../components/AppLayout'

import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'

import gql from 'graphql-tag'
import { graphql, Query } from 'react-apollo'
import findIndex from 'lodash/findIndex'
import { USER_QUERY } from '../graphql/user'
import { Redirect } from 'react-router-dom'

const CREATE_MESSAGE_MUTATION = gql`
    mutation ($channelId:Int!, $text: String!){
        createMessage(channelId: $channelId, text: $text)
    }
`

const ViewTeam = ({mutate, match: { params: { teamId, channelId} }}) => {

    return (

        <Query query={USER_QUERY} fetchPolicy={"network-only"}>
                {
                    ({loading, error, data}) => {
                        if (loading || !data) {
                            return null
                        }
                        if (error) {
                            console.log(error)
                        }

                        if (data) {
                            console.log(data)

                            const teams =data.getUser.teams

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

                            const username = data.getUser.username
                            const isOwner = selectedTeam.admin

                            console.log('DM users', data.getUser)

                            return (

                                <AppLayout>
                                    <Sidebar
                                        team={selectedTeam}
                                        teams={sidebarTeams}
                                        username={username}
                                        userId={data.getUser.id}
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
                                        onSubmit={async (text) =>{
                                            await mutate({variables: {text, channelId: selectedChannel.id}})
                                        }}
                                        placeholder={selectedChannel.name}
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

export default graphql(CREATE_MESSAGE_MUTATION)(ViewTeam)