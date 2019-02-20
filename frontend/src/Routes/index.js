import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom'

import Home from './Home.js'
import Register from './Register'
import Login from './Login'



export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home}/>\
                <Route path='/register' exact component={Register}/>
                <Route path='/login' exact component={Login}/>

            </Switch>
        </BrowserRouter>
    )
} 