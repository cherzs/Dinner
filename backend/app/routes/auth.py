from flask import Blueprint, request, jsonify
from app.controllers import AuthController
from app.utils import login_required, get_current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return AuthController.login(data)

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    return AuthController.logout()

@auth_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    current_user = get_current_user()
    return AuthController.get_profile(current_user)

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    current_user = get_current_user()
    return AuthController.update_profile(current_user)

@auth_bp.route('/profile/upload-image', methods=['POST'])
@login_required
def upload_profile_image():
    current_user = get_current_user()
    return AuthController.upload_profile_image(current_user)