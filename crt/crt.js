/**
 * crt.js
 * 
 * Provides DOM and Javascript old style text mode in browser
 * 	(Rows are DIV element in main DIV container. 
 *	In any row, SPAN elements contains omogeneous (same attributes) characters.
 *	The render routine destroy and re-create every row, only if row changed.
 *	Character attributes are: background color, foreground color, blink state, underline state, and link.
 *	Free to any use, cross-platform (to test) / cross-browser old style 437 code page monospaced bios font is provided also)
 * Requirements: 437.js, crt.css, [font]
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

 /** 
 * color palette index:
 *  0 -> Black
 *  1 -> Navy
 *  2 -> Green
 *  3 -> Cyan
 *  4 -> Red
 *  5 -> Purple
 *  6 -> Brown
 *  7 -> Silver
 *  8 -> Grey
 *  9 -> Blue
 * 10 -> Lime
 * 11 -> Aqua
 * 12 -> Pink
 * 13 -> Fuchsia
 * 14 -> Yellow
 * 15 -> White
 */
 
 // returns HTML object by Id (cross-browser)
function $o(id)
	{
		if (document.all) return document.all[id];
		return document.getElementById(id);
	}

// remove and destroy HTML object by Id (cross-browser)
function $r(id) 
	{
		var element = $o(id);
		element.outerHTML = "";
		delete element;
	}

// convert int to character
function $c(c)
	{
		return String.fromCharCode(c);
	}

// character attribute object
function CRTAttr()
	{
		this.c = '';				// default char (is used, for example, by fill routine to specify filler char)
		this.fg = 7;				// foreground color
		this.bg = 0;				// background color
		this.blink = false; 		// blink state
		this.underline = false; 	// underline state
		this.href = '';				// link href
		return this;
	}

// copy method: copy all <attr> attributes to current object
CRTAttr.prototype.copy = function(attr)
	{
		this.c = attr.c;
		this.fg = attr.fg;
		this.bg = attr.bg;
		this.blink = attr.blink;
		this.underline = attr.underline;
		this.href = attr.href;
	}

// character map object (can contain screen portion or can be used as backbuffer)
function CRTMap(cols, rows)
	{
		this.cols = cols;
		this.rows = rows;
		this.buffer = [];
		for (var y = 0; y < this.rows; y++)
		{
			this.buffer[y] = [];
			for (var x = 0; x < this.cols; x++)
				this.buffer[y][x] = new CRTAttr();
		}
	}

// CRT main object
// <id> is id of main DIV container
// <cols> number of screen cols (x)
// <rows> number of screen rows (y)
function CRT(id, cols, rows)
	{		
		var oCRT = $o(id);	// main DIV container object

		// frame border char array as [<left edge>, <top edge>, <right edge>, <bottom edge>, <top left corner>, <top right corner>, <bottom left corner>, <bottom right corner>]
		this.DOUBLE_FRAME = [$c(186), $c(205), $c(186), $c(205), $c(201), $c(187), $c(200), $c(188)];
		this.SINGLE_FRAME = [$c(179), $c(196), $c(179), $c(196), $c(218), $c(191), $c(192), $c(217)];
		this.MIXED_FRAME = [$c(179), $c(196), $c(186), $c(205), $c(218), $c(183), $c(212), $c(188)];	// left and top borders are single, right and bottom borders are double
		this.SIMPLE_FRAME = ['|', '-', '|', '-', '+', '+', '+', '+'];

		this.BLACK = 0;		// palette index for black color
		this.NAVY = 1;		// palette index for navy (dark blue) color
		this.GREEN = 2;		// palette index for green color
		this.CYAN = 3;		// palette index for cyan color
		this.RED = 4;		// palette index for red color
		this.PURPLE = 5;	// palette index for purple color
		this.BROWN = 6;		// palette index for brown color
		this.SILVER = 7;	// palette index for silver (dark white) color
		this.GREY = 8;		// palette index for grey (black light) color
		this.BLUE = 9;		// palette index for blue color
		this.LIME = 10;		// palette index for lime (green light) color
		this.AQUA = 11;		// palette index for aqua (cyan light) color
		this.PINK = 12;		// palette index for pink (red light) color
		this.FUCHSIA = 13;	// palette index for fuchsia (purple light) color
		this.YELLOW = 14;	// palette index for yellow color
		this.WHITE = 15;	// palette index for white color
		
		this.cursorBlink = null;
		this.oCRT = oCRT;
		this.cols = cols;				// display cols number
		this.rows = rows;				// display rows number
		this.buffer = [];				// all display [<rows>][<cols>] characters
		this.modified = [];				// row modified flag (if modified[y] == true -> redraw row)
		this.texts = [];				// row SPANs text length (because IE innerText collapse spaces). Is used to calculate character position in row)
		this.attr = new CRTAttr();		// default attributes
		this.attr.fg = 7;				// default foreground color
		this.attr.bg = 0;				// default background color
		this.x = 0;						// current cursor position (x)
		this.y = 0;						// current cursor position (y)
		this.cw = 0;					// char width (in pixel) - for blinking cursor draw
		this.ch = 0;					// char height (in pixel) - for blinking cursor draw
		this.sw = -1;					// screen width in pixel - for blinking cursor draw
		this.sh = -1;					// screen height in pixel - for blinking cursor draw
		this.wndLeft = 0;				// current window (viewport) left coordinate
		this.wndTop = 0;				// current window (viewport) top coordinate
		this.wndCols = cols;			// current window (viewport) width (in character)
		this.wndRows = rows;			// current window (viewport) height (in character)
		this.autoscroll	= true;			// if cursor is located to window bottom right corner and I ask to write anything, screen scroll up by 1 row if autoscroll is true. Nothing happens if autoscroll is false.
		this.cursorshowstate = true;	// if true -> blinking cursor is displayed; else not
		this.blinkstate = false;		// flag to draw or not blinking elements
		this.stopwrite = false;			// if true -> no chars are drawn
		this.freeze = false;			// if true -> refresh method not redraw screen
		
		if (oCRT)			
		{
			var sBuffer = "";
			for (var y = 0; y < rows; y++)	
			{
				this.buffer[y] = [];							// initialize row buffer
				this.modified[y] = true;						// set modified flag to true (first draw)
				sBuffer += '<div id="row' + y + '"></div>'; 	// initialize full screen with empty DIV rows
				for (var x = 0; x < cols; x++)
				{
					this.buffer[y][x] = new CRTAttr();			// initialize full buffer with empty characters, silver as foreground color on black background
				}
			}
			oCRT.innerHTML = sBuffer + '<div id="CRT_cursor" class="cursor"></div>';		// add cursor DIV element
		}

		var that = this;
		this.cursorBlink = setInterval(function()
			{
				that.blinkCursor();								// start blinking (cursor and characters)
				that.refresh();									// call refresh (this call handles blinking characters also)
			}, 750);
	}

