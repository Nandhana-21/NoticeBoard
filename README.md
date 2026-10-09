# Department Notice Board

A small full-stack app. The Express server stores notices in MongoDB; the React (TypeScript) page lists them and lets users add new ones.

## Structure
```
server/   Express + MongoDB (Mongoose) API
client/   React + TypeScript (Vite) page
```

## Requirements
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## How to run

### 1. Server (terminal 1)
```
cd server
npm install
copy .env.example .env      # Windows (on Mac/Linux: cp .env.example .env)
npm start
```
Server runs at http://localhost:5000
- `/` - welcome message
- `/faculty` - faculty list
- `GET /api/notices` - all notices
- `POST /api/notices` - add a notice (`{ "title": "...", "message": "..." }`); an empty title or message returns `400` with an error message

### 2. Client (terminal 2)
```
cd client
npm install
npm run dev
```
Open http://localhost:5173. Vite forwards `/api` calls to the server on port 5000.

## Features
- Notices load from MongoDB when the page opens
- Add form (title + message + Add button) saves to MongoDB and shows the new notice instantly
- `NoticeCard` component receives `title` and `message` via props
