# -*- coding: utf-8 -*-
"""
Generate the Official Luxury Promo Card for Captain Burger (كابتن برجر)
Replicating the proven dark-luxury aesthetic of the Wagba Official Card.
100% reliable Arabic typography (zero reversed text, zero emoji box bugs).
"""
import os
import qrcode
import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFont

def ar(text):
    if not text:
        return ""
    # Strip any emojis or special characters
    clean = text.replace("🔥", "").replace("🍔", "").replace("📱", "").replace("🛵", "").replace("👑", "").replace("⚡", "").replace("🎫", "").replace("🍗", "").replace("🍟", "").replace("🥩", "").strip()
    reshaped = arabic_reshaper.reshape(clean)
    return get_display(reshaped)

# Target Paths
brain_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"
burger_public = r"d:\Work\orca-burger\public"

# Active Vercel URLs
web_url = "https://captain-burger-five.vercel.app"
apk_url = "https://captain-burger-five.vercel.app/download"

# 1. Generate High-Res QR Codes
qr_web_obj = qrcode.QRCode(box_size=10, border=1)
qr_web_obj.add_data(web_url)
qr_web_obj.make(fit=True)
img_web_qr = qr_web_obj.make_image(fill_color="#140C07", back_color="white")

qr_apk_obj = qrcode.QRCode(box_size=10, border=1)
qr_apk_obj.add_data(apk_url)
qr_apk_obj.make(fit=True)
img_apk_qr = qr_apk_obj.make_image(fill_color="#140C07", back_color="white")

img_web_qr.save(os.path.join(brain_dir, "captain-web-qr.png"))
img_apk_qr.save(os.path.join(brain_dir, "captain-apk-qr.png"))
img_web_qr.save(os.path.join(burger_public, "captain-web-qr.png"))
img_apk_qr.save(os.path.join(burger_public, "captain-apk-qr.png"))

# 2. Card Dimensions: 1000 x 1240 (Identical to luxury Wagba layout)
W = 1000
H = 1240

card = Image.new("RGBA", (W, H), (20, 12, 7, 255)) # Dark BBQ Chocolate #140C07
draw = ImageDraw.Draw(card)

# Outer Borders & Inner Gold Frame
draw.rounded_rectangle([18, 18, W - 18, H - 18], radius=24, outline="#FFAE00", width=3)
draw.rounded_rectangle([26, 26, W - 26, H - 26], radius=20, outline="#5C3B18", width=1)

# Top Circular Logo
logo_path = os.path.join(burger_public, "logo.png")
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA").resize((130, 130))
    # Draw circular background container with gold border
    draw.ellipse([W // 2 - 70, 35, W // 2 + 70, 175], fill="#FFFFFF", outline="#FFAE00", width=3)
    card.paste(logo, (W // 2 - 65, 40), logo)

# Fonts
font_en_top    = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 26)
font_ar_title  = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 34)
font_ar_sub    = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 17)
font_pill_txt  = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 15)
font_panel_hdr = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 21)
font_panel_sub = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 16)
font_panel_dsc = ImageFont.truetype("C:/Windows/Fonts/tahoma.ttf", 13)
font_url_pill  = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 15)
font_badge_pill= ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 13)
font_footer_dev= ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 15)
font_footer_en = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 13)
font_hotline   = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 16)
font_branch    = ImageFont.truetype("C:/Windows/Fonts/tahoma.ttf", 13)

