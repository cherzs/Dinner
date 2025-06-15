from flask import jsonify, request
from app.models import DinnerRegistration, DinnerGroup
from app.services import MatchingService
from app import db
from datetime import datetime

class DinnerController:
    @staticmethod
    def register_dinner(data, user):
        # Create new dinner registration
        registration = DinnerRegistration(
            user_id=user.id,
            kota=data['kota'],
            budget_preference=data['budget_preference'],
            tanggal_tersedia=datetime.fromisoformat(data['tanggal_tersedia']).date(),
            waktu_preference=data['waktu_preference'],
            makanan_preference=data.get('makanan_preference'),
            min_participants=data.get('min_participants', 2),
            max_participants=data.get('max_participants', 4)
        )
        db.session.add(registration)
        db.session.commit()
        
        # Try to match with existing registrations
        return jsonify({
            'message': 'Dinner registration successful',
            'registration': registration.to_dict()
        })
    
    @staticmethod
    def get_my_registrations(user):
        registrations = DinnerRegistration.query.filter_by(user_id=user.id, status='matched').all()
        return jsonify([reg.to_dict() for reg in registrations])
    
    @staticmethod
    def get_dinner_group(group_id, user):
        group = DinnerGroup.query.get_or_404(group_id)
        
        # Check if user is part of this group
        if not any(reg.user_id == user.id for reg in group.registrations):
            return jsonify({'error': 'Not authorized to view this group'}), 403
        
        return jsonify(group.to_dict())
    
    @staticmethod
    def cancel_registration(registration_id, user):
        registration = DinnerRegistration.query.get_or_404(registration_id)
        
        # Check if user owns this registration
        if registration.user_id != user.id:
            return jsonify({'error': 'Not authorized to cancel this registration'}), 403
        
        # Check if registration can be cancelled
        if registration.status not in ['pending', 'matched']:
            return jsonify({'error': 'Registration cannot be cancelled'}), 400
        
        # If registration is part of a group, remove it
        if registration.group_id:
            group = registration.group
            registration.group_id = None
            registration.status = 'cancelled'
            
            # If group becomes empty, delete it
            if len(group.registrations) <= 1:
                db.session.delete(group)
            else:
                # Update other registrations in the group
                for reg in group.registrations:
                    if reg.id != registration.id:
                        reg.status = 'pending'
                        reg.group_id = None
        else:
            registration.status = 'cancelled'
        
        db.session.commit()
        return jsonify({'message': 'Registration cancelled successfully'})
    
    @staticmethod
    def run_matching():
        """Run the matching algorithm (admin only)."""
        matched_groups = MatchingService.match_registrations()
        cleaned_up = MatchingService.cleanup_old_registrations()
        
        return jsonify({
            'message': 'Matching completed',
            'matched_groups': [group.to_dict() for group in matched_groups],
            'cleaned_up_registrations': cleaned_up
        }) 