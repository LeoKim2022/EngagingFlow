import './App.css'

import EngagingFlow from './components/engaging_flow/engaging_flow'


/************************ begin: firebase hosting config **********************/  
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKiPJ3ivWQAcxNOZMt1EElGWR8YT_ZvJ4",
  authDomain: "engaging-flow.firebaseapp.com",
  projectId: "engaging-flow",
  storageBucket: "engaging-flow.appspot.com",
  messagingSenderId: "286993136644",
  appId: "1:286993136644:web:691e8e6f762dd86412c951"
};

// Initialize Firebase
initializeApp(firebaseConfig);
/************************ end: firebase hosting config **********************/  


function App() {
    return (
        <div 
            className="App"
        >
            <EngagingFlow width={`100%`} height={`100%`}/>
        </div>
    )
}

export default App
