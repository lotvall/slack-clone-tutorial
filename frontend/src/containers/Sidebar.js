import React from 'react'

import Teams from '../components/Teams'
import Channels from '../components/Channels'
import AddChannelModal from '../components/AddChannelModal'
import InvitePeopleModal from '../components/InvitePeopleModal'



class Sidebar extends React.Component {

    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false,
    }

    handleCloseAddChannelModal = () => {
        this.setState({
            openAddChannelModal: false
        })
    }

    handleAddChannelClick = () => {
        this.setState({
            openAddChannelModal: true
        })
    }

    handleCloseInvitePeopleModal = () => {
        this.setState({
            openInvitePeopleModal: false
        })
    }

    handleInvitePeopleClick = () => {
        this.setState({
            openInvitePeopleModal: true
        })
    }

    render () {

        const { team, username, teams } = this.props

        return (
                                <>
                                    <Teams
                                        teams={teams}
                                    />
                                    <Channels 
                                        teamName={team.name}
                                        teamId={team.id}
                                        username={username}
                                        channels={team.channels}
                                        users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                                        onAddChannelClick={this.handleAddChannelClick}
                                        onInvitePeopleClick={this.handleInvitePeopleClick}
                                    />
                                    <AddChannelModal 
                                        open={this.state.openAddChannelModal}
                                        onClose={this.handleCloseAddChannelModal}
                                        teamId={team.id}
                                    />
                                    <InvitePeopleModal 
                                        open={this.state.openInvitePeopleModal}
                                        onClose={this.handleCloseInvitePeopleModal}
                                        teamId={team.id}
                                    />
                                
                                </>
        )
    } 
}

export default Sidebar