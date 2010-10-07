var Pooch = {
	'tasks': [],
	'map': '',

	'init': function(){
		this.tasks = [];
		var panel = window.location.hash ? window.location.hash : '#today'; 
		this.highlight_active_panel(panel);
		
		// load the map
    var myOptions = {
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    this.map = new google.maps.Map(document.getElementById("nearby-map"), myOptions);

    // code from http://code.google.com/apis/maps/documentation/javascript/basics.html#DetectingUserLocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        this.map.setCenter(initialLocation);
      }, function() {
        this.map.setCenter(new google.maps.LatLng(41.947372, -87.655788)); // let's play two!
      });
    }
	},
	
	'highlight_active_panel': function(panel){
	  $('li.toolbar-item').removeClass('toolbar-item-active');
	  $("li" + panel).addClass('toolbar-item-active');
	  
	  $('.panel').hide();
	  $("div" + panel).show();
	},
	
	'show_panel': function(panel){    
	  this.highlight_active_panel(panel);
	},
	
	'create_new_task': function(){ 
		task = new Task( $('#task-title').val(), $('#task-due').val(), $('#task-notes').val() ); 
		this.add_task(task);		
		this.highlight_active_panel('#today');
	},

	'add_task': function(task){
		this.tasks.push(task);
		this.insert_task_in_list(task);
		localStorage['pooch:tasks'] = JSON.stringify(this.tasks) // save to the local storage object
		return this.tasks;
	},

	'insert_task_in_list': function(task) {
		$("div#today").append("<div class='task-instance'>" +
				"<div class='task-instance-title'>" +
					"<canvas width='15' height='15' style='border:1px solid #ccc; margin-right:5px;' id='task-" + task.id + "' onclick='Pooch.mark_complete(\"" + task.id + "\");'></canvas>" +
					"<a href='#' onclick='Pooch.show_notes($(this).parent().parent()); return false;'>" + task.title + "</a></div>" +
					"<div class='task-instance-due-date'>" + task.due + "</div>" +
				"<div class='task-instance-notes'>" + task.notes + "</div>" +
				"<div class='clear' /></div>"
		);
		
		$('.task-instance:last').fadeIn();
	},

	'show_notes': function(el){
		$(el).children(".task-instance-notes").toggle();
	},
	
	'load_tasks_from_JSON': function(){
		if ( localStorage['pooch:tasks'].length - 1 ){
			var task_list = JSON.parse(localStorage['pooch:tasks']);
			$.each(task_list, function(idx,task){
				if(task['title'] != undefined){
					Pooch.add_task(new Task(task['title'], task['due'], task['notes']));
				}
		 	});
		}
	},

	'reset': function(){
		localStorage['pooch:tasks'] = JSON.stringify([]);
	},
	
	'mark_complete': function(tid){
    $.each(this.tasks, function(index, task){
      if(task.id == tid){
        task.completed = true;
        document.getElementById('task-' + tid).getContext('2d').fillRect(3,3,9,9 );
      }
    });        
	}

}

function Task(title, due, notes){
	this.title = title;
	this.due = due;
	this.notes = notes;
	this.completed = false;
	this.id = (new Date()).getTime();
}

$(document).ready(function() {
	// load the tasks from localStorage
	Pooch.init();
	Pooch.load_tasks_from_JSON();
});
