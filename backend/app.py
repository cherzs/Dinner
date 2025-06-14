from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# File upload configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Initialize extensions
db = SQLAlchemy(app)
cors = CORS(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    occupation = db.Column(db.String(100))
    bio = db.Column(db.Text)
    interests = db.Column(db.Text)  # JSON string of interests
    preferred_language = db.Column(db.String(50), default='Indonesian')
    budget_preference = db.Column(db.String(50), nullable=False)  # 100k-200k, 200k-300k, etc
    dietary_restrictions = db.Column(db.Text)  # Halal, Vegetarian, etc
    role = db.Column(db.String(20), default='user')  # user, admin
    profile_image = db.Column(db.LargeBinary, nullable=True)  # Store image as BLOB
    profile_image_type = db.Column(db.String(50), nullable=True)  # Store MIME type
    gender = db.Column(db.String(20), nullable=True)  # Laki-laki, Perempuan
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'age': self.age,
            'city': self.city,
            'occupation': self.occupation,
            'bio': self.bio,
            'interests': self.interests,
            'preferred_language': self.preferred_language,
            'budget_preference': self.budget_preference,
            'dietary_restrictions': self.dietary_restrictions,
            'role': self.role,
            'gender': self.gender,
            'has_profile_image': self.profile_image is not None,
            'created_at': self.created_at.isoformat()
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    city = db.Column(db.String(100), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    registration_deadline = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer, default=6)
    budget_range = db.Column(db.String(50), nullable=False)  # 100k-200k, 200k-300k, etc
    platform_fee = db.Column(db.Float, nullable=False)  # 15k, 25k, 35k based on budget
    status = db.Column(db.String(20), default='open')  # open, closed, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'city': self.city,
            'event_date': self.event_date.isoformat(),
            'registration_deadline': self.registration_deadline.isoformat(),
            'max_participants': self.max_participants,
            'budget_range': self.budget_range,
            'platform_fee': self.platform_fee,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)

    user = db.relationship('User', backref='registrations')
    event = db.relationship('Event', backref='registrations')

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    restaurant_name = db.Column(db.String(200))
    restaurant_address = db.Column(db.Text)
    meeting_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    event = db.relationship('Event', backref='groups')
    members = db.relationship('Registration', backref='group')

# New model for dinner registrations
class DinnerRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    kota = db.Column(db.String(100), nullable=False)
    budget_preference = db.Column(db.String(50), nullable=False)
    tanggal_tersedia = db.Column(db.Date, nullable=False)
    waktu_preference = db.Column(db.String(50), default='malam')
    dietary_restrictions = db.Column(db.String(100))
    hobi_interests = db.Column(db.Text)
    personality_type = db.Column(db.Text)
    age_preference = db.Column(db.String(50))
    tujuan_kenalan = db.Column(db.String(100))
    bahasa_conversation = db.Column(db.String(50))
    pekerjaan = db.Column(db.String(200))
    special_notes = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')  # pending, matched, completed
    group_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='dinner_registrations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'kota': self.kota,
            'budget_preference': self.budget_preference,
            'tanggal_tersedia': self.tanggal_tersedia.isoformat(),
            'waktu_preference': self.waktu_preference,
            'dietary_restrictions': self.dietary_restrictions,
            'hobi_interests': self.hobi_interests,
            'personality_type': self.personality_type,
            'age_preference': self.age_preference,
            'tujuan_kenalan': self.tujuan_kenalan,
            'bahasa_conversation': self.bahasa_conversation,
            'pekerjaan': self.pekerjaan,
            'special_notes': self.special_notes,
            'status': self.status,
            'group_id': self.group_id,
            'created_at': self.created_at.isoformat()
        }

# Utility Functions
def calculate_platform_fee(budget_range):
    """
    Calculate platform fee based on budget range
    100k-200k = 15k, then +10k for each level up
    """
    budget_fees = {
        '100k-200k': 15000,
        '200k-300k': 25000,
        '300k-400k': 35000,
        '400k-500k': 45000,
        '500k+': 55000
    }
    return budget_fees.get(budget_range, 15000)

