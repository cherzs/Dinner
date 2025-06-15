# 🍽️ SocialConnect - Mystery Dinner Platform

A modern social discovery platform inspired by Timeleft, where users can register for mystery dinners and get matched with 5 compatible people based on their preferences, interests, and personality.

## ✨ Features

### 🎯 **Core Functionality**
- **User Registration & Authentication** - Secure JWT-based auth system
- **Mystery Dinner Registration** - Comprehensive preference-based matching
- **Smart Matching Algorithm** - AI-powered compatibility matching
- **Budget-Based Grouping** - Groups formed by budget compatibility
- **Platform Fee System** - Tiered pricing based on budget ranges

### 🎨 **Modern UI/UX**
- **Gradient Design** - Beautiful purple-blue gradient backgrounds
- **Responsive Layout** - Works perfectly on all devices
- **Interactive Elements** - Smooth animations and hover effects
- **Modern Forms** - Clean, user-friendly form designs
- **Loading States** - Elegant loading animations

### 🔧 **Technical Features**
- **React.js Frontend** - Modern component-based architecture
- **Flask Backend** - Robust Python API with SQLAlchemy ORM
- **PostgreSQL Database** - Reliable data storage
- **Environment Variables** - Secure configuration management
- **CORS Support** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL database

### 1. Clone Repository
```bash
git clone <repository-url>
cd dinner
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Flask Configuration
SECRET_KEY=your-super-secret-key-here

# Optional: Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Initialize database with sample data
cd backend
python seed_data.py

# Start Flask server
python app.py
```

### 4. Frontend Setup
```bash
# Install Node.js dependencies
cd frontend
npm install

# Start React development server
npm start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🏗️ Project Structure

```
dinner/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration with env variables
│   ├── matching_algorithm.py  # Smart matching logic
│   ├── seed_data.py          # Database initialization
│   └── .env                  # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React context providers
│   │   ├── pages/           # Main application pages
│   │   │   ├── DaftarDinner.js  # Mystery dinner registration
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Login.js         # User authentication
│   │   │   └── Register.js      # User registration
│   │   ├── App.js           # Main React component
│   │   └── index.css        # Global styles
│   └── package.json         # Node.js dependencies
├── requirements.txt         # Python dependencies
├── run.py                  # Automated startup script
└── README.md              # This file
```

## 🎮 How It Works

### 1. **User Registration**
- Simple registration with name, email, and password
- Age automatically set to 25 if not provided
- Secure password hashing with bcrypt

### 2. **Mystery Dinner Registration**
Users fill out comprehensive preferences:
- **📍 Basic Info**: City, date, budget, time preference
- **🍕 Food Preferences**: Dietary restrictions and allergies
- **🎯 Personality & Interests**: Hobbies, personality type, occupation
- **🤝 Matching Preferences**: Age preference, meeting purpose, language

### 3. **Smart Matching Algorithm**
- **Budget Compatibility**: Primary matching criteria
- **Interest Alignment**: Hobby and personality matching
- **Geographic Proximity**: Same city matching
- **Age Preferences**: Respects user age preferences
- **Balanced Groups**: Creates diverse, compatible groups of 6

### 4. **Platform Fee Structure**
- **100k-200k**: Rp 15,000 platform fee
- **200k-300k**: Rp 25,000 platform fee
- **300k-400k**: Rp 35,000 platform fee
- **400k-500k**: Rp 45,000 platform fee
- **500k+**: Rp 55,000 platform fee

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - Component-based UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### **Backend**
- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **PostgreSQL** - Relational database

### **Development Tools**
- **python-dotenv** - Environment variable management
- **bcrypt** - Password hashing
- **psycopg2** - PostgreSQL adapter

## 🎨 Design Features

### **Visual Design**
- **Modern Gradient Backgrounds** - Purple-blue gradients throughout
- **Card-Based Layout** - Clean, organized content presentation
- **Smooth Animations** - Hover effects and loading states
- **Responsive Design** - Mobile-first approach

### **User Experience**
- **Intuitive Navigation** - Clear menu structure
- **Form Validation** - Real-time input validation
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages

## 📊 Database Schema

### **Users Table**
- Basic user information (name, email, age, city)
- Authentication data (password hash)
- Preferences (budget, dietary restrictions)

### **Dinner Registrations Table**
- Comprehensive user preferences
- Matching criteria and special notes
- Status tracking (pending, matched, completed)

### **Events Table**
- Budget-based event categories
- Platform fee calculations
- Event status management

## 🔐 Security Features

- **Environment Variables** - Sensitive data protection
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Server-side data validation
- **CORS Configuration** - Controlled cross-origin access

## 🚀 Deployment

### **Environment Variables Required**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key
```

### **Production Considerations**
- Set `FLASK_ENV=production`
- Use strong, unique secret keys
- Configure proper database connection
- Set up SSL/HTTPS
- Configure email service for notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Sample Login

For testing purposes, use these sample credentials:
- **Email**: alice@example.com
- **Password**: password123

## 🎯 Future Enhancements

- **Payment Integration** - Midtrans payment gateway
- **Email Notifications** - Automated matching notifications
- **Restaurant Integration** - Partner restaurant bookings
- **Mobile App** - React Native mobile application
- **Advanced Matching** - ML-based compatibility scoring

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React.js and Flask** 