// returns string representation of color palette index
CRT.prototype.colorName = function(index)	
	{
		switch(index)
			{
				case 0:
					return "Black";
				case 1:
					return "Navy";
				case 2:
					return "Green";
				case 3:
					return "Cyan";
				case 4:
					return "Red";
				case 5:
					return "Purple";
				case 6:
					return "Brown";
				case 7:
					return "Silver";
				case 8:
					return "Grey";
				case 9:
					return "Blue";
				case 10:
					return "Lime";
				case 11:
					return "Aqua";
				case 12:
					return "Pink";
				case 13:
					return "Fuchsia";
				case 14:
					return "Yellow";
				case 15:
					return "White";
			}
		return "Unknown";
	}
	
// Calculates the actual size of the screen and the actual size of a single character. 
// The size will be available only after the first call to refresh
CRT.prototype.getScreenSize = function()	
	{
		if (this.sw == -1 || this.sh == -1)	// calculate first time only
			{
				var row0 = $o('row0');		// first row DIV element
				if (row0)
					{
						this.sh = row0.offsetHeight * this.rows;					// row height (in pixel) * row number = screen height (in pixel)
						var firstSpan = row0.childNodes[0];							// first row / first SPAN element
						var lastSpan = row0.childNodes[row0.childNodes.length-1];	// first row / last SPAN element
						if (firstSpan && lastSpan)
							{
								this.firstleft = firstSpan.offsetLeft;				// first span left (in pixel)
								this.firsttop = firstSpan.offsetTop;				// first span top (in pixel)
								var left = lastSpan.offsetLeft;						// last span left (in pixel)
								var width = lastSpan.offsetWidth;					// last span width (in pixel)
								this.sw = left + width - this.firstleft;			// last span left (in pixel) + last span width (in pixel) - first span left (in pixel) = screen width (in pixel)
								
								this.cw = this.sw / this.cols;						// char width (in pixel) = screen width (in pixel) / cols number
								this.ch = this.sh / this.rows;						// char height (in pixel) = screen height (in pixel) / rows number
							}
					}
			}
	}

// provides cursor and characters blinking
CRT.prototype.blinkCursor = function()
	{	
		this.blinkstate = !this.blinkstate;						// updates blinking state
		this.getScreenSize();									// calculates screen size
		if (this.sw > 0 && this.sh > 0)
			{
				var c = $o('CRT_cursor');						// cursor DIV object
				if (!this.cursorshowstate)						// if cursor have to be not visible ...
					{
						c.style.display = 'none';				// ... have to be not visible
						return;
					}
				if (this.blinkstate) 							// if cursor is not visible ...
					{
						if (this.isValidXY(this.x, this.y))		// if cursor is located in window ...
							{
								c.style.display = 'block';														// cursor have to be visible		
								var curh = parseFloat($o('CRT_cursor').offsetHeight, 10);						// get the cursor height in pixel (from css)
								c.style.left = this.firstleft + this.x * this.cw + 'px';						// cursor left (in pixel) = screen left (first row / first span left in pixel) + cursor x coordinate * char width (in pixel)
								c.style.top = this.firsttop + this.y * this.ch + (this.ch - curh) + 'px';		// cursor top (in pixel) = screen top (first row / first span top in pixel) + cursor y coordinate * char height + (char height - cursor height)
								c.style.width = this.cw + 'px';													// cursor width = char width (in pixel)
								c.className = 'cursor cur' + this.buffer[this.y][this.x].fg;					// cursor color = foreground color
							}
					}					
				 else 											// if cursor is visible ...
					c.style.display = 'none';					// ... have to be not visible
			}
	}

