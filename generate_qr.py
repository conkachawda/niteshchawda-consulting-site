"""
Generate the contact vCard QR code as a clean SVG for the website.
Run once: python generate_qr.py
Outputs assets/qr-contact.svg
"""
import qrcode
import qrcode.image.svg
from pathlib import Path

VCARD = """BEGIN:VCARD
VERSION:3.0
N:Chawda;Nitesh;;;
FN:Nitesh Chawda
ORG:Nitesh Chawda Consulting
TITLE:Principal
TEL;TYPE=CELL,VOICE:+61423610052
EMAIL;TYPE=INTERNET,WORK:contact@niteshchawda.consulting
EMAIL;TYPE=INTERNET,HOME:niteshchawda@hotmail.com
URL:https://niteshchawda.consulting
ADR;TYPE=WORK:;;9 Victoria Street;Box Hill;Victoria 3128;Australia
END:VCARD"""

qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=2,
)
qr.add_data(VCARD)
qr.make(fit=True)

# SvgPathImage gives the cleanest single-path SVG (no rect-per-module bloat)
img = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage)

out = Path(__file__).parent / "assets" / "qr-contact.svg"
img.save(str(out))
print(f"Wrote {out}")
print(f"vCard length: {len(VCARD)} chars, QR version: {qr.version}")
