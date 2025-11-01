#!/bin/bash

echo "========================================"
echo " MarketSync - Trading Journal"
echo " Starting Development Servers..."
echo "========================================"
echo ""

echo "Starting MongoDB connection..."
echo "(Make sure MongoDB is running on your system)"
echo ""

echo "Starting Express Server..."
cd server && npm start &
SERVER_PID=$!

sleep 3

echo "Starting React Client..."
cd ../client && npm start &
CLIENT_PID=$!

echo ""
echo "========================================"
echo " Both servers are starting..."
echo " Server: http://localhost:5000"
echo " Client: http://localhost:3000"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

wait





