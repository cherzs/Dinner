from app import create_app
from app.config import config
import os

# Get environment from environment variable, default to development
env = os.getenv('FLASK_ENV', 'development')
app = create_app(env)  # Pass the environment string directly

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000))) 