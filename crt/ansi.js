/**
 * ansi.js
 * 
 * Based on crt.js, provides full featured ANSI text mode terminal in browser
 *  see also (https://en.wikipedia.org/wiki/ANSI_escape_code)
 * 	ANS and ASCII Art are supplied.
 *	write method allows to use ANSI sequences directly.
 *  JQuery is required for loading ANS file from server only.
 * Requirements: crt.js, 437.js, crt.css, [font], <jquery 1.x>
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

// ANSI main object
// <oCRT> is CRT object instance
function ANSI (oCRT)
	{
		this.CRT = oCRT;
		this.buffer = "";						// ANSI buffer
		this.curX = -1;							// saved x cursor position
		this.curY = -1;							// saved y cursor position
		this.curFG = this.CRT.attr.fg;			// current foreground color palette index
		this.curBG = this.CRT.attr.bg;			// current background color palette index
		this.hiColor = false;					// color mode: true -> High mode; false (default) -> Low mode
		this.reverse = false;					// true -> invert fg and bg; false (default) -> fg and bg are not inverted
		this.invisible = false;					// true -> fg is set to bg; false (default) -> fg is user controlled
		
		this.ESC = String.fromCharCode(27);		// ANSI escape char
		
		// ANSI escape sequences enumeration
		
		this.BAW_TEXT = 0;
		this.BAW_MOVE_CURSOR_TO = 1;
		this.BAW_MOVE_CURSOR_REL = 2;
		this.BAW_CURSOR_SAVE = 3;
		this.BAW_CURSOR_RECALL = 4;
		this.BAW_CLEAR_SCREEN = 5;
		this.BAW_CLEAR_EOL = 6;
		this.BAW_SET_COLOR = 7;
		
		this.MOVE_UP = 0;
		this.MOVE_DOWN = 1;
		this.MOVE_LEFT = 2;
		this.MOVE_RIGHT = 3;

		this.TA_NORMAL = 0;
		this.TA_BOLD = 1;
		this.TA_UNDERLINE = 4;
		this.TA_BLINK = 5;
		this.TA_REVERSE = 7;
		this.TA_INVISIBLE = 8;
		
		this.FG_BLACK = 30;
		this.FG_RED = 31;
		this.FG_GREEN = 32;
		this.FG_YELLOW = 33;
		this.FG_BLUE = 34;
		this.FG_MAGENTA = 35;
		this.FG_CYAN = 36;
		this.FG_WHITE = 37;

		this.BG_BLACK = 40;
		this.BG_RED = 41;
		this.BG_GREEN = 42;
		this.BG_YELLOW = 43;
		this.BG_BLUE = 44;
		this.BG_MAGENTA = 45;
		this.BG_CYAN = 46;
		this.BG_WHITE = 47;
		
		// ANSI escape sequences templates
		
		this.ESC_MOVE_CURSOR_TO 	= this.ESC + "[<p0>;<p1>H";
		this.ESC_MOVE_CURSOR_UP 	= this.ESC + "[<p0>A";
		this.ESC_MOVE_CURSOR_DOWN 	= this.ESC + "[<p0>B";
		this.ESC_MOVE_CURSOR_RIGHT 	= this.ESC + "[<p0>C";
		this.ESC_MOVE_CURSOR_LEFT 	= this.ESC + "[<p0>D";
		this.ESC_CURSOR_SAVE 		= this.ESC + "[s";
		this.ESC_CURSOR_RECALL		= this.ESC + "[u";
		this.ESC_CLEAR_SCREEN		= this.ESC + "[J";
		this.ESC_CLEAR_EOL			= this.ESC + "[K";
		this.ESC_SET_COLOR1			= this.ESC + "[<p0>m";
		this.ESC_SET_COLOR2			= this.ESC + "[<p0>;<p1>m";
		this.ESC_SET_COLOR3			= this.ESC + "[<p0>;<p1>;<p2>m";
	}

// create a new ANSI string buffer
// you can add your ANSI sequences here with bufferAppend method
ANSI.prototype.bufferBegin = function()
	{
		this.buffer = "";
	}

// returns string representation of buffer
// you can pass this to write method to write buffer contents to screen	
ANSI.prototype.bufferToString = function()
	{
		return this.buffer;
	}

// replace parameters in ANSI sequence template
// <escSeq> is ANSI escape sequence template
// <param0> is the 1st escape sequence parameter (optional)
// <param1> is the 2nd escape sequence parameter (optional)
// <param2> is the 3rd escape sequence parameter (optional)
ANSI.prototype.replaceInEscape = function(escSeq, param0, param1, param2)
	{
		return escSeq.replace("<p0>", param0).replace("<p1>", param1).replace("<p2>", param2);
	}

// appends ANSI escape sequence to buffer
// <what> is ANSI escape sequence enum (see above)
// <param0> is the 1st escape sequence parameter (optional)
// <param1> is the 2nd escape sequence parameter (optional)
// <param2> is the 3rd escape sequence parameter (optional)
ANSI.prototype.bufferAppend = function(what, param0, param1, param2)
	{
		switch (what)
			{
				// es: oANSI.bufferAppend(oANSI.BAW_TEXT, "Hello");
				case this.BAW_TEXT:
					this.buffer += param0;	// text to append in param0 
					break;
					
				// es: oANSI.bufferAppend(oANSI.BAW_MOVE_CURSOR_TO, 5, 2);	// move cursor to row 2 and col 5
				case this.BAW_MOVE_CURSOR_TO:
					this.buffer += this.replaceInEscape(this.ESC_MOVE_CURSOR_TO, param1, param0);	// x coordinate in param0 and y coordinate in in param1
					break;
					
				// es: oANSI.bufferAppend(oANSI.BAW_MOVE_CURSOR_REL, oANSI.MOVE_DOWN, 2);	// move cursor down by 2 rows
				case this.BAW_MOVE_CURSOR_REL:
					switch (param0)		// direction in param0
						{
							case this.MOVE_UP:
								this.buffer += this.replaceInEscape(this.ESC_MOVE_CURSOR_UP, param1);	 // offset in param1
								break;
							case this.MOVE_DOWN:
								this.buffer += this.replaceInEscape(this.ESC_MOVE_CURSOR_DOWN, param1);	 // offset in param1
								break;
							case this.MOVE_LEFT:
								this.buffer += this.replaceInEscape(this.ESC_MOVE_CURSOR_LEFT, param1);	 // offset in param1
								break;
							case this.MOVE_RIGHT:
								this.buffer += this.replaceInEscape(this.ESC_MOVE_CURSOR_RIGHT, param1); // offset in param1
								break;
						}
					break;

				// es: oANSI.bufferAppend(oANSI.BAW_CURSOR_SAVE);	// save current cursor position
				case this.BAW_CURSOR_SAVE:
					this.buffer += this.ESC_CURSOR_SAVE;
					break;

				// es: oANSI.bufferAppend(oANSI.BAW_CURSOR_RECALL);	// restore saved cursor position
				case this.BAW_CURSOR_RECALL:
					this.buffer += this.ESC_CURSOR_RECALL;
					break;

				// es: oANSI.bufferAppend(oANSI.BAW_CLEAR_SCREEN);	// clear screen
				case this.BAW_CLEAR_SCREEN:
					this.buffer += this.ESC_CLEAR_SCREEN;
					break;

				// es: oANSI.bufferAppend(oANSI.BAW_CLEAR_EOL);		// clear from cursor position to end-of-line
				case this.BAW_CLEAR_EOL:
					this.buffer += this.ESC_CLEAR_EOL;
					break;
					
				// es: oANSI.bufferAppend(oANSI.BAW_SET_COLOR, oANSI.FG_RED);
				// es: oANSI.bufferAppend(oANSI.BAW_SET_COLOR, oANSI.TA_BOLD, oANSI.FG_RED);
				// es: oANSI.bufferAppend(oANSI.BAW_SET_COLOR, oANSI.TA_BOLD, oANSI.FG_RED, oANSI.BG_BLUE);
				case this.BAW_SET_COLOR:							// change current text attributes
					if (typeof param0 != 'undefined' && typeof param1 != 'undefined' && typeof param2 != 'undefined')
						this.buffer += this.replaceInEscape(this.ESC_SET_COLOR3, param0, param1, param2);
					else
						if (typeof param0 != 'undefined' && typeof param1 != 'undefined')
							this.buffer += this.replaceInEscape(this.ESC_SET_COLOR2, param0, param1);
						else
							if (typeof param0 != 'undefined')
								this.buffer += this.replaceInEscape(this.ESC_SET_COLOR1, param0);
					break;
			}
	}

// writes ANSI string to screen
// <text> can be simple text or any complex ANSI sequence (ANSI Art also)
ANSI.prototype.write = function(text)
	{
		var inSeq = false;							// true -> I'm in ANSI sequence, I've to consider next char as parameters or sequence part
		var curSeq = "";							// current forming sequence
		var ch = '';								// current char
		var txt = "";								// current text portion
		for (var i = 0, len = text.length; i < len; i++)	// elaborate entire string
			{
				ch = text.charAt(i);				// get the current string char
				if (ch == this.ESC && !inSeq)		// if an ANSI escape sequence is started (and I'm not already in sequence), first I write the text before
					{
						if (txt != '')					// if I've text to write only
							{
								if (!this.CRT.stopwrite)	// if I can write it only
									this.CRT.write(txt);	// write text on screen
								txt = "";			// reset current text
							}
						inSeq = true;				// I'm in sequence of course!
					}
				else
					if (!inSeq)		// if I'm not in ANSI sequence, char is simply text
						{
							txt += ch;		// append char to current text
						}
						
				if (inSeq)	// if I'm in the escape sequence, I have to check if there is a character that makes end the sequence
					{
						if (ch == 'H' || ch == 'f' || ch == 'A' || ch == 'B' || ch == 'C' || ch == 'D' || ch == 'R' ||
							ch == 's' || ch == 'u' || ch == 'J' || ch == 'K' || ch == 'm' || ch == 'h' || ch == 'l')
							{
								inSeq = false;							// I exit from sequence
								txt += this.runSequence(curSeq + ch);	// if the sequence is recognized, run it and return "", otherwise return it as text
								curSeq = "";							// reset current sequence
							}
						else
							curSeq += ch;				// append char to current sequence
					}
			}
		// at the end...
		if (curSeq != "")						// if there is a pending sequence
			txt += this.runSequence(curSeq);	// run the sequence
		if (txt != "")							// if there is a pending text
			if (!this.CRT.stopwrite)			// and I can write text on screen
				this.CRT.write(txt);			// write text on screen
	}

// current ANSI window contextualized gotoXY method
ANSI.prototype.gotoXY = function (x, y)
	{
		this.CRT.x = x + this.CRT.wndLeft - 1;
		this.CRT.y = y + this.CRT.wndTop - 1;
	}

// interprets the escape sequence according to ANSI specification
// if the sequence is recognized, run it and return "", otherwise return it as text
// <seq> is ANSI atomic sequence to run
ANSI.prototype.runSequence = function(seq)
	{
		//console.log(seq);
		var params = "";
		var lastCh = seq.charAt(seq.length - 1);
		switch (lastCh)
			{
				case 'H':	// move to
				case 'f':
					params = seq.substring(2, seq.length - 1);
					params = params.split(';');
					if (params.length == 2)
						{
							if (params[0].length == 0) params[0] = 1;
							if (params[1].length == 0) params[1] = 1;
							this.gotoXY(params[1] * 1, params[0] * 1);
							return "";
						}
					else
						if (params.length == 1)
							{
								if (params[0].length == 0) params[0] = "1";
								this.gotoXY(1, params[0] * 1);
								return "";
							}
						else
							return seq;
				
				case 'A':	// move rel up
					params = seq.substring(2, seq.length - 1);
					if (params.length == 0)
						this.CRT.moveCursor("n", 1);
					else
						this.CRT.moveCursor("n", params * 1);
					return "";
				case 'B':	// move rel down
					params = seq.substring(2, seq.length - 1);
					if (params.length == 0)
						this.CRT.moveCursor("s", 1);
					else
						this.CRT.moveCursor("s", params * 1);
					return "";
				case 'C':	// move rel right
					params = seq.substring(2, seq.length - 1);
					if (params.length == 0)
						this.CRT.moveCursor("e", 1);
					else
						this.CRT.moveCursor("e", params * 1);
					return "";
				case 'D':	// move rel left
					params = seq.substring(2, seq.length - 1);
					if (params.length == 0)
						this.CRT.moveCursor("w", 1);
					else
						this.CRT.moveCursor("w", params * 1);
					return "";
				
				case 's':	// save cursor pos
					this.curX = this.CRT.x;
					this.curY = this.CRT.y;
					return "";
				case 'u':	// restore cursor pos
					this.CRT.gotoXY(this.curX, this.curY);
					return "";
				
				case 'J':	// clear screen
					this.CRT.clrScr();
					return "";
				case 'K':	// clear eol
					this.CRT.clrEol();
					return "";
				
				case 'm':	// display e color
					//console.log(seq);
					params = seq.substring(2, seq.length - 1);
					params = params.split(';');
					for (var i = 0, len = params.length; i < len; i++)
						{
							switch (params[i] * 1)
								{
									case this.TA_NORMAL:
										this.curBG = 0;
										this.curFG = 7;
										this.hiColor = false;
										this.CRT.setUnderline(false);
										this.CRT.setBlink(false);
										this.reverse = false;
										this.invisible = false;
										break;
									case this.TA_BOLD:
										this.hiColor = true;
										break;
									case this.TA_UNDERLINE:
										this.CRT.setUnderline(true);
										break;
									case this.TA_BLINK:
										this.CRT.setBlink(true);
										break;
									case this.TA_REVERSE:
										this.reverse = true;
										break;
									case this.TA_INVISIBLE:
										this.invisible = true;
										break;
									
									case this.FG_BLACK:
										this.curFG = 0;
										break;
									case this.FG_RED:
										this.curFG = 4;
										break;
									case this.FG_GREEN:
										this.curFG = 2;
										break;
									case this.FG_YELLOW:
										this.curFG = 6;
										break;
									case this.FG_BLUE:
										this.curFG = 1;
										break;
									case this.FG_MAGENTA:
										this.curFG = 5;
										break;
									case this.FG_CYAN:
										this.curFG = 3;
										break;
									case this.FG_WHITE:
										this.curFG = 7;
										break;

									case this.BG_BLACK:
										this.curBG = 0;
										break;
									case this.BG_RED:
										this.curBG = 4;
										break;
									case this.BG_GREEN:
										this.curBG = 2;
										break;
									case this.BG_YELLOW:
										this.curBG = 6;
										break;
									case this.BG_BLUE:
										this.curBG = 1;
										break;
									case this.BG_MAGENTA:
										this.curBG = 5;
										break;
									case this.BG_CYAN:
										this.curBG = 3;
										break;
									case this.BG_WHITE:
										this.curBG = 7;
										break;

								}								
						}						

					if (this.reverse)
						{
							if (this.invisible)
								this.CRT.setColor(this.curFG);
							else
								{
									if (this.hiColor)
										{
											if (this.curBG < 8)
												this.CRT.setColor(this.curBG + 8);
											else
												this.CRT.setColor(this.curBG);
										}
									else
										this.CRT.setColor(this.curBG);
								}
								
							this.CRT.setBackgroundColor(this.curFG);
						}
					else
						{
							if (this.invisible)
								this.CRT.setColor(this.curBG);
							else
								{
									if (this.hiColor)
										{
											if (this.curFG < 8)
												this.CRT.setColor(this.curFG + 8);
											else
												this.CRT.setColor(this.curFG);
										}
									else
										this.CRT.setColor(this.curFG);
								}
								
							this.CRT.setBackgroundColor(this.curBG);
						}
					return "";
					
				default:
					//console.log(seq);
					return "";
			}
	}
	
// (requires JQuery loaded)
// draws ANSI art from url
// <arturl> have to point to ANS file
ANSI.prototype.loadArt = function(arturl)
	{
		if (!$) return;
		var ansi = this;
		$.ajax({
			url:arturl,
			cache:false
		}).done(function(data)
			{
				ansi.write(data);
			}).fail(function()
				{
					ansi.write("Unable to download " + arturl);
				});
	}
	
// (requires JQuery loaded)
// draws ANSI art from url in window
// <x>, <y>, <width> and <height> defines art window
// <arturl> have to point to ANS file
// <restorexy> indicates if restore cursor position after draw (default = true)
// <restorewindow> indicates if restore current window after draw (default = true)
ANSI.prototype.loadArtWindow = function(x, y, width, height, arturl, restorexy, restorewindow)
	{
		if (!$) return;
		if (typeof restorexy == 'undefined') restorexy = true;
		if (typeof restorewindow == 'undefined') restorewindow = true;
		var wndLeft = this.CRT.wndLeft;
		var wndTop = this.CRT.wndTop;
		var wndCols = this.CRT.wndCols;
		var wndRows = this.CRT.wndRows;
		var cX = this.CRT.x;
		var cY = this.CRT.y;
		this.CRT.window(x, y, width, height);
		this.CRT.gotoXY(0, 0);
		var ansi = this;
		$.ajax({
			url:arturl,
			cache:false
		}).done(function(data)
			{
				ansi.write(data);
			}).fail(function()
				{
					ansi.write("Unable to download " + arturl);
				}).always(function()
					{
						if (restorewindow)
							{
								ansi.CRT.wndLeft = wndLeft;
								ansi.CRT.wndTop = wndTop;
								ansi.CRT.wndCols = wndCols;
								ansi.CRT.wndRows = wndRows;
							}
						if (restorexy)
							{
								ansi.CRT.x = cX;
								ansi.CRT.y = cY;
							}
					});
	}
	
// draws ANSI art from string
// <data> have to contain full ANS file content (ans2js.py tool can be used)
ANSI.prototype.stringArt = function(data)
	{
		var oldscroll = this.CRT.autoscroll;
		//this.CRT.autoscroll = false;
		this.write(data);
		this.CRT.autoscroll = oldscroll;
	}
	
// draws ANSI art from string in window
// <x>, <y>, <width> and <height> defines art window
// <data> have to contain full ANS file content (ans2js.py tool can be used)
// <restorexy> indicates if restore cursor position after draw (default = false)
// <restorewindow> indicates if restore current window after draw (default = false)
ANSI.prototype.stringArtWindow = function(x, y, width, height, data, restorexy, restorewindow)
	{
		if (typeof restorexy == 'undefined') restorexy = true;
		if (typeof restorewindow == 'undefined') restorewindow = true;
		var wndLeft = this.CRT.wndLeft;
		var wndTop = this.CRT.wndTop;
		var wndCols = this.CRT.wndCols;
		var wndRows = this.CRT.wndRows;
		var cX = this.CRT.x;
		var cY = this.CRT.y;
		this.CRT.window(x, y, width, height);
		this.CRT.gotoXY(0, 0);
		var oldscroll = this.CRT.autoscroll;
		//this.CRT.autoscroll = false;
		this.write(data);
		this.CRT.autoscroll = oldscroll;
		if (restorewindow)
			{
				this.CRT.window(wndLeft, wndTop, wndCols, wndRows);
			}
		if (restorexy)
			{
				this.CRT.gotoXY(cX, cY);
			}
	}