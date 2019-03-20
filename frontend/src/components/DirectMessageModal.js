import React from 'react'
import { Form, Button, Modal } from 'semantic-ui-react'
import { Mutation, Query } from 'react-apollo'
import { withRouter , Redirect} from 'react-router-dom'
import { TEAM_MEMBERS_QUERY } from '../graphql/team'
import {Formik} from 'formik'
import SelectMultiUsers from './SelectMultiUsers'
import { CREATE_DMCHANNEL_MUTATION } from '../graphql/channel'
import { USER_QUERY } from '../graphql/user';
import { findIndex } from 'lodash'

class QueryContainer extends React.Component {
    render() {
        const {teamId, open, onClose, userId} = this.props

        return (
            <Query query={TEAM_MEMBERS_QUERY} variables={{teamId}}>
                {
                    ({ loading, error, data}) => {
                        if (loading) console.log('loading')
                        if(error) console.log(error)
                        if (data) console.log(data)

                        const teamMembers = data.getTeamMembers
                        console.log(teamMembers)
                        return (
                            <DirectMessageModal 
                                open={open} 
                                onClose={onClose}
                                teamMembers={teamMembers}
                                teamId={teamId}
                                loading={loading}
                                userId={userId}
                            />
                        )
                    }
                }
            </Query>
        )
    }
}

const DirectMessageModal = withRouter(({
    open, 
    onClose,
    teamId,
    userId,
    history
}) => (
    <Mutation mutation={CREATE_DMCHANNEL_MUTATION} >
        {(createDMChannel, { data }) => (
            <Modal open={open} onClose={onClose}>
                <Modal.Header>Direct Message</Modal.Header>
                <Modal.Content>

                    <Formik
                        initialValues={{ members: [] }}
                        onSubmit={ async ({members}, { setSubmitting } ) => {
                            const response = await createDMChannel({ 
                                variables: { 
                                    teamId: parseInt(teamId, 10),
                                    members, 
                                }, update: (store, { data: { createDMChannel }}) => {
                                    const { id, name } = createDMChannel
                                    const data = store.readQuery({ query: USER_QUERY })
                                    const teamIdx = findIndex(data.getUser.teams, ['id', teamId])
                                    const notInChannelList = data.getUser.teams[teamIdx].channels.every(c => c.id !== id )
                                    if(notInChannelList) {
                                        data.getUser.teams[teamIdx].channels.push({
                                            __typename: 'Channel',
                                            id,
                                            name,
                                            dm: true,
                                        })
                                        store.writeQuery({query: USER_QUERY, data})
                                    }
                                }
                            })
                            const DMChannelId = response.data.createDMChannel
                            console.log(response, typeof DMChannelId)
                            onClose()
                            setSubmitting(false)
                            if (typeof DMChannelId === "number"){
                                history.push(`/view-team/${teamId}/${DMChannelId}`)
                            }
                        }}
                        render={({values, setFieldValue, isSubmitting, resetForm, handleSubmit}) => (
                            <Form>
                            <Form.Field>
                                <SelectMultiUsers
                                    teamId={teamId}
                                    selectedMembers={values.members}
                                    handleChange={(e, { value }) => setFieldValue('members', value)}
                                    placeholder="Select members to message"
                                    userId = {userId}
                                />
                            </Form.Field>
                            <Form.Group width="equal">
                                <Button disabled={isSubmitting} fluid onClick={(e) => {
                                    resetForm()
                                    onClose()
                                }}>Cancel</Button>
                            </Form.Group>
                            <Form.Group width="equal">
                                <Button disabled={isSubmitting} fluid onClick={handleSubmit}>Start messaging</Button>
                            </Form.Group>
                        </Form>
                        )}
                    />
            </Modal.Content>
        </Modal>

        )}
    </Mutation>

    
))

export default QueryContainer





