from app import app, db, User, Event, Registration, DinnerRegistration, Group
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta, date
import random

def create_sample_users():
    """Create sample users for testing"""
    users_data = [
        {
            'email': 'alice@example.com',
            'password': 'password123',
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'age': 28,
            'city': 'Jakarta',
            'occupation': 'Software Engineer',
            'bio': 'Tech enthusiast who loves trying new restaurants and meeting new people!',
            'interests': 'Technology, Photography, Traveling, Coffee',
            'preferred_language': 'English',
            'budget_preference': '200k-300k',
            'dietary_restrictions': 'Tidak Ada',
            'gender': 'Perempuan'
        },
        {
            'email': 'bob@example.com',
            'password': 'password123',
            'first_name': 'Bob',
            'last_name': 'Smith',
            'age': 32,
            'city': 'Jakarta',
            'occupation': 'Marketing Manager',
            'bio': 'Love good food and great conversations. Always up for new adventures!',
            'interests': 'Marketing, Sports, Music, Cooking',
            'preferred_language': 'Indonesian',
            'budget_preference': '200k-300k',
            'dietary_restrictions': 'Halal',
            'gender': 'Laki-laki'
        },
        {
            'email': 'charlie@example.com',
            'password': 'password123',
            'first_name': 'Charlie',
            'last_name': 'Brown',
            'age': 26,
            'city': 'Bandung',
            'occupation': 'Graphic Designer',
            'bio': 'Creative soul with a passion for design and good food.',
            'interests': 'Design, Art, Photography, Hiking',
            'preferred_language': 'Indonesian',
            'budget_preference': '100k-200k',
            'dietary_restrictions': 'Vegetarian',
            'gender': 'Laki-laki'
        },
        {
            'email': 'diana@example.com',
            'password': 'password123',
            'first_name': 'Diana',
            'last_name': 'Lee',
            'age': 30,
            'city': 'Jakarta',
            'occupation': 'Data Scientist',
            'bio': 'Numbers by day, foodie by night. Love analyzing data and trying new cuisines.',
            'interests': 'Data Science, Reading, Culiner, Yoga',
            'preferred_language': 'Both',
            'budget_preference': '200k-300k',
            'dietary_restrictions': 'Tidak Ada',
            'gender': 'Perempuan'
        },
        {
            'email': 'erik@example.com',
            'password': 'password123',
            'first_name': 'Erik',
            'last_name': 'Wilson',
            'age': 29,
            'city': 'Surabaya',
            'occupation': 'Teacher',
            'bio': 'Educator with a love for learning and sharing experiences with others.',
            'interests': 'Education, Books, Travel, Music',
            'preferred_language': 'Indonesian',
            'budget_preference': '100k-200k',
            'dietary_restrictions': 'Tidak Ada',
            'gender': 'Laki-laki'
        },
        {
            'email': 'fiona@example.com',
            'password': 'password123',
            'first_name': 'Fiona',
            'last_name': 'Davis',
            'age': 27,
            'city': 'Jakarta',
            'occupation': 'Startup Founder',
            'bio': 'Entrepreneur building the next big thing. Love networking and good food!',
            'interests': 'Startup, Business, Networking, Fitness',
            'preferred_language': 'English',
            'budget_preference': '300k-400k',
            'dietary_restrictions': 'No Pork',
            'gender': 'Perempuan'
        },
        {
            'email': 'george@example.com',
            'password': 'password123',
            'first_name': 'George',
            'last_name': 'Miller',
            'age': 31,
            'city': 'Bandung',
            'occupation': 'Doctor',
            'bio': 'Medical professional who believes in work-life balance and great conversations.',
            'interests': 'Medicine, Hiking, Photography, Classical Music',
            'preferred_language': 'Indonesian',
            'budget_preference': '100k-200k',
            'dietary_restrictions': 'Tidak Ada',
            'gender': 'Laki-laki'
        },
        {
            'email': 'helen@example.com',
            'password': 'password123',
            'first_name': 'Helen',
            'last_name': 'Chen',
            'age': 25,
            'city': 'Jakarta',
            'occupation': 'Financial Analyst',
            'bio': 'Finance professional with a passion for good food and interesting people.',
            'interests': 'Finance, Investing, Food, Travel',
            'preferred_language': 'Both',
            'budget_preference': '200k-300k',
            'dietary_restrictions': 'No Seafood',
            'gender': 'Perempuan'
        }
    ]
    
    # Add admin user
    admin_data = {
        'email': 'admin@socialconnect.com',
        'password': 'admin123',
        'first_name': 'Admin',
        'last_name': 'User',
        'age': 30,
        'city': 'Jakarta',
        'occupation': 'Platform Administrator',
        'bio': 'Administrator of SocialConnect platform',
        'interests': 'Technology, Management, Analytics',
        'preferred_language': 'Both',
        'budget_preference': '200k-300k',
        'dietary_restrictions': 'Tidak Ada',
        'role': 'admin',
        'gender': 'Laki-laki'
    }
    users_data.append(admin_data)
    
    users = []
    for user_data in users_data:
        # Check if user already exists
        existing_user = User.query.filter_by(email=user_data['email']).first()
        if not existing_user:
            user = User(
                email=user_data['email'],
                password_hash=generate_password_hash(user_data['password']),
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                age=user_data['age'],
                city=user_data['city'],
                occupation=user_data['occupation'],
                bio=user_data['bio'],
                interests=user_data['interests'],
                preferred_language=user_data['preferred_language'],
                budget_preference=user_data['budget_preference'],
                dietary_restrictions=user_data['dietary_restrictions'],
                role=user_data.get('role', 'user'),  # Default to 'user' if not specified
                gender=user_data.get('gender', None)  # Add gender field
            )
            db.session.add(user)
            users.append(user)
    
    db.session.commit()
    return users

