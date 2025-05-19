
# Event Management Backend

This is the backend service for the Event Management application.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```

3. Run the development server:
```
npm run dev
```

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/range/:start/:end` - Get events in a date range
- `POST /api/events/:id/check-in` - Check in a participant to an event

### Participants

- `GET /api/participants` - Get all participants
- `POST /api/participants` - Create a new participant

### Properties

- `GET /api/properties` - Get all properties

## Production Deployment

For production, you would need to:

1. Set up a proper database (MongoDB, PostgreSQL, etc.)
2. Configure environment variables
3. Set up authentication
4. Deploy to a hosting service like Heroku, AWS, or DigitalOcean

## Future Improvements

- Connect to a real database
- Add authentication
- Add more comprehensive error handling
- Add logging
- Add tests
- Add documentation
