from flask import Blueprint, request, jsonify
from app.utils import login_required, admin_required, get_current_user
from app.controllers import DinnerController

dinner_bp = Blueprint('dinner', __name__)
dinner_controller = DinnerController()

# Protected routes
@dinner_bp.route('/daftar-dinner', methods=['POST'])
@login_required
def register_dinner():
    current_user = get_current_user()
    return dinner_controller.register_dinner(request.get_json(), current_user)

@dinner_bp.route('/my-dinner-registrations', methods=['GET'])
@login_required
def get_my_registrations():
    current_user = get_current_user()
    return dinner_controller.get_my_registrations(current_user)

@dinner_bp.route('/dinner-group/<int:group_id>', methods=['GET'])
@login_required
def get_dinner_group(group_id):
    current_user = get_current_user()
    return dinner_controller.get_dinner_group(group_id, current_user)

@dinner_bp.route('/dinner-registration/<int:registration_id>', methods=['DELETE'])
@login_required
def cancel_registration(registration_id):
    current_user = get_current_user()
    return dinner_controller.cancel_registration(registration_id, current_user)

# Admin routes
@dinner_bp.route('/admin/run-matching', methods=['POST'])
@admin_required
def run_matching():
    return dinner_controller.run_matching_algorithm() 