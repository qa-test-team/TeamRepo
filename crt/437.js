/**
 * 437.js
 * 
 * Provides 437 codepage to map old style BIOS font and character set
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

CRT.prototype.codepage = function(c)		// filter chars to draw
{
	if (c == '') return ' ';
	if (c == $c(0)) return ' ';
	
	var i = c.charCodeAt(0);
	if (isNaN(i)) return ' ';
	if (i > 255) return ' ';
	switch(i)
	{
		case 0:
			return ' ';							// NUL (Null)
		case 1:
			return String.fromCharCode(0x263a);	// SOH (Start of Header)
		case 2:
			return String.fromCharCode(0x263b);	// STX (Start of Text)
		case 3:
			return String.fromCharCode(0x2665);	// ETX (End of Text)
		case 4:
			return String.fromCharCode(0x2666);	// EOT (End of Transmission)
		case 5:
			return String.fromCharCode(0x2663);	// ENQ (Enquiry)
		case 6:
			return String.fromCharCode(0x2660);	// ACK (Acknowledge)
		case 7:
			return String.fromCharCode(0x2022);	// BEL (Bell)
		case 8:
			return String.fromCharCode(0x25d8);	// BS (BackSpace)
		case 9:
			return String.fromCharCode(0x25cb);	// HT (Horizontal Tabulation)
		case 10:
			return String.fromCharCode(0x25d9);	// LF (Line Feed)
		case 11:
			return String.fromCharCode(0x2642);	// VT (Vertical Tabulation)
		case 12:
			return String.fromCharCode(0x2640);	// FF (Form Feed)
		case 13:
			return String.fromCharCode(0x266a);	// CR (Carriage Return)
		case 14:
			return String.fromCharCode(0x266b);	// SO (Shift Out)
		case 15:
			return String.fromCharCode(0x263c);	// SI (Shift In)
		case 16:
			return String.fromCharCode(0x25ba);	// DLE (Data Link Escape)
		case 17:
			return String.fromCharCode(0x25c4);	// DC1 (Device Control 1)
		case 18:
			return String.fromCharCode(0x2195);	// DC2 (Device Control 2)
		case 19:
			return String.fromCharCode(0x203c);	// DC3 (Device Control 3)
		case 20:
			return String.fromCharCode(0x00b6);	// DC4 (Device Control 4)
		case 21:
			return String.fromCharCode(0x00a7);	// NAK (Negative Acknowledge)
		case 22:
			return String.fromCharCode(0x25ac);	// SYN (Synchronous Idle)
		case 23:
			return String.fromCharCode(0x21a8);	// ETB (End of Transmission Block)
		case 24:
			return String.fromCharCode(0x2191);	// CAN (Cancel)
		case 25:
			return String.fromCharCode(0x2193);	// EM (End of Medium)
		case 26:
			return String.fromCharCode(0x2192);	// SUB (Substitute)
		case 27:
			return String.fromCharCode(0x2190);	// ESC (Escape)
		case 28:
			return String.fromCharCode(0x221f);	// FS (File Separator)
		case 29:
			return String.fromCharCode(0x2194);	// GS (Group Separator)
		case 30:
			return String.fromCharCode(0x25b2);	// RS (Record Separator)
		case 31:
			return String.fromCharCode(0x25bc);	// US (Unit Separator)
		case 32:
			return ' ';							// Space
		case 33:
			return '!';							// Exclamation mark
		case 34:
			return '"';							// Quotation Mark
		case 35:
			return '#';							// Hash
		case 36:
			return '$';							// Dollar
		case 37:
			return '%';							// Percent
		case 38:
			return '&';							// Ampersand
		case 39:
			return "'";							// Apostrophe
		case 40:
			return '(';							// Open bracket
		case 41:
			return ')';							// Close bracket
		case 42:
			return '*';							// Asterisk
		case 43:
			return '+';							// Plus
		case 44:
			return ',';							// Comma
		case 45:
			return '-';							// Dash
		case 46:
			return '.';							// Full stop
		case 47:
			return '/';							// Slash
		case 48:
			return '0';							// Zero
		case 49:
			return '1';							// One
		case 50:
			return '2';							// Two
		case 51:
			return '3';							// Three
		case 52:
			return '4';							// Four
		case 53:
			return '5';							// Five
		case 54:
			return '6';							// Six
		case 55:
			return '7';							// Seven
		case 56:
			return '8';							// Eight
		case 57:
			return '9';							// Nine
		case 58:
			return ':';							// Colon
		case 59:
			return ';';							// Semicolon
		case 60:
			return '<';							// Less than
		case 61:
			return '=';							// Equals sign
		case 62:
			return '>';							// Greater than
		case 63:
			return '?';							// Question mark
		case 64:
			return '@';							// At
		case 65:
			return 'A';							// Upper case A
		case 66:
			return 'B';							// Upper case B
		case 67:
			return 'C';							// Upper case C
		case 68:
			return 'D';							// Upper case D
		case 69:
			return 'E';							// Upper case E
		case 70:
			return 'F';							// Upper case F
		case 71:
			return 'G';							// Upper case G
		case 72:
			return 'H';							// Upper case H
		case 73:
			return 'I';							// Upper case I
		case 74:
			return 'J';							// Upper case J
		case 75:
			return 'K';							// Upper case K
		case 76:
			return 'L';							// Upper case L
		case 77:
			return 'M';							// Upper case M
		case 78:
			return 'N';							// Upper case N
		case 79:
			return 'O';							// Upper case O
		case 80:
			return 'P';							// Upper case P
		case 81:
			return 'Q';							// Upper case Q
		case 82:
			return 'R';							// Upper case R
		case 83:
			return 'S';							// Upper case S
		case 84:
			return 'T';							// Upper case T
		case 85:
			return 'U';							// Upper case U
		case 86:
			return 'V';							// Upper case V
		case 87:
			return 'W';							// Upper case W
		case 88:
			return 'X';							// Upper case X
		case 89:
			return 'Y';							// Upper case Y
		case 90:
			return 'Z';							// Upper case Z
		case 91:
			return '[';							// Open square bracket
		case 92:
			return '\\';						// Backslash
		case 93:
			return ']';							// Close square bracket
		case 94:
			return '^';							// Caret
		case 95:
			return '_';							// Underscore
		case 96:
			return String.fromCharCode(0x0060);	// Grave accent
		case 97:
			return 'a';							// Lower case a
		case 98:
			return 'b';							// Lower case b
		case 99:
			return 'c';							// Lower case c
		case 100:
			return 'd';							// Lower case d
		case 101:
			return 'e';							// Lower case e
		case 102:
			return 'f';							// Lower case f
		case 103:
			return 'g';							// Lower case g
		case 104:
			return 'h';							// Lower case h
		case 105:
			return 'i';							// Lower case i
		case 106:
			return 'j';							// Lower case j
		case 107:
			return 'k';							// Lower case k
		case 108:
			return 'l';							// Lower case l
		case 109:
			return 'm';							// Lower case m
		case 110:
			return 'n';							// Lower case n
		case 111:
			return 'o';							// Lower case o
		case 112:
			return 'p';							// Lower case p
		case 113:
			return 'q';							// Lower case q
		case 114:
			return 'r';							// Lower case r
		case 115:
			return 's';							// Lower case s
		case 116:
			return 't';							// Lower case t
		case 117:
			return 'u';							// Lower case u
		case 118:
			return 'v';							// Lower case v
		case 119:
			return 'w';							// Lower case w
		case 120:
			return 'x';							// Lower case x
		case 121:
			return 'y';							// Lower case y
		case 122:
			return 'z';							// Lower case z
		case 123:
			return '{';							// Open brace
		case 124:
			return '|';							// Pipe
		case 125:
			return '}';							// Close brace
		case 126:
			return '~';							// Tilde
		case 127:
			return String.fromCharCode(0x2302);	// Delete
		case 128:
			return String.fromCharCode(0x00c7);	// Ç - Upper case C with cedilla
		case 129:
			return String.fromCharCode(0x00fc);	// ü - Lower case u with diaeresis
		case 130:
			return String.fromCharCode(0x00e9);	// é - Lower case e with acute
		case 131:
			return String.fromCharCode(0x00e2);	// â - Lower case a with circumflex
		case 132:
			return String.fromCharCode(0x00e4);	// ä - Lower case a with diaeresis
		case 133:
			return String.fromCharCode(0x00e0);	// à - Lower case a with grave
		case 134:
			return String.fromCharCode(0x00e5);	// å - Lower case a with ring above
		case 135:
			return String.fromCharCode(0x00e7);	// ç - Lower case c with cedilla
		case 136:
			return String.fromCharCode(0x00ea);	// ê - Lower case e with circumflex
		case 137:
			return String.fromCharCode(0x00eb);	// ë - Lower case e with diaeresis
		case 138:
			return String.fromCharCode(0x00e8);	// è - Lower case e with grave
		case 139:
			return String.fromCharCode(0x00ef);	// ï - Lower case i with diaeresis
		case 140:
			return String.fromCharCode(0x00ee);	// î - Lower case i with circumflex
		case 141:
			return String.fromCharCode(0x00ec);	// ì - Lower case i with grave
		case 142:
			return String.fromCharCode(0x00c4);	// Ä - Upper case A with diaeresis
		case 143:
			return String.fromCharCode(0x00c5);	// Å - Upper case A with ring above
		case 144:
			return String.fromCharCode(0x00c9);	// É - Upper case E with acute
		case 145:
			return String.fromCharCode(0x00e6);	// æ - Lower case ae
		case 146:
			return String.fromCharCode(0x00c6);	// Æ - Upper case AE
		case 147:
			return String.fromCharCode(0x00f4);	// ô - Lower case o with circumflex
		case 148:
			return String.fromCharCode(0x00f6);	// ö - Lower case o with diaeresis
		case 149:
			return String.fromCharCode(0x00f2);	// ò - Lower case o with grave
		case 150:
			return String.fromCharCode(0x00fb);	// û - Lower case u with circumflex
		case 151:
			return String.fromCharCode(0x00f9);	// ù - Lower case u with grave
		case 152:
			return String.fromCharCode(0x00ff);	// ÿ - Lower case y with diaeresis
		case 153:
			return String.fromCharCode(0x00d6);	// Ö - Upper case O with diaeresis
		case 154:
			return String.fromCharCode(0x00dc);	// Ü - Upper case U with diaeresis
		case 155:
			return String.fromCharCode(0x00a2);	// Cent sign
		case 156:
			return String.fromCharCode(0x00a3);	// £ - Pound sign
		case 157:
			return String.fromCharCode(0x00a5);	// Yen sign
		case 158:
			return String.fromCharCode(0x20a7);	// Peseta sign
		case 159:
			return String.fromCharCode(0x0192);	// ƒ - Lower case f with hook
		case 160:
			return String.fromCharCode(0x00e1);	// á - Lower case a with acute
		case 161:
			return String.fromCharCode(0x00ed);	// í - Lower case i with acute
		case 162:
			return String.fromCharCode(0x00f3);	// ó - Lower case o with acute
		case 163:
			return String.fromCharCode(0x00fa);	// ú - Lower case u with acute
		case 164:
			return String.fromCharCode(0x00f1);	// ñ - Lower case n with tilde
		case 165:
			return String.fromCharCode(0x00d1);	// Ñ - Upper case N with tilde
		case 166:
			return String.fromCharCode(0x00aa);	// ª - Feminine ordinal indicator
		case 167:
			return String.fromCharCode(0x00ba);	// º - Masculine ordinal indicator
		case 168:
			return String.fromCharCode(0x00bf);	// ¿ - Inverted question mark
		case 169:
			return String.fromCharCode(0x2310);	// Reversed not sign
		case 170:
			return String.fromCharCode(0x00ac);	// Not sign
		case 171:
			return String.fromCharCode(0x00bd);	// ½ - Vulgar fraction one half
		case 172:
			return String.fromCharCode(0x00bc);	// ¼ - Vulgar fraction one quarter
		case 173:
			return String.fromCharCode(0x00a1);	// ¡ - Inverted exclamation mark
		case 174:
			return String.fromCharCode(0x00ab);	// « - Left-pointing double angle quotation mark
		case 175:
			return String.fromCharCode(0x00bb);	// » - Right-pointing double angle quotation mark
		case 176:
			return String.fromCharCode(0x2591);	// ░ - Light shade
		case 177:
			return String.fromCharCode(0x2592);	// ▒ - Medium shade
		case 178:
			return String.fromCharCode(0x2593);	// ▓ - Dark shade
		case 179:
			return String.fromCharCode(0x2502);	// │ - Box drawings light vertical
		case 180:
			return String.fromCharCode(0x2524);	// ┤ - Box drawings light vertical and left
		case 181:
			return String.fromCharCode(0x2561);	// Box drawings vertical single and left double
		case 182:
			return String.fromCharCode(0x2562);	// Box drawings vertical double and left single
		case 183:
			return String.fromCharCode(0x2556);	// Box drawings down double and left single
		case 184:
			return String.fromCharCode(0x2555);	// Box drawings down single and left double
		case 185:
			return String.fromCharCode(0x2563);	// ╣ - Box drawings double vertical and left
		case 186:
			return String.fromCharCode(0x2551);	// ║ - Box drawings double vertical
		case 187:
			return String.fromCharCode(0x2557);	// ╗ - Box drawings double down and left
		case 188:
			return String.fromCharCode(0x255d);	// ╝ - Box drawings up single and left double
		case 189:
			return String.fromCharCode(0x255c);	// Box drawings double up and left
		case 190:
			return String.fromCharCode(0x255b);	// Box drawings up double and left single
		case 191:
			return String.fromCharCode(0x2510);	// ┐ - Box drawings light down and left
		case 192:
			return String.fromCharCode(0x2514);	// └ - Box drawings light up and right
		case 193:
			return String.fromCharCode(0x2534);	// ┴ - Box drawings light up and horizontal
		case 194:
			return String.fromCharCode(0x252c);	// ┬ - Box drawings light down and horizontal
		case 195:
			return String.fromCharCode(0x251c);	// ├ - Box drawings light vertical and right
		case 196:
			return String.fromCharCode(0x2500);	// ─ - Box drawings light horizontal
		case 197:
			return String.fromCharCode(0x253c);	// ┼ - Box drawings light vertical and horizontal
		case 198:
			return String.fromCharCode(0x255e);	// Box drawings vertical single and right double
		case 199:
			return String.fromCharCode(0x255f);	// Box drawings vertical double and right single
		case 200:
			return String.fromCharCode(0x255a);	// ╚ - Box drawings double up and right
		case 201:
			return String.fromCharCode(0x2554);	// ╔ - Box drawings double down and right
		case 202:
			return String.fromCharCode(0x2569);	// ╩ - Box drawings double up and horizontal
		case 203:
			return String.fromCharCode(0x2566);	// ╦ - Box drawings double down and horizontal
		case 204:
			return String.fromCharCode(0x2560);	// ╠ - Box drawings double vertical and right
		case 205:
			return String.fromCharCode(0x2550);	// ═ - Box drawings double horizontal
		case 206:
			return String.fromCharCode(0x256c);	// ╬ - Box drawings double vertical and horizontal
		case 207:
			return String.fromCharCode(0x2567);	// Box drawings up single and horizontal double
		case 208:
			return String.fromCharCode(0x2568);	// Box drawings up double and horizontal single
		case 209:
			return String.fromCharCode(0x2564);	// Box drawings down single and horizontal double
		case 210:
			return String.fromCharCode(0x2565);	// Box drawings down double and horizontal single
		case 211:
			return String.fromCharCode(0x2559);	// Box drawings up double and right single
		case 212:
			return String.fromCharCode(0x2558);	// Box drawings up single and right double
		case 213:
			return String.fromCharCode(0x2552);	// Box drawings down single and right double
		case 214:
			return String.fromCharCode(0x2553);	// Box drawings down double and right single
		case 215:
			return String.fromCharCode(0x256b);	// Box drawings vertical double and horizontal single
		case 216:
			return String.fromCharCode(0x256a);	// Box drawings vertical single and horizontal double
		case 217:
			return String.fromCharCode(0x2518);	// ┘ - Box drawings light up and lef
		case 218:
			return String.fromCharCode(0x250c);	// ┌ - Box drawings light down and righ
		case 219:
			return String.fromCharCode(0x2588);	// █ - Full block
		case 220:
			return String.fromCharCode(0x2584);	// ▄ - Lower half block
		case 221:
			return String.fromCharCode(0x258c);	// Left half block
		case 222:
			return String.fromCharCode(0x2590);	// Right half block
		case 223:
			return String.fromCharCode(0x2580);	// ▀ - Upper half block
		case 224:
			return String.fromCharCode(0x03b1);	// Greek lower case alpha
		case 225:
			return String.fromCharCode(0x00df);	// Lower case sharp s
		case 226:
			return String.fromCharCode(0x0393);	// Greek upper case letter gamma
		case 227:
			return String.fromCharCode(0x03c0);	// Greek lower case pi
		case 228:
			return String.fromCharCode(0x03a3);	// Greek upper case letter sigma
		case 229:
			return String.fromCharCode(0x03c3);	// Greek lower case sigma
		case 230:
			return String.fromCharCode(0x00b5);	// Micro sign
		case 231:
			return String.fromCharCode(0x03c4);	// Greek lower case tau
		case 232:
			return String.fromCharCode(0x03a6);	// Greek upper case letter phi
		case 233:
			return String.fromCharCode(0x0398);	// Greek upper case letter theta
		case 234:
			return String.fromCharCode(0x03a9);	// Greek upper case letter omega
		case 235:
			return String.fromCharCode(0x03b4);	// Greek lower case delta
		case 236:
			return String.fromCharCode(0x221e);	// Infinity
		case 237:
			return String.fromCharCode(0x03c6);	// Greek lower case phi
		case 238:
			return String.fromCharCode(0x03b5);	// Greek lower case epsilon
		case 239:
			return String.fromCharCode(0x2229);	// Intersection
		case 240:
			return String.fromCharCode(0x2261);	// Identical to
		case 241:
			return String.fromCharCode(0x00b1);	// Plus-minus sign
		case 242:
			return String.fromCharCode(0x2265);	// Greater-than or equal to
		case 243:
			return String.fromCharCode(0x2264);	// Less-than or equal to
		case 244:
			return String.fromCharCode(0x2320);	// Top half integral
		case 245:
			return String.fromCharCode(0x2321);	// Bottom half integral
		case 246:
			return String.fromCharCode(0x00f7);	// Division sign
		case 247:
			return String.fromCharCode(0x2248);	// Almost equal to
		case 248:
			return String.fromCharCode(0x00b0);	// Degree sign
		case 249:
			return String.fromCharCode(0x2219);	// Bullet operator
		case 250:
			return String.fromCharCode(0x00b7);	// Middle dot
		case 251:
			return String.fromCharCode(0x221a);	// Square root
		case 252:
			return String.fromCharCode(0x207f);	// Superscript lower case n
		case 253:
			return String.fromCharCode(0x00b2);	// Superscript two
		case 254:
			return String.fromCharCode(0x25a0);	// Black square
		case 255:
			return String.fromCharCode(0x00a0);	// No-break space
	}
	return c;
}
