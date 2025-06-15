from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    date = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer)
    image = db.Column(db.String(200))
    status = db.Column(db.String(20), default='active')  # 'active', 'cancelled', 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    registrations = db.relationship('Registration', backref='event', lazy=True)
    
    def __init__(self, title, description, location, date, max_participants, organizer_id, image=None, status='active'):
        self.title = title
        self.description = description
        self.location = location
        self.date = date
        self.max_participants = max_participants
        self.organizer_id = organizer_id
        self.image = image
        self.status = status
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'date': self.date.isoformat() if self.date else None,
            'max_participants': self.max_participants,
            'image': self.image,
            'status': self.status,
            'organizer_id': self.organizer_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'organizer': self.organizer.to_dict() if self.organizer else None,
            'registrations': [reg.to_dict() for reg in self.registrations]
        }
    
    def __repr__(self):
        return f'<Event {self.title}>' 