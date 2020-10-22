// import  React, { Component, useState } from 'react';
// import { Button, Modal } from 'react-bootstrap';

// let bgColor = {
// 	background: '#716b6b'
// }

// function PhotoModal(props) {
// 	let selectedImage = props.selectedImage;
// 	const [show, setShow] = useState(false);
// 	const handleClose = () => setShow(false);
// 	const handleShow = () => setShow(true);

// 	return  <Modal show={show} onHide={ handleClose }>
//                 <Modal.Header style={ bgColor }>
//                     <h4 class="modal-title text-white">{ selectedImage.title }</h4>
//                     <Button>Close<span aria-hidden="true">×</span></Button>
//                 </Modal.Header>
//                 <Modal.Body style={ bgColor }>
//                     <div class="row">
//                         <div class="col" style={{width: '70%'}}>
//                         	<img style={{width: '100%'}} />
//                         </div>
//                         <div class="col">
//                             <div class="row"><div class="col"><Button variant="primary" type="Button">Rotate 90deg clockwise</Button></div></div>
//                             <div class="row"><div class="col"><Button variant="primary" type="Button">Crop Image</Button></div></div>
//                             <div class="row"><div class="col"><Button variant="primary" type="Button">Modify Metadata</Button></div></div>
//                             <div class="row"><div class="col"><Button variant="primary" type="Button">Tag People</Button></div></div>
//                             <div class="row"><div class="col"><Button variant="primary" type="Button">Set Location</Button></div></div>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer style={ bgColor }>
//                     <Button variant="light"><img src="https://img.icons8.com/ios-filled/20/000000/full-trash.png" /></Button>
//                     <Button variant="light"><img src="https://img.icons8.com/android/20/000000/share.png" /></Button>
//                     <Button variant="light"><img src="https://img.icons8.com/color/20/000000/filled-like.png" /></Button>
//                     <Button variant="light">Close</Button>
//                     <Button variant="primary">Save</Button>
//                 </Modal.Footer>
//   			</Modal>;
// }

// export default PhotoModal;