def create_sample_events():
    """Create sample events for testing"""
    events_data = [
        {
            'title': 'Mystery Dinner Jakarta - Budget Friendly',
            'description': 'Join us for an exciting evening of food and conversation with fellow Jakarta foodies! Budget: 100k-200k per person.',
            'city': 'Jakarta',
            'event_date': datetime.now() + timedelta(days=7),
            'registration_deadline': datetime.now() + timedelta(days=5),
            'max_participants': 6,
            'budget_range': '100k-200k',
            'platform_fee': 15000.0,
            'status': 'open'
        },
        {
            'title': 'Bandung Foodie Meetup - Mid Range',
            'description': 'Discover the best culinary gems in Bandung while making new friends! Budget: 200k-300k per person.',
            'city': 'Bandung',
            'event_date': datetime.now() + timedelta(days=10),
            'registration_deadline': datetime.now() + timedelta(days=8),
            'max_participants': 6,
            'budget_range': '200k-300k',
            'platform_fee': 25000.0,
            'status': 'open'
        },
        {
            'title': 'Surabaya Social Dinner - Budget Friendly',
            'description': 'Connect with like-minded individuals over delicious East Javanese cuisine! Budget: 100k-200k per person.',
            'city': 'Surabaya',
            'event_date': datetime.now() + timedelta(days=14),
            'registration_deadline': datetime.now() + timedelta(days=12),
            'max_participants': 6,
            'budget_range': '100k-200k',
            'platform_fee': 15000.0,
            'status': 'open'
        },
        {
            'title': 'Jakarta Premium Experience',
            'description': 'An upscale dining experience for professionals looking to network and socialize. Budget: 300k-400k per person.',
            'city': 'Jakarta',
            'event_date': datetime.now() + timedelta(days=21),
            'registration_deadline': datetime.now() + timedelta(days=19),
            'max_participants': 8,
            'budget_range': '300k-400k',
            'platform_fee': 35000.0,
            'status': 'open'
        },
        {
            'title': 'Young Professionals Jakarta - Mid Range',
            'description': 'Perfect for young professionals (22-30) looking to expand their network. Budget: 200k-300k per person.',
            'city': 'Jakarta',
            'event_date': datetime.now() + timedelta(days=28),
            'registration_deadline': datetime.now() + timedelta(days=26),
            'max_participants': 6,
            'budget_range': '200k-300k',
            'platform_fee': 25000.0,
            'status': 'open'
        }
    ]
    
    events = []
    for event_data in events_data:
        # Check if event already exists
        existing_event = Event.query.filter_by(
            title=event_data['title'],
            city=event_data['city']
        ).first()
        
        if not existing_event:
            event = Event(**event_data)
            db.session.add(event)
            events.append(event)
    
    db.session.commit()
    return events

def create_sample_registrations(users, events):
    """Create some sample registrations"""
    # Register some users for events
    registrations = [
        (users[0], events[0]),  # Alice -> Jakarta Weekend
        (users[1], events[0]),  # Bob -> Jakarta Weekend
        (users[3], events[0]),  # Diana -> Jakarta Weekend
        (users[5], events[0]),  # Fiona -> Jakarta Weekend
        (users[7], events[0]),  # Helen -> Jakarta Weekend
        
        (users[2], events[1]),  # Charlie -> Bandung Foodie
        (users[6], events[1]),  # George -> Bandung Foodie
        
        (users[4], events[2]),  # Erik -> Surabaya Social
    ]
    
    for user, event in registrations:
        # Check if registration already exists
        existing_reg = Registration.query.filter_by(
            user_id=user.id, 
            event_id=event.id
        ).first()
        
        if not existing_reg:
            registration = Registration(
                user_id=user.id,
                event_id=event.id,
                payment_status='paid'  # Mark as paid for testing
            )
            db.session.add(registration)
    
    db.session.commit()