def get_budget_options():
    """Get available budget ranges"""
    return ['100k-200k', '200k-300k', '300k-400k', '400k-500k', '500k+']

def get_dietary_options():
    """Get available dietary restriction options"""
    return ['Tidak Ada', 'Halal', 'Vegetarian', 'Vegan', 'No Pork', 'No Seafood']

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Admin decorator
def admin_required(f):
    """Decorator to require admin role"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# API Routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            age=int(data['age']) if data.get('age') and str(data.get('age')).strip() else 25,  # Default age 25 if not provided
            city=data.get('city', ''),
            occupation=data.get('occupation', ''),
            bio=data.get('bio', ''),
            interests=data.get('interests', ''),
            preferred_language=data.get('preferred_language', 'Indonesian'),
            budget_preference=data.get('budget_preference', ''),
            dietary_restrictions=data.get('dietary_restrictions', 'Tidak Ada')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'occupation' in data:
            user.occupation = data['occupation']
        if 'bio' in data:
            user.bio = data['bio']
        if 'interests' in data:
            user.interests = data['interests']
        if 'dietary_restrictions' in data:
            user.dietary_restrictions = data['dietary_restrictions']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/upload-image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if file is in request
        if 'profile_image' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['profile_image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Use PNG, JPG, JPEG, or GIF'}), 400
        
        # Read file data
        file_data = file.read()
        
        # Get MIME type
        file_type = file.content_type
        
        # Update user profile with image data
        user.profile_image = file_data
        user.profile_image_type = file_type
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile image uploaded successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve profile images from database
@app.route('/api/profile/image/<int:user_id>')
def get_profile_image(user_id):
    try:
        user = User.query.get(user_id)
        if not user or not user.profile_image:
            return jsonify({'error': 'Image not found'}), 404
        
        from flask import Response
        return Response(
            user.profile_image,
            mimetype=user.profile_image_type or 'image/jpeg'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        city = request.args.get('city')
        events = Event.query.filter_by(status='open')
        
        if city:
            events = events.filter_by(city=city)
            
        events = events.order_by(Event.event_date.asc()).all()
        
        return jsonify({
            'events': [event.to_dict() for event in events]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget-options', methods=['GET'])
def get_budget_options_api():
    """Get available budget ranges and their fees"""
    try:
        budget_options = []
        for budget_range in get_budget_options():
            fee = calculate_platform_fee(budget_range)
            budget_options.append({
                'range': budget_range,
                'fee': fee,
                'fee_formatted': f"Rp {fee:,.0f}"
            })
        
        return jsonify({
            'budget_options': budget_options,
            'dietary_options': get_dietary_options()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
@jwt_required()
@admin_required
def create_event():
    """
    Create a new event - Admin only
    """
    try:
        data = request.get_json()
        budget_range = data['budget_range']
        platform_fee = calculate_platform_fee(budget_range)
        
        event = Event(
            title=data['title'],
            description=data.get('description', ''),
            city=data['city'],
            event_date=datetime.fromisoformat(data['event_date']),
            registration_deadline=datetime.fromisoformat(data['registration_deadline']),
            max_participants=data.get('max_participants', 6),
            budget_range=budget_range,
            platform_fee=platform_fee
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if event exists
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if registration is still open
        if datetime.utcnow() > event.registration_deadline:
            return jsonify({'error': 'Registration deadline has passed'}), 400
        
        # Check if user already registered
        existing_registration = Registration.query.filter_by(
            user_id=user_id, 
            event_id=event_id
        ).first()
        
        if existing_registration:
            return jsonify({'error': 'Already registered for this event'}), 400
        
        # Create registration
        registration = Registration(
            user_id=user_id,
            event_id=event_id,
            payment_status='paid' if event.platform_fee == 0 else 'pending'
        )
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully registered for event',
            'registration_id': registration.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
            
        return jsonify({'event': event.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/matching/<int:event_id>', methods=['POST'])
@jwt_required()
def run_matching_algorithm_endpoint(event_id):
    """
    Advanced matching algorithm using the matching_algorithm module
    """
    try:
        from matching_algorithm import run_matching_algorithm
        
        # Get event details
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Get all paid registrations for this event
        registrations = Registration.query.filter_by(
            event_id=event_id,
            payment_status='paid'
        ).all()
        
        if len(registrations) < 3:
            return jsonify({'error': 'Not enough participants for matching'}), 400
        
        # Prepare data for matching algorithm
        registration_data = []
        for reg in registrations:
            user_data = reg.user.to_dict()
            user_data['registration_date'] = reg.registration_date.isoformat()
            registration_data.append({
                'registration_id': reg.id,
                'user': user_data
            })
        
        event_data = event.to_dict()
        
        # Run matching algorithm
        matching_results = run_matching_algorithm(registration_data, event_data)
        
        # Save results to database
        groups_created = 0
        for result in matching_results:
            # Create group
            group = Group(
                event_id=event_id,
                restaurant_name=result['restaurant_name'],
                restaurant_address=result['restaurant_address'],
                meeting_time=datetime.fromisoformat(result['meeting_time'].replace('Z', '+00:00'))
            )
            db.session.add(group)
            db.session.flush()  # To get the ID
            
            # Assign users to group
            for member in result['members']:
                registration = Registration.query.filter_by(
                    user_id=member['id'],
                    event_id=event_id
                ).first()
                if registration:
                    registration.group_id = group.id
            
            groups_created += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully created {groups_created} groups using advanced matching',
            'total_participants': len(registrations),
            'groups': len(matching_results)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/daftar-dinner', methods=['POST'])
@jwt_required()
def daftar_dinner():
    """
    API endpoint for dinner registration with full preferences
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if user already has pending registration
        existing = DinnerRegistration.query.filter_by(
            user_id=user_id,
            status='pending'
        ).first()
        
        if existing:
            return jsonify({'error': 'Kamu sudah memiliki pendaftaran dinner yang pending. Tunggu proses matching selesai.'}), 400
        
        # Parse date
        tanggal_tersedia = datetime.strptime(data['tanggal_tersedia'], '%Y-%m-%d').date()
        
        # Create dinner registration
        dinner_reg = DinnerRegistration(
            user_id=user_id,
            kota=data['kota'],
            budget_preference=data['budget_preference'],
            tanggal_tersedia=tanggal_tersedia,
            waktu_preference=data.get('waktu_preference', 'malam'),
            dietary_restrictions=data.get('dietary_restrictions', 'Tidak Ada'),
            hobi_interests=data['hobi_interests'],
            personality_type=data['personality_type'],
            age_preference=data.get('age_preference', 'semua'),
            tujuan_kenalan=data.get('tujuan_kenalan', 'teman'),
            bahasa_conversation=data.get('bahasa_conversation', 'Indonesian'),
            pekerjaan=data['pekerjaan'],
            special_notes=data.get('special_notes', '')
        )
        
        db.session.add(dinner_reg)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pendaftaran dinner berhasil! Kami akan mencarikan teman yang cocok.',
            'registration': dinner_reg.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/my-dinner-registrations', methods=['GET'])