// puts a single character in screen buffer and move cursor
// <char> is int value of char to draw
// <binary> is flag. If true control chars are drawn; if false control chars are activated (default value = false)
// <overrideAttrs> is flag. If true, char attributes are overwritten with default attributes; if false, char attributes are left unchanged (default value = true).
CRT.prototype.rawWriteChar = function(char, binary, overrideAttrs)
	{
		if (!this.isValidXY(this.x, this.y)) return;						// if cursor position is not into current window, nothing to draw
		if (this.stopwrite) return;											// if I can't draw -> exit
		
		var oldchar = this.attr.c;
		if (typeof binary == 'undefined') binary = false;
		if (typeof overrideAttrs == 'undefined') overrideAttrs = true;
		if (binary)
		{
			if (overrideAttrs)												// I have to overwrite cells attributes with defaults
			{
				this.attr.c = $c(char);
				this.buffer[this.y][this.x].copy(this.attr);				// copy default attributes in current cell
				this.attr.c = oldchar;
			}
			else															// attributes are ok
			{
				this.buffer[this.y][this.x].c = $c(char);				
			}
			this.modified[this.y] = true;									// anyway the row have to be drawn
			this.moveCursor('auto');										// move cursor in <auto> mode (move to right -> if over the right -> left on next row -> if over bottom right corner -> left on last row and scroll up)
		}
		else																// I have to activate control chars
		{
			switch (char)
			{
				case 7:		// bell
					this.beep();
					break;
				case 8:		// backspace					
					this.moveCursor('back');
					this.rawWriteChar(32, true, overrideAttrs);
					this.moveCursor('back');
					break;
				case 9:		// tab
					for (var i = 0; i < 8; i++)
						this.rawWriteChar(32, true, overrideAttrs);
					break;
				case 10:	// line feed
					this.moveCursor('lf');
					break;
				case 13:	// carriage return
					this.moveCursor('cr');
					break;
				/*
				case 0:		// escape chars
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 11:
				case 12:
				case 14:
				case 15:
				case 16:
				case 17:
				case 18:	// I draw it however
				case 19:
				case 20:
				case 21:
				case 22:
				case 23:
				case 24:
				case 25:
				case 26:
				case 27:
				case 28:
				case 29:
				case 30:
				case 31:
					break;
				*/
				default:
					if (overrideAttrs)											// I have to overwrite cells attributes with defaults
					{
						this.attr.c = $c(char);
						this.buffer[this.y][this.x].copy(this.attr);			// copy default attributes in current cell
						this.attr.c = oldchar;
					}
					else														// attributes are ok
					{
						this.buffer[this.y][this.x].c = $c(char);				
					}
					this.modified[this.y] = true;								// anyway the row have to be drawn
					this.moveCursor('auto');									// move cursor in <auto> mode (move to right -> if over the right -> left on next row -> if over bottom right corner -> left on last row and scroll up)
					break;
			}
		}
		this.attr.c = oldchar;
	}

// write a string into screen buffer usign rawWriteChar
// <text> is the string to draw
// <binary> is flag. If true control chars are drawn; if false control chars are activated (default value = false)
// <overrideAttrs> is flag. If true, char attributes are overwritten with default attributes; if false, char attributes are left unchanged (default value = true).
CRT.prototype.write = function(text, binary, overrideAttrs)
	{
		if (typeof binary == 'undefined') binary = false;
		if (typeof overrideAttrs == 'undefined') overrideAttrs = true;
		this.stopwrite = false;
		for (var i = 0, len = text.length; i < len; i++)
			{
				this.rawWriteChar(text.charAt(i).charCodeAt(0), binary, overrideAttrs);		// puts each string character in buffer calling rawWriteChar
			}
	}	

// returns true if at least one character in the row have blink flag set to true; false otherwise
// <y> is row number to test
CRT.prototype.blinkRow = function(y)
	{
		for (var x = 0; x < this.cols; x++)
			if (this.buffer[y][x].blink) return true;
		return false;
	}

