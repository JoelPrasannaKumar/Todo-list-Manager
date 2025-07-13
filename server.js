const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase configuration with your actual credentials
const serviceAccount = {
  type: "service_account",
  project_id: "to-do-list-manager-d1a1c",
  private_key_id: "83bbc4681c28003a3bc422c6b84bef01d057e882",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC9IpyMbj+BhoTA\n97BfeJcqj0Hggzvc44++QVoLlfWBlAg1FH0Z8wySfk+cvAY2ej9c+3S7/OHosNFJ\nvTtkBDDe90hbn4xvxDTyR/xOaklc5GO91CMcMJl2FSl+Vm1Z6l1stDwyTisuEJ13\nNeaugBB777+BC6ovGLrfRVvBTsj7pDbK4uN9F8v3Vl9qKmcuOhkOCublFH/oJ/jA\ntWaJ7GEcszyCpAKT0YfZieRXy5GubL8+j5BA1ll3tEqKZ4o72M7NyMwzsM1gCorG\nn6igP9SDl61HmFXz+H+ix/talI6RvJHbIPWPkbMRdduD9kKMq/6Rcio8HmZykQ4E\nt3gGcxnFAgMBAAECggEAKA3HZ3oFmvGY9aC+ykkogkvaYKiKKepLS7hdUGzOlEV8\nQ3l2UOOG+xMi2wd6rVjQSGm8O/9+/B9OAza++BxnGSD3QugT/qtnpxOVnCmoJbL8\naHwff13PchFjOy0kdVFLvbShtumU/WlpX5CbrMLUOtr4DGUjAlxTXus6VkLQD3JG\nR5ucmjrD0LEDNIsFLb9gKm6u2yHsW5D2EjriDPFA2qIpOCZLoqNU9RqKnXf9Tbwd\nRhmL+XF1guYqG9doa+VbR3s6S4jzzZOs+eXy77ITyItIhU8c1tpu2w4iXw9U6bB4\nQIv+kSqkkxGkAzHkozqZc/XL00kcpkejI2hAXcsKoQKBgQD9D6Dq+Au5hd7qqqSh\nZPcS/B2koBDyBNeEQ8eoTXYPKbp3B4yowERhj5NXZTQ0h1dG5ytxAC7rGRa7IDlv\nlWB6lynxs35ZXUdy54GK3Cf+MGaQI6LS5eU9/GuT1Ac2kmLrRvtYwOqpkCLPIC6M\nBtVPLGVQaWztRWvjkHtySij5/QKBgQC/VO0VGBp6E/ivPu/3Y7FTw7Qqddeb4PdC\n1IaE20mhnaA4Ex/8t3EL8PTEPvYe58p41d9ocWo7JA7jEDax1uSBpY8DZePHR+K3\naU9ZcUrr4DjcDhu6PlKaNuD2MfMklyo/bubSvOLN2+LToxqgfz/UCO48ZG3tr+EF\nlNaYx38laQKBgQC38WVBhj1XhCRtpM339qDVbubJJARNNxHEtVPqVSvMh8NfA+DN\nRLwvwiISc6DH0dyx0BS2lbCE+P6Z1CmLnyO62CgH5TWhFXl63yY9Xhu/20Sh3xVa\ngPrp3JIBqSv5EdzPMhA/CjNIP1nd/oF3DPx+CUI3efpQWZa7mejxQVCZrQKBgQCh\nwfwanGEuGppiFrSsE7XE2q0ERNK/L6f78U+1HOwYXfopzkl5z+EcNl/JVm2gXVj5\nZd/WHiSw0WBgqcGEAuj3ju/k8IxtW6IabEcwmC6+Urffm3HnuG7/gCwbGMm2grKu\nJGWzfwvE/QS85qVJUau16ML5ffLOQ6bboCT5z5f4GQKBgQD3mr8wm4MFBeMdyBlc\nfLIPyG9v9HfyWsvpRLHZzbDxHed1UhdvZdfx3QIcRv7fKN7fRMv5nnYLWEImHOm3\nBBoaH1EmgjxNDQNZmyAl0SGqT7gfp3gK/1mmsJCy9hdlvEekH0JK5JgTGtQE40Hk\nD2aBVDpKoSleZJx+1Uo8OPENyg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@to-do-list-manager-d1a1c.iam.gserviceaccount.com",
  client_id: "104023564071847542063",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40to-do-list-manager-d1a1c.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
let db;
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://to-do-list-manager-d1a1c-default-rtdb.firebaseio.com/'
  });
  db = admin.database();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Helper functions for Firebase database operations
