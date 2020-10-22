import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

const AnyReactComponent = ({ text }) => <div>{text}</div>;


function exifNumStrToFloat(strNum) {
  let fraction = strNum.split("/")
  return parseInt(fraction[0]) / parseInt(fraction[1])
}

function parseCoordinate(coordinateString, direction) {
  let parts = coordinateString.split(", ")
  let values = []
  parts.forEach((part) => {
    values.push(exifNumStrToFloat(part))
  })
  return ConvertDMSToDD(values[0], values[1], values[2], direction)
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

export class PhotoMap extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    if (props.metadata !== undefined && props.metadata.gpsLatitude !== undefined && props.metadata.gpsLongitude !== undefined) {
      let lat = parseCoordinate(props.metadata.gpsLatitude, props.metadata.gpsLatitudeRef)
      let lon = parseCoordinate(props.metadata.gpsLongitude, props.metadata.gpsLongitudeRef)
      this.setState({position: { lat: lat, lng: lon }})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.metadata !== undefined && nextProps.metadata.gpsLatitude !== undefined && nextProps.metadata.gpsLongitude !== undefined) {
      let lat = parseCoordinate(nextProps.metadata.gpsLatitude, nextProps.metadata.gpsLatitudeRef)
      let lon = parseCoordinate(nextProps.metadata.gpsLongitude, nextProps.metadata.gpsLongitudeRef)
      this.setState({position: { lat: lat, lng: lon }})
    }
  }
  render() {
    if (this.state.position === undefined) {
      return <div></div>
    }
    return (
      <div style={{ height: '400px', width: '90%', padding:'20px' }}>
        <Map google={this.props.google} zoom={13} initialCenter={ this.state.position } style={{ height: '400px', width: '90%', padding:'40px' }} >
           <Marker position={this.state.position} />
         </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
 apiKey: ('YOUR API KEY HERE')
})(PhotoMap);
 