// draw a row if needs. The current row is replaced
// <y> is row number to draw	
CRT.prototype.rowRender = function(y)
	{
		if (!this.modified[y] && !this.blinkRow(y)) return;		// draw the row if is modified or if have to blink only
		
		var sRow = "";
		var oldBG = -1;					// old attributes. used for key break.
		var oldFG = -1;
		var oldBlink = false;
		var oldUnderline = false;
		var oldHref = '';
		var span = false;
		var link = false;
		
		var txt = '';
		this.texts[y] = [];
		for (var x = 0; x < this.cols; x++)
		{
			var a = this.buffer[y][x];
			fg = a.fg;
			if (a.blink && !this.blinkstate) fg = a.bg;																			// if blink -> foreground color = background color
			if (a.bg != oldBG || fg != oldFG || a.blink != oldBlink || a.underline != oldUnderline || a.href != oldHref)		// create new span element if at least attribute is changed from previuos span only
			{
				oldBG = a.bg;																									// save current attributes for key break
				oldFG = fg;																										// if blinking, foreground color have to be equal to background color
				oldBlink = a.blink;
				oldUnderline = a.underline;
				oldHref = a.href;
				if (link) 																										// if I created a link, I close the link
					{
						sRow += "</a>";
						link = false;
					}
				if (span) sRow += "</span>";																					// if I created a text content (span element), I close the span
				if (txt != '')
					{
						this.texts[y][this.texts[y].length] = txt.length;														// save all texts length for each row
						txt = '';
					}
				sRow += '<span class="bg' + a.bg + ' fg' + fg + (a.underline ? " underline" : "") + '">';						// then I create a new span element for text content
				if (a.href != '') 																								// and if attributes have link, I create a link
					{
						sRow += '<a href="' + a.href + '" target="_new">';
						link = true;
					}
				span = true;
			}
			sRow += this.codepage(a.c).replace('<', '&lt;').replace('>', '&gt;');												// map char code to 437 code page 
			txt += ' ';
		}
		if (link) sRow += "</a>";		// close all is needed
		if (span) sRow += "</span>";
		var row = $o('row' + y);		
		row.innerHTML = sRow;			// replace modified row only
		this.modified[y] = false;		// so current row is actual
	}

// resize screen to last non empty row
CRT.prototype.autoHeight = function()
	{
		for (var y = this.rows-1; y > 0; --y)
			{
				var r = $o('row' + y);
				if (!r || r.innerText.trim().length == 0)			// if row not exists or is empty
					{
						// destroy row
						$r('row' + y);
						this.rows--;
						this.buffer.splice(y, 1);
						this.modified.splice(y, 1);
						this.texts.splice(y, 1);
					}
				else
					break;
			}
		if (this.getY() > this.rows-1)
			this.gotoXY(this.getX(), this.getY());
	}
	
// redraw the entire screen
CRT.prototype.refresh = function()
	{
		if (this.freeze) return;					// if the screen is not freezed!
		for (var y = 0; y < this.rows; y++)
		{
			this.rowRender(y);						// redraw modified rows or blinking rows only
		}
	}
	
// set current foreground color
// <color> is palette index (see color table at top)
CRT.prototype.setColor = function(color)
	{
		this.attr.fg = color;
	}

// set current background color
// <color> is palette index (see color table at top)
CRT.prototype.setBackgroundColor = function(color)
	{
		this.attr.bg = color;
	}

// set current blink state
// <state> is flag. True -> all I write from now have to blink; False otherwise
CRT.prototype.setBlink = function(state)
	{
		this.attr.blink = state;
	}

// set current underline state
// <state> is flag. True -> all I write from now have to be underlined; False otherwise
CRT.prototype.setUnderline = function(state)
	{
		this.attr.underline = state;
	}

// set current link href
// <href> is string. Url of link. if <href> == '' -> no link
CRT.prototype.setLink = function(href)
	{
		this.attr.href = href;
	}

// returns current foreground color index (see color table at top)
CRT.prototype.getColor = function()
	{
		return this.attr.fg;
	}

// returns current background color index (see color table at top)
CRT.prototype.getBackgroundColor = function()
	{
		return this.attr.bg;
	}

// returns current blink state (as boolean flag)
CRT.prototype.getBlink = function()
	{
		return this.attr.blink;
	}

// returns current underline state (as boolean flag)
CRT.prototype.getUnderline = function()
	{
		return this.attr.underline;
	}

// returns current url of link (as string)
CRT.prototype.getLink = function()
	{
		return this.attr.href;
	}

// change cursor position in current window
// coordinates are 0-based and referred to current window
// coordinates are in characters (not in pixel)
CRT.prototype.gotoXY = function(x, y)
	{
		x += this.wndLeft;
		y += this.wndTop;
		
		if (x < this.wndLeft + this.wndCols)
			this.x = x;
		else
			this.x = this.wndLeft + this.wndCols - 1;	// if specified x is out of cols -> cursor is moved at the end of row
			
		if (x < this.wndLeft) this.x = this.wndLeft;	// if specified x is out of window at left -> cursor is moved at the start of row
			
		if (y < this.wndTop + this.wndRows)
			this.y = y;
		else
			this.y = this.wndTop + this.wndRows - 1;	// if specified y is out of rows -> cursor is moved at the last row
			
		if (y < this.wndTop) this.y = this.wndTop;		// if specified y is out of window at top -> cursor is moved at the first row
	}

// force to redraw all window rows
// note: cols out of window will be redrawn also, for each window row
CRT.prototype.invalidate = function()
	{
		for (y = this.wndTop; y < this.wndTop + this.wndRows; y++)
			this.modified[y] = true;					// set modified flag to true for each window row
		this.freeze = false;							// set freeze flag to false (so I sure refresh works)
		this.refresh();									// call refresh
	}

