#!/usr/bin/env python3
"""
Startup script untuk SocialConnect project
Menjalankan backend Flask dan frontend React secara bersamaan
"""

import os
import sys
import subprocess
import platform
import time
from pathlib import Path

def is_windows():
    return platform.system().lower() == 'windows'

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python
    try:
        python_version = sys.version_info
        if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
            print("❌ Python 3.8+ required")
            return False
        print(f"✅ Python {python_version.major}.{python_version.minor}")
    except:
        print("❌ Python not found")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
        else:
            print("❌ Node.js not found")
            return False
    except:
        print("❌ Node.js not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()}")
        else:
            print("❌ npm not found")
            return False
    except:
        print("❌ npm not found")
        return False
    
    return True

def setup_backend():
    """Setup and start backend"""
    print("\n🐍 Setting up backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return None
    
    os.chdir(backend_dir)
    
    # Check if virtual environment exists
    venv_dir = Path("venv")
    if not venv_dir.exists():
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
    
    # Activate virtual environment and install dependencies
    if is_windows():
        activate_script = Path("venv/Scripts/activate.bat")
        python_executable = Path("venv/Scripts/python.exe")
    else:
        activate_script = Path("venv/bin/activate")
        python_executable = Path("venv/bin/python")
    
    if not python_executable.exists():
        print("❌ Virtual environment setup failed")
        return None
    
    # Install requirements
    print("📥 Installing Python dependencies...")
    result = subprocess.run([str(python_executable), "-m", "pip", "install", "-r", "requirements.txt"], 
                          capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Failed to install requirements: {result.stderr}")
        return None
    
    # Always run seed script for PostgreSQL (it will check for existing data)
    print("🌱 Setting up database with sample data...")
    result = subprocess.run([str(python_executable), "seed_data.py"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"⚠️ Database seeding had issues (this is normal if data already exists): {result.stderr}")
    else:
        print("✅ Database setup completed")
    
    print("✅ Backend setup complete")
    os.chdir("..")
    return python_executable

def setup_frontend():
    """Setup frontend"""
    print("\n⚛️ Setting up frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    os.chdir(frontend_dir)
    
    # Check if node_modules exists
    if not Path("node_modules").exists():
        print("📥 Installing Node.js dependencies...")
        result = subprocess.run(["npm", "install"], capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"❌ Failed to install npm packages: {result.stderr}")
            return False
    
    print("✅ Frontend setup complete")
    os.chdir("..")
    return True

def start_backend(python_executable):
    """Start backend server"""
    print("\n🚀 Starting backend server...")
    os.chdir("backend")
    
    # Start Flask app
    backend_process = subprocess.Popen([str(python_executable), "app.py"])
    os.chdir("..")
    return backend_process

def start_frontend():
    """Start frontend server"""
    print("🚀 Starting frontend server...")
    os.chdir("frontend")
    
    # Start React app
    frontend_process = subprocess.Popen(["npm", "start"])
    os.chdir("..")
    return frontend_process

def main():
    """Main function"""
    print("🎉 SocialConnect Startup Script")
    print("=" * 50)
    
    if not check_dependencies():
        print("\n❌ Please install missing dependencies and try again")
        sys.exit(1)
    
    # Setup backend
    python_executable = setup_backend()
    if not python_executable:
        print("\n❌ Backend setup failed")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("\n❌ Frontend setup failed")
        sys.exit(1)
    
    print("\n🎯 Starting servers...")
    print("Backend will run on: http://localhost:5000")
    print("Frontend will run on: http://localhost:3000")
    print("\nPress Ctrl+C to stop both servers")
    
    try:
        # Start backend
        backend_process = start_backend(python_executable)
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = start_frontend()
        
        # Keep running until interrupted
        print("\n✅ Both servers are running!")
        print("🌐 Open http://localhost:3000 in your browser")
        
        # Wait for processes
        while True:
            time.sleep(1)
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("⚠️ Backend process stopped")
                break
            if frontend_process.poll() is not None:
                print("⚠️ Frontend process stopped")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
        # Terminate processes
        try:
            backend_process.terminate()
            frontend_process.terminate()
            
            # Wait for processes to terminate
            backend_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
            
        except subprocess.TimeoutExpired:
            # Force kill if they don't terminate gracefully
            backend_process.kill()
            frontend_process.kill()
        
        print("✅ Servers stopped successfully")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1) 