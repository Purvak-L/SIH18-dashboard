paramsobj = {height:0, overlap:0, no_drones:0, comm_range:0, time_of_flight: 0, x1:0, y1:0, x2:0, y2:0};

var drone_stats_str = '';
var curr_level = -1; 

set_drone_data_flag = 0;
set_grid_data_flag = 0;

var new_data_flag = 0;

var conn_status_json;
var global_weather_status;

var disp;
var dispCtx;
var im;
var ws;

var drone_loc = { 
	"type": "drones",
	"drones": [
		{"id": "1101", "est_loc": [12.1234,11.5678,1], "conn_status": "connected", "timestamp": "020439" },
		{"id": "1102", "est_loc": [8.1234,14.5678,1], "conn_status": "connected", "timestamp": "074518" },
		{"id": "1103", "est_loc": [9.1234,10.5678,1], "conn_status": "not_connected", "timestamp": "032338" },
		{"id": "1104", "est_loc": [4.1234,11.5678,1], "conn_status": "connected", "timestamp": "032338" }	
	]
};

function check_mission_status() {
	if (paramsobj.x1 == 0 || paramsobj.y1 == 0 || paramsobj.x2 == 0 || paramsobj.y2 == 0 || paramsobj.height == 0 || paramsobj.overlap == 0 || paramsobj.no_drones == 0 || paramsobj.comm_range == 0 || paramsobj.time_of_flight == 0) {
		console.log('entered check mission status');
		document.getElementById('mission_button').innerHTML = '<button type="button" class="btn cur-p btn-danger"></button>';
		document.getElementById('mission_ready_state').innerHTML ='<h6 class="lh-1">Status: <span style="color: #ff3f80">NOT READY</span></h6>';
		// document.getElementById('drone_tip').innerHTML = '<div class="alert alert-danger" role="alert">Please submit all params to get estimates on <strong>time</strong> and <strong>number of drones</strong></div>';
		
	}
}

function start_mission() {
	var start_mission = {
		"type" : "start"
	}
	ws.send(JSON.stringify(start_mission));
	document.getElementById('2dsimulation').src="http://192.168.137.217:5000/calc";
}

function send_params() {

	console.log('entered send_params');

	paramsobj.height = document.getElementById("height").value;
	paramsobj.overlap = document.getElementById("overlap").value;
	paramsobj.no_drones = document.getElementById("no_drones").value;
	paramsobj.comm_range = document.getElementById("comm_range").value;
	paramsobj.time_of_flight = document.getElementById("time_of_flight").value;
	paramsobj.x1 = localStorage.getItem("x1");
	paramsobj.y1 = localStorage.getItem("y1");
	paramsobj.x2 = localStorage.getItem("x2");
	paramsobj.y2 = localStorage.getItem("y2");

	var sim_params = {
	"type": "sim_params",
	"level": curr_level,
	"height": paramsobj.height,
	"overlap": paramsobj.overlap,
	"swarm" : [paramsobj.no_drones,paramsobj.comm_range,paramsobj.time_of_flight],
	"select_coords" : [paramsobj.x1, paramsobj.y1, paramsobj.x2, paramsobj.y2] }

	console.log(sim_params);

	ws.send(JSON.stringify(sim_params));
}

function set_level(number) {
	console.log(number);
	curr_level = number;
}

