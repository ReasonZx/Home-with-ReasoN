'use strict';

function SmartHome() {
	
	document.addEventListener('DOMContentLoaded', function () {
		//console.log(Testing123);
		// Shortcuts to DOM Elements.
		this.userWelcome = document.getElementById('user-welcome');

		// Bind events.
		this.requestSync = document.getElementById('request-sync');
		this.washer = document.getElementById('demo-washer');
		this.requestSync.addEventListener('click', async () => {
		  try {
			const response = await fetch('/requestsync');
			console.log(response.status == 200 ?
			  'Request SYNC success!' : `Request SYNC unexpected status: ${response.status}`);
		  } catch (err) {
			console.error('Request SYNC error', err);
		  }
		});

		this.initWasher();
  }.bind(this));
}

SmartHome.prototype.initWasher = () => {
  console.log("Logged in as default user");
  this.uid = "123";
  this.smarthome.userWelcome.innerHTML = "Welcome user 123!";
}


SmartHome.prototype.updateState = () => {
	const elOnOff = document.getElementById('demo-washer-onOff');
}

// Load the SmartHome.
window.smarthome = new SmartHome();