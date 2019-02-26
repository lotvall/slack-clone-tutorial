import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages'

const MESSAGES_QUERY = gql`
    query($channelId: Int!){
        messages(channelId: $channelId) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
 `

const MessageContainer = ({channelId}) => {
    console.log(channelId)
    return (
        <Query query={MESSAGES_QUERY} variables={{channelId}}>
        {
            ({loading, error, data}) => {
                if (loading) return null
                if(error) console.log(error)
                if (data) console.log(data)

                const messages = data.Messages
                return (
                    <Messages>
                        <ul>
                            { messages.map(message) }
                        </ul>
                    </Messages>
                )
            }
        }

        </Query>
    )
}

export default MessageContainer