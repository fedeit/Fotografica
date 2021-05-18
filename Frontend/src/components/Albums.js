import React from 'react';

let endingSection = {
	height: '350px',
	background: '#dedede'
}

function Albums() {
	return  <section className="portfolio-block photography">
	            <div className="container">
	                <div className="row no-gutters" data-bs-hover-animate="pulse">
	                    <div className="col-md-6 col-lg-4 d-lg-flex align-items-lg-center item zoom-on-hover" style={{background: 'transparent'}}>
	                        <h1 style={{color: 'rgb(73,75,78)'}}>Vacation in Perù</h1>
	                    </div>
	                    <div class="col"><a href="#"><img class="img-fluid image" src="assets/img/nature/image2.jpg" /></a></div>
	                </div>
	                <div className="row no-gutters">
	                    <div className="col d-lg-flex justify-content-lg-center align-items-lg-center" data-bs-hover-animate="pulse" style={ endingSection }>
	                    	<img src="https://img.icons8.com/pastel-glyph/128/000000/plus.png" />
	                        <h1 style={{margin: '23px'}}>New Album</h1>
	                    </div>
	                </div>
	            </div>
	        </section>;
}

export default Albums;