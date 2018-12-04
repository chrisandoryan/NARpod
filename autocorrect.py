import re

patterns = {
    'output': r'System.out.print(ln|f)?\(.+\);',
    'input': r'(import java.util.(\*|Scanner);)(.|\n)+?(\w+\.next(Line|Int|Double)\(\);)',
    'floop': r'for\s*\(int \w+\s*=\s*\d;\s*\w\s*(<|>|<=|>=)\s*.+;\s*\w+(\+\+|\-\-)\)\s*{((.|\n)+?)}',
    'dwloop': r'do\s*{((.|\n)+?)}\s*while(.+?);',
    'wloop': r'while\((.+?)\)\s*{((.|\n)+?)}',
    'switchcase': r'switch\s*\(\w+\)\s*{(.|\n)+?case .+?:((.|\n)+?;)(.|\n)+?break;(.|\n)+?}',
    'if': r'if\s*\(.+\)\s*{((.|\n)+?)}',
    'declare_array': r'.+(\[\])? \w+?(\[\])?\s*=\s*new \w+\[.+?\];',
    'declare_arrlist': r'ArrayList\s*<.+?> .+?\s*=\s*new ArrayList\s*<(.+?)?>\((.+?)?\);',
    'declare_vector': r'Vector\s*<(.+?)> .+?\s*=\s*new Vector\s*<(.+?)?>\((.+?)?\);'
}

def checkOutputSyntax(ans):
    return re.search(patterns['output'], ans)

def checkInputSyntax(ans):
    return re.search(patterns['input'], ans)

def checkLoopingSyntax(ans):
    floop = re.search(patterns['floop'], ans)
    if floop is not None: 
        print floop.group()
        #return floop

    dwloop = re.search(patterns['dwloop'], ans)
    if dwloop is not None: 
        print dwloop.group()
        # return dwloop

    wloop = re.search(patterns['wloop'], ans)
    if wloop is not None: 
        print wloop.group()
        return wloop

def checkSelectionSyntax(ans):
    switch = re.search(patterns['switchcase'], ans)
    if switch is not None:
        print switch.group()
    ifselection = re.search(patterns['if'], ans)
    if ifselection is not None:
        print ifselection.group()

# def checkArrayDeclarationSyntax():

# def checkArrayUsageSyntax():

with open('JavaILevelUp_T108.java', 'r') as f:
    ans = f.read()

    result = checkOutputSyntax(ans)
    print result.group()

    result = checkInputSyntax(ans)
    print result.group(1)
    print result.group(4)

    result = checkLoopingSyntax(ans)
    result = checkSelectionSyntax(ans)