import { useEffect, useRef, useState } from 'react';
import './App.css'

import EngagingFlow from './components/engaging_flow/engaging_flow'


/************************ begin: firebase hosting config **********************/  
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Add SDKs for Firebase products that you want to use
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

    const [flowSize, setFlowSize] = useState({ width: 0, height: 0 });

    const appRef = useRef(null);
    const flowBoxRef = useRef(null);

    useEffect(() => {
        if(flowBoxRef.current) {
            setFlowSize({
                width : flowBoxRef.current.offsetWidth,
                height: flowBoxRef.current.offsetHeight,
            });
        }

        if(appRef.current) {
            appRef.current.addEventListener('wheel', (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, { passive: false });
        }
    }, []);

    return (
        <div 
            ref={appRef} 
            className="App"
        >
            <div 
                ref={flowBoxRef} 
                className='engaging-flow-box' 
                style={{
                    width: '1600px', 
                    height: '1200px', 
                    position: 'absolute', 
                    top: '50px', 
                    left: '50px'
                }}
            >
                <EngagingFlow boxWidth={flowSize.width} boxHeight={flowSize.height}/>
            </div>
        </div>
    )
}

export default App