// returns current cursor x position (in characters)
CRT.prototype.getX = function()
	{
		return this.x;
	}

// returns current cursor y position (in characters)
CRT.prototype.getY = function()
	{
		return this.y;
	}

// provide a different way to move cursor
// <direction> can be:
//		cardinals: n, s, e, w, ne, nw, se, sw
//		auto: cursor is moved to next window cell. 
//				if end of window row is reached, cursor moved to the start of next window row. 
//				if end of window is reached, cursor moved to the start of last window row and window scrolls up.
//		back: cursor is moved to previuos window cell.
//				if start of window row is reached, cursor moved to the end of previous window row.
//				if top left window corner is reached, cursor don't move.
//		cr (carriage return): cursor is moved at start of window row.
//		lf (line feed): cursor is moved at next window row, same col.
//				if last row is reached, window scrolls up.
//		home: cursor is moved at top left window corner.
//		eol (end of line): cursor is moved at the end of current window row.
//		end: cursor is moved at bottom right window corner.
// <distance> (for cardinals only): indicates how many cells cursor have to move in direction
// note: window scrolls up if autoscroll property is true only. otherwise nothing happens (cursor move only).
CRT.prototype.moveCursor = function(direction, distance)
	{
		switch (direction)
		{
			case 'n':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x, this.y - distance);
				break;
			case 's':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x, this.y + distance);
				break;
			case 'e':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x + distance, this.y);
				break;
			case 'w':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x - distance, this.y);
				break;
			case 'ne':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x + distance, this.y - distance);
				break;
			case 'nw':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x - distance, this.y - distance);
				break;
			case 'se':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x + distance, this.y + distance);
				break;
			case 'sw':
				if (typeof distance == 'undefined') distance = 1;
				this.gotoXY(this.x - distance, this.y + distance);
				break;
			case 'auto':
				this.x++;
				if (this.x >= this.wndLeft + this.wndCols)
				{
					if (this.y < this.wndTop + this.wndRows - 1)
					{
						this.x = this.wndLeft;
						this.y++;
					}
					else
					{
						if (this.autoscroll)
						{	
							this.scroll();
							this.x = this.wndLeft;
							this.y = this.wndTop + this.wndRows - 1;
						}
						else
						{
							this.x = this.wndLeft + this.wndCols - 1;
							this.y = this.wndTop + this.wndRows - 1;
							this.stopwrite = true;
						}
					}
				}
				break;
			case 'back':
				this.x--;
				if (this.x < this.wndLeft)
				{					
					if (this.autoscroll)
					{
						if (this.y > this.wndTop)
						{
							this.x = this.wndLeft + this.wndCols - 1;
							this.y--;
						}
						else
							this.x = this.wndLeft;
					}
					else
						this.x = this.wndLeft;
				}
				break;
			case 'cr':
				this.x = this.wndLeft;
				break;
			case 'lf':
				this.y++;
				if (this.y >= this.wndTop + this.wndRows)
				{
					this.y = this.wndTop + this.wndRows - 1;
					if (this.autoscroll)
						this.scroll();
				}
				break;
			case 'home':
				this.x = this.wndLeft;
				this.y = this.wndTop;
				break;
			case 'eol':
				this.x = this.wndLeft + this.wndCols - 1;
				break;
			case 'end':
				this.x = this.wndLeft + this.wndCols - 1;
				this.y = this.wndTop + this.wndRows - 1;
				break;
		}
	}

// cursor have to be shown
CRT.prototype.showCursor = function()
	{
		this.cursorshowstate = true;
	}

// cursor have to be hide
CRT.prototype.hideCursor = function()
	{
		this.cursorshowstate = false;
	}

// reset current window to screen size
// like call window w/out params
CRT.prototype.resetWindow = function()
	{
		this.window(0, 0, this.cols, this.rows, true);
	}

// define new current window (viewport)
// out of window will be inalterated
// <left> and <top> indicates top left corner of window in screen coordinate system (in characters, 0-based)
// <cols> and <rows> indicates window size (width and height respectively - in characters)
// <autoscroll> defines if window have to scroll automatically if needed (default true) or not
CRT.prototype.window = function(left, top, cols, rows, autoscroll)
	{
		// if no params, window is resetted to screen size
		if (typeof left == 'undefined') left = 0;
		if (typeof top == 'undefined') top = 0;
		if (typeof cols == 'undefined') cols = this.cols;
		if (typeof rows == 'undefined') rows = this.rows;
		if (typeof autoscroll != 'undefined')
			this.autoscroll = autoscroll;
		else
			this.autoscroll = true;
		var rLeft, rTop, rCols, rRows;
		if (left < 0) cols = cols + left;
		if (top < 0) rows = rows + top;
		rLeft = left;
		rTop = top;
		rCols = cols;
		rRows = rows;
		// position out of screen is not allowed
		if (left < 0) rLeft = 0; if (left > this.cols - 1) rLeft = this.cols - 1;
		if (top < 0) rTop = 0; if (top > this.rows - 1) rTop = this.rows - 1;
		// size less of 1x1 chars is not allowed
		if (cols < 1) rCols = 1; if (left + cols > this.cols - 1) rCols = this.cols - left;
		if (rows < 1) rRows = 1; if (top + rows > this.rows - 1) rRows = this.rows - top;
		
		this.wndLeft = rLeft;
		this.wndTop = rTop;
		this.wndCols = rCols;
		this.wndRows = rRows;
		
		// move cursor at window top left corner
		this.gotoXY(0, 0);
	}

