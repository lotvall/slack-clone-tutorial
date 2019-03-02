import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages'
import { Comment } from 'semantic-ui-react'
import moment from 'moment'


const DIRECT_MESSAGES_QUERY = gql`
    query($teamId: Int!, $otherUserId: Int!) {
        directMessages(teamId: $teamId, otherUserId: $otherUserId) {
        id
        text
        sender {
            username
        }
        createdAt
        }
    }
`
// const MESSAGE_SUBSCRIPTION = gql`
//     subscription($channelId: Int!) {
//         newChannelMessage(channelId: $channelId) {
//         id
//         createdAt
//         text
//         user {
//             username
//         }
//         }
//     }
// `


 const message = ({ id, text, sender, createdAt }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ sender.username }</Comment.Author>
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

    // componentWillMount() {
    //     console.log('props: ', this.props.channelId)
    //     console.log(`subscribing to ${this.props.channelId}`)

    //     this.unscubscribe = this.props.subscribeToNewMessages(this.props.channelId);
    // }

    // componentWillReceiveProps({ channelId }) {
    //     console.log('props: ', this.props.channelId, channelId)
    //     if (this.props.channelId !== channelId) { 
    //         if(this.unscubscribe) {
    //             console.log(`unsubscribing to ${this.props.channelId}`)
    //             this.unscubscribe(this.props.channelId)
    //         }
    //         console.log(`subscribing to ${channelId}`)

    //         this.unscubscribe = this.props.subscribeToNewMessages(channelId);
    //     }
    // }
    // componentWillUnmount() {
    //     if(this.unscubscribe) {
    //         console.log(`unsubscribing to ${this.props.channelId}`)
    //         this.unscubscribe(this.props.channelId)
    //     }
    // }

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

class DirectMessageContainer extends React.Component {

    render() {

        const { teamId, otherUserId } = this.props
        return (
            <Query query={DIRECT_MESSAGES_QUERY} variables={{teamId: parseInt(teamId), otherUserId: parseInt(otherUserId)}} fetchPolicy={"network-only"}>
            {
                ({ subscribeToMore, loading, error, data}) => {
                    if (loading) return null
                    if(error) console.log(error)
                    if (data) console.log('le data', data)
                    const messages = data.directMessages
                    return (

                        <AllMessages 
                            messages={messages} 
                            
                        />
                    )
                }
            }
            </Query>
        )
    }
} 

export default DirectMessageContainer