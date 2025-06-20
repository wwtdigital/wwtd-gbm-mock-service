// Mock API service for GBM Chatbot
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8000;

// Sample data store
let threads = [];
const users = {
  'user123': { user_id: 'user123', email: 'user@example.com', first_name: 'Demo', last_name: 'User', role: 'client' }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all threads
app.get('/api/threads', (req, res) => {
  res.json(threads);
});

// Get a specific thread
app.get('/api/threads/:thread_id', (req, res) => {
  const thread = threads.find(t => t.thread_id === req.params.thread_id);
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  res.json(thread);
});

// Create or continue a thread
app.post('/api/threads', (req, res) => {
  const { thread_id, user_id, content, role } = req.body;
  
  // If thread_id is provided, find and update existing thread
  if (thread_id) {
    const threadIndex = threads.findIndex(t => t.thread_id === thread_id);
    if (threadIndex === -1) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    // Add new entry to thread
    const entryId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const newEntry = {
      entry_id: entryId,
      thread_id: thread_id,
      category: 'message',
      data: {
        role,
        content
      },
      created_at: timestamp
    };
    
    threads[threadIndex].entries.push(newEntry);
    
    // Add assistant response
    const assistantEntryId = uuidv4();
    const assistantResponse = {
      entry_id: assistantEntryId,
      thread_id: thread_id,
      category: 'message',
      data: {
        role: 'assistant',
        content: {
          text: `This is a mock assistant response to: "${content.text}"`,
          sources: null
        }
      },
      created_at: new Date().toISOString()
    };
    
    threads[threadIndex].entries.push(assistantResponse);
    
    return res.json(threads[threadIndex]);
  }
  
  // Create new thread
  const newThreadId = uuidv4();
  const timestamp = new Date().toISOString();
  
  // Create initial entries (user message + assistant response)
  const userEntryId = uuidv4();
  const assistantEntryId = uuidv4();
  
  const newThread = {
    thread_id: newThreadId,
    user_id: user_id,
    created_at: timestamp,
    entries: [
      {
        entry_id: userEntryId,
        thread_id: newThreadId,
        category: 'message',
        data: {
          role,
          content
        },
        created_at: timestamp
      },
      {
        entry_id: assistantEntryId,
        thread_id: newThreadId,
        category: 'message',
        data: {
          role: 'assistant',
          content: {
            text: `This is a mock assistant response to: "${content.text}"`,
            sources: null
          }
        },
        created_at: new Date().toISOString()
      }
    ]
  };
  
  threads.push(newThread);
  res.status(201).json(newThread);
});

// Delete a thread
app.delete('/api/threads/:thread_id', (req, res) => {
  const threadIndex = threads.findIndex(t => t.thread_id === req.params.thread_id);
  if (threadIndex === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  
  threads.splice(threadIndex, 1);
  res.status(204).send();
});

// Submit feedback
app.post('/api/feedback', (req, res) => {
  const { thread_id, entry_id, feedback_type, feedback_text } = req.body;
  res.status(201).json({ 
    feedback_id: uuidv4(),
    thread_id,
    entry_id,
    feedback_type,
    feedback_text,
    created_at: new Date().toISOString()
  });
});

// Vercel serverless function handler
module.exports = app;

// Start server when run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Mock API server running at http://localhost:${port}`);
  });
}
