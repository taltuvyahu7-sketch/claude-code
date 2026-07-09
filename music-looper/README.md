# Loop Station 🎛️

A browser-based music looping tool. Record loops with your microphone, layer up to
4 synced tracks, shape each one with filters and effects, and jam over a built-in
drum machine. Everything runs locally in your browser with the Web Audio API — no
build step, no dependencies, no samples to download.

## Running it

Microphone access requires a secure context, so serve the folder over HTTP instead
of opening the file directly:

```bash
cd music-looper
python3 -m http.server 8080
# then open http://localhost:8080
```

(or `npx serve`, or any static file server — `localhost` counts as secure.)

Works in current Chrome, Edge, and Firefox. **Use headphones**, otherwise the mic
will re-record what comes out of your speakers.

## Features

- **4 loop tracks** — hit *Rec* (or keys `1`–`4`); after a 1-bar count-in the track
  records exactly one loop (BPM × loop length, sample-accurate via an AudioWorklet)
  and immediately starts looping. All tracks stay locked to the same grid.
- **Per-track effects** — volume, low/high/band-pass filter with cutoff + resonance,
  delay (mix / time / feedback), and a shared reverb send. Everything is tweakable
  live while the loop plays.
- **Drum machine** — 16-step sequencer with synthesized kick, snare, hi-hat and clap
  (pure Web Audio, no samples), synced to the loop. It starts with a basic beat you
  can edit by clicking steps.
- **Transport** — BPM (40–220), loop length (1–8 bars), metronome, optional 1-bar
  count-in, mic monitoring toggle, master volume with a safety compressor.
- **Latency compensation** — recorded audio is shifted back by an adjustable amount
  so your playing lands where you heard it. If loops feel late against the drums,
  raise it; if early, lower it.
- **Export** — renders one full loop of the current mix (tracks + effects + drums)
  offline and downloads it as a 16-bit stereo WAV.

## Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / stop |
| `1`–`4` | Record / cancel on track 1–4 |
| `M` | Toggle metronome |

## Notes

- BPM and loop length lock once a loop exists (they define the grid every track is
  recorded against). Use *Clear all* to unlock them.
- One track records at a time; re-recording a track replaces its previous take.
- If the mic permission is denied, playback, drums and export still work — only
  recording is disabled.
