# API Updates - Letter Images & Phrase GIFs

## ✅ Changes Made

### 1. Letter Images from `letters/` Folder
- **New Endpoint**: `/api/letter/<letter>`
- **Source**: Uses images from `letters/` folder (a.jpg, b.jpg, etc.)
- **Format**: Returns letter images for individual letters

### 2. Phrase/Word/Sentence GIFs
- **New Endpoint**: `/api/phrase/<phrase>`
- **Source**: Uses GIFs from `ISL_Gifs/` folder
- **Format**: Returns animated GIFs for phrases, words, and sentences

## 📡 Updated API Endpoints

### Letter Images
```
GET /api/letter/A    → Returns letter A image from letters/ folder
GET /api/letter/b    → Returns letter B image (case-insensitive)
GET /api/letter/list → Lists all available letters
```

### Phrase/Word GIFs
```
GET /api/phrase/hello                    → Returns "hello.gif"
GET /api/phrase/good morning             → Returns "good morning.gif"
GET /api/phrase/are you angry            → Returns "are you angry.gif"
GET /api/phrase/list                     → Lists all available phrases
```

## 🎯 How It Works

### Smart Detection
1. **First**: Tries to match the entire sentence as a phrase/word
   - Example: "hello" → Shows "hello.gif"
   - Example: "good morning" → Shows "good morning.gif"

2. **Fallback**: If no phrase match, splits into letters
   - Example: "HELLO" → Shows H, E, L, L, O letter images sequentially

### Phrase Matching
The API tries multiple variations:
- Original phrase: `"good morning"`
- Without punctuation: `"good morning"` (if had punctuation)
- Spaces to underscores: `"good_morning"`
- Spaces to hyphens: `"good-morning"`
- No spaces: `"goodmorning"`

### Partial Matching
If exact match not found, tries to find GIFs where all words in the phrase appear in the filename.

## 📝 Example Usage

### JavaScript
```javascript
// Get letter image
fetch('/api/letter/A')
  .then(response => response.blob())
  .then(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
  });

// Get phrase GIF
fetch('/api/phrase/hello')
  .then(response => response.blob())
  .then(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
  });

// List available phrases
fetch('/api/phrase/list')
  .then(response => response.json())
  .then(data => {
    console.log('Available phrases:', data.phrases);
  });
```

### cURL
```bash
# Get letter A image
curl http://localhost:5000/api/letter/A -o A.jpg

# Get phrase GIF
curl http://localhost:5000/api/phrase/hello -o hello.gif

# List phrases
curl http://localhost:5000/api/phrase/list
```

## 🔄 Backward Compatibility

- `/api/gif/<letter>` still works (redirects to `/api/letter/<letter>`)
- `/api/gif/list` still works (redirects to `/api/letter/list`)

## 📂 Folder Structure

```
project/
├── letters/          → Letter images (a.jpg, b.jpg, ...)
│   ├── a.jpg
│   ├── b.jpg
│   └── ...
└── ISL_Gifs/         → Phrase/word/sentence GIFs
    ├── hello.gif
    ├── good morning.gif
    ├── are you angry.gif
    └── ...
```

## 🎨 Frontend Behavior

When you speak:
1. **"hello"** → Shows "hello.gif" directly
2. **"good morning"** → Shows "good morning.gif" directly
3. **"XYZ123"** → Shows X, Y, Z letter images sequentially (ignores numbers)
4. **"hello world"** → Tries "hello world.gif", if not found, shows letters H-E-L-L-O-W-O-R-L-D

## ✨ Benefits

- ✅ **Better UX**: Shows phrase GIFs when available (more natural)
- ✅ **Fallback**: Still works letter-by-letter for unknown phrases
- ✅ **Flexible**: Handles variations in phrase formatting
- ✅ **Organized**: Clear separation between letters and phrases

