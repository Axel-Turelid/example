import './Login.css'

function Register(){
  return(
    <>
    <title>Register</title>
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label>Username</label>
        <input type="text" name="username"/>
        <label>Password</label>
        <input type="password" name="password"/>
        <label>Password again</label>
        <input type="password" name="password2"/>
        <p hidden id="passwordMiss"><i>*Passwords doesn't match!</i></p>
        <label id="criteria"><i>*Password must include min 4 characters</i></label>
        <div> 
          <button className="submit" type="submit">Submit</button>
        </div>
      </form>
      <a href="/" className="login">Go back to login</a>
    </div>
    </>
  )
}

async function handleSignup(e){
  e.preventDefault()
  const form = e.target
  const missMatch = document.getElementById("passwordMiss")
  const criteria = document.getElementById("criteria")
  const password = form.password.value;
  const password2 = form.password2.value;
  const username = form.username.value

  if(password!=password2 && password.length<4){
    missMatch.removeAttribute("hidden")
    criteria.style.color = "red"
    return
  }

  if(password!=password2 || password.length<4){
    if(password!=password2){
    missMatch.removeAttribute("hidden")
    criteria.style.color = "black"
    return
    }
    else{
      missMatch.hidden = true
      criteria.style.color = "red"
      return
    }  
  }
  missMatch.hidden = true
  criteria.style.color = "black"

  const payload = {
    username: form.username.value,
    password: form.password.value,
    password2: form.password2.value
  }
  const response = await fetch("http://localhost:5000/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  
  const data = await response.json()

  if(!response.ok){
    alert(data.errorType)
    return
  }
  else{
    await handleLogin(username, password)
  }
}

async function handleLogin(username, password){
  const payload = {
    username: username,
    password: password
  }
try{
  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if(!response.ok){
    if(data.errorType=="Unauthorized"){
    loginreq.removeAttribute("hidden")
    }
    return
  }
  else if(response.status == 201){
    window.location.href="/home"
  }
  } catch(err){
    console.log(err)
  }
}

export default Register