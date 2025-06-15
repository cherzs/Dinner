from app import db
from datetime import datetime

class DinnerGroup(db.Model):
    __tablename__ = 'dinner_groups'
    
    id = db.Column(db.Integer, primary_key=True)
    kota = db.Column(db.String(100), nullable=False)
    budget_preference = db.Column(db.String(50), nullable=False)
    tanggal = db.Column(db.Date, nullable=False)
    waktu = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active', 'completed', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('DinnerRegistration', backref='group', lazy=True)
    
    def __init__(self, kota, budget_preference, tanggal, waktu, status='active'):
        self.kota = kota
        self.budget_preference = budget_preference
        self.tanggal = tanggal
        self.waktu = waktu
        self.status = status
    
    def to_dict(self):
        return {
            'id': self.id,
            'kota': self.kota,
            'budget_preference': self.budget_preference,
            'tanggal': self.tanggal.isoformat() if self.tanggal else None,
            'waktu': self.waktu,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'registrations': [reg.to_dict() for reg in self.registrations]
        }
    
    def __repr__(self):
        return f'<DinnerGroup {self.id}>' 