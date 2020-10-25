import React, { Component } from 'react'
import { GoogleMap, LoadScript, MarkerClusterer, Marker } from '@react-google-maps/api'
import PhotoModal from './PhotoModal'
import Photos from './Photos'

const mapContainerStyle = {
  height: '500px',
  width: '100%',
}

const options = {
  zoomOnClick: false,
  disableAutoPan: true,
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
}

let map;

export class PhotoMap extends Component {
  constructor(props) {
    super(props)
    // Call a function that creates a state based on the props
    let computedState = this.computeStateFromProps(props, props.markersType)
    this.state = ( computedState !== undefined ) ? computedState : {}
    // Add markers type to state
    this.state.markersType = props?.markersType
    this.state.center = { lat: 0, lng: 0 }
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
        return { positions: props.coordinatesList, selectedImage: "" }
      }
    }
    return undefined
  }

  clusterClicked(cluster) {
    let images = cluster.markers.map((img) => {
      return { id: img.id, thumbPath: img.thumbPath }
    })
    this.setState({ selectedImage: "", selectedCluster: images})
  }

  photoClicked(photo) {
    this.setState({ selectedImage: photo.vb.target.title })
  }

  handleCenterChange() {
    if (map !== undefined) {
      let currentCenter = map.getCenter()
      this.state.center = { lat: currentCenter.lat(), lng: currentCenter.lng() }
    }
  }

  setMap(mapInstance) {
    map = mapInstance
  }

  render() {
    if (this.state === undefined) {
      return <div></div>
    }
    if (this.state.markersType == "single") {
      return (
          <GoogleMap mapContainerStyle={ mapContainerStyle } zoom={ 10 } center={ this.state.position }>
            <Marker position={ this.state.position } />
          </GoogleMap>
      )
    } else if (this.state.markersType == "cluster") {
      if (this.state.positions === undefined) {
        this.state.positions = []
      }
      return (
        <div>
          <PhotoModal selectedImage={ this.state.selectedImage }/>
            <GoogleMap mapContainerStyle={ mapContainerStyle } zoom={ 2 } onLoad={ this.setMap.bind(this) } onCenterChanged={ this.handleCenterChange.bind(this) } center={ this.state.center }>
              <MarkerClusterer options={ options } onClick={ this.clusterClicked.bind(this) }>
                {(clusterer) =>
                  this.state.positions.map((location) => (
                    <Marker key={ location.id }
                            title={ location.id }
                            options={ { id: location.id, thumbPath: location.thumbPath } }
                            onClick={ this.photoClicked.bind(this) }
                            position={ { lat: location.coordinates.lat, lng: location.coordinates.lng} }
                            clusterer={ clusterer } />
                  ))
                }
              </MarkerClusterer>
            </GoogleMap>
          <Photos preLoaded={ true } photos={ this.state.selectedCluster }/>
        </div>
      )
    }
  }
}

export default PhotoMap