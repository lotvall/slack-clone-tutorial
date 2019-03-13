import React from 'react'
import { Form, Input, Button, Modal, List } from 'semantic-ui-react'
import Downshift from 'downshift'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { TEAM_MEMBERS_QUERY } from '../graphql/team'

class QueryContainer extends React.Component {
    render() {
        const {teamId, open, onClose} = this.props

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
    teamMembers,
    loading,
    teamId,
    history
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Direct Message</Modal.Header>
    <Modal.Content>
        <Form>
            <Form.Field>
                { !loading && 
                <Downshift
                    onChange={selectedUser => {
                        history.push(`/view-team/user/${teamId}/${selectedUser.id}`)
                        onClose()
                    }}
                    itemToString={item => (item ? item.username : '')}
                >
                    {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                    }) => (
                    <div>
                        <Input {...getInputProps({placeholder: "Search users"})} fluid/>
                        <List {...getMenuProps()}>
                        {isOpen
                            ? teamMembers
                            
                                .filter(item => !inputValue || item.username.includes(inputValue))
                                .map((item, index) => (
                                <List.Item
                                    {...getItemProps({
                                    key: item.id,
                                    index,
                                    item,
                                    style: {
                                        backgroundColor:
                                        highlightedIndex === index ? 'lightgray' : null,
                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                    },
                                    })}
                                >
                                    {item.username}
                                </List.Item>
                                ))
                            : null}
                        </List>
                    </div>
                    )}
                </Downshift>}
            </Form.Field>
            <Form.Group width="equal">
                <Button fluid onClick={onClose}>Cancel</Button>
            </Form.Group>
        </Form>

    </Modal.Content>
  </Modal>
))

export default QueryContainer





