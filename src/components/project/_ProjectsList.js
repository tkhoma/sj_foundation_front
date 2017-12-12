import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getProjects, getProjectsCategories } from '../../actions/projectActions';

class ProjectsList extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(getProjectsCategories());
        this.props.dispatch(getProjects(1, {limit: 3}));
    }

    render() {
        let categories = this.props.categories.map(category => {
            return (
                <div className="col-auto"
                     key={category.id}
                    onClick={() => {this.props.dispatch(getProjects(1, {category: category.slug}))}}>
                    {category.name}
                </div>
            );
        });

        let projectCards = this.props.projects.map((project, index) => {
            return (
                <div className="card col-4 card-project" key={project.id}>
                    <img className="card-img-top" src="https://x.kinja-static.com/assets/images/logos/placeholders/default.png" alt="Card image cap"/>
                    <div className="card-body">
                        <div className="card-link">{project.category.name}</div>
                        <h4 className="card-title">{project.title}</h4>
                        <div className="card-text">{project.shortDescription}</div>
                        <div className="card-link">by John Smith</div>
                    </div>
                    <div className="card-footer">
                        <div className="card-coins">
                            <span>10,500</span> of 25,000
                        </div>
                        <div className="card-status-bar progress">
                            <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div className="row card-stats">
                            <div className="col">
                                <div className="card-stats-value">72% </div> funded
                            </div>
                            <div className="col">
                                <div className="card-stats-value">15 </div> investors
                            </div>
                            <div className="col">
                                <div className="card-stats-value">22 </div> hours to go
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="container-fluid block-projects">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col text-center text-heading">Projects</div>
                    </div>
                    <div className="row filter-projects align-items-center justify-content-between">
                        <input type="text" className="col-2 input-outline align-self-start" />
                        <div className="col-auto"
                             onClick={() => {this.props.dispatch(getProjects(1, {limit: 3}))}}>All</div>
                            {categories}
                        <div className="col-2"></div>
                    </div>
                    <div className="row card-group grid-projects">
                        {projectCards}
                    </div>
                    <div className="row align-items-center">
                        <h1 className="col text-center">
                            <button className="btn btn-default">Show All</button>
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}

ProjectsList.propTypes = {};

ProjectsList.defaultProps = {};

function mapStateToProps(state, ownProps) {
    return {
        projects: state.projects.data,
        categories: state.projects.categories
    };
}

/**
 * get the data from redux and feed it into component via props
 */
export default connect(mapStateToProps)(ProjectsList);
