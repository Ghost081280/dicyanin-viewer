# Dicyanin Viewer

A web-based camera filter that replicates the optical properties of Dr. Walter Kilner's dicyanin screens from 1911. See the world through the same lens that sparked over a century of paranormal speculation.

**[Try it live](https://ghost081280.github.io/dicyaninviewer/)**

---

## What Are Dicyanin Goggles?

In 1911, Dr. Walter J. Kilner, a British physician at St. Thomas Hospital in London, published "The Human Atmosphere" — one of the first Western medical studies proposing that the human aura could be made visible through chemical screens.

Kilner created glass slides treated with dicyanin, a synthetic blue coal-tar dye originally used for infrared sensitization of photographic plates. He claimed these screens allowed observers to perceive "auric formations" he called the Etheric Double, the Inner Aura, and the Outer Aura, extending several inches from patients' bodies.

The goggles gained renewed internet fame due to viral claims that military pilots using dicyanin-based night vision reported seeing "demons," leading to the technology being banned. While these specific claims are unverified folklore, the optical properties of dicyanin are well-documented in scientific literature.

---

## Our Research

We analyzed primary sources to replicate the authentic spectral characteristics of dicyanin dye:

### Primary Sources

1. **Bureau of Standards Bulletin (1917)**
   - "Application of Dicyanin to the Photography of Stellar Spectra" by Paul W. Merrill
   - Published in Bulletin of the Bureau of Standards, Vol. 14, No. 4, pp. 487-505

2. **Kilner's Original Work (1911)**
   - "The Human Atmosphere, or The Aura Made Visible by the Aid of Chemical Screens"
   - Reissued in 1920 as "The Human Aura"

3. **Spectral Analysis Documentation**
   - Various chemical and photographic references on cyanine dye properties
   - Kook Science archive of Kilner screen construction

### Key Scientific Finding

The critical discovery that informed our filter:

> "Tests on the dicyanin screens show that they almost fully cut out the light in the middle of the visible spectrum, letting through only the double image of the red and blue ends of the spectrum."

This means dicyanin does NOT simply block red light — it creates a **gap in the middle of the spectrum**, passing both blue/violet AND deep red/near-infrared while blocking green and yellow almost completely.

### Additional Findings

- Kilner used TWO types of screens: a dark blue dicyanin screen and a red/carmine screen
- Dicyanin was described as a "synthetic blue quinoline dye of the cyanine type derived from coal tar"
- The screens were very dark — Kilner noted that "dim light (not complete darkness)" was optimal for viewing
- Prolonged use "had a very deleterious effect upon our eyes, making them very painful"
- Oscar Bagnall later recommended pinacyanol as a substitute
- Carl Edwin Lindgren stated that cobalt blue and purple glass may be substituted for the original dyes

---

## The Formula

Based on spectral analysis of dicyanin dye, here are the transmission coefficients we implemented:

```
DICYANIN SPECTRAL TRANSMISSION
================================

Wavelength Range          Transmission    Implementation
---------------------------------------------------------
Blue/Violet (380-500nm)   ~95%           Blue channel: 0.95
Green (500-570nm)         ~5%            Green channel: 0.05
Yellow (570-590nm)        ~5%            (blocked via green)
Deep Red/IR (650nm+)      ~25%           Red channel: 0.25

Additional Processing:
- Darkness factor: 0.55 (screens were very dark)
- Violet mix: 0.18 (red bleeding into blue creates purple)
- Contrast boost: 1.2x (enhances edge visibility)
```

### Why This Creates the "Aura" Effect

The "auras" reported by Kilner and his subjects were likely caused by:

1. **Optical afterimages** — staring through dark filters creates retinal fatigue
2. **Edge contrast enhancement** — the spectral gap increases perceived boundaries between light and dark areas
3. **Luminance artifacts** — the eye struggles to process the unusual color balance, creating perceived halos
4. **Chromatic aberration** — the blue+red without green combination produces optical interference effects

The British Medical Journal's 1912 review concluded that Kilner's auras were "artifacts of the observer's own optic process rather than reflective of any emanation being produced by the subject."

---

## Technical Implementation

### Color Transformation

```javascript
// Dicyanin spectral filtering
filteredR = r * 0.25;                           // Partial red transmission
filteredG = g * 0.05;                           // Green almost fully blocked
filteredB = (b * 0.95) + (r * 0.18);           // Blue passes + violet shift

// Apply darkness (Kilner screens were very dark)
filteredR *= 0.55;
filteredG *= 0.55;
filteredB *= 0.55;

// Contrast enhancement for edge visibility
filteredR = ((filteredR - 128) * 1.2) + 128;
filteredG = ((filteredG - 128) * 1.2) + 128;
filteredB = ((filteredB - 128) * 1.2) + 128;
```

### Features

- Real-time camera processing using Canvas API
- Adjustable filter intensity (0-100%)
- Front/rear camera switching
- Image capture with "DICYANIN FILTER ACTIVATED" watermark
- Direct sharing to X (Twitter)
- Mobile-optimized with camera roll save support
- Works offline once loaded
- No server required — runs entirely in browser

---

## Usage

### Online
Visit the live demo and allow camera access.

### Self-Hosted
1. Clone or download this repository
2. Serve the files from any web server (or GitHub Pages)
3. Open in a mobile or desktop browser
4. Allow camera permissions

### Controls
- **Intensity Slider** — Adjust filter strength from subtle to full authentic darkness
- **Flip** — Switch between front and rear cameras
- **Capture** — Take a photo with the filter applied and watermark
- **Share** — Share the app link directly to X
- **Tap Screen** — Toggle filter on/off for comparison

---

## File Structure

```
dicyanin-viewer/
├── index.html      # Main HTML structure
├── style.css       # Dark theme UI styling
├── app.js          # Camera handling and filter processing
└── README.md       # This file
```

---

## Deploy to GitHub Pages

1. Create a new repository
2. Upload `index.html`, `style.css`, and `app.js`
3. Go to Settings → Pages
4. Source: Deploy from branch → main → root
5. Your site will be live at `https://[username].github.io/[repo-name]`

---

## Historical Context

### Timeline

- **1908** — Kilner begins experimenting with dicyanin screens
- **1911** — "The Human Atmosphere" published
- **1912** — British Medical Journal publishes critical review
- **1917** — Bureau of Standards documents dicyanin spectral properties for astronomical use
- **1920** — Revised edition published as "The Human Aura"; Kilner dies
- **1937** — Oscar Bagnall publishes "The Origin and Properties of the Human Aura"
- **1970s** — Kilner goggles still advertised in esoteric periodicals
- **2020s** — Viral TikTok claims about "demon-seeing goggles" renew public interest

### Scientific Reception

The scientific community largely dismissed Kilner's claims. The British Medical Journal concluded that "Dr. Kilner has failed to convince us that his 'aura' is more real than Macbeth's visionary dagger."

However, the optical properties of dicyanin dye are well-documented and were used legitimately in infrared photography and astronomical spectroscopy throughout the early 20th century.

---

## Disclaimer

This application replicates the optical filtering properties of dicyanin dye for entertainment and educational purposes. We make no claims about the existence of auras, supernatural phenomena, or the ability to detect demons.

The "aura" effects visible through this filter are optical artifacts produced by the unusual spectral transmission characteristics, not evidence of paranormal activity.

That said — point it at your friends and family. You might be surprised what you see.

---

## References

1. Kilner, W.J. (1911). *The Human Atmosphere, or The Aura Made Visible by the Aid of Chemical Screens*. Rebman Company.

2. Merrill, P.W. (1917). "Application of Dicyanin to the Photography of Stellar Spectra." *Bulletin of the Bureau of Standards*, 14(4), 487-505.

3. Bagnall, O. (1937). *The Origin and Properties of the Human Aura*. Kegan Paul.

4. "Walter John Kilner." *Wikipedia*. Retrieved 2025.

5. "Dicyanin Dye." *Kook Science*. Retrieved 2025.

---

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Built with science. Inspired by mystery.**
