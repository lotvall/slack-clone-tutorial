import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages'
import { Comment } from 'semantic-ui-react'
import moment from 'moment'


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
const MESSAGE_SUBSCRIPTION = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
        id
        createdAt
        text
        user {
            username
        }
        }
    }
`


 const message = ({ id, text, user, createdAt }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ user.username }</Comment.Author>
            <Comment.Metadata>
                { /* Wed Feb 27 2019 20:06:40 GMT+0100 (GMT+01:00) */} 
                
                <div>
                    { moment(createdAt,"ddd MMM D YYYY HH:mm:ss").fromNow()}
               </div>
            </Comment.Metadata>
            <Comment.Text>{text}</Comment.Text>
            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
  );

class AllMessages extends React.Component {

    componentDidMount() {
        this.props.subscribeToNewMessages();
      }

    render() {
        const {messages} = this.props
        return (
            <Messages
                            
            >
                <Comment.Group>
                    { messages.map(message) }
         
                </Comment.Group>
            </Messages>
        )
    }
}

class MessageContainer extends React.Component {

    render() {

        const {channelId} = this.props
        return (
            <Query query={MESSAGES_QUERY} variables={{channelId}}>
            {
                ({ subscribeToMore, loading, error, data}) => {
                    if (loading) return null
                    if(error) console.log(error)
                    if (data) console.log(data)

                    const messages = data.messages
                    return (

                        <AllMessages 
                            messages={messages}
                            subscribeToNewMessages = {() => (
                                subscribeToMore({
                                    document: MESSAGE_SUBSCRIPTION,
                                    variables: { channelId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev;
                                        return {
                                            ...prev,
                                            messages: [...prev.messages, subscriptionData.data.newChannelMessage]
                                        }
                                    },
                                    onError: err => console.error(err),
                                })
                            ) }
                        />
                    )
                }
            }
            </Query>
        )
    }
} 

export default MessageContainer