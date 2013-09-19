/* COMMON
=========================================== */
People = new Meteor.Collection("people");
Blog = new Meteor.Collection("blog");



Meteor.methods({

	/*
		function: Save
		===========================================
		* To use, add the following line in the blur event handler:
		* Meteor.call("save", this, e.target.dataset, e.target.innerTEXT);

		This function allows in-place content editing from the client, and
		saves changes to the relevant database.

		Currently it captures the database name from the dataset object, 
		e.g. data-doc="blog" in the html, and simply uses a switch block to
		handle the request.

		/TODO/
		It'd be nice if the event handler just 'knew' what db, doc and field
		was being clicked without having to set up html data- properties…
			
		===========================================
	*/
	save : function (doc, prop, val) {
		// weird mongo hack to pass variable (i.e., prop.field) as field (i.e., "title")
		var setModifier = { $set: {} };
		setModifier.$set[prop.field] = val;
		
		if (prop) {
			switch (prop.doc) {
				case 'people' :
					People.update({_id: doc._id}, setModifier);
					break;

				case 'blog' :
					Blog.update({_id: doc._id}, setModifier);
					break;

				default:
					break;
			}
		}
	}
});



/* CLIENT
=========================================== */
if (Meteor.isClient) {

	//// TEMPLATES

	// "Content (is | is not) editable"
	Handlebars.registerHelper('is_editable', function () {
		return Meteor.user() ? "" : "not";
	});
	
	// Table of people
	Template.list.people = function () {
		return People.find();
	};
	// Blog
	Template.blog.articles = function () {
		return Blog.find();
	};




	//// EVENTS
	Template.main.events({
		'blur .editable' : function (e) {
			Meteor.call("save", this, e.target.dataset, e.target.innerText);
		}
	});


	//// REACTIVE DATA
	// Set contenteditable on login
	$(document).ready(function () {
		//setEditable(Meteor.user());
	});


	//// CUSTOM HELPERS
	function setEditable(editable) {

		if (editable) {
			$('.editable').children('td').attr("contenteditable", true);
		} else {
			$('.editable').children('td').attr("contenteditable", false);
		}
	}



	//// ACCOUNTS
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
	});
}




/* SERVER
=========================================== */
if (Meteor.isServer) {
  
}