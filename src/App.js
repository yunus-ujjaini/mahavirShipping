import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc, updateDoc,doc } from "firebase/firestore";   
import { useEffect, useState } from 'react';

function App() {
  const [billNo,setBillNo]=useState(0);
  const [sysdate,setsysDate]=useState(new Date().toDateString().substring(4, 16));
  const [time,setTime]=useState("Shift 1");
  const [gweight,setGrossWeight]=useState("0 MTS");
  const [tweight,setTareWeight]=useState("0 MTS");
  const [nweight,setNetWeight]=useState("0 MTS");
  const [goodsData,setGoodsData]=useState([]);
  const [importerExporterData,setImporterExporterData]=useState([]);
  const [vehicleData,setVehicleData]=useState([]);
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
    let querySnapshot = await getDocs(collection(db, "BillNo"));
    querySnapshot.forEach((doc) => {
      setBillNo(doc.data().BillNo+1);
    });

    //To fill Shift
    let time=new Date().toTimeString().substring(0,4);
    if(parseInt(time.split(":")[0])>=7 && parseInt(time.split(":")[0])<=15){
      setTime("1");
    }
    else if(parseInt(time.split(":")[0])>15 && parseInt(time.split(":")[0])<=23){
      setTime("2");
    }
    else if(parseInt(time.split(":")[0])>23 && parseInt(time.split(":")[0])<7){
      setTime("3");
    }

    //Get Suggestion Options for Goods
    querySnapshot = await getDocs(collection(db, "DescOfGoodsData"));
    let SuggestionOptions=[];
    querySnapshot.forEach((doc) => {
      SuggestionOptions.push(doc.data().DescOfGoods);
    });
    setGoodsData(SuggestionOptions);

    //Get Suggestion Options for Importer/Exporter
    querySnapshot = await getDocs(collection(db, "ImporterExporterData"));
    SuggestionOptions=[];
    querySnapshot.forEach((doc) => {
      SuggestionOptions.push(doc.data().ImporterExporter);
    });
    setImporterExporterData(SuggestionOptions);
  }

  function resetData(){
    document.getElementById("GrossWeightInput").value="";
    document.getElementById("TareWeightInput").value="";
    document.getElementById("NetWeightInput").value="0.000 MTS";
    document.getElementById("importerExporterInput").value="";
    document.getElementById("qtyInput").value="";
    document.getElementById("desOfGoodsInput").value="";
    document.getElementById("truckInput").value="";
    document.getElementById("vehicleInput").value="";
    document.getElementById("driversNameInput").value="";
    document.getElementById("billOfEntryInput").value="";
    document.getElementById("billOfEntryDateInput").value="";
    document.getElementById("warfageEntryInput").value="";
    document.getElementById("warfageEntryDateInput").value="";
    document.getElementById("vesselNameInput").value="";
  }

  function calNWeight() {
    const cleanedGWeight = gweight.replace(/MTS|TS/gi, '').trim();
    const cleanedTWeight = tweight.replace(/MTS|TS/gi, '').trim();

    const grossWeight = parseFloat(cleanedGWeight);
    const tareWeight = parseFloat(cleanedTWeight);

    console.log(`Gross weight = ${gweight}\nTare weight = ${tweight}`);
    let netWeight =(grossWeight - tareWeight).toFixed(3);
    setNetWeight(`${netWeight} MTS`);
    document.getElementById("qtyInput").value=`${netWeight} MTS`;
}

  async function saveData(){
    let details={
      No:billNo,
      Date:sysdate,
      Shift:`Shift - ${time}`,
      GrossWeight:gweight,
      TareWeight:tweight,
      NetWeight:nweight,
      ImporterExporter:document.getElementById("importerExporterInput").value,
      Quantity:document.getElementById("qtyInput").value,
      DescOfGoods:document.getElementById("desOfGoodsInput").value,
      ByTruck:document.getElementById("truckInput").value,
      VehicleNo:document.getElementById("vehicleInput").value,
      DriversName:document.getElementById("driversNameInput").value,
      BillOfEntry:document.getElementById("billOfEntryInput").value,
      BillOfEntryDate:document.getElementById("billOfEntryDateInput").value,
      WarfageEntry:document.getElementById("warfageEntryInput").value,
      WarfageEntryDate:document.getElementById("warfageEntryDateInput").value,
      VesselName:document.getElementById("vesselNameInput").value,
    }
    try {
      const docRef = await addDoc(collection(db, "ActualData"), details);
      console.log("Document written with ID: ", docRef.id);
      
      let fetchedData=await getDocs(collection(db, "DescOfGoodsData"));
      let exists=false;
      fetchedData.forEach(doc=>{
        if(doc.data().DescOfGoods===details.DescOfGoods){
            exists=true;
        }
      })
      if(!exists){
        const docRef = await addDoc(collection(db, "DescOfGoodsData"), {
            DescOfGoods:details.DescOfGoods
        });
        console.log("Document written with ID: ", docRef.id);
      }

      fetchedData=await getDocs(collection(db, "ImporterExporterData"));
      exists=false;
      fetchedData.forEach(doc=>{
        if(doc.data().ImporterExporter===details.ImporterExporter){
            exists=true;
        }
      })
      if(!exists){
        const docRef = await addDoc(collection(db, "ImporterExporterData"), {
            ImporterExporter:details.ImporterExporter
        });
        console.log("Document written with ID: ", docRef.id);
      }

      await updateDoc(doc(db, "BillNo", "BillNoDoc"), {
        BillNo: details.No
      });
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  function saveAndPrintData(){
    saveData();
    
  }


  useEffect(()=>{
    fillInitialData();
  },[])

  useEffect(()=>{
    calNWeight();
  },[gweight,tweight])


  return (
    <div className="App">
        <div className='Container'>
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
                      {sysdate}
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
                  <input className="main-head-right-weight-gweight" id='GrossWeightInput' placeholder="0.00 MTS" onChange={(e)=>{
                    setGrossWeight(e.target.value)
                  }} />
              </div>
              <div className="main-head-right-weight">
                  <h4>T. Wt.</h4>
                  <input className="main-head-right-weight-tweight"  id='TareWeightInput' placeholder="0.00 MTS" onChange={(e)=>{
                    setTareWeight(e.target.value)
                  }} />
              </div>
              <div className="main-head-right-weight">
                  <h4>N. Wt.</h4>
                  <input className="main-head-right-weight-nweight"  id='NetWeightInput' disabled value={nweight}/>
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
                  <input list='importerExporters' id='importerExporterInput'/>
                  <datalist id="importerExporters">
                    {importerExporterData.map((val,key)=>{
                      return <option value={val} key={key}/>
                    })}
                  </datalist>
              </div>
              <div className="main-form-input">
                  <h4>2. Quantity/No. of Packages</h4>
                  <input id="qtyInput"/>
              </div>
              <div className="main-form-input">
                  <h4>3. Des. of goods</h4>
                  <input list='goods' id="desOfGoodsInput" />
                  <datalist id="goods">
                    {goodsData.map((val,key)=>{
                      return <option value={val} key={key}/>
                    })}
                  </datalist>
              </div>
              <div className="main-form-input">
                  <h4>4. By Truck</h4>
                  <input id='truckInput'/>
              </div>
              <div className="main-form-input">
                  <h4>5. R.T.P. No./Vehicle No.</h4>
                  <input id='vehicleInput'/>
              </div>
              <div className="main-form-input">
                  <h4>6. Driver's Name</h4>
                  <input id='driversNameInput'/>
              </div>
              <div className="main-form-input main-form-input-spl">
                  <div className="main-form-input main-form-input-spl-input">
                      <h4>7. Bill of Entry/Shipping Bill/T.P. No.</h4>
                      <input id='billOfEntryInput'/>
                  </div>
                  <div className="main-form-input main-form-input-spl-date">
                      <h4>Dt.</h4>
                      <input type="date" id='billOfEntryDateInput'/>
                  </div>
                  
                  
              </div>
              <div className="main-form-input main-form-input-spl">
                  <div className="main-form-input main-form-input-spl-input">
                      <h4>8. Wharfage Entry No.</h4>
                      <input id='warfageEntryInput'/>
                  </div>
                  
                  <div className="main-form-input main-form-input-spl-date">
                      <h4>Dt.</h4>
                      <input type="date" id='warfageEntryDateInput'/>
                  </div>
                  
              </div>
              <div className="main-form-input">
                  <h4>9. Vessel's Name</h4>
                  <input id='vesselNameInput'/>
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
      </div>

      <div className='ActionButtons'>
        <button onClick={()=>{
            saveData();
            resetData();
            fillInitialData();
            }}>
          Save
        </button>
        <button onClick={saveAndPrintData}>
          Save and Print
        </button>
        <button onClick={resetData}>
          Reset Data
        </button>
      </div>
      
    </div>
  );
}

export default App;
