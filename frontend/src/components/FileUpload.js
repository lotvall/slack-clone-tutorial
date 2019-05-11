import React from 'react'
import Dropzone from 'react-dropzone'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const createFileMessageMutation = gql`
  mutation($channelId: Int!, $file: Upload!) {
    createMessage(channelId: $channelId, file: $file)
  }
`

const FileUpload = ({ children, noClick, channelId }) => (
  <Mutation mutation={createFileMessageMutation}>
    {mutate => (
      <Dropzone noClick={noClick} noKeyboard onDrop={async ([file]) =>  {
        console.log(file)
        const response = await mutate({ variables: { channelId, file } })
        console.log(response)
        return response

        }
        
        }>
        {({ getRootProps, getInputProps }) => (
          <div style={{ border: 'none' }} {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {children}
          </div>
        )}
      </Dropzone>
    )}
  </Mutation>
)

export default FileUpload