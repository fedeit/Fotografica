import React from 'react'

let textFormat = {
	color: 'white'
}

function ImageInfo(props) {
	if (props.photo.metadata === undefined) {
		return <></>
	}
	if (props.showAllMetadata) {
		const all = Object.entries(props.photo.metadata).map(([key,value])=>{
		  return (
		      <tr style={textFormat}><td>{key}: {value}</td></tr>
		  );
		})
		return (<table><tbody>{all}</tbody></table>)
	}
	return 	<table>
				<tbody>
					<tr style={textFormat}><td>Filename: {props.photo.filename}</td></tr>
					<tr style={textFormat}><td>Date and time: {props.photo.metadata.dateTime}</td></tr>
					<tr style={textFormat}><td>Shot on: {props.photo.metadata.model}</td></tr>
				</tbody>
			</table>
}

export default ImageInfo