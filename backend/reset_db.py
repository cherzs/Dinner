from app import create_app, db

app = create_app('development')

with app.app_context():
    print('Dropping all tables...')
    db.drop_all()
    print('Creating all tables...')
    db.create_all()
    print('Database has been reset successfully!') 