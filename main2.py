import os
import time
import string
import speech_recognition as sr
from easygui import buttonbox
from PIL import Image, ImageTk, ImageSequence
import matplotlib.pyplot as plt
import tkinter as tk

# --- configuration ---
ISL_GIFS_DIR = "ISL_Gifs"
LETTERS_DIR = "letters"
SIGN_IMG = "signlang.png"

isl_gif = [
    'all the best', 'any questions', 'are you angry', 'are you busy',
    'are you hungry', 'be careful', 'good morning', 'hello',
    'how are you', 'i am fine', 'nice to meet you', 'thank you', 'welcome'
]
arr = list(string.ascii_lowercase)


# --- utilities ---
def list_microphones():
    try:
        mics = sr.Microphone.list_microphone_names()
    except Exception as e:
        print("Could not list microphones:", e)
        return []
    print("\nAvailable Microphones:")
    for i, name in enumerate(mics):
        print(f"  {i}: {name}")
    return mics


def recognize_audio_with_fallback(recognizer, audio):
    try:
        text = recognizer.recognize_google(audio)
        print("Recognized with Google:", text)
        return text
    except sr.RequestError as e:
        print("Google SR request failed:", e)
    except sr.UnknownValueError:
        print("Google SR could not understand audio")

    try:
        text = recognizer.recognize_sphinx(audio)
        print("Recognized with Sphinx:", text)
        return text
    except ImportError:
        print("PocketSphinx not installed, skipping Sphinx fallback")
    except sr.UnknownValueError:
        print("Sphinx could not understand audio")
    except sr.RequestError as e:
        print("Sphinx error:", e)

    return None


def find_gif_for_phrase(phrase):
    """Return a matching GIF path for a phrase using variants and partial matching."""
    if not phrase:
        return N    
    base = phrase.lower().strip()
    candidates = [
        base,
        base.replace(" ", "_"),
        base.replace(" ", "-"),
        base.replace(" ", ""),
    ]
    for c in candidates:
        p = os.path.join(ISL_GIFS_DIR, f"{c}.gif")
        if os.path.exists(p):
            return p
    if os.path.isdir(ISL_GIFS_DIR):
        words = [w for w in base.split() if w]
        for fname in os.listdir(ISL_GIFS_DIR):
            if not fname.lower().endswith(".gif"):
                continue
            fname_no_ext = os.path.splitext(fname)[0].lower()
            if all(w in fname_no_ext for w in words):
                return os.path.join(ISL_GIFS_DIR, fname)
    return None


