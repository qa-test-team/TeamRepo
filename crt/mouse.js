/**
 * mouse.js
 * 
 * Extends text mode CRT library with mouse support
 *  click, wheel, down, up, and move are currently supported
 * 	this library needs jquery to hook mouse events independently of the browser
 *  it would be nice to be able not to use jquery for this purpose
 * Requirements: crt.js, 437.js, crt.css, [font], JQuery 1.x
 * Tested on: IE8, FF28, Chrome44 (more tests are appreciated).
 * Anyone wants to help to develop this project is welcome!
 * 
 * @date 31-08-2015
 * @license Copyright(C) 2015, Francesco Iafulli <fiaful@hotmail.com>
 * 			Permission to use, copy, modify, and/or distribute this software for any
 * 			purpose with or without fee is hereby granted, provided that the above
 * 			copyright notice and this permission notice appear in all copies.
 * 			THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * 			WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * 			MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * 			ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * 			WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * 			ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * 			OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * @author fiaful (fiaful@hotmail.com)
 * @version 0.9
 */
 
 // Mouse event object
 function CRTMouseEvent()
	{
		this.event = null; 	// original browser event
		this.realx = -1;	// mouse current x coordinate (in pixel)
		this.realy = -1;	// mouse current y coordinate (in pixel)
		this.x = -1;		// mouse current x coordinate (in chars)
		this.y = -1;		// mouse current y coordinate (in chars)
		this.dx = -1;		// mouse click x coordinate (in chars)
		this.dy = -1;		// mouse click y coordinate (in chars)
		this.button = -1; 	// mouse button pressed
		this.wheel = 0; 	// wheel direction
	}

// Mouse handler object
// <oCRT> is CRT object insance
function CRTMouse (oCRT)
	{
		this.CRT = oCRT;			// internal CRT object

		this.clickEvent = null;		// click handler routine
		this.wheelEvent = null;		// mouse wheel handler routine
		this.downEvent = null;		// mouse button down handler routine
		this.upEvent = null;		// mouse up handler routine
		this.moveEvent = null;		// mouse move handler routine
		
		this.lastx = -1;			// last mouse x position
		this.lasty = -1;			// last mouse y position
		
		// mouse event name enumeration
		this.EV_CLICK = 'click';
		this.EV_WHEEL = 'wheel';
		this.EV_DOWN = 'down';
		this.EV_UP = 'up';
		this.EV_MOVE = 'move';
		
		// internal routine to handle mouse events
		that = this;
		//$(this.CRT.oCRT).on('click', function(e) { return false; } );
		$(this.CRT.oCRT).on('rightclick contextmenu', function(e) { return false; } );
		$(this.CRT.oCRT).on('mousewheel DOMMouseScroll', function(e) { that.rawWheel(e, 3); return false; } );
		$(this.CRT.oCRT).on('mousedown', function(e) { that.rawDown(e, -1); return true; } );
		$(this.CRT.oCRT).on('mouseup', function(e) { that.rawUp(e, -1); return true; } );
		$(this.CRT.oCRT).on('mousemove', function(e) { that.rawMove(e, -1); return false; } );
	}

// internally used
// creates an initialized mouse event
CRTMouse.prototype.eventFactory = function(event, button, evtype)
	{
		var e = new CRTMouseEvent();		// creates new mouse event
		e.event = event;					// save original browser event

		e.button = button;					// initialize standardized cross-browser mouse button
		if (button == -1)
			e.button = event.button || event.which;
		if (typeof e.button == 'undefined') e.button = 0;
		
		e.realx = ((event.clientX || event.pageX) - this.CRT.firstleft);	// initialize standardized cross-browser mouse x position
		e.realy = ((event.clientY || event.pageY) - this.CRT.firsttop);		// initialize standardized cross-browser mouse y position
		e.x = Math.floor(e.realx / this.CRT.cw);				// calculate mouse x position in characters
		e.y = Math.floor(e.realy / this.CRT.ch);				// calculate mouse y position in characters
		e.dx = this.lastx;										// initialize mouse click/down x position
		e.dy = this.lasty;										// initialize mouse click/down y position
		if (evtype == 'click' || evtype == 'down')
			{
				this.lastx = e.x;								// updates mouse click/down position
				this.lasty = e.y;
				e.dx = e.x;
				e.dy = e.y;
			}
			
		if (event.wheelDelta)													// initialize standardized cross-browser mouse wheel direction
			{ 
				if (event.wheelDelta > 0) e.wheel = -1; else e.wheel = 1;
			}
		if (event.originalEvent && event.originalEvent.detail) 					// initialize standardized cross-browser mouse wheel direction
			{ 
				if (-event.originalEvent.detail > 0) e.wheel = -1; else e.wheel = 1;
			}		
		return e;						// return initialized mouse event
	}
	
