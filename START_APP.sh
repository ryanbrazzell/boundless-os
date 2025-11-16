#!/bin/bash

echo "🚀 Starting Boundless OS Application..."
echo ""
echo "This will start both the frontend and backend servers."
echo "Keep this window open while using the application."
echo ""
echo "Starting servers..."
echo ""

cd "$(dirname "$0")"
npm run dev

