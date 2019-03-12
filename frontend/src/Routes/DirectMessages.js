import React from 'react'

import AppLayout from '../components/AppLayout'

import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import Sidebar from '../containers/Sidebar'
import DirectMessageContainer from '../containers/DirectMessageContainer'


import { Query, graphql } from 'react-apollo'
import findIndex from 'lodash/findIndex'
import { DIRECT_MESSAGE_USER_QUERY } from '../graphql/user'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'


const CREATE_DIRECT_MESSAGE_MUTATION = gql`
    mutation ($receiverId:Int!, $text:String!, $teamId: Int!){
        createDirectMessage(receiverId: $receiverId, text:$text, teamId: $teamId)
    }
`

const DirectMessages = ({mutate, match: { params: { teamId, receiverId} }}) => {
    console.log(receiverId)
    return (

        <Query query={DIRECT_MESSAGE_USER_QUERY} variables={{userId: parseInt(receiverId, 10)}}>
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
                                        userId={data.getUser.id}
                                        isOwner={isOwner}

                                    />
                                    {  
                                    <Header
                                        channelName={data.singleUser.username}
                                    /> 
                                    }
                                    {  
                                    <DirectMessageContainer teamId={teamIdInteger} otherUserId={receiverId}/>
                                    }
                                    <SendMessage 
                                        onSubmit={async (text) => {
                                            console.log('team id int' , teamIdInteger)
                                            await mutate({
                                                variables:{
                                                    text,
                                                    receiverId: parseInt(receiverId),
                                                    teamId: teamIdInteger
                                                }, optimisticResponse: {
                                                    createDirectMessage: true, 
                                                },
                                                update: (store) => {
                                                        const data = store.readQuery({ query: DIRECT_MESSAGE_USER_QUERY })
                                                        const teamIdx2 = findIndex(data.getUser.teams, ['id', selectedTeam.id ])
                                                        console.log(teamIdx2)
                                                        const notAlreadyThere = data.getUser.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(receiverId, 10))
                                                        if (notAlreadyThere) {
                                                            data.getUser.teams[teamIdx2].directMessageMembers.push({
                                                                __typename: "User",
                                                                id: parseInt(receiverId, 10),
                                                                username: "Someone"
                                    
                                                            })
                                                            store.writeQuery({query: DIRECT_MESSAGE_USER_QUERY, data})
                                                        }
                                                }
                                                
                                            })
                                        }}
                                        placeholder={data.singleUser.username} 
                                    />
                                </AppLayout>

                            )
                        }
                    }
                }
        </Query>                
    )
}

export default graphql(CREATE_DIRECT_MESSAGE_MUTATION)(DirectMessages)