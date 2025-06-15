from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv
import click

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
cors = CORS()

def create_app(env='development'):
    app = Flask(__name__)
    
    # Load config
    if env == 'production':
        app.config.from_object('app.config.ProductionConfig')
    else:
        app.config.from_object('app.config.DevelopmentConfig')
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": [
                "https://fe-dinner-36l24chhn-cherzs-projects.vercel.app",
                "https://fe-dinner.vercel.app",
                "https://fe-dinner-cherzs-projects.vercel.app",
                "http://localhost:3000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.events import events_bp
    from app.routes.dinner import dinner_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(events_bp, url_prefix='/api')
    app.register_blueprint(dinner_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Root route
    @app.route('/')
    def index():
        return jsonify({
            'status': 'ok',
            'message': 'Dinner API is running'
        })
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Add reset-db command
    @app.cli.command('reset-db')
    @click.confirmation_option(prompt='Are you sure you want to drop all tables and recreate them? This will delete all data!')
    def reset_db():
        """Drop all tables and recreate them."""
        db.drop_all()
        db.create_all()
        click.echo('Database has been reset.')
    
    return app 