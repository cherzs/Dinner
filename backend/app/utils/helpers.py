import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename):
    """Check if the file extension is allowed."""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, folder='uploads'):
    """Save an uploaded file and return its filename."""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to filename to make it unique
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        
        # Create folder if it doesn't exist
        upload_folder = os.path.join(current_app.root_path, 'static', folder)
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Return relative path for database storage
        return f"{folder}/{filename}"
    return None

def delete_file(filename):
    """Delete a file from the filesystem."""
    if filename:
        file_path = os.path.join(current_app.root_path, 'static', filename)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception as e:
            current_app.logger.error(f"Error deleting file {filename}: {str(e)}")
    return False

def format_datetime(dt):
    """Format datetime object to ISO format string."""
    if isinstance(dt, datetime):
        return dt.isoformat()
    return None

def parse_datetime(dt_str):
    """Parse ISO format string to datetime object."""
    try:
        return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None 