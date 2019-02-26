import React from 'react'

import Teams from '../components/Teams'
import Channels from '../components/Channels'
import AddChannelModal from '../components/AddChannelModal';


class Sidebar extends React.Component {

    state = {
        openAddChannelModal: false,
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
                                    />
                                    <AddChannelModal 
                                        open={this.state.openAddChannelModal}
                                        onClose={this.handleCloseAddChannelModal}
                                        teamId={team.id}
                                        forceRender={this.handleForceRender}
                                    />
                                </>
        )
    } 
}

export default Sidebar