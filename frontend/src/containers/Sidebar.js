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

    toggleAddChannelModal = (e) => {
        if(e) {
            e.preventDefault()
        }
        this.setState(prevState => ({
            openAddChannelModal: !prevState.openAddChannelModal
        }))
    }

    toggleInvitePeopleModal = (e) => {
        if(e) {
            e.preventDefault()
        }
        this.setState(prevState => ({
            openInvitePeopleModal: !prevState.openInvitePeopleModal
        }))
    }

    render () {

        const { team, username, isOwner, teams } = this.props

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
                                        isOwner={isOwner}
                                        users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                                        onAddChannelClick={this.toggleAddChannelModal}
                                        onInvitePeopleClick={this.toggleInvitePeopleModal}
                                    />
                                    <AddChannelModal 
                                        open={this.state.openAddChannelModal}
                                        onClose={this.toggleAddChannelModal}
                                        teamId={team.id}
                                    />
                                    <InvitePeopleModal 
                                        open={this.state.openInvitePeopleModal}
                                        onClose={this.toggleInvitePeopleModal}
                                        teamId={team.id}
                                    />
                                
                                </>
        )
    } 
}

export default Sidebar