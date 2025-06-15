from flask import jsonify, request
from app.models import User, Event, DinnerRegistration, DinnerGroup
from app import db
from app.services import MatchingService

class AdminController:
    @staticmethod
    def get_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    
    @staticmethod
    def get_user(user_id):
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict())
    
    @staticmethod
    def update_user(user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update user fields
        if 'username' in data:
            # Check if username is already taken
            existing = User.query.filter_by(username=data['username']).first()
            if existing and existing.id != user.id:
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['username']
        
        if 'email' in data:
            # Check if email is already taken
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user.id:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'bio' in data:
            user.bio = data['bio']
        if 'role' in data:
            user.role = data['role']
        
        db.session.commit()
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        })
    
    @staticmethod
    def delete_user(user_id):
        user = User.query.get_or_404(user_id)
        
        # Delete user's profile image if exists
        if user.profile_image:
            from app.utils.helpers import delete_file
            delete_file(user.profile_image)
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    
    @staticmethod
    def get_all_events():
        events = Event.query.order_by(Event.date.desc()).all()
        return jsonify([event.to_dict() for event in events])
    
    @staticmethod
    def get_all_dinner_registrations():
        registrations = DinnerRegistration.query.order_by(DinnerRegistration.created_at.desc()).all()
        return jsonify([reg.to_dict() for reg in registrations])
    
    @staticmethod
    def get_all_dinner_groups():
        groups = DinnerGroup.query.order_by(DinnerGroup.created_at.desc()).all()
        return jsonify([group.to_dict() for group in groups])
    
    @staticmethod
    def run_matching():
        """Run the matching algorithm manually."""
        matched_groups = MatchingService.match_registrations()
        cleaned_up = MatchingService.cleanup_old_registrations()
        
        return jsonify({
            'message': 'Matching completed',
            'matched_groups': [group.to_dict() for group in matched_groups],
            'cleaned_up_registrations': cleaned_up
        })
    
    @staticmethod
    def get_dashboard_stats():
        """Get statistics for the admin dashboard."""
        total_users = User.query.count()
        total_events = Event.query.count()
        total_dinner_registrations = DinnerRegistration.query.count()
        total_dinner_groups = DinnerGroup.query.count()
        
        # Get pending dinner registrations
        pending_registrations = DinnerRegistration.query.filter_by(status='pending').count()
        
        # Get active events
        active_events = Event.query.filter_by(status='active').count()
        
        return jsonify({
            'total_users': total_users,
            'total_events': total_events,
            'total_dinner_registrations': total_dinner_registrations,
            'total_dinner_groups': total_dinner_groups,
            'pending_registrations': pending_registrations,
            'active_events': active_events
        }) 