// special keys enumeration

var K_SHIFT = 		'<shift>';
var K_CTRL = 		'<ctrl>';
var K_ALT = 		'<alt>';
var K_SUPER = 		'<super>';
var K_MENU = 		'<menu>';
var K_ESC = 		'<esc>';
var K_F1 = 			'<f1>';
var K_F2 = 			'<f2>';
var K_F3 = 			'<f3>';
var K_F4 = 			'<f4>';
var K_F5 = 			'<f5>';
var K_F6 = 			'<f6>';
var K_F7 = 			'<f7>';
var K_F8 = 			'<f8>';
var K_F9 = 			'<f9>';
var K_F10 = 		'<f10>';
var K_F11 = 		'<f11>';
var K_F12 = 		'<f12>';
var K_SCROLL = 		'<scroll>';
var K_PAUSE = 		'<pause>';
var K_CAPS = 		'<caps>';
var K_BS = 			'<bs>';
var K_TAB = 		'<tab>';
var K_INS = 		'<ins>';
var K_HOME = 		'<home>';
var K_PGUP = 		'<pgup>';
var K_DEL = 		'<del>';
var K_END = 		'<end>';
var K_PGDOWN = 		'<pgdown>';
var K_LEFT = 		'<left>';
var K_RIGHT = 		'<right>';
var K_UP = 			'<up>';
var K_DOWN = 		'<down>';
var K_NUM = 		'<num>';
var K_PAD_DIV = 	'<pad_div>';
var K_PAD_MUL = 	'<pad_mul>';
var K_PAD_PLUS = 	'<pad_plus>';
var K_PAD_MIN = 	'<pad_min>';
var K_ENTER = 		'<enter>';
var K_PAD_7 = 		'<pad_7>';
var K_PAD_8 = 		'<pad_8>';
var K_PAD_9 = 		'<pad_9>';
var K_PAD_4 = 		'<pad_4>';
var K_PAD_5 = 		'<pad_5>';
var K_PAD_6 = 		'<pad_6>';
var K_PAD_1 = 		'<pad_1>';
var K_PAD_2 = 		'<pad_2>';
var K_PAD_3 = 		'<pad_3>';
var K_PAD_0 = 		'<pad_0>';
var K_PAD_DIGITAL = '<pad_digital>';
var K_FORM_FEED = 	'<form_feed>';

var KeyAttr = function()
	{
		this.c = '';
		this.special = '';
		this.kcode = 0;
		this.shift = false;
		this.ctrl = false;
		this.alt = false;
		this.meta = false;
	}

KeyAttr.prototype.setChar = function(c)
	{
		switch (c)
			{
				case K_SHIFT:
				case K_CTRL:
				case K_ALT:
				case K_SUPER:
				case K_MENU:
				case K_ESC:
				case K_F1:
				case K_F2:
				case K_F3:
				case K_F4:
				case K_F5:
				case K_F6:
				case K_F7:
				case K_F8:
				case K_F9:
				case K_F10:
				case K_F11:
				case K_F12:
				case K_SCROLL:
				case K_PAUSE:
				case K_CAPS:
				case K_BS:
				case K_TAB:
				case K_INS:
				case K_HOME:
				case K_PGUP:
				case K_DEL:
				case K_END:
				case K_PGDOWN:
				case K_LEFT:
				case K_RIGHT:
				case K_UP:
				case K_DOWN:
				case K_NUM:
				case K_ENTER:
				case K_FORM_FEED:
					this.c = '';
					this.special = c;
					break;				
				case K_PAD_DIV:
					this.c = '/';
					this.special = c;
					break;
				case K_PAD_MUL:
					this.c = '*';
					this.special = c;
					break;
				case K_PAD_PLUS:
					this.c = '+';
					this.special = c;
					break;
				case K_PAD_MIN:
					this.c = '-';
					this.special = c;
					break;
				case K_PAD_7:
					this.c = '7';
					this.special = c;
					break;
				case K_PAD_8:
					this.c = '8';
					this.special = c;
					break;
				case K_PAD_9:
					this.c = '9';
					this.special = c;
					break;
				case K_PAD_4:
					this.c = '4';
					this.special = c;
					break;
				case K_PAD_5:
					this.c = '5';
					this.special = c;
					break;
				case K_PAD_6:
					this.c = '6';
					this.special = c;
					break;
				case K_PAD_1:
					this.c = '1';
					this.special = c;
					break;
				case K_PAD_2:
					this.c = '2';
					this.special = c;
					break;
				case K_PAD_3:
					this.c = '3';
					this.special = c;
					break;
				case K_PAD_0:
					this.c = '0';
					this.special = c;
					break;
				case K_PAD_DIGITAL:
					this.c = '.';
					this.special = c;
					break;
				default:
					this.c = c;
					this.special = '';
					break;
			}
	}
	
