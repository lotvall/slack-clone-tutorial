import gql from 'graphql-tag'

export const CREATE_MESSAGE_MUTATION = gql`
  mutation ($channelId:Int!, $text: String!){
      createMessage(channelId: $channelId, text: $text)
  }
`

export const MESSAGES_QUERY = gql`
  query($cursor: String, $channelId: Int!) {
      messages(cursor: $cursor, channelId: $channelId) {
      cursor
      messages {
          id
          text
          user {
          username
          }
          created_at
      }
      }
  }
`
export const MESSAGE_SUBSCRIPTION = gql`
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