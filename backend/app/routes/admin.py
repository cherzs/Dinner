from flask import Blueprint
from app.controllers import AdminController
from app.utils import admin_required

admin_bp = Blueprint('admin', __name__)

# User management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    return AdminController.get_users()

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    return AdminController.get_user(user_id)

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    return AdminController.update_user(user_id)

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    return AdminController.delete_user(user_id)

# Event management
@admin_bp.route('/events', methods=['GET'])
@admin_required
def get_all_events():
    return AdminController.get_all_events()

# Dinner management
@admin_bp.route('/dinner-registrations', methods=['GET'])
@admin_required
def get_all_dinner_registrations():
    return AdminController.get_all_dinner_registrations()

@admin_bp.route('/dinner-groups', methods=['GET'])
@admin_required
def get_all_dinner_groups():
    return AdminController.get_all_dinner_groups()

@admin_bp.route('/run-matching', methods=['POST'])
@admin_required
def run_matching():
    return AdminController.run_matching()

# Dashboard
@admin_bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def get_dashboard_stats():
    return AdminController.get_dashboard_stats() 