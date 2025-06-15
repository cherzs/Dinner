from .auth import auth_bp
from .events import events_bp
from .dinner import dinner_bp
from .admin import admin_bp

__all__ = ['auth_bp', 'events_bp', 'dinner_bp', 'admin_bp']