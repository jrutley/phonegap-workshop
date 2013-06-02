var app = {

	showAlert: function(message, title) {
		if(navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	
	registerEvents: function() {
		var self = this;
		
		// Do we support touch events?
		if(document.documentElement.hasOwnProperty('ontouchstart')) {
			$('body').on('touchstart', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('touched', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		} else {
			// register mouse events
			$('body').on('mousedown', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('mouseup', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		}
		$(window).on('hashchange', $.proxy(this.route, this));
	},
	
	route: function() {
		var hash = window.location.hash;
		if(!hash) {
			var view = new HomeView(this.store);
			$('body').html(view.render().el);
			view.findByName();
			return;
		}
		var match = hash.match(app.detailsURL);
		if(match) {
			this.store.findById(Number(match[1]), function(employee) {
				$('body').html(new EmployeeView(employee).render().el);
			});
		}	
	},
	
    initialize: function() {
		var self = this;
		this.detailsURL = /^#employees\/(\d{1,})/;
		this.registerEvents();
        this.store = new MemoryStore(function() {
			self.route();
		});
    }
};
app.initialize();