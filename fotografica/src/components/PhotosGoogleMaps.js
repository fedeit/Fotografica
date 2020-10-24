import React, { Component } from 'react'
import PhotoMap from './PhotoMap'
import { getAllCoordinates } from '../api/fotografica_api'

class PhotosGoogleMaps extends React.Component {
	constructor(props) {
		super(props)
		this.state = { positions: [] }
		getAllCoordinates((list) => {
			this.setState({ positions: list })
		})
	}

	render() {
		return (
			<PhotoMap markersType="cluster" positions={ this.state.positions }>
		)
	}
}

export default PhotosGoogleMaps