function doLoad() {
	// console.log(allcookies);
	// check_mission_status();
	if (location.href.split("/").slice(-1) == "index.html") {
			check_mission_status();

			disp = document.getElementById("main-image");
    		// dispCtx = disp.getContext("2d");
    		// im = new Image();
    		// im.onload = function() {
    		// disp.setAttribute("width", im.width);
    		// disp.setAttribute("height", im.height);
    		// dispCtx.drawImage(this, 0, 0);
    		// document.getElementById('curr-view-div').style.display = null;
   //  		base_image.src = 'main-curr-view.png';
   //  		base_image.onload = function(){
   // 			dispCtx.drawImage(base_image, 0, 0);

  			// }
  		// };	
	}
    
    ws = new WebSocket("ws://192.168.137.217:50090");
   
    ws.onmessage = function (evt) {
    	console.log(evt.data)
    	// console.log(evt.data);
    	data = JSON.parse(evt.data);
    	
    	// to handle drone status data (e.g. for main page table
    	if (data.type == "drones") {
    		console.log(data);
    		if (location.href.split("/").slice(-1) == "index.html") {
    			setDroneTableData(data);
    			set_drone_data_flag = 1;
    		}
    	}
    	// to handle image data 
    	else if (data.type == "bg-img") {
    		// console.log('img data received');
    		console.log(data);
    		if (location.href.split("/").slice(-1) == "index.html") {
    			var img_data = dispCtx.createImageData(1366,768);
    			img_data.data = data.data;
    			dispCtx.putImageData(img_data,0,0);
    			// im.src = "data:image/png;base64," + data.img_data;
    		}
    	}
    	// to handle relay points data
    	else if (data.type == "relay") {
    		console.log(data);
    	} 

    	// to handle grid data
    	else if (data.type == "grid_data") {
    		setGridTableData(data);
    		console.log(data);
    		
    		if (location.href.split("/").slice(-1) == "index.html") {
    		var total_time = 0;
    		var number_of_grids = data.blocks.length;
    		count_of_explored = 0;
    		for (var i=0; i<number_of_grids; i++) {
    			// console.log(data.blocks[i].est_time);
    			total_time += parseFloat(data.blocks[i].est_time)
    			if (data.blocks[i].status == 'explored' ) {
    				count_of_explored += 1;
    			}
    		}
    		console.log(total_time);
    		average = total_time/number_of_grids;
    		percent_complete = (count_of_explored/number_of_grids)*100;
    		console.log(Math.floor(percent_complete.toString()));
    		// console.log(document.getElementById('grid_exploration_percent'));
    		// console.log(typeof(percent_complete.toString()));
    		// class="easy-pie-chart";
    		// aria-valuenow="50"
    		// document.getElementById('grid_exploration_percent').setAttribute("data-percent","50"); 
    		// document.getElementById('grid_progress').setAttribute("aria-valuenow","50"); 
    		document.getElementById("drone_tip").innerHTML = '<div class="alert alert-success" role="alert">Grid exploration: <span style="color: #ff3f80">'+percent_complete.toString()+'%</span></div>';
    		document.getElementById("est_time").innerHTML = "ETA: "+average;
    		// document.getElementById('grid_exploration_div').innerHTML = '<div id="grid_exploration_percent" class="easy-pie-chart" data-size='+percent_complete.toString()+'data-bar-color=\'#f44336\'><span></span></div><h6 class="fsz-sm">New Users</h6>'
    	}
    	}

    	else if (data.type == "drone_conn") {
    		conn_status_json = data;
    		console.log(conn_status_json);
    		// console.log(data);
    	}
    	else if (data.type == "ready") {
    		document.getElementById('mission_button').innerHTML = '<button type="button" class="btn cur-p btn-success" onclick="start_mission()">Start mission</button>';
			document.getElementById('mission_ready_state').innerHTML ='<h6 class="lh-1">Status: <span style="color: #008975">READY</span></h6>';
			// TODO: Get estimated number of drones and time from server
			// document.getElementById('drone_tip').innerHTML = '<div class="alert alert-success" role="alert"><strong>Estimation:</strong> The selected area will be mapped by <strong>4</strong> drones in <strong>20 minutes</strong></div>';

    	}
    	else if (data.type == "flight_times") {    		
    		setFlightTable(data);
    	}
    }
    if (document.getElementById('weather_tip')){
    	console.log('entered weather');
    	getWeatherStatus(function(weather){
    		console.log(weather);
    	if (weather.weather[0].main == 'Haze' || weather.weather[0].main == 'Rain' || weather.weather[0].main == 'Smoke' ) {
        		document.getElementById('weather_tip').innerHTML = '<div class="alert alert-danger" role="alert">You\'re in '+weather.name+' and there appears to be some '+weather.weather[0].main+'. It is not safe to plan a mission.</div>';  		
        	}
        	else {
        		document.getElementById('weather_tip').innerHTML = '<div class="alert alert-success" role="alert">You\'re in '+weather.name+' and the weather looks fine. It is safe to plan a mission.</div>';  			
        	}
    	});
    	
    }
  }

