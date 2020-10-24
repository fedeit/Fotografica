import  React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getPhotos, getPhoto, getLastRefresh, rotateClockwise } from '../api/fotografica_api.js';
import { url } from '../server_params';
import { ImageGroup, Image } from 'react-fullscreen-image'
import ImageInfo from './ImageInfo'
import PhotoMap from './PhotoMap'
let fontColors = {
	color: 'rgb(107,118,125)'
}

let floatingBarStyle = {
	boxShadow: '0px 0px 10px 2px rgb(138,143,149)',
	background: 'rgba(231,220,220,0.84)',
	padding: '10px',
	borderStyle: 'none',
	borderSadius: '5px'
}

let bgColor = {
	background: '#716b6b'
}

let thumbnailStyle = {width: '100%', height:'150px', overflow: 'hidden'}

let batchNumber = 0;
class Photos extends React.Component {
	constructor(props) {
		super(props);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.imageOpened = this.imageOpened.bind(this);
		this.playLivePhoto = this.playLivePhoto.bind(this);
		this.finishedLivePhoto = this.finishedLivePhoto.bind(this)

		this.state = {
			show: false,
			photos: [],
			selectedImage: {},
			lastRefresh: "Yesterday",
			imageHash: Date.now()
		};
	}

	handleClose() {
	    document.removeEventListener("keydown", this.playLivePhoto, false);
		this.setState({ show: false, showAllMetadata: false });
	}

	handleShow() {
	    document.addEventListener("keydown", this.playLivePhoto, false);
		this.setState({ show: true, showAllMetadata: false });
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

	componentDidMount() {
		getPhotos(50, batchNumber++, (photos) => {
			let merged = this.state.photos.concat(photos)
			this.setState({photos: merged})
		});
		getLastRefresh((timestamp) => {
			console.log(timestamp)
			this.setState({lastRefresh: timestamp})
		})
	}

	imageOpened(event) {
		getPhoto(event.target.id, (photo) => {
			console.log(photo)
			this.setState({selectedImage: photo});
		});
		this.handleShow();
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
		let htmlPhotos = this.state.photos.map((photo) => {
			return <div key={"div" + photo.id} class="justify-content-lg-center col-lg-2 item zoom-on-hover" style={ thumbnailStyle }>
				<img key={"photo" + photo.id} id={ photo.id } onClick={ this.imageOpened } class="img-fluid image" style={{width: '100%', height: '100%', objectFit: 'cover'}} src={url + photo.thumbPath + '?hash=' + this.state.imageHash} />
			</div>
		})

		return <div>
				<Modal show={this.state.show} onHide={ this.handleClose }  size="xl">
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
				                    : <img src={url + this.state.selectedImage.path + '?hash=' + this.state.imageHash } style={{width: '100%'}} />

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
	  			</Modal>
		        <section class="portfolio-block photography">
		            <div class="container">
		                <div class="row no-gutters">
		                	{ htmlPhotos }
		                </div>
		                <div class="row no-gutters">
		                    <div class="col" style={{ height: '300px', background: '#dedede' }}>
		                        <h2 class="text-center" style={{ padding: '10px 0px' }}>You are all set!</h2>
		                        <h5 class="text-center">Your library is up to date! Last refresh was { this.state.lastRefresh }</h5>
		                        <div class="d-lg-flex justify-content-lg-center"><img src="https://img.icons8.com/ios/100/000000/easy.png" /></div>
		                    </div>
		                </div>
		            </div>
		        </section>
		        <nav class="navbar navbar-light navbar-expand-md fixed-bottom">
		            <div class="container-fluid">
		            	<button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
		                <div class="collapse navbar-collapse d-md-flex justify-content-md-center align-items-md-center" id="navcol-1" style={{height: '100px'}}>
		                    <ul class="nav navbar-nav" style={ floatingBarStyle }>
		                        <li class="nav-item"><a class="nav-link" href="photos.html" style={ fontColors }>Years</a></li>
		                        <li class="nav-item"><a class="nav-link" href="projects-grid-cards.html" style={ fontColors }>Months</a></li>
		                        <li class="nav-item"><a class="nav-link" href="cv.html" style={ fontColors }>Days</a></li>
		                        <li class="nav-item"><a class="nav-link" href="hire-me.html" style={ fontColors }>All</a></li>
		                    </ul>
		                </div>
		            </div>
		        </nav>
			</div>;
		}
}

export default Photos;