// fills current window with specified filler char
// <ch> is filler char
CRT.prototype.fill = function(ch)
	{
		this.rect(this.wndLeft, this.wndTop, this.wndCols, this.wndRows, ch);
	}

// scrolls window in specified direction
// <direction> can be: up (default), down, left, right
// scroll is always of 1 unit (in characters)
CRT.prototype.scroll = function(direction)
	{
		if (typeof direction == 'undefined') direction = 'up';
		switch(direction)
		{
			case 'up':
				for (var y = this.wndTop + 1; y < this.wndTop + this.wndRows; y++)
				{
					for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
						this.buffer[y - 1][x].copy(this.buffer[y][x]);
					this.modified[y - 1] = true;
				}
				for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
					this.buffer[this.wndTop + this.wndRows - 1][x].copy(this.attr);
				this.modified[this.wndTop + this.wndRows - 1] = true;
				break;
			case 'down':
				for (var y = this.wndTop + this.wndRows - 1; y > this.wndTop; y--)
				{
					for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
						this.buffer[y][x].copy(this.buffer[y-1][x]);
					this.modified[y] = true;
				}
				for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
					this.buffer[this.wndTop][x].copy(this.attr);
				this.modified[this.wndTop] = true;
				break;
			case 'left':
				for (var y = this.wndTop; y < this.wndTop + this.wndRows; y++)
				{
					for (var x = this.wndLeft + 1; x < this.wndLeft + this.wndCols; x++)
						this.buffer[y][x - 1].copy(this.buffer[y][x]);
					this.modified[y] = true;
				}
				for (var y = this.wndTop; y < this.wndTop + this.wndRows; y++)
					this.buffer[y][this.wndLeft + this.wndCols - 1].copy(this.attr);
				this.modified[y] = true;
				break;
			case 'right':
				for (var y = this.wndTop; y < this.wndTop + this.wndRows; y++)
				{
					for (var x = this.wndLeft + this.wndCols - 1; x > this.wndLeft; x--)
						this.buffer[y][x].copy(this.buffer[y][x-1]);
					this.modified[y] = true;
				}
				for (var y = this.wndTop; y < this.wndTop + this.wndRows; y++)
					this.buffer[y][this.wndLeft].copy(this.attr);
				this.modified[y] = true;
				break;
		}
	}

// delete all chars in current cursor window row and scrolls up the bottom part
CRT.prototype.delLine = function()
	{
		for (var y = this.y + 1; y < this.wndTop + this.wndRows; y++)
		{
			for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
				this.buffer[y - 1][x].copy(this.buffer[y][x]);
			this.modified[y - 1] = true;
		}
		for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
			this.buffer[this.wndTop + this.wndRows - 1][x].copy(this.attr);
		this.modified[this.wndTop + this.wndRows - 1] = true;
	}

// insert new row at current window row and scrolls down the bottom part
CRT.prototype.insLine = function()
	{
		for (var y = this.wndTop + this.wndRows - 1; y > this.y; y--)
		{
			for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
				this.buffer[y][x].copy(this.buffer[y-1][x]);
			this.modified[y] = true;
		}
		for (var x = this.wndLeft; x < this.wndLeft + this.wndCols; x++)
			this.buffer[this.y][x].copy(this.attr);
		this.modified[this.y] = true;
	}
	
// delete all chars from cursor position to end of window row
CRT.prototype.clrEol = function()
	{
		for (var x = this.x; x < this.wndLeft + this.wndCols; x++)
			if (this.isValidXY(x, this.y))
				{
					this.buffer[this.y][x].copy(this.attr);
					this.modified[this.y] = true;
				}
	}

// returns cell attributes (CRTAttr object) of cell at absolute <x> and <y> coordinates (in characters - not windowed)
CRT.prototype.getAttrAtXY = function(x, y)
	{
		return this.buffer[y][x];
	}

// overwrite cell attributes (CRTAttr object) of cell at absolute <x> and <y> coordinates (in characters - not windowed).
// char in cell is preserved (change attributes only)
CRT.prototype.setAttrAtXY = function(x, y, attr)
	{
		var c = this.buffer[y][x].c;
		attr.c = c;
		this.buffer[y][x] = attr;
	}
	
// returns SPAN element that contains char at <x> and <y> coordinates (in characters)
CRT.prototype.getObjectAtXY = function(x, y)
	{
		var row = $o('row' + y);									// row DIV element at y coordinate
		if (row)
			{
				var txt = 0;
				for (var i = 0; i < this.texts[y].length; i++)		// I use texts length array to determine if x is contained
					{
						txt += this.texts[y][i];					// sum of SPAN texts length (it's needed because innerHTML collapse spaces)
						if (txt > x)								// if x is contained in span
							return row.childNodes[i];				// 		it's right span
					}
			}
		return null;												// null if not found (never teorically)
	}
	