function setDroneTableData(data) {
	if (set_drone_data_flag == 0) {
		for (var i = data.drones.length - 1; i >= 0; i--) {
		id = "#"+data.drones[i].id;
		lat = data.drones[i].est_loc[0];
		lng = data.drones[i].est_loc[1];
		conn = data.drones[i].conn_status;
		ts = data.drones[i].timestamp;
		if (conn == "connected") {
			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
		}
		else {
			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
		}
		drone_stats_str += temp_str;
	}
	document.getElementById("drone_stats").innerHTML = drone_stats_str;
	}
	
}

function setGridTableData(data) {
	grid_data_str = '';
		for (var i = data.blocks.length - 1; i >= 0; i--) {
			grid_id = "#"+data.blocks[i].id;
			grid_label = data.blocks[i].label;
			centre_x = data.blocks[i].centre[0];
			centre_y = data.blocks[i].centre[1];
			centre_z = data.blocks[i].centre[2];
			grid_status = data.blocks[i].status;
			associated_drone_id = "#"+data.blocks[i].drone_id;
			est_time = data.blocks[i].est_time;
			if (grid_status == "explored") {
				temp_str = "<tr><td>"+grid_id+"</td><td>"+grid_label+"</td><td>["+centre_x+", "+centre_y+", "+centre_z+"]</td><td><span class=\"badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill\">"+grid_status+"</span></td><td>"+associated_drone_id+"</td><td>"+est_time+"</td></tr>";
			}
			else {
				temp_str = "<tr><td>"+grid_id+"</td><td>"+grid_label+"</td><td>["+centre_x+", "+centre_y+", "+centre_z+"]</td><td><span class=\"badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill\">"+grid_status+"</span></td><td>"+associated_drone_id+"</td><td>"+est_time+"</td></tr>";
			}
			grid_data_str += temp_str;
		}
	document.getElementById("grid_table_body").innerHTML = grid_data_str;
}

function setFlightTable(data) {
	document.getElementById("flight_time_table").innerHTML = '';
	flight_data_str = '';
		for (var i = data.flight_times.length - 1; i >= 0; i--) {
			drone_id = "#110"+i;
			flight_time = data.flight_times[i];
			temp_str = "<tr><td>"+drone_id+"</td><td>"+flight_time+"</td></tr>";
			flight_data_str += temp_str;
		}
	document.getElementById("flight_time_table").innerHTML = flight_data_str;
}

function getWeatherStatus(callback) {
			var getIP = 'http://ip-api.com/json/';
			var openWeatherMap = 'http://api.openweathermap.org/data/2.5/weather'

			$.getJSON(getIP).done(function(location) {
    		
    			$.getJSON(openWeatherMap, {
        			lat: location.lat,
        			lon: location.lon,
	        		units: 'metric',
	        		APPID: '7ebb67f0c260b3f89aaa1ebc0adf4471'
		    	}).done(function(weather) {
		    		if (weather.wind.speed > 6) {
		    		console.log('Unsafe');
		    		}
		    		else {
		    		console.log('Safe');
		    		}
		        	console.log(weather.wind.speed);
		        	console.log(weather.weather.length);
		        		for (var i = 0; i < weather.weather.length; i++) {
		        			console.log(weather);
		        			console.log(weather.weather[i].main);
		        		
		        			//return ''+weather.weather[i].main;
		        				
		        		}
		        	callback(weather);
		    	})
			})
		}




				

