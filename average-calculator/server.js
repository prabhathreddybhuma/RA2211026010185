// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 9876;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(express.static(__dirname));

// Configuration
const WINDOW_SIZE = 10;
const TEST_SERVER_URL = 'http://20.244.56.144/test';
const NUMBER_TYPES = {
  p: 'primes',
  f: 'fibo', 
  e: 'even',
  r: 'rand'
};

// In-memory storage for window state
const windowState = {
  windowPrevState: [],
  windowCurrState: [],
  lastFetch: {
    url: '',
    timestamp: 0,
    numbers: []
  }
};

// Add unique numbers to the window
const addToWindow = (numbers) => {
  if (!Array.isArray(numbers)) {
    return;
  }
  
  // Filter for unique numbers not already in the window
  const uniqueNewNumbers = numbers.filter(
    num => !windowState.windowCurrState.includes(num)
  );
  
  if (uniqueNewNumbers.length === 0) {
    return;
  }
  
  // Save previous state before updating
  windowState.windowPrevState = [...windowState.windowCurrState];
  
  if (windowState.windowCurrState.length + uniqueNewNumbers.length <= WINDOW_SIZE) {
    // If we have space, add all unique numbers
    windowState.windowCurrState = [...windowState.windowCurrState, ...uniqueNewNumbers];
  } else {
    // If we need to replace old numbers, fill up to window size
    const spaceAvailable = WINDOW_SIZE - windowState.windowCurrState.length;
    
    if (spaceAvailable > 0) {
      // First, add as many as we can
      windowState.windowCurrState = [
        ...windowState.windowCurrState,
        ...uniqueNewNumbers.slice(0, spaceAvailable)
      ];
      
      // Then replace oldest with remaining numbers
      const remainingNumbers = uniqueNewNumbers.slice(spaceAvailable);
      
      if (remainingNumbers.length > 0) {
        // Remove oldest numbers and add new ones
        const newWindow = [...windowState.windowCurrState];
        newWindow.splice(0, remainingNumbers.length);
        windowState.windowCurrState = [...newWindow, ...remainingNumbers];
      }
    } else {
      // Replace oldest with new numbers (up to WINDOW_SIZE total)
      const newNumbers = uniqueNewNumbers.slice(0, WINDOW_SIZE);
      const remainingOldNumbers = windowState.windowCurrState.slice(newNumbers.length);
      windowState.windowCurrState = [...remainingOldNumbers, ...newNumbers];
    }
  }
};

// Calculate average of current window
const calculateAverage = () => {
  if (windowState.windowCurrState.length === 0) {
    return 0;
  }
  
  const sum = windowState.windowCurrState.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / windowState.windowCurrState.length).toFixed(2));
};

// Fetch numbers from the test server (mock implementation)
const fetchNumbers = async (numberType) => {
  const endpoint = NUMBER_TYPES[numberType];
  if (!endpoint) {
    throw new Error(`Invalid number type: ${numberType}`);
  }
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return mock data based on number type
  switch (numberType) {
    case 'p':
      return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    case 'f':
      return [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    case 'e':
      return [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    case 'r':
      return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    default:
      return [];
  }
};

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes
app.get('/numbers/:numberId', async (req, res) => {
  const startTime = Date.now();
  try {
    const { numberId } = req.params;
    
    // Validate number ID
    if (!Object.keys(NUMBER_TYPES).includes(numberId)) {
      return res.status(400).json({ 
        error: `Invalid number type. Must be one of: ${Object.keys(NUMBER_TYPES).join(', ')}` 
      });
    }
    
    // Fetch new numbers
    const numbers = await fetchNumbers(numberId);
    
    // Update window with new numbers
    addToWindow(numbers);
    
    // Calculate average
    const avg = calculateAverage();
    
    // Prepare response
    const response = {
      windowPrevState: windowState.windowPrevState,
      windowCurrState: windowState.windowCurrState,
      numbers: numbers,
      avg: avg
    };
    
    // Set content type and send JSON response
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    const duration = Date.now() - startTime;
    console.log(`Request processed in ${duration}ms`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on http://localhost:${PORT}`);
  console.log(`Window size set to: ${WINDOW_SIZE}`);
});