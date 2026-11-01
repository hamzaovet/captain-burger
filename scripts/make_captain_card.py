# -*- coding: utf-8 -*-
"""
Generate the Official Luxury Promo Card for Captain Burger (كابتن برجر)
Zero emoji squares, 100% proper Arabic typography without bidi flips.
"""
import os
import qrcode
import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFont

def ar(text):
    if not text:
        return ""
    # Strip any potential emoji or special symbols that Tahoma font cannot render
    clean = text.replace("🔥", "").replace("🍔", "").replace("📱", "").replace("🛵", "").replace("👑", "").replace("⚡", "").replace("🎫", "").strip()
    reshaped = arabic_reshaper.reshape(clean)
    return get_display(reshaped)

# Target Paths
brain_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"
burger_public = r"d:\Work\orca-burger\public"

# Generate QR Codes
web_url = "https://captain-burger.vercel.app"
apk_url = "https://captain-burger.vercel.app/download"

qr_web_obj = qrcode.QRCode(box_size=10, border=1)
qr_web_obj.add_data(web_url)
qr_web_obj.make(fit=True)
img_web_qr = qr_web_obj.make_image(fill_color="#502314", back_color="white")

qr_apk_obj = qrcode.QRCode(box_size=10, border=1)
qr_apk_obj.add_data(apk_url)
qr_apk_obj.make(fit=True)
img_apk_qr = qr_apk_obj.make_image(fill_color="#502314", back_color="white")

img_web_qr.save(os.path.join(brain_dir, "captain-web-qr.png"))
img_apk_qr.save(os.path.join(brain_dir, "captain-apk-qr.png"))
img_web_qr.save(os.path.join(burger_public, "captain-web-qr.png"))
img_apk_qr.save(os.path.join(burger_public, "captain-apk-qr.png"))

# Card Dimensions (1000 x 1280)
W = 1000
H = 1280

# Base Sesame Cream Canvas (#F5EBDC)
card = Image.new("RGBA", (W, H), (245, 235, 220, 255))
draw = ImageDraw.Draw(card)

# Outer Borders & Inner Frame
draw.rectangle([0, 0, W - 1, H - 1], outline="#502314", width=12)
draw.rectangle([20, 20, W - 21, H - 21], outline="#D62300", width=4)

# Top Header Brand Bar (#502314)
draw.rectangle([24, 24, W - 25, 210], fill="#502314")

# Load and paste logo
logo_path = os.path.join(burger_public, "logo.png")
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA").resize((160, 160))
    card.paste(logo, (W // 2 - 80, 36), logo)

# Fonts
font_title_ar = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 36)
font_title_en = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 32)
font_sub_ar   = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 22)
font_banner   = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 18)
font_panel_h  = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 22)
font_panel_sub= ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 16)
font_panel_desc= ImageFont.truetype("C:/Windows/Fonts/tahoma.ttf", 14)
font_pill     = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 16)
font_footer   = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 17)

