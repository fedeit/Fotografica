import React, { Component } from 'react'
import PhotoMap from './PhotoMap'
import { getAllCoordinates } from '../api/fotografica_api'

class PhotosGoogleMaps extends React.Component {
	constructor(props) {
		super(props)
		this.state = { positions: [] }
	}

	componentWillMount() {
		getAllCoordinates((list) => {
			let coordinates = list.map((el) => {
				return el.coordinates
			})
			this.setState({ positions: coordinates })
		})
	}

	render() {
		return (
			<PhotoMap markersType="cluster" coordinatesList={ this.state.positions } />
		)
	}
}

export default PhotosGoogleMaps