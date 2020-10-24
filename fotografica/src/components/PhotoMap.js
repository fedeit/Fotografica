import React, { Component } from 'react'
import { GoogleMap, LoadScript, MarkerClusterer, Marker } from '@react-google-maps/api'

const mapContainerStyle = {
  height: '400px',
  width: '800px',
}

const options = {
  imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
}

const center = { lat: -28.024, lng: 140.887 }

export class PhotoMap extends Component {
  constructor(props) {
    super(props)
    // Call a function that creates a state based on the props
    let computedState = this.computeStateFromProps(props)
    this.state = ( computedState !== undefined ) ? computedState : {}
    // Add markers type to state
    console.log("Making map of type: " + props.markersType)
    this.state.markersType = props?.markersType
  }

  componentWillReceiveProps(nextProps) {
    // Call a function that creates an updated state based on the new props
    this.setState(this.computeStateFromProps(nextProps))
  }

  computeStateFromProps(props) {
    // Add property to define if map will show one marker or multiple
    if (props.markersType == "single") {
      // Check if the coordinates of the marker are defined
      if (props.coordinates !== undefined) {
        // Return the coordinates for the marker
        return { position: props.coordinates }
      }
    } else if (props.markersType == "cluster") {
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
    let body;
    if (this.state.markersType == "single") {
      return (
        <LoadScript googleMapsApiKey="AIzaSyAmsbP_ItDTDqdouU9YmcCeY8FXopN8BvM">
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={ 3 } center={center}>
            <Marker position={ this.state.position } />
          </GoogleMap>
        </LoadScript>
      )
    } else if (this.state.markersType == "cluster") {
      return (
        <LoadScript googleMapsApiKey="AIzaSyAmsbP_ItDTDqdouU9YmcCeY8FXopN8BvM">
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={ 3 } center={center}>
            <MarkerClusterer options={options}>
              {(clusterer) =>
                locations.map((location) => (
                  <Marker key={ location.lat + location.lng } position={location} clusterer={clusterer} />
                ))
              }
            </MarkerClusterer>
          </GoogleMap>
        </LoadScript>
      )
    }
  }
}

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
]

export default PhotoMap