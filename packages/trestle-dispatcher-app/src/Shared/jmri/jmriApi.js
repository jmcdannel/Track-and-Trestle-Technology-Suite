import log from '../utils/logger';

let isSetup = false;
let isReady = false;
var $jmri = null;
var $debug = false;
var $ = window.jQuery;
var throttleCommand = '';
// var sensros = [];
var promises = {
	speed: {
		resolve: () => {},
		reject: () => {}
	},
	direction: {
		resolve: () => {},
		reject: () => {}
	},
	acquire: {
		resolve: () => {},
		reject: () => {}
  },
	release: {
		resolve: () => {},
		reject: () => {}
  },
  power: {
    resolve: () => {},
		reject: () => {}
  },
  ready: {
    resolve: () => {},
		reject: () => {}
  },
	setup: {
		resolve: () => {},
		reject: () => {}
	}
}
 
window.onerror = function(errMsg, errUrl, errLineNumber) {
	if ($jmri) $jmri.closeSocket();
	console.error('\nError running javascript:\n' + errMsg + '\n\nURL:\n' + errUrl + '\n\nLine Number: ' + errLineNumber);
	return true;
};

window.onunload = function() {
	if ($jmri) {
		// $jmri.setJMRI('throttle', $locoAddress, {"release":null});
		$jmri.closeSocket();
	}
};

var jmriLostComm = function(message) {
    console.log('Communication lost.', message);
};

var jmriReady = function(jsonVersion, jmriVersion, railroadName) {
	console.log('__jmriReady', jsonVersion, jmriVersion, railroadName);
	isReady = true;
  fireEvent('ready', isReady);
}

//----------------------------------------- [from server] Last selected throttle address
var throttleState = function(name, address, speed, forward, fs) {
	console.log('__throttleState', name, address, speed, forward, fs);
	if (name !== undefined 
		&& typeof address === 'undefined' 
		&& typeof speed === 'undefined' 
		&& typeof forward === 'undefined') {
			throttleRelease(name);
			return;
	}
	console.log('throttleCommand', throttleCommand);
	if (throttleCommand === 'acquire' && address !== undefined) throttleAcquisition(address);
	if (throttleCommand === 'direction' && forward !== undefined) throttleDirection(name, forward);
	if (throttleCommand === 'speed' && speed !== undefined) throttleSpeed(name, speed);
	for (var i = 0; i < 29; i++) if (fs[i] !== undefined) throttleFunctionState(name, i, fs[i]);
	throttleCommand = '';
};

//----------------------------------------- [from server] Last selected throttle address
var sensorState = function(name, userName, comment, inverted, state) {
	console.log('__sensorState', name, userName, comment, inverted, state);
	fireEvent('sensor', { name, inverted, state });
};

const throttleAcquisition = address => {
    console.log('__throttleAcquisition', address);
    fireEvent('acquire', address);
}

const throttleRelease = address => {
    console.log('__throttleRelease', address);
    fireEvent('release', address);
}

const throttleDirection = function(name, forward) {
		console.log('__throttleDirection', name, forward);
		fireEvent('direction', { name, forward });
}

const throttleSpeed = function(name, speed) {
    console.log('__throttleSpeed', name, speed);
		fireEvent('speed', { name, speed });
};

const throttleFunctionState = function(name, functionNumber, active) {
    // console.log('__throttleFunctionState', name, functionNumber, active);
};

const layoutPowerState = function(state) {
    console.log('__layoutPowerState', state, eventHandlers);
    fireEvent('power', state);
};

