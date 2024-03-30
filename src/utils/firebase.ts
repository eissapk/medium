import { initializeApp } from "firebase/app";
const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = process.env;

export const firebase = () => {
	const firebaseConfig = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
	const initApp = initializeApp(firebaseConfig);
	console.log("Connected to Firebase.");
	return initApp;
};
