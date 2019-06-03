import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withHeader } from 'components/HOC/HeaderDecorator';
import ProjectStatus from './ProjectStatus'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectTitle from './ProjectTitle'
import { EditorState, convertToRaw } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import AcceptImage from './AcceptImage'
import AcceptVideo from './AcceptVideo'
import ProjectButtons from './ProjectButtons'
import { alertActions } from 'actions/alertActions'
import { newProjectStep3, uploadImage } from 'actions/projectActions'
import config from 'config'

class Step3 extends Component {
    constructor(props) {
        super(props)

        var editorState
        if (this.props.description === '') {
            editorState = EditorState.createEmpty()
        } else {
            var contentState = stateFromHTML(this.props.description)
            editorState = EditorState.createWithContent(contentState)
        }
        this.state = {
            editorState: editorState,
            projectImage: this.props.projectImage,
            projectVideo: this.props.projectVideo,
            projectAttachments: this.props.projectAttachments,
            projectImageUrl: this.props.projectImageUrl
        }

        this.onEditorStateChange = this.onEditorStateChange.bind(this)
        this.nextClickHandler = this.nextClickHandler.bind(this)
        this.prevClickHandler = this.prevClickHandler.bind(this)
        this.addProjectImage = this.addProjectImage.bind(this)
        this.removeProjectImage = this.removeProjectImage.bind(this)
        this.getProjectImage = this.getProjectImage.bind(this)
        this.addProjectAttachment = this.addProjectAttachment.bind(this)
        this.removeProjectAttachment = this.removeProjectAttachment.bind(this)
        this.getProjectAttachments = this.getProjectAttachments.bind(this)
        this.addProjectVideo = this.addProjectVideo.bind(this)
        this.removeProjectVideo = this.removeProjectVideo.bind(this)
        this.getProjectVideo = this.getProjectVideo.bind(this)
        this.sendFileRequest = this.sendFileRequest.bind(this)
        this.handleProjectImageUpload = this.handleProjectImageUpload.bind(this)
    }

    addProjectImage(image) {
        if (typeof image === 'undefined') {
            this.setState({
                ...this.state,
                projectImage: []
            })
            return
        }
        this.setState({
            ...this.state,
            projectImage: [ image ]
        })

        this.sendFileRequest(image)
        .then(this.handleProjectImageUpload)
    }

    handleProjectImageUpload(responseText) {
        var response = JSON.parse(responseText)
        this.setState({
            ...this.state,
            projectImageUrl: response.uploadedFile
        })
    }

