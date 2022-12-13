// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

 function onPageLoad() {
  console.log('onPageLoad()')
  
	try {
		getTracks()
			.then(tracks => {			
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
    console.log('setupClickHandlers()')

	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
  console.log('delay')
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  console.log('handleCreateRace')
	// render starting UI
  console.log("handle craete")

	// TODO - Get player_id and track_id from the store
  const player_id= store.player_id
        const track_id= store.track_id

		if(!player_id || !track_id){
			alert('please select from below')
		}else{
// const race = TODO - invoke the API call to create the race, then save the result
try {
	const race = await createRace(player_id, track_id);
	console.log('createRace::',race);
	// render starting UI
	renderAt('#race', renderRaceStartView(race.Track)); 
	// TODO - update the store with the race id
	store.race_id = race.ID-1 ;
	// TODO - call the async function runCountdown
	await runCountdown();
	// TODO - call the async function startRace
	await startRace(store.race_id);
	// TODO - call the async function runRace
	const raceRun = await runRace(store.race_id);
	console.log('raceRun::',raceRun);
} catch(error) {
	console.log("Error in handleCreateRace: ", error);
}
		}
	
	
}

async function runRace(raceID) {
  console.log('runRace')
	return new Promise(resolve => {
	// TODO - use Javascript's built in setInterval method to get race info every 500ms
	setInterval(raceInfo=()=>{
		getRace(raceID).then(info=>{
			console.log(info)
			if(info.status=='in-progress'){
				renderAt('#leaderBoard', raceProgress(info.positions))

			}else if(info.status=='finished'){
				clearInterval(raceInfo) // to stop the interval from repeating
				renderAt('#race', resultsView(info.positions)) // to render the results view
				reslove(info) // resolve the promise
			}
		})
	},500)

	/* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:

		renderAt('#leaderBoard', raceProgress(res.positions))
	*/

	/* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		reslove(res) // resolve the promise
	*/
	}).catch(err=>console.log('Error occured with run race'))
	// remember to add error handling for the Promise
}

async function runCountdown() {
  console.log('runCountdown')
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3
		
		return new Promise(resolve => {

							// TODO - use Javascript's built in setInterval method to count down once per second

				setInterval(countDowonInterval=()=>{
			// run this DOM manipulation to decrement the countdown for the user
			if(timer !==0){
				document.getElementById('big-numbers').innerHTML = --timer
		
			}else{
				// TODO - if the countdown is done, clear the interval, resolve the promise, and return
		
				clearInterval(countDowonInterval)
				resolve()
			}

				}, 1000)

	
	
				



		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
    console.log('handleSelectPodRacer')

	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	store.player_id=target.id
}

function handleSelectTrack(target) {
      console.log('handleSelectTrack')

	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected track id to the store
	store.track_id= target.id
}

function handleAccelerate() {
        console.log('handleAccelerate')

	// TODO - Invoke the API call to accelerate
	accelerate(store.race_id).then(x=>{
		console.log("accelerate button clicked")
	}).catch(err=>{
		console.log(err)
	})
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
          console.log('renderRacerCars')

	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')
	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
            console.log('renderRacerCard')
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
              console.log('renderTrackCards')
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')
	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
                console.log('renderTrackCard')

	const { id, name } = track

	return `
	
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
                  console.log('renderCountdown')

	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
                    console.log('renderRaceStartView')

	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
              console.log('resultsView')

	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
                console.log('raceProgress')

	let userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
                console.log('renderAt')

	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001'

function defaultFetchOpts() {
  
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

  

 function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	return fetch(`${SERVER}/api/tracks`)
	.then((res) => res.json())
	.then((res) =>res )
  .catch(err=>console.log('Error getting tracks:',err))

// 	const response = await fetch(`http://localhost:3001/api/tracks`)
// 	console.log('trrrrr')
// console.log(response.json())
//   return await response.json()
  
}

 function getRacers() {
	// GET request to `${SERVER}/api/cars`
return  fetch(`${SERVER}/api/cars`)
.then((res) => res.json())
	.then((res) => res)
  .catch(err=>console.log('Error getting cars:',err))
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		dataType: 'jsonp',
		body: JSON.stringify(body),
		...defaultFetchOpts()
	})
	.then(res => res.json())
	.catch(err => console.log("Error occurd with createRace request:", err))
}

 async function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
return await fetch(`${SERVER}/api/races/${id}`)
.then( res=>res.json())
.then((res)=>res)
  .catch(err=>console.log('Error getting tracks:',err))
  
}

async function startRace(id) {


	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts()
	})
	.then(res => res)
	.catch(err => console.log("Error occurd with  startRace:", err))

	
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
  
	
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp'
	})
	.then(res => res.json())
	.then((res)=>res)
	.catch(err => console.log("Error occured with accelerate:", err))
  
  
  
  
  
}
