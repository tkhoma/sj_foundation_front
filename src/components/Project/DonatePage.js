import React, { Component } from 'react';
import { withHeader } from 'components/HOC/HeaderDecorator';
import { connect } from 'react-redux';

class DonatePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Hello, World!
            </div>
        )
    }
}

export default connect()(withHeader(DonatePage))
