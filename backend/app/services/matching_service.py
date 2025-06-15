from datetime import datetime, timedelta
from app.models import DinnerRegistration, DinnerGroup
from app import db

class MatchingService:
    @staticmethod
    def find_compatible_registrations(registration):
        """Find compatible registrations for a given registration."""
        # Get registrations with matching criteria
        compatible = DinnerRegistration.query.filter(
            DinnerRegistration.id != registration.id,
            DinnerRegistration.status == 'pending',
            DinnerRegistration.kota == registration.kota,
            DinnerRegistration.budget_preference == registration.budget_preference,
            DinnerRegistration.tanggal_tersedia == registration.tanggal_tersedia,
            DinnerRegistration.waktu_preference == registration.waktu_preference
        ).all()
        
        return compatible
    
    @staticmethod
    def create_group(registrations):
        """Create a new dinner group from compatible registrations."""
        if not registrations:
            return None
        
        # Use the first registration's details for the group
        first_reg = registrations[0]
        group = DinnerGroup(
            kota=first_reg.kota,
            budget_preference=first_reg.budget_preference,
            tanggal=first_reg.tanggal_tersedia,
            waktu=first_reg.waktu_preference
        )
        
        db.session.add(group)
        db.session.flush()  # Get the group ID
        
        # Update registrations
        for reg in registrations:
            reg.group_id = group.id
            reg.status = 'matched'
        
        db.session.commit()
        return group
    
    @staticmethod
    def match_registrations():
        """Match pending registrations into groups."""
        # Get all pending registrations
        pending_registrations = DinnerRegistration.query.filter_by(
            status='pending'
        ).order_by(DinnerRegistration.created_at).all()
        
        matched_groups = []
        
        for reg in pending_registrations:
            if reg.status != 'pending':
                continue
            
            # Find compatible registrations
            compatible = MatchingService.find_compatible_registrations(reg)
            
            # Check if we have enough compatible registrations
            if len(compatible) >= reg.min_participants - 1:
                # Create a group with this registration and its compatible ones
                group_registrations = [reg] + compatible[:reg.max_participants - 1]
                group = MatchingService.create_group(group_registrations)
                if group:
                    matched_groups.append(group)
        
        return matched_groups
    
    @staticmethod
    def cleanup_old_registrations():
        """Clean up old pending registrations."""
        # Find registrations older than 7 days
        cutoff_date = datetime.utcnow() - timedelta(days=7)
        old_registrations = DinnerRegistration.query.filter(
            DinnerRegistration.status == 'pending',
            DinnerRegistration.created_at < cutoff_date
        ).all()
        
        # Update their status to cancelled
        for reg in old_registrations:
            reg.status = 'cancelled'
        
        db.session.commit()
        return len(old_registrations) 