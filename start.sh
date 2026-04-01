#!/bin/bash

echo "========================================"
echo "  TrustBound - Integrated Setup"
echo "========================================"
echo ""
echo "PREREQUISITES:"
echo "  1. Node.js installed"
echo "  2. MongoDB running or MongoDB Atlas URI"
echo ""
echo "========================================"
echo ""
echo "Choose an option:"
echo "  1 - Start Backend Only (localhost:5000)"
echo "  2 - Start Backend + Show Frontend Instructions"
echo "  3 - Show Setup Instructions"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "Starting Backend Server..."
    cd trustbound/backend
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies..."
      npm install
    fi
    npm run dev
    ;;
  2)
    echo ""
    echo "Starting Backend Server..."
    cd trustbound/backend
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies..."
      npm install
    fi
    echo ""
    echo "========================================"
    echo "Backend: http://localhost:5000"
    echo "API: http://localhost:5000/api"
    echo "Health Check: http://localhost:5000/api/health"
    echo "========================================"
    echo ""
    echo "After backend starts, open in another terminal:"
    echo "  Frontend: Open frontend/index.html in your browser"
    echo "========================================"
    echo ""
    npm run dev
    ;;
  3)
    echo ""
    echo "========================================"
    echo "TRUSTBOUND SETUP INSTRUCTIONS"
    echo "========================================"
    echo ""
    echo "1. INSTALL DEPENDENCIES"
    echo "   cd trustbound/backend"
    echo "   npm install"
    echo ""
    echo "2. START MONGODB"
    echo "   mongod"
    echo "   (or use MongoDB Atlas: update MONGO_URI in .env)"
    echo ""
    echo "3. START BACKEND"
    echo "   cd trustbound/backend"
    echo "   npm run dev"
    echo "   (Server runs on http://localhost:5000)"
    echo ""
    echo "4. OPEN FRONTEND"
    echo "   Open frontend/index.html in your browser"
    echo ""
    echo "5. TEST LOGIN"
    echo "   Email: arjun@example.com"
    echo "   Password: password"
    echo ""
    echo "========================================"
    ;;
  *)
    echo "Invalid choice. Please run again."
    ;;
esac
