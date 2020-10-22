import React, { Component } from 'react';
import { Link } from 'react-router-dom';

let height40 = {
	height: '40px'
}
let buttonStyle = {
	color: "black",
	padding: '2px 20px'
}

class Navbar extends Component {
	render() {
		return	<ul class="nav nav-tabs d-md-flex d-lg-flex ml-auto justify-content-md-start align-items-md-center justify-content-lg-start align-items-lg-center" style={{fontSize: '20px'}}>
		            <li class="nav-item">
		            	<img src="https://img.icons8.com/cute-clipart/64/000000/ice-cream-cone.png" style={{padding: '20px'}} />
	            	</li>
		            <li class="nav-item d-lg-flex justify-content-lg-center">
		            	<img src="https://img.icons8.com/color/48/000000/google-photos-new.png" height={ height40 } />
		           		<Link to="/photos" style={buttonStyle}>Photos</Link>
	           		</li>
		            <li class="nav-item d-lg-flex justify-content-lg-center">
		            	<img src="https://img.icons8.com/color/48/000000/collage.png" height={ height40 } />
		            	<Link to="/albums" style={buttonStyle}>Albums</Link>
	            	</li>
		            <li class="nav-item d-lg-flex justify-content-lg-center">
			            <img src="https://img.icons8.com/color/48/000000/collage.png" height={ height40 } />
			            <Link to="/libraries" style={buttonStyle}>Libraries</Link>
		            </li>
		            <li class="nav-item d-lg-flex justify-content-lg-center" height={ height40 }>
		            	<img src="https://img.icons8.com/color/48/000000/search-more.png" height={ height40 } />
		            	<Link to="/search" style={buttonStyle}>Search</Link>
	            	</li>
        		</ul>;
	}
}

export default Navbar;