// clear entire window and move cursor to top left window corner
CRT.prototype.clrScr = function()
	{
		this.fill($c(0));
		this.gotoXY(0, 0);
	}

// clear window content from cursor position to end of row and below
CRT.prototype.erase = function()
	{
		for (var x = this.x; x < this.wndLeft + this.wndCols; x++)
			this.buffer[this.y][x].copy(this.attr);
		this.modified[this.y] = true;
		this.rect(this.wndLeft, this.y + 1, this.wndLeft + this.wndCols, this.wndRows);
	}
	
// returns the bounds of a rectangle given by the intersection of the rectangle passed as parameters and the current window
// returns as array: [<left>, <top>, <cols>, <rows>]
CRT.prototype.intersect = function(left, top, cols, rows)
	{
		var iLeft = left;
		if (left < this.wndLeft) iLeft = this.wndLeft;
		
		var iTop = top;
		if (top < this.wndTop) iTop = this.wndTop;
		
		var iCols = cols;
		if (left < this.wndLeft) iCols = left + cols - this.wndLeft;
		var iRows = rows;
		if (top < this.wndTop) iRows = top + rows - this.wndTop;
		
		if (iLeft + iCols > this.wndLeft + this.wndCols) iCols = this.wndLeft + this.wndCols - iLeft;
		if (iTop + iRows > this.wndTop + this.wndRows) iRows = this.wndTop + this.wndRows - iTop;
		
		return [iLeft, iTop, iCols, iRows];
	}

// draw a rectengle in current window, with default attributes.
// <left>, <top>, <cols> and <rows> are rectangle bounds.
// if <filler> is specified, the rectangle is filled with <filler> char.
// if <filler> is set to -1, only attributes are changed.
CRT.prototype.rect = function(left, top, cols, rows, filler)
	{
		var r = this.intersect(left, top, cols, rows);
		var iLeft = r[0]; var iTop = r[1]; var iCols = r[2]; var iRows = r[3];
		var oldchar = this.attr.c;
		if (typeof filler == 'undefined') filler = this.attr.c;
		this.attr.c = filler;
		for (var y = iTop; y < iTop + iRows; y++)
		{
			for (var x = iLeft; x < iLeft + iCols; x++)
				{
					if (filler == -1)
						this.attr.c = this.buffer[y][x].c;
					this.buffer[y][x].copy(this.attr);
				}
			this.modified[y] = true;
		}
		this.attr.c = oldchar;
	}

// overwrite cell attributes (CRTAttr object) of cell at absolute <x> and <y> coordinates (in characters) if <x> and <y> falls in current window only.
// char in cell is NOT preserved (change attributes and char)
CRT.prototype.safeSetbuffer = function(y, x, attr)
	{
		if (this.isValidXY(x, y)) 
			{
				this.buffer[y][x].copy(attr);
				this.modified[y] = true;
			}
	}