@jwt_required()
def get_my_dinner_registrations():
    """
    Get user's dinner registrations with group members if matched
    """
    try:
        user_id = get_jwt_identity()
        registrations = DinnerRegistration.query.filter_by(user_id=user_id).order_by(DinnerRegistration.created_at.desc()).all()
        
        result = []
        for reg in registrations:
            reg_data = reg.to_dict()
            
            # If user is matched and has group_id, get group members
            if reg.status == 'matched' and reg.group_id:
                group_members = DinnerRegistration.query.filter_by(
                    group_id=reg.group_id
                ).all()
                
                members_data = []
                for member in group_members:
                    member_info = {
                        'id': member.user.id,
                        'first_name': member.user.first_name,
                        'last_name': member.user.last_name,
                        'age': member.user.age,
                        'occupation': member.user.occupation,
                        'interests': member.user.interests,
                        'gender': member.user.gender,
                        'bio': member.user.bio,
                        'has_profile_image': member.user.profile_image is not None,
                        'registration_id': member.id
                    }
                    members_data.append(member_info)
                
                reg_data['group_members'] = members_data
                reg_data['total_members'] = len(members_data)
            else:
                reg_data['group_members'] = []
                reg_data['total_members'] = 0
            
            result.append(reg_data)
        
        return jsonify({
            'registrations': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin Routes
@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def admin_dashboard():
    """
    Get admin dashboard statistics
    """
    try:
        # Get statistics
        total_users = User.query.count()
        total_events = Event.query.count()
        total_dinner_registrations = DinnerRegistration.query.count()
        total_groups = Group.query.count()
        
        # Recent registrations
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        recent_dinner_regs = DinnerRegistration.query.order_by(DinnerRegistration.created_at.desc()).limit(5).all()
        
        # Status breakdown
        pending_dinners = DinnerRegistration.query.filter_by(status='pending').count()
        matched_dinners = DinnerRegistration.query.filter_by(status='matched').count()
        completed_dinners = DinnerRegistration.query.filter_by(status='completed').count()
        
        # City breakdown
        city_stats = db.session.query(
            DinnerRegistration.kota, 
            db.func.count(DinnerRegistration.id).label('count')
        ).group_by(DinnerRegistration.kota).all()
        
        # Budget breakdown
        budget_stats = db.session.query(
            DinnerRegistration.budget_preference, 
            db.func.count(DinnerRegistration.id).label('count')
        ).group_by(DinnerRegistration.budget_preference).all()
        
        return jsonify({
            'statistics': {
                'total_users': total_users,
                'total_events': total_events,
                'total_dinner_registrations': total_dinner_registrations,
                'total_groups': total_groups,
                'pending_dinners': pending_dinners,
                'matched_dinners': matched_dinners,
                'completed_dinners': completed_dinners
            },
            'recent_users': [user.to_dict() for user in recent_users],
            'recent_dinner_registrations': [reg.to_dict() for reg in recent_dinner_regs],
            'city_stats': [{'city': stat[0], 'count': stat[1]} for stat in city_stats],
            'budget_stats': [{'budget': stat[0], 'count': stat[1]} for stat in budget_stats]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_users():
    """
    Get all users with pagination
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        
        query = User.query
        
        if search:
            query = query.filter(
                db.or_(
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%'),
                    User.city.ilike(f'%{search}%')
                )
            )
        
        users = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': page,
                'pages': users.pages,
                'per_page': per_page,
                'total': users.total,
                'has_next': users.has_next,
                'has_prev': users.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dinner-registrations', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_dinner_registrations():
    """
    Get all dinner registrations with pagination
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')
        city = request.args.get('city', '')
        
        query = DinnerRegistration.query.join(User)
        
        if status:
            query = query.filter(DinnerRegistration.status == status)
        
        if city:
            query = query.filter(DinnerRegistration.kota == city)
        
        registrations = query.order_by(DinnerRegistration.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include user data in response
        result = []
        for reg in registrations.items:
            reg_data = reg.to_dict()
            reg_data['user'] = reg.user.to_dict()
            result.append(reg_data)
        
        return jsonify({
            'registrations': result,
            'pagination': {
                'page': page,
                'pages': registrations.pages,
                'per_page': per_page,
                'total': registrations.total,
                'has_next': registrations.has_next,
                'has_prev': registrations.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/toggle-admin', methods=['POST'])
@jwt_required()
@admin_required
def admin_toggle_user_role(user_id):
    """
    Toggle user role between user and admin
    """
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Toggle role
        user.role = 'admin' if user.role == 'user' else 'user'
        db.session.commit()
        
        return jsonify({
            'message': f'User role updated to {user.role}',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/toggle-active', methods=['POST'])
@jwt_required()
@admin_required
def admin_toggle_user_active(user_id):
    """
    Toggle user active status
    """
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Toggle active status
        user.is_active = not user.is_active
        db.session.commit()
        
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"}',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dinner-registrations/<int:reg_id>/update-status', methods=['POST'])
@jwt_required()
@admin_required
def admin_update_dinner_status(reg_id):
    """
    Update dinner registration status
    """
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'matched', 'completed', 'cancelled']:
            return jsonify({'error': 'Invalid status'}), 400
        
        registration = DinnerRegistration.query.get(reg_id)
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        registration.status = new_status
        db.session.commit()
        
        return jsonify({
            'message': f'Registration status updated to {new_status}',
            'registration': registration.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dinner-group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_dinner_group_details(group_id):
    """
    Get dinner group details - only accessible by group members or admin
    """
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Check if user is admin
        is_admin = current_user.role == 'admin'
        
        # Get group members
        group_members = DinnerRegistration.query.filter_by(group_id=group_id).all()
        
        if not group_members:
            return jsonify({'error': 'Group not found'}), 404
        
        # Check if current user is part of this group (unless admin)
        if not is_admin:
            user_in_group = any(member.user_id == user_id for member in group_members)
            if not user_in_group:
                return jsonify({'error': 'Access denied. You are not part of this group.'}), 403
        
        # Prepare group data
        members_data = []
        for member in group_members:
            member_info = {
                'id': member.user.id,
                'first_name': member.user.first_name,
                'last_name': member.user.last_name,
                'age': member.user.age,
                'occupation': member.user.occupation,
                'interests': member.user.interests,
                'gender': member.user.gender,
                'bio': member.user.bio,
                'city': member.user.city,
                'dietary_restrictions': member.dietary_restrictions,
                'hobi_interests': member.hobi_interests,
                'personality_type': member.personality_type,
                'bahasa_conversation': member.bahasa_conversation,
                'has_profile_image': member.user.profile_image is not None,
                'registration_id': member.id,
                'status': member.status
            }
            members_data.append(member_info)
        
        # Get group info from first member
        first_member = group_members[0]
        group_info = {
            'group_id': group_id,
            'kota': first_member.kota,
            'budget_preference': first_member.budget_preference,
            'tanggal_tersedia': first_member.tanggal_tersedia.isoformat(),
            'waktu_preference': first_member.waktu_preference,
            'total_members': len(members_data),
            'members': members_data,
            'created_at': first_member.created_at.isoformat()
        }
        
        return jsonify(group_info), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/events', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_events():
    """
    Get all events for admin management
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')
        city = request.args.get('city', '')
        
        query = Event.query
        
        if status:
            query = query.filter(Event.status == status)
        
        if city:
            query = query.filter(Event.city == city)
        
        events = query.order_by(Event.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include registration count for each event
        result = []
        for event in events.items:
            event_data = event.to_dict()
            event_data['registration_count'] = len(event.registrations)
            event_data['groups_count'] = len(event.groups)
            result.append(event_data)
        
        return jsonify({
            'events': result,
            'pagination': {
                'page': page,
                'pages': events.pages,
                'per_page': per_page,
                'total': events.total,
                'has_next': events.has_next,
                'has_prev': events.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/events/<int:event_id>', methods=['PUT'])
@jwt_required()
@admin_required
def admin_update_event(event_id):
    """
    Update event details - Admin only
    """
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        data = request.get_json()
        
        # Update event fields
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'city' in data:
            event.city = data['city']
        if 'event_date' in data:
            event.event_date = datetime.fromisoformat(data['event_date'])
        if 'registration_deadline' in data:
            event.registration_deadline = datetime.fromisoformat(data['registration_deadline'])
        if 'max_participants' in data:
            event.max_participants = data['max_participants']
        if 'budget_range' in data:
            event.budget_range = data['budget_range']
            event.platform_fee = calculate_platform_fee(data['budget_range'])
        if 'status' in data:
            event.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def admin_delete_event(event_id):
    """
    Delete event - Admin only
    """
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if event has registrations
        if event.registrations:
            return jsonify({'error': 'Cannot delete event with existing registrations'}), 400
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist (without dropping existing data)
        db.create_all()
        print("🚀 Database tables created/verified successfully!")
        print("📊 Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False) 