# Main Title under header: Drawn in 3 parts so English and Arabic never flip each other
draw.text((W // 2 - 160, 245), ar("كابتن برجر"), font=font_title_ar, fill="#502314", anchor="mm")
draw.text((W // 2, 245), "•", font=font_title_ar, fill="#D62300", anchor="mm")
draw.text((W // 2 + 160, 245), "CAPTAIN BRGR", font=font_title_en, fill="#502314", anchor="mm")

draw.text((W // 2, 288), ar("طعم البرجر الأصلي • برجر لحم مشوي عالفحم ودجاج كرسبي"), font=font_sub_ar, fill="#D62300", anchor="mm")
draw.text((W // 2, 322), ar("فروعنا: الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد / وصلة دهشور)"), font=font_panel_desc, fill="#6B4226", anchor="mm")

# Flame Promo Banner Pill
banner_y = 355
draw.rounded_rectangle([60, banner_y, W - 60, banner_y + 46], radius=23, fill="#D62300", outline="#502314", width=2)
draw.text((W // 2, banner_y + 23), ar("اطلب أونلاين الآن أو حمّل تطبيق الأندرويد واستمتع بعروض وخصومات الكابتن!"), font=font_banner, fill="#FFFFFF", anchor="mm")

# Dual QR Panels (Side by Side)
panel_w = 410
panel_h = 570
panel_y = 425

# Left Panel: Android App APK
panel_left_x = 65
draw.rounded_rectangle([panel_left_x, panel_y, panel_left_x + panel_w, panel_y + panel_h], radius=24, fill="#FFFFFF", outline="#502314", width=3)
# Panel Header
draw.rounded_rectangle([panel_left_x + 3, panel_y + 3, panel_left_x + panel_w - 3, panel_y + 55], radius=20, fill="#D62300")
draw.text((panel_left_x + panel_w // 2, panel_y + 28), ar("تطبيق الأندرويد الرسمي"), font=font_panel_h, fill="#FFFFFF", anchor="mm")

# QR Box
qr_box_size = 230
qr_x1 = panel_left_x + (panel_w - qr_box_size) // 2
qr_y1 = panel_y + 80
draw.rounded_rectangle([qr_x1 - 10, qr_y1 - 10, qr_x1 + qr_box_size + 10, qr_y1 + qr_box_size + 10], radius=16, fill="#F5EBDC", outline="#502314", width=2)
img_apk_resized = img_apk_qr.resize((qr_box_size, qr_box_size))
card.paste(img_apk_resized, (qr_x1, qr_y1))

draw.text((panel_left_x + panel_w // 2, qr_y1 + qr_box_size + 30), ar("امسح الكود لتثبيت التطبيق مباشرة"), font=font_panel_sub, fill="#502314", anchor="mm")
draw.text((panel_left_x + panel_w // 2, qr_y1 + qr_box_size + 56), ar("ملف أصلي وخفيف • تتبع لحظي وتنبيهات فورية"), font=font_panel_desc, fill="#6B4226", anchor="mm")

# Action Pill
pill_y1 = panel_y + panel_h - 60
draw.rounded_rectangle([panel_left_x + 30, pill_y1, panel_left_x + panel_w - 30, pill_y1 + 42], radius=21, fill="#D62300")
draw.text((panel_left_x + panel_w // 2, pill_y1 + 21), ar("حمّل التطبيق الآن"), font=font_pill, fill="#FFFFFF", anchor="mm")

# Right Panel: Web Storefront
panel_right_x = W - 65 - panel_w
draw.rounded_rectangle([panel_right_x, panel_y, panel_right_x + panel_w, panel_y + panel_h], radius=24, fill="#FFFFFF", outline="#502314", width=3)
# Panel Header
draw.rounded_rectangle([panel_right_x + 3, panel_y + 3, panel_right_x + panel_w - 3, panel_y + 55], radius=20, fill="#502314")
draw.text((panel_right_x + panel_w // 2, panel_y + 28), ar("المتجر الإلكتروني السريع"), font=font_panel_h, fill="#FFFFFF", anchor="mm")

# QR Box
qr_x2 = panel_right_x + (panel_w - qr_box_size) // 2
qr_y2 = panel_y + 80
draw.rounded_rectangle([qr_x2 - 10, qr_y2 - 10, qr_x2 + qr_box_size + 10, qr_y2 + qr_box_size + 10], radius=16, fill="#F5EBDC", outline="#502314", width=2)
img_web_resized = img_web_qr.resize((qr_box_size, qr_box_size))
card.paste(img_web_resized, (qr_x2, qr_y2))

draw.text((panel_right_x + panel_w // 2, qr_y2 + qr_box_size + 30), ar("امسح الكود للطلب أونلاين فوراً"), font=font_panel_sub, fill="#502314", anchor="mm")
draw.text((panel_right_x + panel_w // 2, qr_y2 + qr_box_size + 56), ar("دليفري وتيك أواي وصالة لكافة المناطق"), font=font_panel_desc, fill="#6B4226", anchor="mm")

# Action Pill
draw.rounded_rectangle([panel_right_x + 30, pill_y1, panel_right_x + panel_w - 30, pill_y1 + 42], radius=21, fill="#502314")
draw.text((panel_right_x + panel_w // 2, pill_y1 + 21), ar("تصفح المنيو واطلب"), font=font_pill, fill="#FFFFFF", anchor="mm")

# Hotline & Delivery Footer Bar
footer_y = H - 240
draw.rounded_rectangle([60, footer_y, W - 60, footer_y + 120], radius=20, fill="#FFFFFF", outline="#502314", width=2)
draw.text((W // 2, footer_y + 30), ar("الخط الساخن والطلبات: 01206002168 | 01117776349 | 01018804888"), font=font_footer, fill="#502314", anchor="mm")
draw.text((W // 2, footer_y + 64), ar("خدمة توصيل سريعة لكافة أحياء الشيخ زايد و 6 أكتوبر • يومياً 12 ظهراً حتى 3 صباحاً"), font=font_panel_desc, fill="#6B4226", anchor="mm")
draw.text((W // 2, footer_y + 94), "https://captain-burger.vercel.app", font=font_panel_desc, fill="#D62300", anchor="mm")

# Subtle Dev Credit Bar
draw.text((W // 2, H - 45), ar("تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية"), font=font_panel_desc, fill="#8C6E56", anchor="mm")

# Save Cards
card.save(os.path.join(brain_dir, "captain-official-card.png"))
card.save(os.path.join(burger_public, "captain-official-card.png"))
print("[SUCCESS] Captain Burger Official Card generated perfectly!")