// draw a frame on screen.
// <left>, <top>, <cols> and <rows> are frame bounds and are absolute screen related.
// <chars> is char array containing edge and corner chars
// <colors> is optional foregrounds array for [left, top, right, bottom] edge and corner
//		examples of chars:
//			this.DOUBLE_FRAME = [$c(186), $c(205), $c(186), $c(205), $c(201), $c(187), $c(200), $c(188)];
//			this.SINGLE_FRAME = [$c(179), $c(196), $c(179), $c(196), $c(218), $c(191), $c(192), $c(217)];
//			this.MIXED_FRAME = [$c(179), $c(196), $c(186), $c(205), $c(218), $c(183), $c(212), $c(188)];	// left and top borders are single, right and bottom borders are double
//			this.SIMPLE_FRAME = ['|', '-', '|', '-', '+', '+', '+', '+'];
CRT.prototype.frame = function(left, top, cols, rows, chars, colors)
	{
		var oldfg = this.attr.fg;
		var oldchar = this.attr.c;
		if (typeof colors != 'undefined') this.attr.fg = colors[0];
		this.attr.c = chars[0]; // vertical left edge
		for (var y = top + 1; y < top + rows - 1; y++)
			this.safeSetbuffer(y, left, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[1];
		this.attr.c = chars[1]; // horizontal top edge 
		for (var x = left + 1; x < left + cols - 1; x++)
			this.safeSetbuffer(top, x, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[2];
		this.attr.c = chars[2];	// vertical right edge
		for (var y = top + 1; y < top + rows - 1; y++)
			this.safeSetbuffer(y, left + cols - 1, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[3];
		this.attr.c = chars[3];	// horizontal bottom edge
		for (var x = left + 1; x < left + cols - 1; x++)
			this.safeSetbuffer(top + rows - 1, x, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[0];
		this.attr.c = chars[4];	// nw corner
		this.safeSetbuffer(top, left, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[1];
		this.attr.c = chars[5];	// ne corner
		this.safeSetbuffer(top, left + cols - 1, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[3];
		this.attr.c = chars[6];	// sw corner
		this.safeSetbuffer(top + rows - 1, left, this.attr);
		if (typeof colors != 'undefined') this.attr.fg = colors[2];
		this.attr.c = chars[7];	// se corner
		this.safeSetbuffer(top + rows - 1, left + cols - 1, this.attr);
		this.attr.c = oldchar;
		this.attr.fg = oldfg;
	}

// returns true if absolute <x> and <y> screen coordinates (in characters) falls in current window. False otherwise.
CRT.prototype.isValidXY = function(x, y)
	{
		return (x >= this.wndLeft && x < this.wndLeft + this.wndCols && y >= this.wndTop && y < this.wndTop + this.wndRows);
	}

// copy screen zone (chars and attributes) in memory (like a bitmap) and returns the map
// <left>, <top>, <cols> and <rows> are zone bounds
CRT.prototype.getMap = function(left, top, cols, rows)
	{
		var r = this.intersect(left, top, cols, rows);
		var iLeft = r[0]; var iTop = r[1]; var iCols = r[2]; var iRows = r[3];
		var map = new CRTMap(iCols, iRows);
		for (var y = iTop; y < iTop + iRows; y++)
			for (var x = iLeft; x < iLeft + iCols; x++)
				map.buffer[y - iTop][x - iLeft].copy(this.buffer[y][x]);
		return map;
	}

// copy <map> content (chars and attributes) on screen at <left> and <top> coordinates (screen absolute and in characters)
CRT.prototype.putMap = function(left, top, map)
	{
		for (var y = top; y < top + map.rows; y++)
			for (var x = left; x < left + map.cols; x++)
				if (this.isValidXY(x, y))
				{
					this.buffer[y][x].copy(map.buffer[y - top][x - left]);
					this.modified[y] = true;
				}
	}

// play a beep (aka bell char)
// play a file called beep.mp3... you can overwrite this file with your favourite bell sound.
CRT.prototype.beep = function()
	{
		var beepfile = "beep.mp3";
		var beep, obody;
		var isHTML5 = true;
		try 
			{
				if (typeof document.createElement("audio").play == "undefined") isHTML5 = false;
			}
		catch (e)
			{
				isHTML5 = false;
			}

		obody = document.getElementsByTagName("body")[0];	
		if (!obody) obody = document.getElementsByTagName("html")[0];
		
		beep = document.getElementById("beep");		
		if (beep) obody.removeChild(beep);

		if (isHTML5) 
			{
				beep = document.createElement("audio");
				beep.setAttribute("id", "beep");
				beep.setAttribute("src", beepfile);
				beep.play();
			}
		else if (navigator.userAgent.toLowerCase().indexOf("msie") > -1)
			{		
				beep = document.createElement("bgsound");
				beep.setAttribute("id", "beep");
				beep.setAttribute("loop", 1);
				beep.setAttribute("src", beepfile);
				obody.appendChild(beep);
			}
		else 
			{
				var params;
				beep = document.createElement("object");
				beep.setAttribute("id", "beep");
				beep.setAttribute("type", "audio/wav");
				beep.setAttribute("style", "display:none;");
				beep.setAttribute("data", beepfile);
			
				params = document.createElement("param");
				params.setAttribute("name", "autostart");
				params.setAttribute("value", "false");
			
				beep.appendChild(params);
				obody.appendChild(beep);
			
				try 
					{
						beep.Play();
					}
				catch (e) 
					{
						beep.object.Play();
					}
			}
	}

// draw a 16x16 char table for display full ASCII Table (with default attributes) at <left> and <top> coordinates
CRT.prototype.ASCIITable = function(left, top)
	{
		var oldx = this.x;
		var oldy = this.y;
		var ch = 0;
		for (var y = 0; y < 16; y++)
			for (var x = 0; x < 16; x++)
				{
					this.gotoXY(x + left, y + top);
					this.rawWriteChar(ch, true, true);
					ch++; if (ch > 255) ch = 0;
				}
		this.x = oldx;
		this.y = oldy;
	}

// draw a ruler at <left> and <top> position (screen absolute), of <cols> width.
// <units> char indicates which char to use for units (default = '-')
// <tens> char indicates which char to use for tens (default = '!')
CRT.prototype.ruler = function(left, top, cols, units, tens)
	{
		if (typeof left == 'undefined') left = this.wndLeft;
		if (typeof top == 'undefined') top = this.wndTop;
		if (typeof cols == 'undefined') cols = this.wndCols;
		if (typeof units == 'undefined') units = '-';
		if (typeof tens == 'undefined') tens = '!';
		var oldc = this.attr.c;
		for (var x = left; x < left + cols; x++)
			if (this.isValidXY(x, top))
				{
					this.attr.c = units;
					if ((x - left) % 10 == 0) this.attr.c = tens;
					this.buffer[top][x].copy(this.attr);
				}
		this.attr.c = oldc;
		this.modified[top] = true;
	}