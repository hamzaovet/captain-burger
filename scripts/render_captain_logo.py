import os
import math
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

def ar(text):
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

def create_captain_logo(size=512):
    # Canvas with alpha
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size // 2
    r_outer = int(size * 0.46)
    r_inner = int(size * 0.43)

    # 1. Outer Dark BBQ Ring (#502314)
    draw.ellipse(
        [center - r_outer, center - r_outer, center + r_outer, center + r_outer],
        fill="#F5EBDC",
        outline="#502314",
        width=int(size * 0.025),
    )

    # 2. Inner Decorative Stitch Line (#D62300)
    draw.ellipse(
        [center - r_inner, center - r_inner, center + r_inner, center + r_inner],
        outline="#D62300",
        width=int(size * 0.008),
    )

    # 3. Draw Burger Components (Top Bun, Seeds, Cheese, Patty, Bottom Bun)
    burger_center_y = int(size * 0.36)

    # Top Bun (Warm Golden Brioche #ED7A1C)
    bun_w = int(size * 0.46)
    bun_h = int(size * 0.18)
    top_bun_box = [
        center - bun_w // 2,
        burger_center_y - bun_h,
        center + bun_w // 2,
        burger_center_y + int(bun_h * 0.3),
    ]
    draw.chord(top_bun_box, 180, 0, fill="#ED7A1C", outline="#502314", width=int(size * 0.012))

    # Sesame Seeds (White/Cream specks)
    seed_r = int(size * 0.009)
    seed_offsets = [
        (-int(bun_w * 0.25), -int(bun_h * 0.35)),
        (-int(bun_w * 0.1), -int(bun_h * 0.65)),
        (0, -int(bun_h * 0.4)),
        (int(bun_w * 0.15), -int(bun_h * 0.6)),
        (int(bun_w * 0.28), -int(bun_h * 0.3)),
    ]
    for dx, dy in seed_offsets:
        sx = center + dx
        sy = burger_center_y + dy
        draw.ellipse([sx - seed_r, sy - seed_r // 2, sx + seed_r, sy + seed_r // 2], fill="#FFF5EA")

    # Melted Cheddar Layer (#FFAE00)
    cheese_y = burger_center_y + int(size * 0.015)
    cheese_poly = [
        (center - bun_w // 2 - int(size * 0.02), cheese_y),
        (center + bun_w // 2 + int(size * 0.02), cheese_y),
        (center + int(bun_w * 0.35), cheese_y + int(size * 0.06)),
        (center + int(bun_w * 0.1), cheese_y + int(size * 0.03)),
        (center - int(bun_w * 0.1), cheese_y + int(size * 0.07)),
        (center - int(bun_w * 0.35), cheese_y + int(size * 0.02)),
    ]
    draw.polygon(cheese_poly, fill="#FFAE00", outline="#502314")

    # Beef Patty (Dark Flame Grilled #3A140A)
    patty_y = cheese_y + int(size * 0.035)
    patty_h = int(size * 0.075)
    draw.rounded_rectangle(
        [center - bun_w // 2, patty_y, center + bun_w // 2, patty_y + patty_h],
        radius=int(size * 0.025),
        fill="#3A140A",
        outline="#502314",
        width=int(size * 0.012),
    )

    # Bottom Bun (#ED7A1C)
    bot_y = patty_y + patty_h
    bot_h = int(size * 0.05)
    draw.rounded_rectangle(
        [center - int(bun_w * 0.44), bot_y, center + int(bun_w * 0.44), bot_y + bot_h],
        radius=int(size * 0.02),
        fill="#ED7A1C",
        outline="#502314",
        width=int(size * 0.012),
    )

    # 4. CAPTAIN BRGR Ribbon Banner (Fiery Flame Red #D62300)
    ribbon_w = int(size * 0.62)
    ribbon_h = int(size * 0.09)
    ribbon_y = bot_y + bot_h + int(size * 0.025)
    draw.rounded_rectangle(
        [center - ribbon_w // 2, ribbon_y, center + ribbon_w // 2, ribbon_y + ribbon_h],
        radius=int(size * 0.02),
        fill="#D62300",
        outline="#502314",
        width=int(size * 0.012),
    )

    # Ribbon Text
    font_en = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", int(size * 0.052))
    draw.text((center, ribbon_y + ribbon_h // 2), "CAPTAIN BRGR", font=font_en, fill="#FFFFFF", anchor="mm")

    # 5. Arabic Calligraphy: كابتن برجر
    font_ar = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", int(size * 0.072))
    ar_text = ar("كابتن برجر")
    draw.text((center, ribbon_y + ribbon_h + int(size * 0.055)), ar_text, font=font_ar, fill="#502314", anchor="mm")

    # 6. Stars Subtitle
    font_sub = ImageFont.truetype("C:/Windows/Fonts/tahoma.ttf", int(size * 0.026))
    sub_text = ar("★ برجر لحم مشوي وفراخ مقرمشة ★")
    draw.text((center, ribbon_y + ribbon_h + int(size * 0.105)), sub_text, font=font_sub, fill="#D62300", anchor="mm")

    return img

def main():
    pub = "d:/Work/orca-burger/public"
    res = "d:/Work/orca-burger/android/app/src/main/res"

    print("[INFO] Rendering high-res Captain Burger logos...")
    logo_512 = create_captain_logo(512)
    logo_512.save(os.path.join(pub, "logo.png"))
    logo_512.save(os.path.join(pub, "app-icon.png"))
    
    # Save as JPG on warm white background
    jpg_canvas = Image.new("RGB", (512, 512), (245, 235, 220))
    jpg_canvas.paste(logo_512, (0, 0), logo_512)
    jpg_canvas.save(os.path.join(pub, "logo.jpg"), quality=95)
    print("[SUCCESS] Saved public/logo.png, public/logo.jpg, public/app-icon.png")

    # Android mipmap densities
    densities = {
        'mipmap-mdpi': (48, 108),
        'mipmap-hdpi': (72, 162),
        'mipmap-xhdpi': (96, 216),
        'mipmap-xxhdpi': (144, 324),
        'mipmap-xxxhdpi': (192, 432),
    }

    for folder, (icon_sz, fg_sz) in densities.items():
        out_dir = os.path.join(res, folder)
        os.makedirs(out_dir, exist_ok=True)

        # Square icon with rounded corners & Sesame cream base
        canvas = Image.new('RGBA', (icon_sz, icon_sz), (0, 0, 0, 0))
        draw = ImageDraw.Draw(canvas)
        corner_r = int(icon_sz * 0.22)
        draw.rounded_rectangle([0, 0, icon_sz - 1, icon_sz - 1], radius=corner_r, fill=(245, 235, 220, 255), outline=(214, 35, 0, 220), width=max(1, int(icon_sz * 0.03)))
        
        inner_sz = int(icon_sz * 0.88)
        padding = (icon_sz - inner_sz) // 2
        logo_res = logo_512.resize((inner_sz, inner_sz), Image.Resampling.LANCZOS)
        canvas.paste(logo_res, (padding, padding), logo_res)
        canvas.save(os.path.join(out_dir, 'ic_launcher.png'))

        # Round icon
        round_canvas = Image.new('RGBA', (icon_sz, icon_sz), (0, 0, 0, 0))
        round_draw = ImageDraw.Draw(round_canvas)
        round_draw.ellipse([0, 0, icon_sz - 1, icon_sz - 1], fill=(245, 235, 220, 255), outline=(214, 35, 0, 220), width=max(1, int(icon_sz * 0.03)))
        round_canvas.paste(logo_res, (padding, padding), logo_res)
        round_canvas.save(os.path.join(out_dir, 'ic_launcher_round.png'))

        # Foreground adaptive icon
        fg_canvas = Image.new('RGBA', (fg_sz, fg_sz), (0, 0, 0, 0))
        fg_logo_sz = int(fg_sz * 0.65)
        fg_logo = logo_512.resize((fg_logo_sz, fg_logo_sz), Image.Resampling.LANCZOS)
        fg_pos = ((fg_sz - fg_logo_sz) // 2, (fg_sz - fg_logo_sz) // 2)
        fg_canvas.paste(fg_logo, fg_pos, fg_logo)
        fg_canvas.save(os.path.join(out_dir, 'ic_launcher_foreground.png'))

    print("[SUCCESS] All Android mipmap launcher icons generated.")

    # Update splash screens
    for root, dirs, files in os.walk(res):
        if 'splash.png' in files:
            fpath = os.path.join(root, 'splash.png')
            orig = Image.open(fpath)
            w, h = orig.size
            # Create warm sesame cream canvas (#F5EBDC)
            splash = Image.new('RGBA', (w, h), (245, 235, 220, 255))
            logo_sz = min(w, h) // 2
            if logo_sz < 60: logo_sz = 60
            logo_res = logo_512.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
            pos = ((w - logo_sz) // 2, (h - logo_sz) // 2)
            splash.paste(logo_res, pos, logo_res)
            splash.save(fpath)
            print(f"Updated splash: {fpath} ({w}x{h})")

if __name__ == "__main__":
    main()
