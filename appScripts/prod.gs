//This Google AppScript file is for Implementation

const DATA = "data";
const ERR = "error";
const USERS = AdminDirectory.Users.list({"domain":"iitgn.ac.in"});

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
		let startTime = new Date(parseInt(start));
		let endTime = new Date(parseInt(end));
		let c = CalendarApp.getCalendarById(user.primaryEmail).getEvents(startTime, endTime);

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

/* Qeury string format is
    URL?start=<START_TIME_IN_MS>&end=<END_TIME_IN_MS>
*/

function doGet(request){
	try{
		let r = request.parameter;
		if(r.start==undefined || r.end==undefined){
			return sendResponse(ERR,{"invalidQuery":r,"request":request});
		}
		return getInfo(r.start,r.end);
	}catch(E){
		return sendResponse(ERR,{"scriptError":E.name,"message":E.message});
	}
}
