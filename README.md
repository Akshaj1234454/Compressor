# Compressor

A simple Django-based image compression web app that lets users upload one or more images, choose a compression quality, and download the optimized results. It supports both single image download and multi-image ZIP download.

## Features

- Drag-and-drop or browse for image uploads
- Multiple image selection
- Compression quality options: Very Low, Medium, High
- Downloads compressed image(s) directly
- Returns a ZIP file when multiple images are uploaded

## Tech stack

- Python 3
- Django 5.2
- Pillow for image processing
- HTML/CSS/JavaScript for the frontend

## Requirements

- Install Python dependencies from `Compressor/requirements.txt`
- Uses `Pillow` for image compression

## Setup

1. Open a terminal in the project root.
2. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
pip install -r Compressor\requirements.txt
```

4. Run migrations:

```powershell
cd Compressor
python manage.py migrate
```

5. Start the development server:

```powershell
python manage.py runserver
```

6. Open your browser at `http://127.0.0.1:8000/`

## Usage

- Upload one or more image files using drag-and-drop or the file picker.
- Select a compression quality.
- Click `Compress`.
- Download the compressed image directly, or receive a ZIP archive for multiple images.

## Project layout

- `Compressor/manage.py` - Django command-line utility
- `Compressor/Compressor/settings.py` - Django configuration
- `Compressor/Compressor/urls.py` - URL routes
- `Compressor/Compressor/views.py` - Main compression logic
- `Compressor/templates/` - HTML templates
- `Compressor/static/` - CSS and JS frontend files
- `Compressor/requirements.txt` - Python dependencies

## Notes

- Uploaded images are converted to JPEG when compressed.
- If an image has transparency, it is converted to RGB before saving.
- Invalid non-image uploads are skipped when multiple files are submitted.

