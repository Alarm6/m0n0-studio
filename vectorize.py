from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from pathlib import Path
import re

font = TTFont('C:/Windows/Fonts/arial.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 160 / font['head'].unitsPerEm
parts = []
for word, baseline in [('Этого уже',150),('недостаточно',310)]:
    x = 40
    for char in word:
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        parts.append(f'<path d="{pen.getCommands()}" transform="translate({x:.4f} {baseline}) scale({scale:.8f} {-scale:.8f})"/>')
        x += glyph.width * scale - 8
svg = '<svg class="zoom-type" viewBox="0 0 1400 420" role="img" aria-label="Этого уже недостаточно"><g fill="white">' + ''.join(parts) + '</g></svg>'
path = Path('dist/scroll-scene.js')
source = path.read_text(encoding='utf-8-sig')
source = re.sub(r"title.innerHTML = '.*?';", lambda _: 'title.innerHTML = '+repr(svg)+';', source, count=1)
path.write_text(source,encoding='utf-8')
assert '<text ' not in source
print('Created outline paths for all 14 letters')
