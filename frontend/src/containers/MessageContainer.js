import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages'
import { Button, Comment } from 'semantic-ui-react'
import moment from 'moment'


const MESSAGES_QUERY = gql`
    query($cursor: String, $channelId: Int!){
        messages(cursor: $cursor, channelId: $channelId) {
            id
            text
            user {
                username
            }
            created_at
        }
    }
`
const MESSAGE_SUBSCRIPTION = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
        id
        created_at
        text
        user {
            username
        }
        }
    }
`


 const message = ({ id, text, user, created_at }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ user.username }</Comment.Author>
            <Comment.Metadata>
                { /* Wed Feb 27 2019 20:06:40 GMT+0100 (GMT+01:00) */} 
                
                <div>
                    { moment(created_at,"ddd MMM D YYYY HH:mm:ss").fromNow()}
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

    state = {
        hasMoreMessages: true
    }
    componentWillMount() {
        console.log('props: ', this.props.channelId)
        console.log(`subscribing to ${this.props.channelId}`)

        this.unscubscribe = this.props.subscribeToNewMessages(this.props.channelId);
    }

    componentWillReceiveProps({ channelId }) {
        console.log('props: ', this.props.channelId, channelId)
        if (this.props.channelId !== channelId) { 
            if(this.unscubscribe) {
                console.log(`unsubscribing to ${this.props.channelId}`)
                this.unscubscribe(this.props.channelId)
            }
            console.log(`subscribing to ${channelId}`)

            this.unscubscribe = this.props.subscribeToNewMessages(channelId);
        }
    }
    componentWillUnmount() {
        if(this.unscubscribe) {
            console.log(`unsubscribing to ${this.props.channelId}`)
            this.unscubscribe(this.props.channelId)
        }
    }

    render() {
        const {messages, channelId, fetchMore} = this.props
        return (
            <Messages
                            
            >
                <Comment.Group>
                    { this.state.hasMoreMessages && messages.length >= 35 && <Button onClick={() => fetchMore({
                        variables: {
                            channelId,
                            cursor: messages[messages.length -1].created_at
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) {
                                return prev;
                            }
                            if(fetchMoreResult.messages.length < 35) {
                                this.setState({hasMoreMessages: false})
                            }
                            return {
                                ...prev,
                                messages: [...prev.messages, ...fetchMoreResult.messages]
                            }
                        }
                    })}>Load more</Button> }
                    { [...messages].reverse().map(message) }
         
                </Comment.Group>
            </Messages>
        )
    }
}

class MessageContainer extends React.Component {

    render() {

        const {channelId} = this.props
        return (
            <Query 
                query={MESSAGES_QUERY} 
                variables={{channelId}} 
                fetchPolicy={"network-only"}
            >
            {
                ({ fetchMore, subscribeToMore, loading, error, data}) => {
                    if (loading) return null
                    if(error) console.log(error)
                    if (data) console.log(data)

                    const messages = data.messages
                    return (

                        <AllMessages 
                            messages={messages}
                            channelId={channelId}
                            fetchMore={fetchMore}
                            subscribeToNewMessages = {(channelId) => (
                                subscribeToMore({
                                    document: MESSAGE_SUBSCRIPTION,
                                    variables: { channelId },
                                    fetchPolicy: 'network-only',
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