from app import db
from datetime import datetime

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    def __init__(self, user_id, event_id, status='pending'):
        self.user_id = user_id
        self.event_id = event_id
        self.status = status
    
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
            'event': self.event.to_dict() if self.event else None
        }
    
    def __repr__(self):
        return f'<Registration {self.id}>' 