import os
import re

p1 = re.compile(r'(window|globalThis|self|top|parent)\.fetch\s*=')
p2 = re.compile(r'Object\.defineProperty\([^,]+,\s*[\'\"`]fetch[\'\"`]')
p3 = re.compile(r'(?<![a-zA-Z0-9_$])fetch\s*=\s*')

for root, dirs, files in os.walk('.'):
    if '.git' in dirs: dirs.remove('.git')
    for f in files:
        if f.endswith(('.js', '.mjs', '.cjs', '.ts', '.tsx', '.html')):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    for m in p1.finditer(content):
                        print('P1 (window.fetch=):', path, content[max(0, m.start()-40):m.end()+40].replace('\n', ' '))
                    for m in p2.finditer(content):
                        print('P2 (defineProperty fetch):', path, content[max(0, m.start()-40):m.end()+40].replace('\n', ' '))
            except Exception as e:
                pass
