let form = document.querySelector("form");
form.addEventListener("click", displayData);

let queens = {
	lat: 40.742054,
	lng: -73.769417
};

let brooklyn = {
	lat: 40.650002,
	lng: -73.949997
};

let manhattan = {
	lat: 40.7831,
	lng: -73.9712
};
let statenIsland = {
	lat: 40.5795,
	lng: -74.1502
};
let bronx = {
	lat: 40.8448,
	lng: -73.8648
};

var map;

function displayData(e) {
	e.preventDefault();
	console.log(e);
	let url = `https://data.cityofnewyork.us/resource/fhrw-4uyv.json?agency=NYPD&&borough=${e.target.innerText}`;
	let borough = returnBoroughCoordinatesObject(e.target.innerText);
	fetch(url)
		.then(function(res) {
			return res.json();
		})
		.then(function(res) {
			console.log(res);
			let input = parseInt(document.querySelector("input").value) || 10;
			let complaintsList = document.querySelector(".complaintsList");
			deleteChildren(complaintsList);
			map = new google.maps.Map(document.getElementById("map"), {
				center: borough,
				zoom: 12
			});
			for (let i = 0; i < input; i++) {
				let marker = generateMarkerForIncident(res[i]);
				marker.setMap(map);
				let newListItem = document.createElement("li"); //add new list item with the respective complaint type
				newListItem.innerText = res[i].complaint_type;
				complaintsList.appendChild(newListItem);

				let newButton = document.createElement("button");
				newButton.innerText = "Show Police Action";
				newButton.addEventListener("click", displayInfo);
				complaintsList.appendChild(newButton);

				let description = document.createElement("p");
				if (res[i].resolution_description) {
					description.innerText = res[i].resolution_description;
				} else {
					description.innerText = res[i].status;
				}
				description.classList.add("hide");
				complaintsList.appendChild(description);
			}
		})
		.catch(function(err) {
			console.log("error", err);
		});
}

function displayInfo(e) {
	


	//focusOnMarker();
	console.log(e);
	e.target.nextSibling.classList.toggle("hide");
}

function returnBoroughCoordinatesObject(text) {
	if (text === "QUEENS") {
		return queens;
	} else if (text === "BROOKLYN") {
		return brooklyn;
	} else if (text === "MANHATTAN") {
		return manhattan;
	} else if (text === "STATEN ISLAND") {
		return statenIsland;
	} else if (text === "BRONX") {
		return bronx;
	}
}

function generateMarkerForIncident(incident) {
	let lng = incident.location.coordinates[0];
	let lat = incident.location.coordinates[1];
	let latlng = new google.maps.LatLng(lat, lng);

	let id = incident.unique_key;

	let marker = new google.maps.Marker({
		position: latlng,
		title: id
	});

	return marker;
}

function focusOnMarker(marker) {
	let mainMap = document.querySelector('#map');
	mainMap.classList.toggle('hide');
	var newMap;
	newMap = new google.maps.Map(document.getElementById("map"), {
		center: marker.position,
		zoom: 15
	});
}

function deleteChildren(parentElement) {
	while (parentElement.firstChild) {
		parentElement.removeChild(parentElement.firstChild);
	}
}