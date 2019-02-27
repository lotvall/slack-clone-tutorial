import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages'
import { Comment } from 'semantic-ui-react'
import Moment from 'react-moment';


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

 const message = ({ id, text, user, createdAt }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ user.username }</Comment.Author>
            <Comment.Metadata>
                <div><Moment>{createdAt}</Moment></div>
            </Comment.Metadata>
            <Comment.Text>{text}</Comment.Text>
            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
  );

const MessageContainer = ({channelId}) => {
    console.log(channelId)
    return (
        <Query query={MESSAGES_QUERY} variables={{channelId}}>
        {
            ({loading, error, data}) => {
                if (loading) return null
                if(error) console.log(error)
                if (data) console.log(data)

                const messages = data.messages
                return (
                    <Messages>
                    <Comment.Group>
                    { messages.map(message) }

                        
                    </Comment.Group>
                    </Messages>
                )
            }
        }

        </Query>
    )
}

export default MessageContainer