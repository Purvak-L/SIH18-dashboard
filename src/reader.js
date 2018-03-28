var drone_stats_str = '';
var curr_level = -1; 

set_drone_data_flag = 0;
set_grid_data_flag = 0;

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

function send_params() {
	console.log('entered send_params');
	height = document.getElementById("height").value;
	overlap = document.getElementById("overlap").value;
	no_drones = document.getElementById("no_drones").value;
	comm_range = document.getElementById("comm_range").value;
	time_of_flight = document.getElementById("time_of_flight").value;

	var sim_params = {
	"type": "sim_params",
	"level": curr_level,
	"height": height,
	"overlap": overlap,
	"swarm" : [no_drones,comm_range,time_of_flight] }

	console.log(sim_params);

	// ws2 = new WebSocket("ws://127.0.0.1:50008");
	ws2 = new WebSocket("ws://172.20.10.2:50010");
	ws2.onopen = () => ws2.send(JSON.stringify(sim_params));
}

function set_level(number) {
	console.log(number);
	curr_level = number;
}

function doLoad() {
	console.log('entered doload');
	if (location.href.split("/").slice(-1) == "index.html") {
			disp = document.getElementById("main-image");
    		dispCtx = disp.getContext("2d");
    		im = new Image();
    		im.onload = function() {
    		disp.setAttribute("width", im.width);
    		disp.setAttribute("height", im.height);
    		dispCtx.drawImage(this, 0, 0);
  		};	
	} 
    
    ws = new WebSocket("ws://172.20.10.2:50010");
    // ws = new WebSocket("ws://127.0.0.1:50008");
    ws.onmessage = function (evt) {
    	// console.log(evt.data);
    	data = JSON.parse(evt.data);
    	
    	// to handle drone status data (e.g. for main page table)
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
    			im.src = "data:image/png;base64," + data.img_data;
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
    	}

    	else if (data.type == "drone_conn") {
    		conn_status_json = data;
    		console.log(conn_status_json);
    		// console.log(data);
    	}   
    }
    if (document.getElementById('weather_tip')){
    	console.log('entered weather');
    	getWeatherStatus(function(weather){
    		console.log(weather);
    	if (weather.weather[0].main == 'Haze' || weather.weather[0].main == 'Rain' || weather.weather[0].main == 'Smoke' ) {
        		document.getElementById('weather_tip').innerHTML = '<div class="alert alert-danger" role="alert">There appears to be some '+weather.weather[0].main+'. It is not safe to plan a mission.</div>';  		
        	}
        	else {
        		document.getElementById('weather_tip').innerHTML = '<div class="alert alert-success" role="alert">The weather looks fine. It is safe to plan a mission.</div>';  			
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




				