    sendFileRequest(file) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file, file.name);
            req.onreadystatechange = function() {
                if (req.readyState !== 4) return;
                if (req.status >= 200 && req.status < 300) {
                    resolve(req.response);
                } else {
                    reject({
                        status: req.status,
                        statusText: req.statusText
                    });
                }
            }
            req.open("POST", `${config.apiUrl}/projects/uploadProjectFile`);
            req.send(formData);
        });
    }

    removeProjectImage() {
        this.setState({
            ...this.state,
            projectImage: []
        })
    }

    getProjectImage() {
        return [ ...this.state.projectImage ]
    }

    addProjectVideo(video) {
        if (typeof video === 'undefined') {
            this.setState({
                ...this.state,
                projectVideo: []
            })
            return
        }
        this.setState({
            ...this.state,
            projectVideo: [ video ]
        })
        this.sendFileRequest(video);
    }

    removeProjectVideo() {
        this.setState({
            ...this.state,
            projectVideo: []
        })
    }

    getProjectVideo() {
        return [ ...this.state.projectVideo ]
    }

    addProjectAttachment(attachment) {
        if (typeof attachment == 'undefined') {
            return
        }

        this.setState({
            ...this.state,
            projectAttachments: [
                ...this.state.projectAttachments,
                attachment
            ]
        })

        this.sendFileRequest(attachment);
    }

    removeProjectAttachment(fileName) {
        var indexToRemove = this.state.projectAttachments
            .map(e => e.name)
            .indexOf(fileName)

        this.setState({
            ...this.state,
            projectAttachments: [
                ...this.state.projectAttachments.slice(0, indexToRemove),
                ...this.state.projectAttachments.slice(indexToRemove + 1)
            ]
        })
    }

    getProjectAttachments() {
        return [ ...this.state.projectAttachments ]
    }

    onEditorStateChange(editorState) {
        this.setState({
            editorState
        })
    }

    nextClickHandler() {
        var projectDescription = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        if (projectDescription.trim() === '<p></p>') {
            this.props.dispatch(alertActions.error("Project description is empty"));
            window.scrollTo(0,0)
            return;
        }
        this.props.dispatch(newProjectStep3(projectDescription,
            this.state.projectImage,
            this.state.projectVideo,
            this.state.projectAttachments,
            this.state.projectImageUrl
        ));
        window.scrollTo(0,0)
        this.props.history.push('/step4');
    }

    prevClickHandler() {
        this.props.history.push('/start');
    }

    render() {
        var editorContent = "Write about your project like you're explaining it to a friend..."
        return (
            <div className="container-fluid start-project-step3">
                <ProjectStatus greenButtons={true} />
                <ProjectProgressBar step="3" status="75" />
                <ProjectTitle title="Project Description" />
                <div className="row project-description-label justify-content-around">
                    <div className="col col-sm-6">
                        Project Text Description
                    </div>
                </div>
                <div className="row project-description justify-content-around">
                    <div className="col col-sm-6">
                        <Editor
                            placeholder={editorContent}
                            editorState={this.state.editorState}
                            wrapperClassName="description-wrapper"
                            editorClassName="description-editor"
                            onEditorStateChange={this.onEditorStateChange}
                            toolbar={{
                                options: ['blockType', 'inline', 'list', 'textAlign', 'link'],
                                inline: {
                                    inDropdown: false,
                                    options: [ 'bold', 'italic' ]
                                },
                                list: {
                                    inDropdown: false,
                                    options: [ 'unordered', 'ordered' ]
                                },
                                blockType: {
                                    inDropdown: true,
                                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
                                },
                                textAlign: {
                                    inDropdown: false,
                                    options: ['left', 'center', 'right']
                                },
                                link: {
                                    inDropdown: false
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="row project-files-label justify-content-center">
                    <div className="col col-sm-3">
                        Project Image
                    </div>
                    <div className="col col-sm-3">
                        Project Attachments
                    </div>
                </div>
                <div className="row project-images justify-content-center">
                    <div className="col col-sm-3 project-image">
                        <AcceptImage
                            imgContainer="uploaded-image"
                            multiple={false}
                            addFile={this.addProjectImage}
                            removeFile={this.removeProjectImage}
                            getFiles={this.getProjectImage}
                        />
                    </div>
                    <div className="col col-sm-3 project-image">
                        <AcceptImage
                            imgContainer="uploaded-attachments"
                            videoContainer="uploaded-video"
                            addFile={this.addProjectAttachment}
                            removeFile={this.removeProjectAttachment}
                            getFiles={this.getProjectAttachments}
                        />
                    </div>
                </div>
                <div className="row project-files-label justify-content-center">
                    <div className="col col-sm-6">
                        Project Video
                    </div>
                </div>
                <div className="row project-video justify-content-center">
                    <div className="col col-sm-6 uploaded-video">
                        <AcceptVideo
                            videoContainer="uploaded-video"
                            addFile={this.addProjectVideo}
                            removeFile={this.removeProjectVideo}
                            getFiles={this.getProjectVideo}
                        />
                    </div>
                </div>
                <ProjectButtons
                    nextClickHandler={this.nextClickHandler}
                    prevClickHandler={this.prevClickHandler}
                />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        description: state.projects.newProject.description || '',
        projectImage: state.projects.newProject.projectImage || [],
        projectVideo: state.projects.newProject.projectVideo || [],
        projectAttachments: state.projects.newProject.projectAttachments || [],
        projectImageUrl: state.projects.newProject.projectImageUrl || ''
    };
}

export default connect(mapStateToProps)(withHeader(Step3))
