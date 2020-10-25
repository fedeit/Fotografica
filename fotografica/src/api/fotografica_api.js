import axios from 'axios';
let url = process.env.REACT_APP_SERVER_URL

export let getPhotos = (quantity, batchNumber, completion) => {
    axios.get(url + '/photos', {quantity: quantity, batchNumber: batchNumber})
  	.then(res => {
  		const photos = res.data.result;
  		completion(photos)
  	})
}

export let getPhoto = (id, completion) => {
    axios.get(url + '/photo?id=' + id, {})
  	.then(res => {
  		const photo = res.data.result;
  		completion(photo)
  	})
}

export let getLastRefresh = (completion) => {
    axios.get(url + '/lastRefresh', {})
  	.then(res => {
		  completion(res.data.result)
  	})
}

export let rotateClockwise = (id, completion) => {
    axios.get(url + '/rotateClockwise?id=' + id, {})
  	.then(res => {
		  completion()
  	})
}

export let getAllCoordinates = (completion) => {
  axios.get(url + '/allCoordinates', {})
    .then(res => {
      completion(res.data.result)
    })
}