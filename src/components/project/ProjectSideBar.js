import React, { Component } from 'react';
import SJCoin from '../helper/sjCoin';
import PledgeInput from '../forms/PledgeInput';
import { Link } from 'react-router'
import { browserHistory } from 'react-router';
import CoinsSum from '../helper/CoinsSum';

export default class ProjectSideBar extends Component {

  constructor(props) {
    super();
    this.state = {
      projectId: props.projectId,
      status: props.status,
      supporters: props.supporters,
      raised: props.raised,
      userRaised: props.userRaised,
      price: props.price,
      canDonateMore: props.canDonateMore,
      durationLeft: props.durationLeft,
      user: props.user,
      showModal: props.showModal,
      canPledge: false,
      donationStatus: props.donationStatus,
      canDonate: props.canDonate,
    };
  }

  /**
   * new props from redux state
   * @function componentWillReceiveProps
   * @param {object} nextProps - new props for component
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      project: nextProps.project
    });
  }

  getTimeRemain() {
    //in minutes
    const durationLeft = this.state.durationLeft;
    if (!(!!durationLeft)) {
      return null;
    }
    if (durationLeft <= 0) {
      return null;
    } else if (durationLeft < 60) {
      return (
        <div>
          <h2>{durationLeft}</h2>
          minutes remain
        </div>
      )
    } else if (durationLeft < 60*24) {
      return (
        <div>
          <h2>{Math.round(durationLeft/60)}</h2>
          hours remain
        </div>
      );
    }

    return (
      <div>
        <h2>{Math.round(durationLeft/(60*24))}</h2>
        days remain
      </div>
    );

  }

  canPledge() {
    return this.state.status == 'open';
  }

  getStatus() {
    switch (this.state.status) {
      case 'draft':
      case '':
        return 'Draft';
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
    }
    return ''
  }

  render() {
    const {projectId, showModal, status, supporters, donationStatus, canDonate, raised, price, canDonateMore, userRaised, user} = this.state;
    return (
        <div className="row text-center justify-content-md-center project-stats">
          <div className="col-3">
            <h2>{supporters}</h2>
            supporters
          </div>
          <div className="col-3">
            <h2>
              <SJCoin /><CoinsSum value={raised}/>
            </h2>
            donated {price !== '' && <span>of <b><CoinsSum value={price}/></b> goal {canDonateMore && <span>or more</span>}</span>}
          </div>
          {
            !canDonate &&
            <div className="col-3">
              <h2>{donationStatus.toUpperCase()}</h2>
              status
            </div>
          }
          { this.getTimeRemain() &&
            <div className="col-4">
              {this.getTimeRemain()}
            </div>
          }

        </div>
    );
  }
}
