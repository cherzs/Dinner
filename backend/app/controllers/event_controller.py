from flask import jsonify, request
from app.models import Event, Registration
from app import db
from app.utils.helpers import save_file, delete_file
from datetime import datetime

class EventController:
    @staticmethod
    def create_event(user):
        data = request.get_json()
        
        # Create new event
        event = Event(
            title=data['title'],
            description=data['description'],
            location=data['location'],
            date=datetime.fromisoformat(data['date']),
            max_participants=data.get('max_participants'),
            organizer_id=user.id
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
    
    @staticmethod
    def get_events():
        events = Event.query.order_by(Event.date.desc()).all()
        return jsonify([event.to_dict() for event in events])
    
    @staticmethod
    def get_event(event_id):
        event = Event.query.get_or_404(event_id)
        return jsonify(event.to_dict())
    
    @staticmethod
    def update_event(event_id, user):
        event = Event.query.get_or_404(event_id)
        
        # Check if user is the organizer
        if event.organizer_id != user.id and user.role != 'admin':
            return jsonify({'error': 'Not authorized to update this event'}), 403
        
        data = request.get_json()
        
        # Update event fields
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'location' in data:
            event.location = data['location']
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'])
        if 'max_participants' in data:
            event.max_participants = data['max_participants']
        if 'status' in data and user.role == 'admin':
            event.status = data['status']
        
        db.session.commit()
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        })
    
    @staticmethod
    def delete_event(event_id, user):
        event = Event.query.get_or_404(event_id)
        
        # Check if user is the organizer or admin
        if event.organizer_id != user.id and user.role != 'admin':
            return jsonify({'error': 'Not authorized to delete this event'}), 403
        
        # Delete event image if exists
        if event.image:
            delete_file(event.image)
        
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'})
    
    @staticmethod
    def upload_event_image(event_id, user):
        event = Event.query.get_or_404(event_id)
        
        # Check if user is the organizer
        if event.organizer_id != user.id and user.role != 'admin':
            return jsonify({'error': 'Not authorized to update this event'}), 403
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if not file.filename:
            return jsonify({'error': 'No selected file'}), 400
        
        # Save the new image
        filename = save_file(file, 'event_images')
        if not filename:
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Delete old image if exists
        if event.image:
            delete_file(event.image)
        
        # Update event image
        event.image = filename
        db.session.commit()
        
        return jsonify({
            'message': 'Event image uploaded successfully',
            'image': filename
        })
    
    @staticmethod
    def register_for_event(event_id, user):
        event = Event.query.get_or_404(event_id)
        
        # Check if event is active
        if event.status != 'active':
            return jsonify({'error': 'Event is not active'}), 400
        
        # Check if user is already registered
        existing_reg = Registration.query.filter_by(
            user_id=user.id,
            event_id=event_id
        ).first()
        
        if existing_reg:
            return jsonify({'error': 'Already registered for this event'}), 400
        
        # Check if event is full
        if event.max_participants and len(event.registrations) >= event.max_participants:
            return jsonify({'error': 'Event is full'}), 400
        
        # Create registration
        registration = Registration(user_id=user.id, event_id=event_id)
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully registered for event',
            'registration': registration.to_dict()
        })
    
    @staticmethod
    def cancel_registration(event_id, user):
        registration = Registration.query.filter_by(
            user_id=user.id,
            event_id=event_id
        ).first_or_404()
        
        db.session.delete(registration)
        db.session.commit()
        
        return jsonify({'message': 'Registration cancelled successfully'}) 