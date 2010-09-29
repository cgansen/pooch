var Pooch = {
	'tasks': [],

	'create_new_task': function(){ 
		task = new Task( $('#task-title').val(), $('#task-due').val(), $('#task-notes').val() ); 
		this.add_task(task);
	},

	'add_task': function(task){
		this.tasks.push(task);
		this.insert_task_in_list(task);
		return this.tasks;
	},

	'insert_task_in_list': function(task) {
		$("#task-list").append("<div class='task-instance'>" +
				"<div class='task-instance-title'>" +
					"<a href='#' onclick='Pooch.show_notes($(this).parent().parent()); return false;'>" + task.title + "</a></div>" +
					"<div class='task-instance-due-date'>" + task.due + "</div>" +
				"<div class='task-instance-notes'>" + task.notes + "</div>" +
				"<div class='clear' /></div>"
		);
		
		$('.task-instance:last').fadeIn();
	},

	'show_notes': function(el){
		$(el).children(".task-instance-notes").toggle();
	}

}

function Task(title, due, notes){
	this.title = title;
	this.due = due;
	this.notes = notes;
}
