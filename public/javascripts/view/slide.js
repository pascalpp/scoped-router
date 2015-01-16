define(function(require) {

	var Marionette = require('marionette');

	var show_notes = true;

	var SlideView = Marionette.LayoutView.extend({
		className: 'slide',
		onShow: function() {
			this.logNotes();
		},
		logNotes: function() {
			if (! show_notes) return;
			console.log('');
			console.log('');
			console.log('—————————————————————————————————————');
			console.log(this.$('h1').first().text());
			console.log('');
			this.$('.notes p').map(function() {
				console.log('• ' + this.innerText);
			});
		}
	});

	return SlideView;

});
