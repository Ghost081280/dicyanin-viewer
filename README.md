# Dicyanin Viewer

[![Live Demo](https://img.shields.io/badge/🔴_LIVE-Try_Now-dc2626?style=for-the-badge)](https://ghost081280.github.io/dicyanin-viewer/)

![Version](https://img.shields.io/badge/version-2.0.0-8b7aff?style=flat-square)
[![License](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](LICENSE)
![Mobile Ready](https://img.shields.io/badge/mobile-ready-10b981?style=flat-square)

---

<p align="center">
  <img src="https://img.shields.io/badge/👁️-DICYANIN_FILTER_ACTIVATED-4a3aff?style=for-the-badge" alt="Dicyanin Filter"/>
</p>

<p align="center">
  <strong>A web-based camera filter that replicates the optical properties of Dr. Walter Kilner's dicyanin screens from 1911.</strong><br>
  See the world through the same lens that sparked over a century of paranormal speculation.
</p>

<p align="center">
  <a href="https://ghost081280.github.io/dicyanin-viewer/"><strong>👻 Try it live →</strong></a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎥 **Video Recording** | Record up to 30 seconds of filtered video with watermark |
| 📸 **Photo Capture** | Take instant photos with the filter applied |
| 🎚️ **Adjustable Intensity** | Fine-tune the filter from subtle to full authentic darkness |
| 🔄 **Camera Flip** | Switch between front and rear cameras |
| 📱 **Mobile Optimized** | Works on iOS and Android with camera roll save |
| 🐦 **Social Sharing** | Share directly to X (Twitter) and other platforms |
| ⚡ **No Server Required** | Runs entirely in browser, works offline |

---

## 🔬 What Are Dicyanin Goggles?

In **1911**, Dr. Walter J. Kilner, a British physician at St. Thomas Hospital in London, published *"The Human Atmosphere"* — one of the first Western medical studies proposing that the human aura could be made visible through chemical screens.

Kilner created glass slides treated with **dicyanin**, a synthetic blue coal-tar dye originally used for infrared sensitization of photographic plates. He claimed these screens allowed observers to perceive "auric formations" he called the *Etheric Double*, the *Inner Aura*, and the *Outer Aura*.

In **1928**, Harry Boddington patented an improved version called **"Aurospecs"** — wearable goggles with double glass lenses containing alcoholised dicyanin solution.

The goggles gained renewed internet fame due to viral claims that military pilots using dicyanin-based night vision reported seeing "demons," leading to the technology being banned. While these specific claims are unverified folklore, the optical properties of dicyanin are well-documented in scientific literature.

---

## 📜 Historical Timeline

| Year | Event |
|------|-------|
| 1908 | Kilner begins experimenting with dicyanin screens |
| 1911 | *"The Human Atmosphere"* published |
| 1912 | British Medical Journal publishes critical review |
| 1917 | Bureau of Standards documents dicyanin spectral properties |
| 1920 | Revised edition published as *"The Human Aura"*; Kilner dies |
| 1928 | **Aurospecs patented** by Harry Boddington |
| 1937 | Oscar Bagnall publishes *"The Origin and Properties of the Human Aura"* |
| 1970s | Kilner goggles still advertised in esoteric periodicals |
| 2020s | Viral TikTok claims about "demon-seeing goggles" renew public interest |

---

## 🔭 Our Research

We analyzed primary sources to replicate the **authentic spectral characteristics** of dicyanin dye:

### Primary Sources

| Source | Description |
|--------|-------------|
| **Bureau of Standards Bulletin (1917)** | "Application of Dicyanin to the Photography of Stellar Spectra" by Paul W. Merrill |
| **Kilner's Original Work (1911)** | "The Human Atmosphere, or The Aura Made Visible by the Aid of Chemical Screens" |
| **Aurospecs Patent (1928)** | Harry Boddington's improvement on Kilner screens |

### 🔑 Key Scientific Finding

> *"Tests on the dicyanin screens show that they almost fully cut out the light in the middle of the visible spectrum, letting through only the double image of the red and blue ends of the spectrum."*
> 
> — Bureau of Standards, 1917

This means dicyanin does **NOT** simply block red light — it creates a **gap in the middle of the spectrum**, passing both blue/violet AND deep red/near-infrared while blocking green and yellow almost completely.

---

## 🧪 The Formula

Based on spectral analysis of dicyanin dye, here are the transmission coefficients we implemented:

```
DICYANIN SPECTRAL TRANSMISSION
══════════════════════════════════════════════════════════

Wavelength Range          Transmission    Implementation
──────────────────────────────────────────────────────────
Blue/Violet (380-500nm)   ~95%           Blue channel: 0.95
Green (500-570nm)         ~5%            Green channel: 0.05
Yellow (570-590nm)        ~5%            (blocked via green)
Deep Red/IR (650nm+)      ~25%           Red channel: 0.25

Additional Processing:
──────────────────────────────────────────────────────────
Darkness factor           0.55           (screens were very dark)
Violet mix               0.18           (red → blue creates purple)
Contrast boost           1.2x           (enhances edge visibility)
```

### Color Transformation Code

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

---

## 👻 Why This Creates the "Aura" Effect

The "auras" reported by Kilner and his subjects were likely caused by:

| Effect | Explanation |
|--------|-------------|
| **Optical afterimages** | Staring through dark filters creates retinal fatigue |
| **Edge contrast enhancement** | The spectral gap increases perceived boundaries |
| **Luminance artifacts** | The eye struggles to process unusual color balance |
| **Chromatic aberration** | Blue+red without green produces optical interference |

The British Medical Journal's 1912 review concluded that Kilner's auras were *"artifacts of the observer's own optic process rather than reflective of any emanation being produced by the subject."*

---

## 📱 Usage

### Controls

| Control | Action |
|---------|--------|
| **Intensity Slider** | Adjust filter strength from subtle to full authentic darkness |
| **Flip** | Switch between front and rear cameras |
| **Photo** | Take a photo with the filter applied and watermark |
| **Record** | Record up to 30 seconds of video (tap again to stop) |
| **Share** | Share the app link directly to X |
| **Tap Screen** | Toggle filter on/off for comparison |

### Recording Videos

1. Tap the **Record** button to start recording
2. The red REC indicator shows recording time
3. Recording auto-stops at 30 seconds
4. Preview your video and save or share

---

## 🚀 Deploy Your Own

### GitHub Pages

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Source: Deploy from branch → `main` → root
4. Your site will be live at `https://[username].github.io/[repo-name]`

### Self-Hosted

```bash
# Clone the repository
git clone https://github.com/ghost081280/dicyanin-viewer.git

# Serve with any static server
npx serve dicyanin-viewer
# or
python -m http.server 8000
```

---

## 📁 File Structure

```
dicyanin-viewer/
├── index.html      # Main HTML structure
├── style.css       # Dark theme UI styling
├── app.js          # Camera handling, filter processing, video recording
└── README.md       # This file
```

---

## 🛠️ Technical Details

| Technology | Usage |
|------------|-------|
| **Canvas API** | Real-time pixel manipulation |
| **MediaRecorder API** | Video recording from canvas stream |
| **Web Share API** | Native sharing on mobile |
| **getUserMedia** | Camera access |

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full support |
| Safari (iOS) | ✅ Full support |
| Firefox | ✅ Full support |
| Samsung Internet | ✅ Full support |

---

## 📚 References

1. Kilner, W.J. (1911). *The Human Atmosphere, or The Aura Made Visible by the Aid of Chemical Screens*. Rebman Company.

2. Merrill, P.W. (1917). "Application of Dicyanin to the Photography of Stellar Spectra." *Bulletin of the Bureau of Standards*, 14(4), 487-505.

3. Boddington, H. (1931). *Aura. Kilner Screens. (Aurospecs) and All About Them*. London Psychic Educational Centre.

4. Bagnall, O. (1937). *The Origin and Properties of the Human Aura*. Kegan Paul.

5. Ruth, R.A. (2017). "The Secret of Seeing Charlie in the Dark." *Vulcan: The Journal of the History of Military Technology*.

---

## ⚠️ Disclaimer

This application replicates the optical filtering properties of dicyanin dye for **entertainment and educational purposes**. We make no claims about the existence of auras, supernatural phenomena, or the ability to detect demons.

The "aura" effects visible through this filter are optical artifacts produced by the unusual spectral transmission characteristics, not evidence of paranormal activity.

**That said — point it at your friends and family. You might be surprised what you see.**

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with science. Inspired by mystery.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/👁️_SEE_WHAT_OTHERS_CAN'T-4a3aff?style=for-the-badge" alt="See What Others Can't"/>
</p>