# --- GIF/Tk helpers ---
class ImageLabel(tk.Label):
    """Tkinter Label that can display animated GIFs (keeps PhotoImage refs).
    Improved frame extraction: composes frames to handle GIF disposal/transparency.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._frames = []
        self._delay = 100
        self._index = 0
        self._running = False
        self._after_id = None
        self._photo_refs = []

    def _compose_frames(self, im, maxdim=500):
        """Return a list of RGBA PIL Images representing each displayed frame."""
        frames = []
        mode = 'RGBA'
        base = Image.new(mode, im.size)  # composite background
        palette = im.getpalette() if hasattr(im, "getpalette") else None

        try:
            for frame in ImageSequence.Iterator(im):
                # ensure palette retained for 'P' frames
                if palette and getattr(frame, "mode", None) == "P":
                    frame.putpalette(palette)
                frame_rgba = frame.convert(mode)

                # paste onto composite using frame alpha as mask
                composite = base.copy()
                composite.paste(frame_rgba, (0, 0), frame_rgba)

                # resize if needed (maintain aspect)
                if composite.width > maxdim or composite.height > maxdim:
                    composite.thumbnail((maxdim, maxdim), Image.Resampling.LANCZOS)

                frames.append(composite)
                # update base to composite (simple disposal handling)
                base = composite
        except Exception as e:
            print("Error composing GIF frames:", e)
        return frames

    def load(self, path):
        """Load frames from a GIF file path. Returns True on success."""
        if not os.path.exists(path):
            print("GIF not found:", path)
            return False
        try:
            im = Image.open(path)
        except Exception as e:
            print("Error opening GIF:", e)
            return False

        # clear previous
        self._frames.clear()
        self._photo_refs.clear()
        self._index = 0

        # extract composed RGBA frames
        pil_frames = self._compose_frames(im, maxdim=500)
        if not pil_frames:
            print("No frames extracted from GIF.")
            return False

        try:
            for f in pil_frames:
                photo = ImageTk.PhotoImage(f)
                self._photo_refs.append(photo)   # keep reference
                self._frames.append(photo)
        except Exception as e:
            print("Error converting frames to PhotoImage:", e)
            return False

        # read delay (ms) from original image info, fallback to 100
        try:
            delay = int(im.info.get("duration", 100))
            if delay <= 0:
                delay = 100
        except Exception:
            delay = 100
        self._delay = delay if delay >= 50 else 100

        # start animation if frames present
        if self._frames:
            self.config(image=self._frames[0])
            self.start()
            return True

        print("No frames available after processing.")
        return False

    def _animate(self):
        if not self._running or not self._frames:
            return
        self.config(image=self._frames[self._index])
        self._index = (self._index + 1) % len(self._frames)
        self._after_id = self.after(self._delay, self._animate)

    def start(self):
        if not self._running:
            self._running = True
            self._animate()

    def stop(self):
        if self._running:
            self._running = False
            if self._after_id:
                try:
                    self.after_cancel(self._after_id)
                except Exception:
                    pass
                self._after_id = None


# --- Letter display (matplotlib) ---
class LetterDisplay:
    def __init__(self):
        plt.ion()
        self.fig, self.ax = plt.subplots(figsize=(6, 6))
        self.ax.axis("off")
        self._open = True

    def display_sequence(self, text, delay=0.8):
        for ch in text.lower():
            if ch not in arr:
                continue
            path = os.path.join(LETTERS_DIR, f"{ch}.jpg")
            if not os.path.exists(path):
                print("Letter image missing:", path)
                continue
            try:
                img = Image.open(path).convert("RGBA")
                img.thumbnail((500, 500), Image.Resampling.LANCZOS)
                self.ax.clear()
                self.ax.axis("off")
                self.ax.imshow(img)
                self.fig.canvas.draw()
                plt.pause(delay)
            except Exception as e:
                print("Error showing letter image:", e)

    def close(self):
        try:
            plt.close(self.fig)
        except Exception:
            pass
        self._open = False


# --- main voice loop ---
def func(device_index=None, timeout=5, phrase_time_limit=6):
    r = sr.Recognizer()
    list_microphones()
    letter_display = LetterDisplay()

    try:
        with sr.Microphone(device_index=device_index) as source:
            print("Adjusting for ambient noise...")
            r.adjust_for_ambient_noise(source, duration=1.0)
            print("Ready. Speak a phrase (say 'goodbye' to exit).")

            while True:
                print("\nListening...")
                try:
                    audio = r.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
                except sr.WaitTimeoutError:
                    print("Listening timed out waiting for phrase to start. Try again.")
                    continue
                except Exception as e:
                    print("Listen error:", e)
                    continue

                text = recognize_audio_with_fallback(r, audio)
                if not text:
                    continue

                phrase = text.lower().strip()
                print("You said:", phrase)

                if phrase == "goodbye":
                    print("Exiting voice loop.")
                    letter_display.close()
                    break

                if phrase in isl_gif:
                    gif_path = find_gif_for_phrase(phrase)
                    if gif_path:
                        print("Found GIF:", os.path.abspath(gif_path))
                        root = tk.Tk()
                        root.title(f"Sign: {phrase}")
                        root.geometry("520x640")
                        container = tk.Frame(root)
                        container.pack(expand=True, fill="both", padx=8, pady=8)
                        tk.Label(container, text=f'Showing: "{phrase}"', font=("Arial", 12, "bold")).pack(pady=4)
                        lbl = ImageLabel(container)
                        lbl.pack(expand=True)
                        btn_frame = tk.Frame(container)
                        btn_frame.pack(pady=6)
                        tk.Button(btn_frame, text="Play", command=lbl.start).pack(side="left", padx=6)
                        tk.Button(btn_frame, text="Stop", command=lbl.stop).pack(side="left", padx=6)
                        tk.Button(btn_frame, text="Close", command=root.destroy).pack(side="left", padx=6)
                        success = lbl.load(gif_path)
                        if success:
                            root.mainloop()
                        else:
                            print("Failed to load GIF frames.")
                    else:
                        print("No GIF matched for phrase. Files in ISL_Gifs:", os.listdir(ISL_GIFS_DIR) if os.path.isdir(ISL_GIFS_DIR) else "missing")
                else:
                    letter_display.display_sequence(phrase, delay=0.8)

    except Exception as e:
        print("Microphone or recognition error:", e)
    finally:
        try:
            letter_display.close()
        except Exception:
            pass


# --- startup / main loop ---
def main():
    print("Working directory:", os.getcwd())
    print("ISL_Gifs present:", os.path.isdir(ISL_GIFS_DIR))
    if os.path.isdir(ISL_GIFS_DIR):
        print("ISL_Gifs files:", os.listdir(ISL_GIFS_DIR))
    print("Letters present:", os.path.isdir(LETTERS_DIR))
    if os.path.isdir(LETTERS_DIR):
        print("Letters files:", os.listdir(LETTERS_DIR)[:20])

    while True:
        reply = buttonbox("HEARING IMPAIRMENT ASSISTANT", image=SIGN_IMG, choices=["Live Voice", "All Done!"])
        if reply == "Live Voice":
            func()
        else:
            break


if __name__ == "__main__":
    main()

import os
ISL='ISL_Gifs'; LET='letters'; SIGN='signlang.png'
print('cwd:', os.getcwd())
print('ISL_Gifs exists:', os.path.isdir(ISL))
print('ISL_Gifs files:', os.listdir(ISL) if os.path.isdir(ISL) else [])
print('letters exists:', os.path.isdir(LET))
print('letters files:', os.listdir(LET) if os.path.isdir(LET) else [])
print('signlang.png exists:', os.path.exists(SIGN))
# check common phrase→gif names
phrases=['all the best','are you hungry','hello']
for p in phrases:
    variants=[p, p.replace(' ','_'), p.replace(' ','-'), p.replace(' ','')]
    found=[v for v in variants if os.path.exists(os.path.join(ISL,f"{v}.gif"))] if os.path.isdir(ISL) else []
    print(p, 'found variants:', found)