KeyAttr.prototype.printable = function()
	{
		return this.c != '';
	}
	
// keyboard handler main object
var Keyb = function(layoutManager, keyCallback)
	{
		this.BROWSER = null;
		this.B_CHROME = 'Chrome';
		this.B_FIREFOX = 'Firefox';
		this.B_IE = 'MSIE';
		
		this.layoutManager = layoutManager;
		this.keyCallback = keyCallback;
		this.alt = false;
		
		document.onhelp = function () { return (false); };
		window.onhelp = function () { return (false); };	

		c=navigator.userAgent.search("Chrome");
		f=navigator.userAgent.search("Firefox");
		m8=navigator.userAgent.search("MSIE 8.0");
		m9=navigator.userAgent.search("MSIE 9.0");
		if (c >- 1) this.BROWSER = this.B_CHROME;
		else if ( f>-1 ) this.BROWSER = this.B_FIREFOX;
		else if (m9 >- 1) /* BROWSER ="MSIE 9.0"; */ this.BROWSER = this.B_IE;
		else if (m8 >-1 ) /* BROWSER ="MSIE 8.0"; */ this.BROWSER = this.B_IE;
		
		that = this;
		if (document.addEventListener) document.addEventListener('keydown', function(e) { that.handler(that, e); }, false);
		else if (document.attachEvent) document.attachEvent('onkeydown', function(e) { that.handler(that, e); });
		else document['onkeydown'] = function(e) { that.handler(that, e); };	

		if (document.addEventListener) document.addEventListener('keypress', function(e) { that.althandler(that, e); }, false);
		else if (document.attachEvent) document.attachEvent('onkeypress', function(e) { that.althandler(that, e); });
		else document['onkeypress'] = function(e) { that.althandler(that, e); };			

		//if (document.addEventListener) document.addEventListener('keyup', function(e) { that.althandler(that, e); }, false);
		//else if (document.attachEvent) document.attachEvent('onkeyup', function(e) { that.althandler(that, e); });
		//else document['onkeyup'] = function(e) { that.althandler(that, e); };			
	}

Keyb.prototype.handler = function(ko, e)
	{
		e = e || window.event;
		e.keyb = ko;
		
		//Find Which key is pressed
		if (e.keyCode) e.kcode = e.keyCode;
		else if (e.which) e.kcode = e.which;

		//log(e.code)
		e.character = String.fromCharCode(e.kcode).toLowerCase();

		var c = ko.layoutManager(e);
		if (e.altKey && 
			(c == K_PAD_0 || 
			c == K_PAD_1 || 
			c == K_PAD_2 || 
			c == K_PAD_3 || 
			c == K_PAD_4 || 
			c == K_PAD_5 || 
			c == K_PAD_6 || 
			c == K_PAD_7 || 
			c == K_PAD_8 || 
			c == K_PAD_9)) 
				ko.alt = true;
			else
				ko.alt = false;
		
		if (!ko.alt && ko.keyCallback)
			{
				var attr = new KeyAttr();
				attr.setChar(c);
				attr.kcode = e.kcode;
				attr.shift = e.shiftKey;
				attr.ctrl = e.ctrlKey;
				attr.alt = e.altKey;
				attr.meta = e.metaKey;
				ko.keyCallback(attr);
			}
		
		if (!ko.alt)
			{
				e.cancelBubble = true;
				e.returnValue = false;

				//e.stopPropagation works in Firefox.
				if (e.stopPropagation) 
					{
						e.stopPropagation();
						e.preventDefault();
					}
				return false;				
			}
	}

Keyb.prototype.remap = function(x)
	{
		var i = alt_remap.length;
		while (i--)
		   if (alt_remap[i] === x)
			   return i;
		return x;
	}
	
Keyb.prototype.althandler = function(ko, e)
	{
		e = e || window.event;
		e.keyb = ko;
		
		//Find Which key is pressed
		if (e.keyCode) e.kcode = e.keyCode;
		else if (e.which) e.kcode = e.which;

		if (ko.alt && ko.keyCallback)
			{
				var attr = new KeyAttr();
				attr.setChar($c(ko.remap(e.kcode)));
				attr.kcode = e.kcode;
				attr.shift = e.shiftKey;
				attr.ctrl = e.ctrlKey;
				attr.alt = e.altKey;
				attr.meta = e.metaKey;
				ko.keyCallback(attr);
			}
		
		ko.alt = false;
		
		e.cancelBubble = true;
		e.returnValue = false;

		//e.stopPropagation works in Firefox.
		if (e.stopPropagation) 
			{
				e.stopPropagation();
				e.preventDefault();
			}
		return false;				
	}