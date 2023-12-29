const URL = "https://script.google.com/macros/s/AKfycbxXYza4MZ2sbwMExQfWORuTC33HCRRSBRy6kiGV5R-1VuzhIFHVHDeqvNfqM0wqnFMw/exec";
const locations = {
	"AB1":[
		"Academic Block 1-GF-DARPAN",
		"(Auditorium)-Academic Block 1-GF-Jibaben",
		"(Learning Theatre)-Academic Block 1-FF-201 (150)",
		"(Open Space)-Academic Block 1-GF-SRUJAN",
		"(Learning Theatre)-Academic Block 1-GF-101 (150) [Hybrid Classroom]",
		"(Learning Theatre)-Academic Block 1-GF-102 (150) [Hybrid Classroom]"
	],
	"AB2":[
		"(Auditorium)-Academic Block 2-GF-Jasubhai Memorial Auditorium (580)"
	],
	"AB3":[
		"(Classroom)-Academic Block 3-FF-216 (50)",
		"(Meeting Room)-Academic Block 3-SF-304 (7)",
		"(Open Space)-Academic Block 3-GF-SAMVAD",
		"(Meeting Room)-Academic Block 3-FF-211 (20)"
	],
	"AB4":[
		"Academic Block 4-GF-SANDHYACHAYA",
		"(Meeting Room)-Academic Block 4-TF-408 (8)",
		"(Meeting Room)-Academic Block 4-GF-112 (25)"
	],
	"AB5":[
		"Academic Block 5-GF-SAMMELAN",
		"(Classroom)-Academic Block 5-FF-202 (70)",
		"(Classroom)-Academic Block 5-FF-203 (70)"
	],
	"AB6":[
		"Academic Block 6-FF-201 (70)",
		"(Classroom)-Academic Block 6-FF-202 (69)",
		"(Meeting Room)-Academic Block 6-TF-404 (8)",
		"(Open Space)-Academic Block 6-FF-PRADARSHINI"
	],
	"AB7":[
		"Academic Block 7-GF-VIDHYACHAHYA",
		"(Classroom)-Academic Block 7-FF-202 (50)",
		"(Classroom)-Academic Block 7-FF-203 (50)",
		"(Classroom)-Academic Block 7-FF-205 (40)",
		"(Classroom)-Academic Block 7-FF-206 (40)",
		"(Classroom)-Academic Block 7-FF-207 (40)",
		"(Classroom)-Academic Block 7-FF-208 (70)",
		"(Classroom)-Academic Block 7-GF-103 (40)",
		"(Classroom)-Academic Block 7-GF-104 (40)",
		"(Classroom)-Academic Block 7-GF-106 (40)",
		"(Classroom)-Academic Block 7-GF-107 (50)",
		"(Computer Lab)-Academic Block 7-GF-108 (70)",
		"(Computer Lab)-Academic Block 7-GF-109 (70)",
		"(Classroom)-Academic Block 7-FF-201 (40)",
		"(Classroom)-Academic Block 7-FF-204 (40)",
		"(Classroom)-Academic Block 7-FF-209 (70)",
		"(Classroom)-Academic Block 7-FF-210 (40)",
		"(Classroom)-Academic Block 7-GF-101 (40) [Hybrid Classroom]",
		"(Classroom)-Academic Block 7-GF-102 (50) [Hybrid Classroom]"
		,"(Classroom)-Academic Block 7-GF-105 (40)"
	],
	"AB8":[
		"(Open Space)-Academic Block 8-GF-VISHWANGAN"
	],
	"AB9":[
		"(Meeting Room)-Academic Block 9-FF-202 (5)"
	],
	"AB10":[
		"(Presentation Studio)-Central Arcade-SF-Hall 9 (4)"
	]
};

var rooms;
var i;

function createRooms(){
	document.getElementById("content").innerHTML = "";
	rooms = {};
	i = 0;
	for(let block in locations){
		let ab = document.createElement("div");
		let name = document.createElement("h3");
		name.innerHTML = block;
		document.getElementById("content").appendChild(name);
		ab.className = "block";
		locations[block].forEach(room=>ab.appendChild(createRoom(room)));
		document.getElementById("content").appendChild(ab);
	}
}

function displayInfo(e){
	let box = document.createElement("div");
	let popup =document.createElement("div");
	popup.id = "popup";
	box.id = "box";
	let offset_y = document.body.getBoundingClientRect().top-10;
	popup.style['top'] = `${-offset_y}px`;
	box.appendChild(popup);
	box.onclick = (ev) =>{
		try{
			document.body.removeChild(ev.target);
			document.body.style['position'] = "static";
			window.scrollTo(0,-offset_y);
		}catch(E){}
	}
	popup.innerHTML = "<h4>"+((e.target.nodeName=="H4")?e.target:e.target.firstChild).innerHTML +"</h4><hr/>"+((e.target.nodeName=="H4")?e.target.parentElement:e.target).dataset.events;
	document.body.style['position'] = "fixed";
	document.body.style['top'] = offset_y+"px";
	document.body.appendChild(box);
}

function createRoom(name){
	let room = document.createElement("div");
	let title = document.createElement("h4");
	room.className = "room";
	room.dataset.events = "<p>Available</p>";
	room.onclick =(ev)=> displayInfo(ev);
	title.innerHTML = name;
	rooms[name] = i;
	room.appendChild(title);
	i++;
	return room;
}
function update(){
	let start = document.getElementById("start");
	let end = document.getElementById("end");
	let startTime = new Date(start.value).getTime();
	let endTime = new Date(end.value).getTime();
	let query = `?to=getInfo&start=${startTime}&end=${endTime}`;
	document.getElementById("updateInfo").innerHTML = "Updating...";
	document.getElementById("updateInfo").dataset.time = new Date().toLocaleString();
	sendRequest(query);
}

function showData(E){
	E.forEach(e=>{
		if(e.location in rooms){
			let room = document.getElementsByClassName("room")[rooms[e.location]];
			if(room.dataset.events=="<p>Available</p>") room.dataset.events = "<p>Not Available:</p>";
			room.dataset.events += `<p><b>from</b> ${new Date(e.start).toLocaleString()} <b>to</b> ${new Date(e.end).toLocaleString()}</p>`;
			room.className = "filled_room";
		}
	});
	let u = document.getElementById("updateInfo").dataset.time;
	document.getElementById("updateInfo").innerHTML = "Updated on "+u;
}

function sendRequest(r){
	fetch(URL+r).then(response=>{
		response.json().then(e=>{
			if(e.type=="data"){
				createRooms();
				showData(e.data);
			}
		});
	});
}

window.onload=()=>{
	let sTime = new Date();
	let eTime = new Date(sTime.getTime()+(3*60*60*1000));
	document.getElementById("start").value = sTime.toISOString().slice(0,16); 
	document.getElementById("end").value = eTime.toISOString().slice(0,16);
	update();
}
