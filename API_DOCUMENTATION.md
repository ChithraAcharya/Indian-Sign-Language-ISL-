# API Documentation - Indian Sign Language Converter

## Server Information
- **Base URL**: `http://localhost:5000`
- **Framework**: Flask (Python)
- **CORS**: Enabled for all routes

## API Endpoints

### 1. Main Application
**GET** `/`

Serves the main HTML application page.

**Response**: HTML page

**Example**:
```
http://localhost:5000/
```

---

### 2. Get GIF for Letter
**GET** `/api/gif/<letter>`

Retrieves the ISL GIF/image for a specific letter.

**Parameters**:
- `letter` (path parameter): Single letter (A-Z), case-insensitive

**Response**:
- **Success (200)**: Image file (GIF or JPG)
- **Error (404)**: JSON error message

**Example Requests**:
```
GET http://localhost:5000/api/gif/A
GET http://localhost:5000/api/gif/h
GET http://localhost:5000/api/gif/Z
```

**Example Success Response**:
- Returns the image file directly (binary)

**Example Error Response** (404):
```json
{
  "error": "GIF/image not found for letter: X",
  "searched_paths": [
    "ISL_Gifs/X.gif",
    "ISL_Gifs/X.jpg",
    "ISL_Gifs/x.gif",
    "ISL_Gifs/x.jpg"
  ]
}
```

**File Priority**:
1. `ISL_Gifs/{letter}.gif` (uppercase)
2. `ISL_Gifs/{letter}.jpg` (uppercase)
3. `ISL_Gifs/{letter}.gif` (lowercase)
4. `ISL_Gifs/{letter}.jpg` (lowercase)

---

### 3. List Available GIFs
**GET** `/api/gif/list`

Returns a list of all available letter GIFs/images.

**Response** (200): JSON object

**Example Request**:
```
GET http://localhost:5000/api/gif/list
```

**Example Response**:
```json
{
  "available": {
    "A": {
      "letter": "A",
      "filename": "A.jpg",
      "path": "ISL_Gifs/A.jpg",
      "url": "/api/gif/A"
    },
    "B": {
      "letter": "B",
      "filename": "B.jpg",
      "path": "ISL_Gifs/B.jpg",
      "url": "/api/gif/B"
    },
    ...
  },
  "count": 14
}
```

---

### 4. Health Check
**GET** `/api/health`

Returns server health status and configuration.

**Response** (200): JSON object

**Example Request**:
```
GET http://localhost:5000/api/health
```

**Example Response**:
```json
{
  "status": "ok",
  "isl_gifs_dir": "ISL_Gifs",
  "isl_gifs_exists": true
}
```

---

## Usage Examples

### JavaScript (Fetch API)
```javascript
// Get GIF for letter A
fetch('/api/gif/A')
  .then(response => {
    if (response.ok) {
      return response.blob();
    }
    throw new Error('GIF not found');
  })
  .then(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  })
  .catch(error => console.error('Error:', error));

// List all available GIFs
fetch('/api/gif/list')
  .then(response => response.json())
  .then(data => {
    console.log('Available letters:', Object.keys(data.available));
    console.log('Total count:', data.count);
  });
```

### Python (Requests)
```python
import requests

# Get GIF for letter A
response = requests.get('http://localhost:5000/api/gif/A')
if response.status_code == 200:
    with open('A.gif', 'wb') as f:
        f.write(response.content)
    print("GIF saved successfully!")
else:
    print("Error:", response.json())

# List all available GIFs
response = requests.get('http://localhost:5000/api/gif/list')
data = response.json()
print(f"Available letters: {list(data['available'].keys())}")
print(f"Total count: {data['count']}")
```

### cURL
```bash
# Get GIF for letter A
curl http://localhost:5000/api/gif/A -o A.gif

# List all available GIFs
curl http://localhost:5000/api/gif/list

# Health check
curl http://localhost:5000/api/health
```

---

## Error Handling

All API endpoints return appropriate HTTP status codes:

- **200 OK**: Request successful
- **404 Not Found**: Resource not found (e.g., letter GIF doesn't exist)
- **500 Internal Server Error**: Server error (e.g., file read error)

Error responses include a JSON object with an `error` field describing the issue.

---

## CORS

CORS (Cross-Origin Resource Sharing) is enabled for all routes, allowing the API to be accessed from different origins.

---

## Starting the Server

### Option 1: Using Batch File (Windows)
```bash
start_api_server.bat
```

### Option 2: Using Python
```bash
python app.py
```

### Option 3: Using Flask CLI
```bash
flask run --host=0.0.0.0 --port=5000
```

The server will start on `http://localhost:5000` by default.

---

## Notes

- The API automatically handles both `.gif` and `.jpg` file formats
- Letter case is normalized (converted to uppercase internally)
- The API searches multiple file paths to find the best match
- Static files (CSS, JS) are served directly by Flask
- The main HTML page is served at the root route (`/`)

