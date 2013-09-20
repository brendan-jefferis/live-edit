/* COMMON
===========================================
=========================================== */
People = new Meteor.Collection("people");
Blog = new Meteor.Collection("blog");



Meteor.methods({

	/*
		function: Save
		===========================================
		* To use, add the following line in the blur event handler:
		* Meteor.call("save", this, e.target.dataset, e.target.innerTEXT);
			- this: current database document to update, gives us access to _id
			- e.target.dataset: custom HTML attributes (data-doc, data-field)
			- e.target.innerTEXT: content to be updated  

		This function allows in-place content editing from the client, and
		saves changes to the relevant database.

		Currently it captures the database name from the dataset object, 
		e.g. data-doc="blog" in the html, and simply uses a switch block to
		route the request.

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

		// TODO return true only if update successful
		return true;
	}
});




/* CLIENT
===========================================
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
			if (Meteor.call("save", this, e.target.dataset, e.target.innerText)) {
				
				// display timed 'saved' message
				$(e.target).addClass("saved");
				window.setTimeout(function () {
					$(e.target).removeClass("saved");
				}, 1000);
			}
		}
	});



	//// ACCOUNTS
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
	});
}


/* SERVER
===========================================
=========================================== */
if (Meteor.isServer) {
	// Dummy data
	Meteor.startup(function () {

		if (People.find().count() === 0) {
			People.insert({name: "Bob", birthday: "12 JAN 53"});
			People.insert({name: "Mary", birthday: "3 MAY 91"});
		}

		if (Blog.find().count() === 0) {
			Blog.insert({title: "My Awesome Opinions", content: "I have always belived that lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, nobis, quas, dicta nulla quia ex mollitia optio voluptatibus cumque voluptatum obcaecati nisi maiores tenetur rem dolorum illum laborum eveniet ducimus."});
			Blog.insert({title: "Article Title, etc", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, nobis, quas, dicta nulla quia ex mollitia optio voluptatibus cumque voluptatum obcaecati nisi maiores tenetur rem dolorum illum laborum eveniet ducimus."})
		}
	});
}
