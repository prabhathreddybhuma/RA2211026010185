# Campus Hiring Evaluation - Frontend Assignment

## Overview

This repository contains both projects required for the Affordmed Campus Hiring Evaluation:

1. **Social Media Analytics** - A React frontend application for displaying social media analytics
2. **Average Calculator** - A Node.js HTTP microservice for calculating averages of different number types

## Project Structure

- `/social-media-analytics/` - React frontend application
- `/average-calculator/` - Node.js HTTP microservice

## Project 1: Social Media Analytics

### Features

- Displays top users with the highest number of posts
- Shows trending posts with the maximum number of comments
- Provides a real-time feed of latest posts
- Fully responsive design with modern UI

### Technical Implementation

- Built with React and React Router
- Fetches data from the provided social media platform API
- Uses responsive CSS for mobile and desktop experiences
- Implements efficient data structures for handling unsorted data

### Setup & Running

```bash
cd social-media-analytics
npm install
npm start
```

The application runs on http://localhost:3000

## Project 2: Average Calculator Microservice

### Features

- REST API that accepts different number types: p (prime), f (fibonacci), e (even), r (random)
- Maintains a sliding window of unique numbers
- Calculates average of numbers in the current window
- Returns previous and current window state along with the average

### Technical Implementation

- Built with Express.js
- Handles edge cases such as duplicate numbers and window size management
- Provides appropriate error handling and validation
- Efficient algorithm for window management and average calculation

### API Endpoints

- `GET /numbers/p` - Get prime numbers
- `GET /numbers/f` - Get Fibonacci numbers
- `GET /numbers/e` - Get even numbers
- `GET /numbers/r` - Get random numbers

### Setup & Running

```bash
cd average-calculator
npm install
node server.js
```

The microservice runs on http://localhost:9876

## Testing

### Social Media Analytics

- Manual testing of all three views (Top Users, Trending Posts, Feed)
- Verified responsive design across different screen sizes
- Tested with various data scenarios

### Average Calculator

- Tested all endpoints using Postman
- Verified window management with multiple sequential requests
- Tested error handling with invalid inputs


## Development Notes

- The implementation follows production-grade coding standards
- Maintained clean code structure with appropriate comments
- Used modern JavaScript/React features and patterns
- Ensured error handling for better user experience

## Technologies Used

- React
- Express.js
- Node.js
- JavaScript/ES6+
- CSS3
- RESTful API design

---

*This project was completed as part of the Affordmed Campus Hiring Evaluation.*
