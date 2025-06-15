from app import db
from datetime import datetime

class DinnerRegistration(db.Model):
    __tablename__ = 'dinner_registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    kota = db.Column(db.String(100), nullable=False)
    budget_preference = db.Column(db.String(50), nullable=False)
    tanggal_tersedia = db.Column(db.Date, nullable=False)
    waktu_preference = db.Column(db.String(50), nullable=False)
    makanan_preference = db.Column(db.String(200))
    min_participants = db.Column(db.Integer, default=2)
    max_participants = db.Column(db.Integer, default=4)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'matched', 'completed', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    gender = db.Column(db.String(20))
    age = db.Column(db.Integer)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('dinner_groups.id'), nullable=True)
    
    def __init__(self, user_id, kota, budget_preference, tanggal_tersedia, waktu_preference,
                 makanan_preference=None, min_participants=2, max_participants=4, status='pending'):
        self.user_id = user_id
        self.kota = kota
        self.budget_preference = budget_preference
        self.tanggal_tersedia = tanggal_tersedia
        self.waktu_preference = waktu_preference
        self.makanan_preference = makanan_preference
        self.min_participants = min_participants
        self.max_participants = max_participants
        self.status = status
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'kota': self.kota,
            'budget_preference': self.budget_preference,
            'tanggal_tersedia': self.tanggal_tersedia.isoformat() if self.tanggal_tersedia else None,
            'waktu_preference': self.waktu_preference,
            'makanan_preference': self.makanan_preference,
            'min_participants': self.min_participants,
            'max_participants': self.max_participants,
            'status': self.status,
            'group_id': self.group_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def __repr__(self):
        return f'<DinnerRegistration {self.id}>' 