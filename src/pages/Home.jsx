import { useState, useEffect} from 'react'
import httpClient from "../httpClient"
import './Home.css'

function Home(){
  const [user, setUser] = useState(null)
  const [mol, setMol] = useState([])
  mol.sort((a, b) => a.name.localeCompare(b.name))
  const listMol = mol.map(mol => <li key={mol.id} id={mol.id} data-smile={mol.SMILE}>{mol.name}
  <button className="drawBtn" onClick={drawMolecule}>&#9998; Draw</button>
  <button className="deleteBtn" onClick={removeMolecule}>Delete</button></li>)
  
  async function removeMolecule(e){
    const parent = e.target.parentElement;
    const id = parent.id

    try{
      const payload = {
        id: id
      }

      const response = await fetch("http://localhost:5000/remove_molecule", {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if(response.status == 200){
        fetchMolecules()
      } else {
        alert("Something went wrong")
      }
    } catch(error) {
      console.log(error)
    }
  }

  async function addMol(){
    const input = document.getElementById("name")
    const name = input.value
    const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(name)}/smiles`
    try{
      const response = await fetch(url)

      if(!response.ok){
        alert("Could not find a molecule by that name")
        return
      }
      
      const data = await response.text()

      const payload = {
        name: name,
        SMILE: data
      }
      
      const resp = await fetch("http://localhost:5000/add_molecule", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
      })

      fetchMolecules()
    } catch(error) {
      console.log(error)
    }
  }

  const fetchMolecules = async () => {
  try {
    const response = await fetch("http://localhost:5000/get_molecules", {
      method: "GET",
      credentials: "include",
    })
    const data = await response.json()
    setMol(data.molecules)
  } catch (error) {
    console.log(error)
  }
}
  
  useEffect(() => {
    (async () => {
      try{
      const response = await httpClient.get("http://localhost:5000/@me");
      setUser(response.data)}
      catch(error){
        console.log("Not authenticated")
      }
    })()
  }, [])
  useEffect(() => {
    fetchMolecules()
  }, [])
    if(user != null){
    return(
      <>
      <title>Home</title>
      <div className="screen">
        
        <div className="interface">
          <div className="titleArea">
            <div className="logoutDiv">
              <button className="logout" onClick={logout}>Logout</button>
            </div>
            <h1>User: {user.username}</h1>
          </div>
          <div className="molecules">
            {mol.length>0?           
            <ul>
              {listMol}
            </ul>:
            <p>Enter a molecule to get started</p>
            }

          </div>
          <div className="input">
            <label id="nameLabel">Molecule name</label>
            <input id="name"></input>
            <button id="addname" onClick={addMol}>+ Add</button>
          </div>
        </div>

        <div className="ketcher">
          <iframe id="ketcher" src="ketcher-standalone-3.7.0/standalone/index.html" width="100%" height="99.6%"></iframe>
        </div>
      </div>
      </>
  )}
}

async function logout(){
  await httpClient.post("http://localhost:5000/logout")
  window.location.href="/"
}

async function drawMolecule(e){
  const parent = e.target.parentElement;
  const SMILE = parent.dataset.smile
  const iframe = document.getElementById('ketcher');
  const ketcher = iframe.contentWindow.ketcher;
  if(ketcher){
  try {
    await ketcher.setMolecule(SMILE);
    console.log("Molecule loaded!");
  } catch (error) {
    console.error("Failed to load molecule:", error);
  }}
}

export default Home