const setup = (apiHost) => {
		if (isSetup) {
			console.log('throttle API already setup');
			return isSetup;
		}
    $jmri = $.JMRI(apiHost, {
		//*** Callback Functions available in '$jmri' object
		toSend: function(data) {$debug && console.log(`${new Date()} - ${document.title}\nJSONtoSend: ${data}`);},	//Nothing to do
		fullData: function(data) {$debug && console.log(`${new Date()} - ${document.title}\nJSONreceived: ${data}`);},	//Nothing to do
                error: function (code, message) {
                    if (code === 0)
                        jmriLostComm(message);
                    else if (code === 200)
                        console.log(message);
                    else
                        console.log('Error: ' + code + ' - ' + message);
                },
		end: function() {jmriLostComm('The JMRI WebSocket service was turned off.\nSolve the problem and refresh web page.');},
		ready: function(jsonVersion, jmriVersion, railroadName) {jmriReady(jsonVersion, jmriVersion, railroadName);},	//When WebSocket connection established - continue next steps
		throttle: function(name, address, speed, forward, fs) {throttleState(name, address, speed, forward, fs);},
		light: function(name, userName, comment, state) {},	//Nothing to do
		reporter: function(name, userName, state, comment, report, lastReport) {},	//Nothing to do
		sensor: function(name, userName, comment, inverted, state) {sensorState(name, userName, comment, inverted, state)},	//Nothing to do
		// turnout: function(name, userName, comment, inverted, state) {layoutTurnoutState(name, userName, comment, inverted, state);},
		signalHead: function(name, userName, comment, lit, appearance, held, state, appearanceName) {},	//Nothing to do
		signalMast: function(name, userName, aspect, lit, held, state) {},	//Nothing to do
		// route: function(name, userName, comment, state) {layoutRouteState(name, userName, comment, state);},
		memory: function(name, userName, comment, value) {},	//Nothing to do
		power: function(state) {layoutPowerState(state);},
	});
	if (!$jmri) throw new Error('private~Could not open JMRI WebSocket.');
	isSetup = true;
	// setTimeout(() => {
	// 	$jmri.getJMRI('sensor', 'DS25');
	// }, 5000);
	return createPromise('ready');
}

const watchSensors = sensors => {
	sensors.forEach(sensor => $jmri.getJMRI('sensor', `DS${sensor.pin}`));
}

const throttle = async (address, speed) => {
	const speedValue = speed / 100;
	var speedValueFormated = '' + speedValue;
	if (speedValue === 0) speedValueFormated = "0.0";
	if (speedValue === 1) speedValueFormated = "1";
	const payload = { 
		'speed': speedValueFormated
	};
	console.log('throttle', address, speed, speedValueFormated, payload);
	throttleCommand = 'speed';
	validateCommand() && $jmri.setJMRI('throttle', address.toString(), payload);
	return createPromise('speed', 'throttle action failed.');
}

const changeDirection = (address, forward) => {
		console.log('changeDirection', address, forward, !!forward);
		throttleCommand = 'direction';
    validateCommand() && $jmri.setJMRI('throttle', address.toString(), { 
			forward: !!forward
	 });
	 return createPromise('direction', 'direction action failed.');
}

const requestLoco = async address => {
	throttleCommand = 'acquire';
	const payload = { 
		throttle: address.toString(),
		address
	};
	validateCommand(promises.acquire.reject) && $jmri.setJMRI('throttle', address, payload);
	return createPromise('acquire', 'loco request action failed.');
}

const releaseLoco = async address => {
	validateCommand(promises.release.reject) && $jmri.setJMRI('throttle', address, { release: null });
	return createPromise('release', 'loco release action failed.');
}

const power = async state => {
  const payload = state
    ? { state: state }
    : {}
  validateCommand(promises.power.reject) && $jmri.setJMRI('power', null, payload);
  return createPromise('power', 'power action failed.');
}

const getState = () =>{
  return {
    setup: isSetup,
    ready: isReady
  }
}

const eventHandlers = {};

const attachEvent = (type, src, callback) => {
	if (!eventHandlers[type]) {
		eventHandlers[type] = {};
	}
	eventHandlers[type][src] = callback;
}

const dettachEvent = (type, src) => {
  if (eventHandlers[type] && eventHandlers[type][src]) {
		delete eventHandlers[type][src];
	}
}

const fireEvent = (type, payload) => {
	console.log('fireEvent', type, payload, promises[type], eventHandlers[type]);
  if (promises[type]) {
    promises[type].resolve(payload);
  }
  if (eventHandlers[type]) {
		Object.keys(eventHandlers[type]).forEach(key => {
			eventHandlers[type][key](payload);
		});
  }
}

const createPromise = (obj, rejectMsg) => {
	console.log('createPromise', obj);
  if (rejectMsg && promises[obj]) {
    promises[obj].reject(rejectMsg);
  }
	const promise = new Promise((resolve, reject) => {
		promises[obj].resolve = resolve;
		promises[obj].reject = reject;
	});
	return promise;
}

const validateCommand = reject => {
	let errorMessage;
	if (!isSetup) {
		errorMessage =  'Setup not called';
    } else if (!isReady) {
      // debugger;
		errorMessage =  'Comm not ready';
	}
	if (errorMessage) {
		console.error(errorMessage);
		if (reject) {
			reject(errorMessage)
		}
		return false;
	} else { 
		return true;
	}
}
    
export const jmriApi = {
    setup, 
    throttle,
		requestLoco,
		releaseLoco,
		watchSensors,
    changeDirection,
    power,
		on: attachEvent,
		off: dettachEvent,
    getState
};

export default jmriApi;