import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';

function StartProjectButton(props) {
    var content = ''
    if (props.loggedIn) {
        content =
            <NavLink
                className='btn btn-prime'
                to="/start"
                exact
            >Start project</NavLink>
    }
    return (
        <div className="row">
            <div className="col">
                {content}
            </div>
        </div>
    )
}

function mapStateToProps(state, ownProps) {
    return {
        loggedIn: state.authentication.isLoggedIn
    }
}

export default connect(mapStateToProps)(StartProjectButton)
