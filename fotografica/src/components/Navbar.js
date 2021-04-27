import React, { Component } from 'react';
import { Link } from 'react-router-dom';

let buttonStyle = {
	color: "black",
	height: "32px",
	backgroundColor: "#E5E5E5",
	padding: '0px 5px',
	margin: '0px 10px',
	display: 'table',
	borderRadius: '5px',
	boxShadow: '3px 3px 5px #000000',
	border: '0px',
}
let buttonTextStyle = {
	verticalAlign: 'middle',
	display: 'table-cell',
	padding: '0px',
	margin: '0px'
}
let navbarStyle = {
	fontSize: '20px',
	padding: '10px',
	backgroundColor: '#3F3C3C',
	border: '0px',
	boxShadow: '3px 3px 5px 000000'
}
let paddingLess = {
	padding: '0px',
	margin: '0px'
}
let rowStyle = {
	padding: '0px',
	margin: '0px',
	color: 'white'
}

class Navbar extends Component {
	photoNavbar(photo) {
		if (photo === undefined) { photo = {} }
		return (
			<>
	        <li class="nav-item d-lg-flex justify-content-lg-center" style={ {width: '70%'} }>
	        	<table style={ paddingLess }>
	        		<tr><td><p style={ rowStyle }>{ photo.name || "undefined" } - { photo.location || "undefined" }</p></td></tr>
	        		<tr><td><p style={ rowStyle }>{ photo.date || "undefined" } at { photo.time || "undefined" }</p></td></tr>
	        	</table>
	   		</li>
	        <li class="nav-item d-lg-flex justify-content-lg-center" style={ paddingLess }>
	        	<button style={ buttonStyle }> 
	        		<p style={ buttonTextStyle }>Share</p>
	       		</button>
	    	</li>
	        <li class="nav-item d-lg-flex justify-content-lg-center" style={ paddingLess }>
	        	<button style={ buttonStyle }> 
	        		<p style={ buttonTextStyle }>Fav</p>
	       		</button>
	    	</li>
	        <li class="nav-item d-lg-flex justify-content-lg-center" style={ paddingLess }>
	        	<button style={ buttonStyle }> 
	        		<p style={ buttonTextStyle }>Info</p>
	       		</button>
	    	</li>
	    	</>
		)
	}

	defaultNavbar() {
		return (
			<>
			<div class="slidecontainer">
				<input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
			</div>
			</>
		)
	}

	render() {
		let buttons = this.defaultNavbar();
		return	<ul class="nav nav-tabs d-md-flex d-lg-flex ml-auto justify-content-md-start align-items-md-center justify-content-lg-start align-items-lg-center" style={ navbarStyle }>
					{ buttons }
        		</ul>;
	}
}

export default Navbar;