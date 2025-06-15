from flask import Blueprint, request, jsonify
from app.utils import login_required, admin_required, get_current_user
from app.controllers import EventController

events_bp = Blueprint('events', __name__)
event_controller = EventController()

@events_bp.route('/events', methods=['GET'])
def get_events():
    return event_controller.get_events()

@events_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    return event_controller.get_event(event_id)

@events_bp.route('/events', methods=['POST'])
@login_required
def create_event():
    current_user = get_current_user()
    return event_controller.create_event(request.get_json(), current_user)

@events_bp.route('/events/<int:event_id>', methods=['PUT'])
@login_required
def update_event(event_id):
    current_user = get_current_user()
    return event_controller.update_event(event_id, request.get_json(), current_user)

@events_bp.route('/events/<int:event_id>', methods=['DELETE'])
@login_required
def delete_event(event_id):
    current_user = get_current_user()
    return event_controller.delete_event(event_id, current_user)

@events_bp.route('/events/<int:event_id>/register', methods=['POST'])
@login_required
def register_for_event(event_id):
    current_user = get_current_user()
    return event_controller.register_for_event(event_id, current_user)

@events_bp.route('/events/<int:event_id>/cancel', methods=['POST'])
@login_required
def cancel_registration(event_id):
    current_user = get_current_user()
    return event_controller.cancel_registration(event_id, current_user)

@events_bp.route('/my-events', methods=['GET'])
@login_required
def get_my_events():
    current_user = get_current_user()
    return event_controller.get_user_events(current_user) 