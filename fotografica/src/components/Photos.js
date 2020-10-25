import  React from 'react';
import { ImageGroup, Image } from 'react-fullscreen-image'
import PhotoModal from './PhotoModal'
import { getPhotos, getPhoto, getLastRefresh, rotateClockwise } from '../api/fotografica_api.js';
let url = process.env.REACT_APP_SERVER_URL

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

let thumbnailStyle = {width: '100%', height:'150px', overflow: 'hidden'}

let batchNumber = 0;

function getDateYear(date) {
	return date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
}

class Photos extends React.Component {
	constructor(props) {
		super(props);
		this.trackScrolling = this.trackScrolling.bind(this)
		this.loadImages = this.loadImages.bind(this)
		this.state = {
			show: false,
			photos: [],
			selectedImage: "",
			lastRefresh: "Yesterday",
			imageHash: Date.now(),
			preLoaded: (props.preLoaded !== undefined) ? true : false
		};
	}

	loadImages() {
		if (!this.state.preLoaded) {
			getPhotos(50, ++batchNumber, (photos) => {
				let merged = this.state.photos.concat(photos)
				document.addEventListener('scroll', this.trackScrolling);
				this.setState({photos: merged, selectedImage: ""})
			});
		}
	}

	componentDidMount() {
		this.loadImages()
		getLastRefresh((timestamp) => {
			this.setState({lastRefresh: timestamp})
		})
	}

	componentWillUnmount() {
	  document.removeEventListener('scroll', this.trackScrolling);
	}

	trackScrolling() {
	  const wrappedElement = document.getElementById('libTimestamp');
	  if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
	    this.loadImages();
	    document.removeEventListener('scroll', this.trackScrolling);
	  }
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ photos: nextProps.photos })
	}

	imageOpened(event) {
		let imgId = event.target.id
		this.setState( { selectedImage: imgId } )
	}

	render() {
		if (this.state.photos === undefined || this.state.photos.length == 0) {
			return <div></div>
		}
		let prevTimestamp = new Date(this.state.photos[0].fileTimestamp);
		let htmlPhotosSameMonth = []
		let htmlPhotos = []
		this.state.photos.forEach((photo) => {
			let date = new Date(photo.fileTimestamp)
			if (date.getMonth() == prevTimestamp.getMonth()) {
				prevTimestamp = date
				htmlPhotosSameMonth.push(<div key={"div" + photo.id} class="justify-content-lg-center col-lg-2 item zoom-on-hover" style={ thumbnailStyle }>
											<img key={"photo" + photo.id} id={ photo.id } onClick={ this.imageOpened.bind(this) } class="img-fluid image" style={{width: '100%', height: '100%', objectFit: 'cover'}} src={url + photo.thumbPath} />
										</div>)
			} else {
				htmlPhotos.push(<div key={"wrapper-" + getDateYear(prevTimestamp)}><h3>{ getDateYear(prevTimestamp) }</h3><div key={"photos-" + getDateYear(prevTimestamp)} class="row no-gutters"> { htmlPhotosSameMonth } </div></div>);
				htmlPhotosSameMonth = []
				htmlPhotosSameMonth.push(<div key={"div" + photo.id} class="justify-content-lg-center col-lg-2 item zoom-on-hover" style={ thumbnailStyle }>
											<img key={"photo" + photo.id} id={ photo.id } onClick={ this.imageOpened.bind(this) } class="img-fluid image" style={{width: '100%', height: '100%', objectFit: 'cover'}} src={url + photo.thumbPath} />
										</div>)
				prevTimestamp = date
			}
		})
		htmlPhotos.push(<div key={"wrapper-" + getDateYear(prevTimestamp)}><h3>{ getDateYear(prevTimestamp) }</h3><div key={"photos-" + getDateYear(prevTimestamp)} class="row no-gutters"> { htmlPhotosSameMonth } </div></div>);
		return 	<div>
					<PhotoModal selectedImage={ this.state.selectedImage }/>
			        <section class="portfolio-block photography">
			            <div class="container">
		                	{ htmlPhotos }
			                <div class="row no-gutters">
			                    <div id="libTimestamp" class="col" style={{ height: '300px', background: '#dedede' }}>
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