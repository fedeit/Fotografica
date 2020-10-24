import React, { Component } from 'react'
import { GoogleMap, LoadScript, MarkerClusterer, Marker } from '@react-google-maps/api'

const apiKey = "YOUR API"

const mapContainerStyle = {
  height: '500px',
  width: '100%',
}

const options = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
}


export class PhotoMap extends Component {
  constructor(props) {
    super(props)
    // Call a function that creates a state based on the props
    let computedState = this.computeStateFromProps(props, props.markersType)
    this.state = ( computedState !== undefined ) ? computedState : {}
    // Add markers type to state
    this.state.markersType = props?.markersType
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.computeStateFromProps(nextProps, this.state.markersType)
    // Call a function that creates an updated state based on the new props
    this.setState(newState)
  }

  computeStateFromProps(props, markersType) {
    // Add property to define if map will show one marker or multiple
    if (markersType == "single") {
      // Check if the coordinates of the marker are defined
      if (props.coordinates !== undefined) {
        // Return the coordinates for the marker
        return { position: props.coordinates }
      }
    } else if (markersType == "cluster") {
      // Check if an array of coordinates is given
      if (props.coordinatesList !== undefined) {
        // Return a state made of the list pf positions
        return { positions: props.coordinatesList }
      }
    }
    return undefined
  }

  render() {
    if (this.state === undefined) {
      return <div></div>
    }
    if (this.state.markersType == "single") {
      return (
        <LoadScript googleMapsApiKey={ apiKey }>
          <GoogleMap mapContainerStyle={ mapContainerStyle } zoom={ 10 } center={ this.state.position }>
            <Marker position={ this.state.position } />
          </GoogleMap>
        </LoadScript>
      )
    } else if (this.state.markersType == "cluster") {
      if (this.state.positions === undefined) {
        this.state.positions = []
      }
      console.log("Making cluster")
      console.log(this.state.positions)
      return (
        <LoadScript googleMapsApiKey={ apiKey }>
          <GoogleMap mapContainerStyle={ mapContainerStyle } zoom={ 1 } center={ { lat: 0, lng: 0 } }>
            <MarkerClusterer options={ options }>
              {(clusterer) =>
                this.state.positions.map((location) => (
                  <Marker key={ location.lat + location.lng } position={ { lat: location.lat, lng: location.lng} } clusterer={ clusterer } />
                ))
              }
            </MarkerClusterer>
          </GoogleMap>
        </LoadScript>
      )
    }
  }
}

export default PhotoMap