# Header Section (Centered Clean Lines, Zero Arabic/English Mixing on Same Line)
y_offset = 195
# English Line
draw.text((W // 2, y_offset), "Captain BRGR • Gourmet Burgers & Crispy Chicken", font=font_en_top, fill="#FFAE00", anchor="mm")

# Arabic Title Line (100% Arabic)
y_offset += 45
draw.text((W // 2, y_offset), ar("مطعم كابتن برجر — طعم البرجر الأصلي"), font=font_ar_title, fill="#FFFFFF", anchor="mm")

# Arabic Subtitle Line
y_offset += 36
draw.text((W // 2, y_offset), ar("برجر لحم بلدي 100% مشوي عالفحم • دجاج كرسبي سوبر مقرمش • لودد فرايز"), font=font_ar_sub, fill="#D8BFA6", anchor="mm")

# Rounded Feature Pill Banner
y_offset += 32
banner_w = 860
banner_h = 42
banner_x1 = (W - banner_w) // 2
draw.rounded_rectangle([banner_x1, y_offset, banner_x1 + banner_w, y_offset + banner_h], radius=21, fill="#23150C", outline="#FFAE00", width=2)
draw.text((W // 2, y_offset + banner_h // 2), ar("منظومة رقمية متكاملة: منيو تفاعلي • كاشير سحابي POS • أسطول دليفري وتيك أواي • تتبع لحظي"), font=font_pill_txt, fill="#FFFFFF", anchor="mm")

# Dual Panels Section (Side-by-side like Wagba)
# Left: Web Storefront | Right: Official Android App
panel_y = y_offset + banner_h + 26
panel_w = 410
panel_h = 525

# RIGHT PANEL: Official Android App APK
panel_r_x = W - 65 - panel_w
draw.rounded_rectangle([panel_r_x, panel_y, panel_r_x + panel_w, panel_y + panel_h], radius=20, fill="#1B1009", outline="#6A451E", width=2)
# Header
draw.text((panel_r_x + panel_w // 2, panel_y + 32), ar("تطبيق الأندرويد الرسمي v1.0.0"), font=font_panel_hdr, fill="#FFAE00", anchor="mm")

# White QR Card
qr_size = 230
qr_x_r = panel_r_x + (panel_w - qr_size) // 2
qr_y = panel_y + 60
draw.rounded_rectangle([qr_x_r - 8, qr_y - 8, qr_x_r + qr_size + 8, qr_y + qr_size + 8], radius=16, fill="#FFFFFF")
img_apk_resized = img_apk_qr.resize((qr_size, qr_size))
card.paste(img_apk_resized, (qr_x_r, qr_y))

# Text under QR
text_y = qr_y + qr_size + 24
draw.text((panel_r_x + panel_w // 2, text_y), ar("امسح لتحميل ملف التطبيق APK مباشرة"), font=font_panel_sub, fill="#FFFFFF", anchor="mm")
draw.text((panel_r_x + panel_w // 2, text_y + 22), ar("تطبيق سريع وخفيف مصمم لكافة هواتف الأندرويد"), font=font_panel_dsc, fill="#A89485", anchor="mm")
draw.text((panel_r_x + panel_w // 2, text_y + 40), ar("إشعارات صوتية فورية وتجربة طلب سلسة بلمسة واحدة"), font=font_panel_dsc, fill="#A89485", anchor="mm")

# URL Pill
pill_w = 350
pill_h = 36
pill_x_r = panel_r_x + (panel_w - pill_w) // 2
pill_y = panel_y + panel_h - 90
draw.rounded_rectangle([pill_x_r, pill_y, pill_x_r + pill_w, pill_y + pill_h], radius=18, fill="#0F0804", outline="#FFAE00", width=2)
draw.text((panel_r_x + panel_w // 2, pill_y + pill_h // 2), "captain-burger-five.vercel.app/download", font=font_url_pill, fill="#FFAE00", anchor="mm")

# Badge Pill
badge_y = pill_y + pill_h + 8
draw.text((panel_r_x + panel_w // 2, badge_y + 12), ar("إصدار رسمي v1.0.0 • تحميل وتثبيت فوري"), font=font_badge_pill, fill="#25D366", anchor="mm")


# LEFT PANEL: Web Storefront
panel_l_x = 65
draw.rounded_rectangle([panel_l_x, panel_y, panel_l_x + panel_w, panel_y + panel_h], radius=20, fill="#1B1009", outline="#6A451E", width=2)
# Header
draw.text((panel_l_x + panel_w // 2, panel_y + 32), ar("المتجر الإلكتروني المباشر (Web)"), font=font_panel_hdr, fill="#FFAE00", anchor="mm")

# White QR Card
qr_x_l = panel_l_x + (panel_w - qr_size) // 2
draw.rounded_rectangle([qr_x_l - 8, qr_y - 8, qr_x_l + qr_size + 8, qr_y + qr_size + 8], radius=16, fill="#FFFFFF")
img_web_resized = img_web_qr.resize((qr_size, qr_size))
card.paste(img_web_resized, (qr_x_l, qr_y))

# Text under QR
draw.text((panel_l_x + panel_w // 2, text_y), ar("امسح الكاميرا للطلب أونلاين فوراً"), font=font_panel_sub, fill="#FFFFFF", anchor="mm")
draw.text((panel_l_x + panel_w // 2, text_y + 22), ar("يعمل على جميع الأجهزة (آيفون، أندرويد، كمبيوتر)"), font=font_panel_dsc, fill="#A89485", anchor="mm")
draw.text((panel_l_x + panel_w // 2, text_y + 40), ar("بدون تحميل مع اختيار دليفري أو تيك أواي أو صالة"), font=font_panel_dsc, fill="#A89485", anchor="mm")

# URL Pill
pill_x_l = panel_l_x + (panel_w - pill_w) // 2
draw.rounded_rectangle([pill_x_l, pill_y, pill_x_l + pill_w, pill_y + pill_h], radius=18, fill="#0F0804", outline="#FFAE00", width=2)
draw.text((panel_l_x + panel_w // 2, pill_y + pill_h // 2), "captain-burger-five.vercel.app", font=font_url_pill, fill="#FFAE00", anchor="mm")

# Badge Pill
draw.text((panel_l_x + panel_w // 2, badge_y + 12), ar("منيو تفاعلي • تتبع الطلب • عروض وخصومات حصرية"), font=font_badge_pill, fill="#25D366", anchor="mm")


# FOOTER SECTION (Centered Luxury Branding & Hotlines)
footer_base_y = panel_y + panel_h + 20

# Dev Credits
draw.text((W // 2, footer_base_y + 12), ar("تم تطوير وبرمجة النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية"), font=font_footer_dev, fill="#E6C280", anchor="mm")
draw.text((W // 2, footer_base_y + 32), "Orca Solutions • Enterprise Cloud & Mobile Systems", font=font_footer_en, fill="#A89485", anchor="mm")

# Hotline Pill
hl_pill_w = 640
hl_pill_h = 38
hl_pill_x = (W - hl_pill_w) // 2
hl_pill_y = footer_base_y + 48
draw.rounded_rectangle([hl_pill_x, hl_pill_y, hl_pill_x + hl_pill_w, hl_pill_y + hl_pill_h], radius=19, fill="#23150C", outline="#FFAE00", width=2)
draw.text((W // 2, hl_pill_y + hl_pill_h // 2), ar("هواتف الطلبات والدليفري: 01206002168 • 01117776349 • 01018804888"), font=font_hotline, fill="#FFFFFF", anchor="mm")

# Branch Address Line
draw.text((W // 2, hl_pill_y + hl_pill_h + 16), ar("فروع كابتن برجر: الشيخ زايد (الحي العاشر) — 6 أكتوبر (غرب سوميد / وصلة دهشور)"), font=font_branch, fill="#A89485", anchor="mm")

# Save outputs
card.save(os.path.join(brain_dir, "captain-official-card.png"))
card.save(os.path.join(burger_public, "captain-official-card.png"))
print("[SUCCESS] Captain Burger Luxury Official Card generated perfectly!")