def create_sample_dinner_registrations():
    """Create sample dinner registrations for testing"""
    users = User.query.all()
    if not users:
        return
    
    dinner_registrations_data = [
        {
            'user_id': users[0].id,  # Alice
            'kota': 'Jakarta',
            'budget_preference': '200k-300k',
            'tanggal_tersedia': date.today() + timedelta(days=3),
            'waktu_preference': 'malam',
            'dietary_restrictions': 'Tidak Ada',
            'hobi_interests': 'Technology, Photography, Coffee',
            'personality_type': 'Extrovert, Tech-savvy, Friendly',
            'age_preference': '25-35',
            'tujuan_kenalan': 'Networking dan teman baru',
            'bahasa_conversation': 'English',
            'pekerjaan': 'Software Engineer',
            'special_notes': 'Love discussing tech trends and startup ideas',
            'status': 'pending'
        },
        {
            'user_id': users[1].id,  # Bob
            'kota': 'Jakarta',
            'budget_preference': '200k-300k',
            'tanggal_tersedia': date.today() + timedelta(days=5),
            'waktu_preference': 'malam',
            'dietary_restrictions': 'Halal',
            'hobi_interests': 'Marketing, Sports, Music',
            'personality_type': 'Outgoing, Sports enthusiast, Music lover',
            'age_preference': '28-40',
            'tujuan_kenalan': 'Networking profesional',
            'bahasa_conversation': 'Indonesian',
            'pekerjaan': 'Marketing Manager',
            'special_notes': 'Interested in discussing marketing strategies and sports',
            'status': 'pending'
        },
        {
            'user_id': users[2].id,  # Charlie
            'kota': 'Bandung',
            'budget_preference': '100k-200k',
            'tanggal_tersedia': date.today() + timedelta(days=7),
            'waktu_preference': 'sore',
            'dietary_restrictions': 'Vegetarian',
            'hobi_interests': 'Design, Art, Photography',
            'personality_type': 'Creative, Artistic, Thoughtful',
            'age_preference': '23-30',
            'tujuan_kenalan': 'Teman dengan minat serupa',
            'bahasa_conversation': 'Indonesian',
            'pekerjaan': 'Graphic Designer',
            'special_notes': 'Love discussing art, design trends, and creative projects',
            'status': 'matched'
        },
        {
            'user_id': users[3].id,  # Diana
            'kota': 'Jakarta',
            'budget_preference': '200k-300k',
            'tanggal_tersedia': date.today() + timedelta(days=4),
            'waktu_preference': 'malam',
            'dietary_restrictions': 'Tidak Ada',
            'hobi_interests': 'Data Science, Reading, Culiner',
            'personality_type': 'Analytical, Curious, Foodie',
            'age_preference': '26-35',
            'tujuan_kenalan': 'Diskusi intelektual dan kuliner',
            'bahasa_conversation': 'Both',
            'pekerjaan': 'Data Scientist',
            'special_notes': 'Enjoy discussing data trends, books, and trying new cuisines',
            'status': 'pending'
        }
    ]
    
    for reg_data in dinner_registrations_data:
        # Check if registration already exists
        existing_reg = DinnerRegistration.query.filter_by(
            user_id=reg_data['user_id']
        ).first()
        
        if not existing_reg:
            dinner_reg = DinnerRegistration(**reg_data)
            db.session.add(dinner_reg)
    
    db.session.commit()
    print(f"✅ Created sample dinner registrations")

def seed_database():
    """Main function to seed the database"""
    print("🌱 Starting database seeding...")
    
    # Create tables
    with app.app_context():
        print("🗄️ Creating database tables...")
        db.create_all()
        
        print("👥 Creating sample users...")
        users = create_sample_users()
        print(f"✅ Created {len(users)} users")
        
        print("📅 Creating sample events...")
        events = create_sample_events()
        print(f"✅ Created {len(events)} events")
        
        print("📝 Creating sample registrations...")
        create_sample_registrations(User.query.all(), Event.query.all())
        print("✅ Created sample registrations")
        
        print("🍽️ Creating sample dinner registrations...")
        create_sample_dinner_registrations()
        
        print("🎉 Database seeding completed!")
        print("\n📧 Sample login credentials:")
        print("👤 Regular User: alice@example.com, Password: password123")
        print("👤 Regular User: bob@example.com, Password: password123")
        print("🔑 Admin User: admin@socialconnect.com, Password: admin123")
        print("(and so on for other users...)")

if __name__ == '__main__':
    seed_database() 