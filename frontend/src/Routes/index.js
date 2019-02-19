import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom'

import Home from './Home.js'

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home}/>
            </Switch>
        </BrowserRouter>
    )
} 