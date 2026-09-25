"""Rebuild the local, dependency-free world SVG from Natural Earth 1:110m data.

Source: https://github.com/nvkelso/natural-earth-vector
License: public domain; https://www.naturalearthdata.com/about/terms-of-use/
The map uses an equirectangular projection and omits Antarctica.
"""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent
URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
source = ROOT / "natural-earth-countries-110m.geojson"
data = source.read_bytes() if source.exists() else urlopen(URL).read()
features = json.loads(data)["features"]

def project(point):
    longitude, latitude = point[:2]
    return (500 + longitude * 2.55, 239 - latitude * 2.55)

def path_for(geometry):
    polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    paths = []
    for polygon in polygons:
        for ring in polygon:
            points = [project(point) for point in ring]
            paths.append("M" + "L".join(f"{x:.2f},{y:.2f}" for x, y in points) + "Z")
    return "".join(paths)

svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 430" aria-hidden="true" focusable="false">',
    '<!-- Made with Natural Earth. Public domain. Equirectangular projection; Antarctica omitted. -->',
    '<g class="global-map-land" fill="#102f42" stroke="#c9a86a" stroke-opacity=".34" stroke-width=".65" stroke-linejoin="round">',
]
for feature in features:
    code = feature["properties"]["ADM0_A3"]
    if code == "ATA":
        continue
    svg.append(f'<path data-country="{code}" d="{path_for(feature["geometry"])}"/>')
svg.extend(['</g>', '</svg>'])
(ROOT / "world-outline.svg").write_text("\n".join(svg), encoding="utf-8")
(ROOT / "CREDITS.md").write_text(
    "# World map source\n\n"
    "Made with Natural Earth. The geographic outlines derive from the public-domain "
    "Natural Earth 1:110m admin-0 countries dataset.\n\n"
    f"- Source: {URL}\n"
    "- Repository: https://github.com/nvkelso/natural-earth-vector\n"
    "- Terms: https://www.naturalearthdata.com/about/terms-of-use/\n"
    f"- Download SHA-256: `{hashlib.sha256(data).hexdigest()}`\n"
    "- Downloaded: 2026-09-25\n"
    "- Rendering: equirectangular projection, Antarctica omitted, coordinates rounded to two SVG decimal places.\n"
    "- Rebuild: `python assets/maps/build_world.py` from the repository root.\n\n"
    "Engagement markers and client associations are supplied by Nitesh Chawda. "
    "Country/region markers represent the engagement footprint rather than corporate headquarters. "
    "Europe is a regional marker and does not claim an engagement in each European country.\n",
    encoding="utf-8",
)
print(f"Wrote world-outline.svg ({(ROOT / 'world-outline.svg').stat().st_size:,} bytes)")
