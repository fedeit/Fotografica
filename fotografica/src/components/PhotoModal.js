import  React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getPhoto, rotateClockwise } from '../api/fotografica_api.js';
import ImageInfo from './ImageInfo'
import PhotoMap from './PhotoMap'
import { url } from '../server_params';

let bgColor = {
	background: '#716b6b'
}

class PhotoModal extends Component {
	constructor(props) {
		super(props)
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.imageOpened = this.imageOpened.bind(this);
		this.playLivePhoto = this.playLivePhoto.bind(this);
		this.finishedLivePhoto = this.finishedLivePhoto.bind(this)

		this.state = { show: false, selectedImage: {}, selectedImageId: "" };

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedImage != "") {
			this.setState( { show: true } )
			this.handleShow(nextProps.selectedImage)
		}
	}

	playLivePhoto(event) {
		if(event.keyCode === 32) {
			if (this.state.selectedImage.livePhotoPath !== undefined) {
				this.setState({ playingLivePhoto: true})
			}
		}
	}

	finishedLivePhoto() {
		this.setState({ playingLivePhoto: false})
	}

	handleClose() {
	    document.removeEventListener("keydown", this.playLivePhoto, false);
		this.setState({ show: false, showAllMetadata: false });
	}

	handleShow(id) {
		this.imageOpened(id)
	    document.addEventListener("keydown", this.playLivePhoto, false);
		this.setState({ show: true, showAllMetadata: false });
	}

	imageOpened(id) {
		getPhoto(id, (photo) => {
			console.log(photo)
			this.setState({selectedImage: photo});
		});
	}

	askRotateClockwise() {
		rotateClockwise(this.state.selectedImage._id, () => {
			this.setState({
			   imageHash: Date.now()
			})
		})
	}

	showAllMetadata() {
		this.setState({showAllMetadata: true})
	}

	render() {
		return 	<Modal show={ this.state.show } onHide={ this.handleClose }  size="xl">
	                <Modal.Header style={ bgColor }>
	                    <h4 class="modal-title text-white">{ this.state.selectedImage.title }</h4>
	                    <Button onClick={ this.handleClose }>Close<span aria-hidden="true">×</span></Button>
	                </Modal.Header>
	                <Modal.Body style={ bgColor }>
	                    <div class="row">
	                        <div class="col" style={{width: '70%'}}>
	                        	{ this.state.playingLivePhoto 
				                    ? <video style={{width: '100%'}} controls autoPlay onEnded={ this.finishedLivePhoto }>
									    <source src={url + this.state.selectedImage.livePhotoPath} type="video/mp4" />
									  </video>
				                    : <img src={url + "/" + this.state.selectedImage.path + '?hash=' + this.state.imageHash } style={{width: '100%'}} />

				                }
	                        </div>
	                        <div class="col" style={{width: '25%'}}>
	                        	<ImageInfo photo={ this.state.selectedImage } showAllMetadata={ this.state.showAllMetadata }/>
	                            <div class="row"><div class="col"><Button onClick={ this.askRotateClockwise.bind(this) } variant="primary" type="Button">Rotate 90deg clockwise</Button></div></div>
	                            <div class="row"><div class="col"><Button variant="primary" type="Button">Crop Image</Button></div></div>
	                            <div class="row"><div class="col"><Button variant="primary" type="Button" onClick={ this.showAllMetadata.bind(this) }>See all metadata</Button></div></div>
	                            <div class="row"><div class="col"><Button variant="primary" type="Button">Tag People</Button></div></div>
	                            <div class="row"><div class="col"><Button variant="primary" type="Button">Set Location</Button></div></div>
	                        </div>
	                    </div>
						<PhotoMap markersType="single" coordinates={ this.state.selectedImage.coordinates }/>
	                </Modal.Body>
	                <Modal.Footer style={ bgColor }>
	                    <Button variant="light"><img src="https://img.icons8.com/ios-filled/20/000000/full-trash.png" /></Button>
	                    <Button variant="light"><img src="https://img.icons8.com/android/20/000000/share.png" /></Button>
	                    <Button variant="light"><img src="https://img.icons8.com/color/20/000000/filled-like.png" /></Button>
	                    <Button variant="light" onClick={ this.handleClose }>Close</Button>
	                    <Button variant="primary">Save</Button>
	                </Modal.Footer>
	  			</Modal>;

	}
}

export default PhotoModal;