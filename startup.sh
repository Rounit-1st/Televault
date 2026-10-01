#!/bin/bash

cd frontend
npm install
npm run dev &
FRONTEND_PID=$!

cd ../backend
npm install
npm run dev &
BACKEND_PID=$!

wait $FRONTEND_PID $BACKEND_PID
