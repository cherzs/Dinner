from flask import jsonify, request, session

from app.models import User
from app import db
from app.utils.helpers import save_file

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        
        # Check if username or email already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            full_name=data.get('full_name'),
            phone=data.get('phone'),
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        session.permanent = True
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
    
    @staticmethod
    def login(data):
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'password' not in data:
            return jsonify({'error': 'Password is required'}), 400
        if 'email' in data:
            user = User.query.filter_by(email=data['email']).first()
        elif 'username' in data:
            user = User.query.filter_by(username=data['username']).first()
        else:
            return jsonify({'error': 'Email or username is required'}), 400
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        session['user_id'] = user.id
        session.permanent = True
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })
    
    @staticmethod
    def logout():
        session.pop('user_id', None)
        return jsonify({'message': 'Logged out successfully'})
    
    @staticmethod
    def get_profile(user):
        return jsonify(user.to_dict())
    
    @staticmethod
    def update_profile(user):
        data = request.get_json()
        
        # Update user fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'bio' in data:
            user.bio = data['bio']
        if 'gender' in data:
            user.gender = data['gender']
        if 'age' in data:
            user.age = data['age']
        
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        })
    
    @staticmethod
    def upload_profile_image(user):
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if not file.filename:
            return jsonify({'error': 'No selected file'}), 400
        
        # Save the new image
        filename = save_file(file, 'profile_images')
        if not filename:
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Delete old image if exists
        if user.profile_image:
            from app.utils.helpers import delete_file
            delete_file(user.profile_image)
        
        # Update user profile image
        user.profile_image = filename
        db.session.commit()
        
        return jsonify({
            'message': 'Profile image uploaded successfully',
            'profile_image': filename
        }) 