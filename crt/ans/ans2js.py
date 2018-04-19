import sys
import os
import os.path
import codecs

if __name__ == "__main__":

    if len(sys.argv) < 1 or len(sys.argv[-1]) < 1 or os.path.basename(sys.argv[-1]).split(os.path.extsep)[-1].lower() != 'ans':
        print ("You have to indicate ANS pathname as parameter")
    jsvarname = str.join('_', os.path.basename(sys.argv[-1]).split(os.path.extsep)).upper()
    path = os.path.dirname(sys.argv[-1])
    jspathname = os.path.join(path, str.join('.', os.path.basename(sys.argv[-1]).split(os.path.extsep)[:-1]) + '.js')
    try:
        f = codecs.open(sys.argv[-1], 'rb', 'utf-8-sig')
        content = f.read()
    except:
        f = codecs.open(sys.argv[-1], 'rb', 'mbcs')
        content = f.read()
    f.close()
    newcontent = []
    lines = content.splitlines()
    for r in range(len(lines) - 1):
        newcontent.append('"' + lines[r].replace('\"', '\\\"') + '\\r\\n" + \r\n')
    newcontent.append('"' + lines[-1].replace('\"', '\\\"') + '"')
    newfilecontent = 'var ' + jsvarname + ' = ' + str.join('', newcontent)
    f = codecs.open(jspathname, 'wb', 'utf-8-sig')
    f.write(newfilecontent)
    f.close()
