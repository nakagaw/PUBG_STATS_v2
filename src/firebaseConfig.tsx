import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const Config = () => {
  return {
    firebase: {
      apiKey: process.env.REACT_APP_FB_API_KEY,
      authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
      projectId: process.env.REACT_APP_FB_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
      messagingSender_Id: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FB_APP_ID
    }
  }
}

const firebaseConfig = Config().firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firebaseDB = firebaseApp.database()