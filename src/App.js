import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc } from "firebase/firestore";   
import { useEffect, useState } from 'react';

function App() {
  const [billNo,setBillNo]=useState(0);
  const [date,setDate]=useState(new Date().toDateString().substring(4, 16));
  const [time,setTime]=useState("Shift 1");
  const firebaseConfig = {
    apiKey: "AIzaSyBXMUYnWGcGoljKmQYZJE2gML1_N1lEdx8",
    authDomain: "mahavirshipping-1b63e.firebaseapp.com",
    databaseURL: "https://mahavirshipping-1b63e-default-rtdb.firebaseio.com",
    projectId: "mahavirshipping-1b63e",
    storageBucket: "mahavirshipping-1b63e.appspot.com",
    messagingSenderId: "1048875294290",
    appId: "1:1048875294290:web:24e15eba5efbbde84c498b",
    measurementId: "G-K31BC8JJNQ"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function fillInitialData(){
    //To fill Bill no
    const querySnapshot = await getDocs(collection(db, "BillNo"));
    querySnapshot.forEach((doc) => {
      setBillNo(doc.data().BillNo+1);
    });

    //To fill Shift
    let time=new Date().toTimeString().substring(0,4);
    if(parseInt(time.split(":")[0])>=7 && parseInt(time.split(":")[0])<=15){
      setTime("Shift 1");
    }
    else if(parseInt(time.split(":")[0])>15 && parseInt(time.split(":")[0])<=23){
      setTime("Shift 2");
    }
    else if(parseInt(time.split(":")[0])>23 && parseInt(time.split(":")[0])<7){
      setTime("Shift 3");
    }
  }

  function saveData(){
    
  }

  useEffect(()=>{
    fillInitialData();
  },[])


  return (
    <div className="App">
      <div className="head">
          <h1>MAHAVIR SHIPPING SERVICE</h1>
          <h3>Plot No. 295, Ward 6/C, Opp. Om Cineplex, Adipur - Kutch, 370205</h3>
      </div>
      <div className="middle">
          <div className="middle-left">
              <div className="middle-left-input">
                  <h4>
                      No. :
                  </h4>
                  <h4>
                      {billNo}
                  </h4>
              </div>
          </div>
          <div className="middle-right">
              <div className="middle-right-input">
                  <h4>
                      Date :
                  </h4>
                  <h4>
                      {date}
                  </h4>
              </div>
              <div className="middle-right-input">
                  <h4>
                      Shift :
                  </h4>
                  <h4>
                      {time}
                  </h4>
              </div>
          </div>
      </div>
      <div className="middle-static">
          <div className="middle-static-address">
              <h4>
                  The Traffic Manager,
              <br/>
                  Deendayal Port Trust,
              <br/>
                  Kandla.
              </h4>
          </div>
          <div className="middle-static-address">
              <h4>
                  The Security Officer,
              <br/>
                  Deendayal Port Trust,
              <br/>
                  Kandla.
              </h4>
          </div>
          <div className="middle-static-address">
              <h4>
                  The Asstt. Commi,
              <br/>
                  of Customs,
              <br/>
                  Kandla.
              </h4>
          </div>
      </div>
      <div className="main-head">
          <div className="main-head-title">
              <h3>SUB: GATE PASS</h3>
          </div>
          <div className="main-head-right">
              <div className="main-head-right-weight">
                  <h4>G. Wt.</h4>
                  <input className="main-head-right-weight-gweight"/>
              </div>
              <div className="main-head-right-weight">
                  <h4>T. Wt.</h4>
                  <input className="main-head-right-weight-tweight"/>
              </div>
              <div className="main-head-right-weight">
                  <h4>N. Wt.</h4>
                  <input className="main-head-right-weight-nweight"/>
              </div>
          </div>
      </div>
      <div className="main">
          <div className="main-title">
              Kindly allow us to take IN / OUT from Dock Area the material Shown below:
          </div>
          <div className="main-form">
              <div className="main-form-input">
                  <h4>1. Name of Importer/Exporter</h4>
                  <input/>
              </div>
              <div className="main-form-input">
                  <h4>2. Quantity/No. of Packages</h4>
                  <input/>
              </div>
              <div className="main-form-input">
                  <h4>3. Des. of goods</h4>
                  <input/>
              </div>
              <div className="main-form-input">
                  <h4>4. By Truck</h4>
                  <input/>
              </div>
              <div className="main-form-input">
                  <h4>5. R.T.P. No./Vehicle No.</h4>
                  <input/>
              </div>
              <div className="main-form-input">
                  <h4>6. Driver's Name</h4>
                  <input/>
              </div>
              <div className="main-form-input main-form-input-spl">
                  <div className="main-form-input main-form-input-spl-input">
                      <h4>7. Bill of Entry/Shipping Bill/T.P. No.</h4>
                      <input/>
                  </div>
                  <div className="main-form-input main-form-input-spl-date">
                      <h4>dt.</h4>
                      <input/>
                  </div>
                  
                  
              </div>
              <div className="main-form-input main-form-input-spl">
                  <div className="main-form-input main-form-input-spl-input">
                      <h4>8. Wharfage Entry No.</h4>
                      <input/>
                  </div>
                  
                  <div className="main-form-input main-form-input-spl-date">
                      <h4>dt.</h4>
                      <input/>
                  </div>
                  
              </div>
              <div className="main-form-input">
                  <h4>9. Vessel's Name</h4>
                  <input/>
              </div>
          </div>
          <div className="main-footer">
              The above particulars are true and correct to the best of our knowledge and belief Received above mentioned cargo.
          </div>
      </div>
      <div className="footer">
          <div className="footer-left">
              <div className="footer-left-sign">

              </div>
              <div className="footer-left-name">
                  Sig.<br/>For<br/>SSCPL
              </div>
          </div>
          <div className="footer-right">
              <div className="footer-right-sign">
                  <h4>Yours faithfully,</h4>
                  <div className="footer-right-sign-img">
                      <img />
                  </div>
              </div>
              <div className="footer-right-name">
                  For <b>MAHAVIR SHIPPING SERVICE</b>
              </div>
          </div>
      </div>
      <button onClick={saveData}>
        Save and Print
      </button>
    </div>
  );
}

export default App;
