import './Login.css'

function Login(){
  return(
    <>
    <title>Login</title>
    <div className="container">
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
      <label>Username</label>
      <input name="username" type="text"/>
      <label>Password</label>
      <input name="password" type="password"/>
      <p id="loginreq" hidden><i>*Wrong username or password</i></p>
      <div>
      <button className="submit" type="submit">Submit</button>
      </div>
    </form>
    <a className="signup" href="register">Signup</a>
    </div>
    </>
  )
}

async function handleLogin(e){
  e.preventDefault();
  const form = e.target
  const payload = {
    username: form.username.value,
    password: form.password.value
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



export default Login