async function createUser(email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    
    await db.ref('users/' + userId).set({
      id: userId,
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
    
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    const users = snapshot.val();
    
    if (users) {
      const userId = Object.keys(users)[0];
      return users[userId];
    }
    
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function getUserTasks(userId) {
  try {
    const snapshot = await db.ref('tasks/' + userId).once('value');
    const tasks = snapshot.val();
    
    if (tasks) {
      return Object.values(tasks);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return [];
  }
}

async function addTask(userId, taskText) {
  try {
    const taskId = Date.now().toString();
    const task = {
      id: taskId,
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await db.ref('tasks/' + userId + '/' + taskId).set(task);
    return task;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
}

async function deleteTask(userId, taskId) {
  try {
    await db.ref('tasks/' + userId + '/' + taskId).remove();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

async function toggleTaskCompletion(userId, taskId) {
  try {
    const snapshot = await db.ref('tasks/' + userId + '/' + taskId).once('value');
    const task = snapshot.val();
    
    if (task) {
      await db.ref('tasks/' + userId + '/' + taskId + '/completed').set(!task.completed);
    }
  } catch (error) {
    console.error('Error toggling task:', error);
    throw error;
  }
}

// Routes

// Home route - redirect to dashboard if logged in, otherwise to login
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Signup routes
app.get('/signup', (req, res) => {
  res.render('signup', { error: null, success: null });
});

app.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Basic validation
  if (!email || !password || !confirmPassword) {
    return res.render('signup', { error: 'All fields are required', success: null });
  }

  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match', success: null });
  }

  if (password.length < 6) {
    return res.render('signup', { error: 'Password must be at least 6 characters', success: null });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.render('signup', { error: 'Email already registered', success: null });
    }

    // Create new user
    const userId = await createUser(email, password);
    res.render('signup', { error: null, success: 'Account created successfully! Please login.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', { error: 'An error occurred during signup', success: null });
  }
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Email and password are required' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Dashboard route
app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const tasks = await getUserTasks(req.session.userId);
    res.render('dashboard', { 
      userEmail: req.session.userEmail, 
      tasks: tasks,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('dashboard', { 
      userEmail: req.session.userEmail, 
      tasks: [],
      error: 'Error loading tasks',
      success: null
    });
  }
});

// Add task route
app.post('/add-task', requireAuth, async (req, res) => {
  const { taskText } = req.body;

  if (!taskText || taskText.trim() === '') {
    const tasks = await getUserTasks(req.session.userId);
    return res.render('dashboard', { 
      userEmail: req.session.userEmail, 
      tasks: tasks,
      error: 'Task text cannot be empty',
      success: null
    });
  }

  try {
    await addTask(req.session.userId, taskText.trim());
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Add task error:', error);
    const tasks = await getUserTasks(req.session.userId);
    res.render('dashboard', { 
      userEmail: req.session.userEmail, 
      tasks: tasks,
      error: 'Error adding task',
      success: null
    });
  }
});

// Delete task route
app.post('/delete-task/:id', requireAuth, async (req, res) => {
  const taskId = req.params.id;

  try {
    await deleteTask(req.session.userId, taskId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Delete task error:', error);
    res.redirect('/dashboard');
  }
});

// Toggle task completion route
app.post('/toggle-task/:id', requireAuth, async (req, res) => {
  const taskId = req.params.id;

  try {
    await toggleTaskCompletion(req.session.userId, taskId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Toggle task error:', error);
    res.redirect('/dashboard');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Firebase Realtime Database connected successfully');
});