'use strict';

function SmartHome() {
		document.addEventListener('DOMContentLoaded', function () {
		// Shortcuts to DOM Elements.
		this.userWelcome = document.getElementById('user-welcome');

		// Bind events.
		this.updateButton = document.getElementById('demo-washer-update');
		this.updateButton.addEventListener('click', this.updateState.bind(this));
		this.washer = document.getElementById('demo-washer');
		this.requestSync = document.getElementById('request-sync');
		this.requestSync.addEventListener('click', async () => {
			try {
			const response = await fetch('/requestsync');
			console.log(response.status == 200 ?
				'Request SYNC success!' : `Request SYNC unexpected status: ${response.status}`);
			} catch (err) {
			console.error('Request SYNC error', err);
			}
		});
		this.initFirebase();
		this.initWasher();
	}.bind(this));
}

SmartHome.prototype.initFirebase = () => {
	// Initiates Firebase.
	console.log("Initialized Firebase");
	console.log("Testing123");
  };

SmartHome.prototype.initWasher = () => {
	console.log("Logged in as default user");
	this.uid = "123";
	this.smarthome.userWelcome.innerHTML = "Welcome user 123!";

	//this.smarthome.handleData();
	this.smarthome.washer.style.display = "block";
}

SmartHome.prototype.setToken = (token) => {
	document.cookie = `__session=${token};max-age=3600`;
};

SmartHome.prototype.handleData = () => {
	const elOnOff = document.getElementById('demo-washer-onOff');

}

SmartHome.prototype.updateState = () => {
	const elOnOff = document.getElementById('demo-washer-onOff');
}

// Load the SmartHome.
window.smarthome = new SmartHome();