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
        created_at
        }
    }
`
const DIRECT_MESSAGE_SUBSCRIPTION = gql`
    subscription($teamId: Int!, $otherUserId: Int!) {
        newDirectMessage(teamId: $teamId, otherUserId: $otherUserId) {
            id
            created_at
            text
            sender {
                username
            }
        }
    }
`


 const message = ({ id, text, sender, created_at }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ sender.username }</Comment.Author>
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

    componentWillMount() {
        console.log('props: ', this.props)
        console.log(`subscribing to ${this.props}`)
        console.log('hmmm2', this.props.teamId, this.props.otherUserId)


        this.unscubscribe = this.props.subscribeToNewDirectMessages(this.props.teamId, this.props.otherUserId);
    }

    componentWillReceiveProps({teamId, otherUserId}) {
        console.log('props: ', this.props)
        if (this.props.teamId !== teamId || this.props.otherUserId !== otherUserId ){ 
            if(this.unscubscribe) {
                console.log(`unsubscribing to dm`)

                this.unscubscribe()
            }
            console.log(`subscribing to new dm`)

            this.unscubscribe = this.props.subscribeToNewMessages(teamId, otherUserId);
        }
    }
    componentWillUnmount() {
        if(this.unscubscribe) {
            console.log(`unsubscribing to ${this.props.channelId}`)
            this.unscubscribe(this.props.channelId)
        }
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
                    console.log('hmmm', teamId, otherUserId)
                    const messages = data.directMessages
                    return (

                        <AllMessages 
                            messages={messages} 
                            teamId={teamId}
                            otherUserId={otherUserId}
                            subscribeToNewDirectMessages = {(teamId, otherUserId) => (
                                subscribeToMore({
                                    document: DIRECT_MESSAGE_SUBSCRIPTION,
                                    variables: {teamId: parseInt(teamId), otherUserId: parseInt(otherUserId)},
                                    fetchPolicy: 'network-only',
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) {
                                            console.log('prev', prev)
                                            return prev;
                                            
                                        }
                                        console.log('not prev', prev)

                                        return {
                                            ...prev,
                                            directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage]
                                        }
                                    },
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

export default DirectMessageContainer