// internal click handler routine
// calls clickEvent(e) routine if defined
// if character cell contains url, link is actived in new window (after clickEvent routine)
CRTMouse.prototype.rawClick = function(ev, button)
	{
		var event = window.event || ev;
		if (this.clickEvent)
			{
				var e = this.eventFactory(event, button, 'click');
				this.clickEvent(e);
				
				// if character cell contains url, link is actived in new window
				var spanAt = this.CRT.getObjectAtXY(e.x, e.y);
				if (spanAt)
					{
						if (spanAt.childNodes[0].tagName == 'A')
						{
							var a = $(spanAt.childNodes[0]);
							window.open(a.attr('href'), '_blank');
						}
					}
			}
	}

// internal mouse wheel handler routine
// calls wheelEvent(e) routine if defined
CRTMouse.prototype.rawWheel = function(ev, button)
	{
		var event = window.event || ev;
		if (this.wheelEvent)
			{
				var e = this.eventFactory(event, button, 'wheel');
				this.wheelEvent(e);
			}
	}

// internal mouse button down handler routine
// calls downEvent(e) routine if defined
CRTMouse.prototype.rawDown = function(ev, button)
	{
		var event = window.event || ev;
		if (this.downEvent)
			{
				var e = this.eventFactory(event, button, 'down');
				this.downEvent(e);
			}
	}

// internal mouse button up handler routine
// calls upEvent(e) routine if defined
// calls rawClick if mouse position is the same of mouse click position
CRTMouse.prototype.rawUp = function(ev, button)
	{
		var event = window.event || ev;
		if (this.upEvent)
			{
				var e = this.eventFactory(event, button, 'up');
				this.upEvent(e);

				// calls rawClick if mouse position is the same of mouse click position
				if (e.x == e.dx && e.y == e.dy)
					this.rawClick(event, e.button);
				
			}
	}

// internal mouse move handler routine
// calls moveEvent(e) routine if defined
CRTMouse.prototype.rawMove = function(ev, button)
	{
		var event = window.event || ev;
		if (this.moveEvent)
			{
				var e = this.eventFactory(event, button, 'move');
				this.moveEvent(e);
			}
	}

// attach mouse event handler routine
// <eventName> is event name enum
// <fnc> is function name
// exampe: oMouse.on(oMouse.EV_CLICK, onClick)
CRTMouse.prototype.on = function(eventName, fnc)
	{
		switch(eventName.toLowerCase())
			{
				case this.EV_CLICK:
					this.clickEvent = fnc;
					break;
				case this.EV_WHEEL:
					this.wheelEvent = fnc;
					break;
				case this.EV_DOWN:
					this.downEvent = fnc;
					break;
				case this.EV_UP:
					this.upEvent = fnc;
					break;
				case this.EV_MOVE:
					this.moveEvent = fnc;
					break;
			}
	}
	
// detach mouse event handler routine
// <eventName> is event name enum
// exampe: oMouse.off(oMouse.EV_CLICK)
CRTMouse.prototype.off = function(eventName)
	{
		switch(eventName.toLowerCase())
			{
				case this.EV_CLICK:
					this.clickEvent = null;
					break;
				case this.EV_WHEEL:
					this.wheelEvent = null;
					break;
				case this.EV_DOWN:
					this.downEvent = null;
					break;
				case this.EV_UP:
					this.upEvent = null;
					break;
				case this.EV_MOVE:
					this.moveEvent = null;
					break;
			}
	}
