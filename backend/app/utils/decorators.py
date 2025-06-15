from functools import wraps
from flask import session, jsonify
from app.models.user import User

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
            
        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Helper function to get current user from session"""
    if 'user_id' not in session:
        return None
    return User.query.get(session['user_id']) 