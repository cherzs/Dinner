from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.String(200))
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    gender = db.Column(db.String(20))
    age = db.Column(db.Integer)
    
    # Relationships
    events = db.relationship('Event', backref='organizer', lazy=True)
    registrations = db.relationship('Registration', backref='user', lazy=True)
    dinner_registrations = db.relationship('DinnerRegistration', backref='user', lazy=True)
    
    def __init__(self, username, email, password, full_name=None, phone=None, bio=None, role='user'):
        self.username = username
        self.email = email
        self.set_password(password)
        self.full_name = full_name
        self.phone = phone
        self.bio = bio
        self.role = role
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.username}>' 