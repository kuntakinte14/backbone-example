(function($){ 
	
	// Object declarations goe here 
	var UserModel = Backbone.Model.extend({  
		
		// Set default values.    
		defaults: {      
			firstname: "",      
			lastname: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			zipcode: ""
		},
		
		// Define validation criteria.
	    validation: {
	      firstname: {
	        required: true,
	        msg: 'Please provide your first name'
	      },
	      lastname: {
	        required: true,
	        msg: 'Please provide your last name'
	      },
	      address1: {
		    required: true,
		    msg: 'Please provide your address'
		  }	      
	    }
	});
	
	var UsersCollection = Backbone.Collection.extend({
	    model: UserModel,
	    localStorage: new Backbone.LocalStorage("userInfo")
	});
	
	var RegisterView = Backbone.View.extend({
				
		initialize: function() {
			Backbone.Validation.bind(this);
			this.render();
			$("#complete").parent().parent().hide();
		},
		
		render: function() {
			this.$el.html($.tpl['tmpl_regform']);
			return this;
		},
		
		// Bind click events to callback functions.
	    events: {
	      "click #nextpage": "next",
	      "click #complete": "complete"
	    },
	    
	    next: function() {
	    	var errors = this.model.preValidate({firstname: $('[name~="firstname"]').val(), lastname: $('[name~="lastname"]').val()});
	    	if (!errors) {
	    		$("#nextpage").parent().hide();
	    		$("#complete").parent().parent().show();
	    	} else {
	    		errString = "";
	    		for(var propt in errors){
	    			if (errString == "") {
	    				errString += "-" + errors[propt];
	    			}
	    			else {
	    				errString += "\n-" + errors[propt];
	    			}
	    		}
	    		alert(errString);
	    	};
	    },

	    complete: function(){
	      var errors = this.model.preValidate({address1: $('[name~="address1"]').val()});
	      if (!errors) {	    	  
	    	  // Update model attributes.
		      this.model.set({
		        firstname: $('[name~="firstname"]').val(),
		        lastname: $('[name~="lastname"]').val(),
		        address1: $('[name~="address1"]').val(),
		        address2: $('[name~="address2"]').val(),
		        city: $('[name~="city"]').val(),
		        state: $('[name~="state"]').val(),
		        zipcode: $('[name~="zipcode"]').val()
		      });
		      
		      var usersCollection = new UsersCollection();
		      usersCollection.fetch();
		      usersCollection.add(this.model);
		      this.model.save();
		      
		      usersCollection.models.forEach(function(model){
		    	    //console.log("Model in collection: " + model.get("lastname"));
		    	    var msgHTML = "Congratulations, you have successfully registered with the following information:";
		    	    msgHTML += "<p>";
		    	    msgHTML += "&nbsp;<br>";
		    	    msgHTML += "First Name: "+model.get("firstname")+"<br>";
		    	    msgHTML += "Last Name: "+model.get("lastname")+"<br>";
		    	    msgHTML += "Address 1: "+model.get("address1")+"<br>";
		    	    msgHTML += "Address 2: "+model.get("address2")+"<br>";
		    	    msgHTML += "City: "+model.get("city")+"<br>";
		    	    msgHTML += "State: "+model.get("state")+"<br>";
		    	    msgHTML += "Zip Code: "+model.get("zipcode")+"<br>";
		    	    msgHTML += "</p>";
		    	    $("div#container").html(msgHTML);
		      });		      
	      } else {
	        alert("-"+errors.address1);
	      };	
	    }		
	});
	
	var AppRouter = Backbone.Router.extend({
	    routes: {
	      // Default path.
	      '': 'register',

	      // Usage of static path.
	      'register': 'register',
	    },
	    
		register: function() {
		    // Create new model instance.
	     	var userModel = new UserModel();
	     	
	        // Create new view instance.
	        var registerView = new RegisterView({
	          model: userModel,
	          el: '#container'
	        });
		}
	    
	});
	
	$(document).ready(function () {  
		
		// Start application code goes here 		
		new AppRouter();
	    Backbone.history.start();

	});
})(jQuery);