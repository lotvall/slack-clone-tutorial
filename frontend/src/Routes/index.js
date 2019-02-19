import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom'

import Home from './Home.js'
import Register from './Register'


export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home}/>\
                <Route path='/register' exact component={Register}/>
            </Switch>
        </BrowserRouter>
    )
} 