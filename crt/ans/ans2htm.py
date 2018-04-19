import sys
import os
import os.path
import codecs

if __name__ == "__main__":

    if len(sys.argv) < 1 or len(sys.argv[-1]) < 1 or os.path.basename(sys.argv[-1]).split(os.path.extsep)[-1].lower() != 'ans':
        print ("You have to indicate ANS pathname as parameter")
    jsvarname = 'ART_ANS'
    path = os.path.dirname(sys.argv[-1])
    htmpathname = os.path.join(path, str.join('.', os.path.basename(sys.argv[-1]).split(os.path.extsep)[:-1]) + '.htm')
    try:
        f = codecs.open(sys.argv[-1], 'rb', 'utf-8-sig')
        content = f.read()
    except:
        f = codecs.open(sys.argv[-1], 'rb', 'mbcs')
        content = f.read()
    f.close()
    newcontent = []
    lines = content.splitlines()
    artheight = max(25, len(lines))
    for r in range(len(lines) - 1):
        newcontent.append('"' + lines[r].replace('\"', '\\\"') + '\\r\\n" + \r\n')
    newcontent.append('"' + lines[-1].replace('\"', '\\\"') + '"')
    newfilecontent = 'var ' + jsvarname + ' = ' + str.join('', newcontent)

    htmlbuf = "<!DOCTYPE>"
    htmlbuf += "<html>"
    htmlbuf += "<head>"
    htmlbuf += "<title>ans2htm: %s</title>" % sys.argv[-1]
    htmlbuf += "<script src=\"js/crt.js\"></script>"
    htmlbuf += "<script src=\"js/437.js\"></script>"
    htmlbuf += "<script src=\"js/ansi.js\"></script>"	
    htmlbuf += "<script>%s</script>" % newfilecontent
    htmlbuf += "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/crt.css\"/>"
    htmlbuf += "</head>"
    htmlbuf += "<body>"
    htmlbuf += "<div id=\"crt\" class=\"crt\"></div>"
    htmlbuf += "<script>"
    htmlbuf += "var screen = new CRT('crt', 80, %i);" % artheight
    htmlbuf += "var ansi = new ANSI(screen);"
    htmlbuf += "screen.freeze = true;"
    htmlbuf += "ansi.stringArtWindow(0, 0, 80, %i, %s, true, true);" % (artheight, jsvarname)
    htmlbuf += "screen.gotoXY(0, 0);"
    htmlbuf += "screen.invalidate();"
    htmlbuf += "screen.autoHeight();"
    htmlbuf += "</script>"
    htmlbuf += "</body>"
    htmlbuf += "</html>"
    
    f = codecs.open(htmpathname, 'wb', 'utf-8-sig')
    f.write(htmlbuf)
    f.close()
