//This Google AppScript file is for Test purposes

const DATA = "data";
const ERR = "error";
const LOG = "log";
const USERS = PropertiesService.getScriptProperties().getProperties();

//function for sending response to website
function sendResponse(type,message,data={}){
	let response = {
		"type": type,
		"message": message,
		"data": data
	}
	return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

//function for querying locations info
function getInfo(start,end){
	let data = [];
	for(let user in USERS){
		//Get all events in the time range [start,end]
		let c = CalendarApp.getCalendarById(user).getEvents(new Date(parseInt(start)), new Date(parseInt(end)));

		//For each event, if there is location defined, add its start,end and location to result
		c.forEach(e=>{
      			if(e.getLocation()!=""){
				data.push({
					'start':e.getStartTime(),
					'end':e.getEndTime(),
					'location':e.getLocation()
				});
			}
		});
	}
	return sendResponse(DATA,"success",data);
}

/* Qeury string format can be
    URL?to=[add|remove]&id=<abc@gmail.com>
    URL?to=get&start=<start time in ms>&end=<end time in ms>
*/

function doGet(request){
	try{
		let r = request.parameter;
		if (r.to==undefined){
			return sendResponse(ERR,"'to' query parameter is not defined");
		}
		switch(r.to){
			case "add":
				PropertiesService.getScriptProperties().setProperty(`${r.id}`,1);
				return sendResponse(LOG,`${r.id} added to Properties`);

			case "remove":
				PropertiesService.getScriptProperties().deleteProperty(`${r.id}`)
				return sendResponse(LOG,`${r.id} removed from Properties`);

			case "getUsers":
				return sendResponse(DATA,"Users' list",PropertiesService.getScriptProperties().getProperties());

			case "getInfo":
				return getInfo(r.start,r.end);

			default:
				return sendResponse(ERR,`'to' query parameter value '${r.to}' is not valid`);
		}
	}catch(E){
		return sendResponse(ERR,{"scriptError":E.name,"message":E.message});
	}
}
