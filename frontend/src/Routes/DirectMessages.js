import React from 'react'

import AppLayout from '../components/AppLayout'

import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'


import { Query, graphql } from 'react-apollo'
import findIndex from 'lodash/findIndex'
import { USER_QUERY } from '../graphql/user'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'


const CREATE_MESSAGE_MUTATION = gql`
    mutation ($channelId:Int!, $text: String!){
        createMessage(channelId: $channelId, text: $text)
    }
`

const DirectMessages = ({match: { params: { teamId, userId} }}) => {

    return (

        <Query query={USER_QUERY}>
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
                    
                            const username = data.getUser.username
                            const isOwner = selectedTeam.admin

                            return (

                                <AppLayout>
                                    <Sidebar
                                        team={selectedTeam}
                                        teams={sidebarTeams}
                                        username={username}
                                        isOwner={isOwner}

                                    />
                                    {/*  
                                    <Header
                                        channelName={selectedChannel.name}
                                    /> 
                                    */}
                                    {/*  
                                    <MessageContainer channelId = { selectedChannel.id }/>
                                    */}
                                    <SendMessage 
                                        onSubmit={() => {}}
                                        placeholder={userId} 
                                    />
                                </AppLayout>

                            )
                        }
                    }
                }
        </Query>                
    )
}

export default graphql(CREATE_MESSAGE_MUTATION)(DirectMessages)