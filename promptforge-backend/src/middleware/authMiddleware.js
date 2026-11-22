let firebaseAdmin;
function getFirebaseAdmin() {
  if (firebaseAdmin) return firebaseAdmin;
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw || !process.env.FIREBASE_PROJECT_ID) {
      throw new Error('Firebase Admin credentials are not configured');
    }
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(raw)),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  firebaseAdmin = admin;
  return firebaseAdmin;
}

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      const token = header.slice(7);
      const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
      req.userId = decoded.uid;
      req.auth = decoded;
      return next();
    }

    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_AUTH === 'true') {
      const demoId = req.headers['x-user-id'];
      if (typeof demoId === 'string' && demoId.trim()) {
        req.userId = demoId.trim().slice(0, 128);
        req.auth = { demo: true };
        return next();
      }
    }

    return res.status(401).json({ error: 'A valid Firebase ID token is required' });
  } catch (error) {
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token' || error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
    return next(error);
  }
}

module.exports = { authMiddleware };
