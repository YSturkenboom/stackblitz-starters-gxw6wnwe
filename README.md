# Todo App Challenge

A 20-minute live coding challenge for experienced MERN fullstack developers. This is a partially implemented todo application that needs several key features to be completed.

## Current Features

- Basic todo CRUD operations
- Status management (Not Started, In Progress, Finished)
- Drag and drop reordering
- Frontend filtering UI
- Toast notifications
- Simulated MongoDB database

## Challenge Requirements

You have 20 minutes to implement as many of the following features as possible. Choose wisely based on your strengths and the time available.

### Backend TODOs

1. **API Routes**
   - Implement proper error handling and validation in all API routes
   - Implement create endpoint (POST /api/todos)
   - Implement filter endpoint (GET /api/todos with statuses query param)
   - Implement update endpoint (PUT /api/todos/[id])
   - Implement delete endpoint (DELETE /api/todos/[id])

2. **Data Management**
   - Implement proper order persistence for drag-and-drop
   - Implement backend filtering logic using the simulated DB

### Frontend TODOs

1. **State Management**
   - Implement proper loading states and error boundaries
   - Implement proper state updates for todo operations
   - Implement proper state updates for status changes

2. **Filter Feature**
   - Implement filtering logic in the endpoint
   - Add proper error handling for filter operations

### General TODOs

- Add proper error handling for failed API calls
- Add proper toast notifications for all operations

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Notes

- The application uses a simulated MongoDB database (no need to set up a real database)
- All necessary dependencies are already installed
- Focus on implementing features rather than setting up infrastructure
- Choose which features to implement based on your strengths and time available
- The codebase includes detailed comments explaining what needs to be implemented

## Evaluation Criteria

- Code quality and organization
- Feature implementation completeness
- Error handling
- TypeScript usage
- API design
- State management
- User experience

Good luck! 