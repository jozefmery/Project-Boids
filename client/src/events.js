/**
 * File: events.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 3.3.2020
 * License: none
 * Description: Defines event system including an instance, event handler and a function for invoking events.
 * 
 */

// import dependencies
import uniqid from "uniqid";

class EventSystem {

    /// Members
    
    handlers = {};
    
    /// Methods

    invokeEvent(event, ...callbackArgs) {

        // if no handlers exist for given event, exit
        if(!this.handlers[event]) return false;

        let preventDefault = false;

        // call each handler for given event handler group
        for(let id in this.handlers[event]) {

            const handler = this.handlers[event][id];

            // check if handler is enabled
            if(handler.isEnabled()) {

                preventDefault |= handler._callback(...callbackArgs);
            }
        }

        return preventDefault;
    }

    registerHandler(handler) {

        // --- shorthands
        const event = handler.event();
        const id = handler.id();
        // --- shorthands

        // check if event type exists
        if(!this.handlers[event]) {

            this.handlers[event] = {};
        }

        // save reference to handler
        this.handlers[event][id] = handler
    }

    deleteHandler(event, id) {

        // delete reference to handler
        delete this.handlers[event][id];
    }
}

// create event system instance
const eventSystem = new EventSystem();

const invokeEvent = (event, ...rest) => {

    // invoke given event and pass all other arguments to handler
    return eventSystem.invokeEvent(event, ...rest);
}

class EventHandler {

    /// Methods

    constructor(event, callback) {

        // create unique id
        this._id = uniqid();

        // enable by default
        this._enabled = true;

        // save event type
        this._event = event;

        this._callback = callback;

        // pass reference to event system
        eventSystem.registerHandler(this);
    }

    id() {

        return this._id;
    }

    event() {

        return this._event;
    }

    isEnabled() {

        return this._enabled;
    }

    toggleEnabled() {

        this._enabled = !this._enabled;
    }

    setEnabled(enable) {

        this._enabled = enable;
    }

    setCallback(callback) {

        this._callback = callback;
    }

    remove() {

        eventSystem.removeHandler(this.event(), this.id());
    }
}

export { EventHandler, invokeEvent };