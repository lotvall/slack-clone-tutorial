import React from 'react'
import { graphql, Query, withApollo } from 'react-apollo';
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import SendMessage from '../components/SendMessage'
import { CREATE_MESSAGE_MUTATION, MESSAGES_QUERY, MESSAGE_SUBSCRIPTION } from '../graphql/message'
import FileUpload from './../components/FileUpload'
import RenderTextFile from './../components/RenderTextFile'


const Message = ({url, text, filetype}) => {

    if (url) {
        if (filetype.startsWith('image')) {
            return <div><img src={`${url}`} /></div>
        } else if (filetype === 'text/plain') {
            return <RenderTextFile url ={url}/>
        } else if (filetype.startsWith('audio')) {
            return <div><audio controls>
                <source src={url} type={filetype} />
            </audio> </div>
        }
    }

    return <Comment.Text>{text}</Comment.Text>

}
 const message = ({ id, text, user, created_at, url, filetype }) => (
    <Comment key = {`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{ user.username }</Comment.Author>
            <Comment.Metadata>                
                <div>
                    { moment(created_at,"ddd MMM D YYYY HH:mm:ss").fromNow()}
               </div>
            </Comment.Metadata>

            <Message url={url} text ={text} filetype={filetype}/>

            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
  );

class AllMessages extends React.Component {

    state = {
        hasMoreMessages: true,
    }
    componentWillMount() {
        const { channelId, cursor} = this.props
        console.log(`subscribing to ${this.props.channelId}`)

        this.unscubscribe = this.props.subscribeToNewMessages(cursor, channelId);
    }

    componentWillReceiveProps({  messages ,  channelId }) {
        console.log('props: ', this.props.channelId, channelId)
        if (this.props.channelId !== channelId) { 
            if(this.unscubscribe) {
                console.log(`unsubscribing to ${this.props.channelId}`)
                this.unscubscribe(this.props.channelId)
            }
            console.log(`subscribing to ${channelId}`)

            this.unscubscribe = this.props.subscribeToNewMessages(channelId);
        }
        if (
            this.scroller &&
            this.scroller.scrollTop < 100 &&
            this.props.messages &&
            messages &&
            this.props.messages.length !== messages.length
          ) {
            // 35 items
            const heightBeforeRender = this.scroller.scrollHeight;
            // wait for 70 items to render

            setTimeout(() => {
              this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;

            }, 120);
        }
      
    }
    componentWillUnmount() {
        if(this.unscubscribe) {
            console.log(`unsubscribing to ${this.props.channelId}`)
            this.unscubscribe(this.props.channelId)
        }
    }
    handleFetchMore = async (channelId, cursor) => {
        const { client, fetchMore } = this.props

        const newVariables = {
            channelId,
            cursor
        }
        const oldVariables ={
            channelId,
            cursor:null
        }
        
        const prev = client.readQuery({
            query:MESSAGES_QUERY, 
            variables: {
                ...oldVariables
            }
        })
        let res;
        try {
            res = await client.query({
                query: MESSAGES_QUERY,
                variables: {
                    ...newVariables,
                }
            })

        } catch {
            return prev
        }

        console.log('oldcursor', this.state.cursor)
        console.log('newCursor', res.data.messages.cursor)

        
        if(res.data.messages.messages.length < 35) {
            this.setState({hasMoreMessages: false})
        }

        
        const updatedData = { 
            ...prev, 
            messages: {
                cursor: res.data.messages.cursor,
                messages: [...prev.messages.messages, ...res.data.messages.messages],
                __typename: "MessagesResponse"
            }
        }
        console.log('updatedData', updatedData)
        client.writeQuery({ 
            query: MESSAGES_QUERY, 
            variables: { ...oldVariables }, 
            data: updatedData 
        })

    }
    handleScroll = () => {
        const {messages, channelId, fetchMore, cursor} = this.props

        if (
            this.scroller && 
            this.scroller.scrollTop < 100 &&
            this.state.hasMoreMessages &&
            messages.length >= 35  &&
            messages.length < 1000 // prevent infinite loop      
        ) {
            const variables = {
                channelId,
                cursor
            }
            console.log('variables', variables, {...variables})
            this.handleFetchMore(channelId, cursor)
            
        }
    }

    render() {
        const {messages, channelId, channelName, mutate, cursor} = this.props
        return (

            <div
                style={{
                    gridColumn: 3,
                    gridRow: 2,
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    overflowY: 'auto',
                }}
                onScroll={this.handleScroll}
                ref={(scroller) => {
                    this.scroller = scroller
                }}
            >
                <SendMessage 
                    onSubmit={async (text) =>{
                        await mutate({variables: {text, channelId, cursor}})
                    }}
                    placeholder={channelName}
                    channelId={channelId}
                />
                <FileUpload noClick channelId={channelId}>
                    <Comment.Group>
                        {[...messages].reverse().map(message)}
                    </Comment.Group>
                </FileUpload>
                
            </div>
        )
    }
}

class MessageContainer extends React.Component {
    
    render() {

        const {mutate, client, channelId, channelName} = this.props
        return (
            <Query 
                query={MESSAGES_QUERY} 
                variables={{channelId, cursor: null}} 
                fetchPolicy={"network-only"}
            >
            {
                ({ fetchMore, subscribeToMore, loading, error, data}) => {
                    if (loading) return null
                    if(error) console.log(error)
                    if (data) console.log('data', data)

                    const messages = data.messages ? data.messages.messages : []
                    const cursor = data.messages ? data.messages.cursor : null
                    console.log('client', client)
                    return (
                        
                        <AllMessages 
                            messages={messages}
                            channelId={channelId}
                            fetchMore={fetchMore}
                            cursor={cursor}
                            client={client}
                            mutate={mutate}
                            channelName={channelName}
                            subscribeToNewMessages = {(cursor, channelId) => (
                                subscribeToMore({
                                    document: MESSAGE_SUBSCRIPTION,
                                    variables: { channelId },
                                    fetchPolicy: 'network-only',
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev;

                                        const newData = {
                                            ...prev,
                                            messages:{
                                                cursor,
                                                messages: [subscriptionData.data.newChannelMessage, ...prev.messages.messages],
                                                __typename: "MessagesResponse"

                                            }
                                        }
                                        console.log(newData)
                                        return newData
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

export default graphql(CREATE_MESSAGE_MUTATION)(withApollo(MessageContainer))