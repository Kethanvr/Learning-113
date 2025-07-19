"use client"
import { useRouter } from 'next/navigation'
// Removed unused import of Router
import React,{ useState }  from 'react'
const RegisterPage = () => {
 const [email,setemail] =  useState('')
 const [password,setpassword] =  useState('')
 const [newpassword,setnewpassword] = useState('')
 const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

      e.preventDefault()
      if (password !== newpassword) {
        alert("passwords do not match")
        return
      }
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Failed to register')
        }
        console.log("user created successfully")
        router.push('/login')
      } catch (error) {
        console.error("Error during registration:", error)
        alert("An error occurred while registering. Please try again later.")
      }
  }



  return (
   <div>register page 
<h1>Register</h1>  
<form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="newpassword">Confirm Password:</label>
        <input
          type="password"
          id="newpassword"
          value={newpassword}
          onChange={(e) => setnewpassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>

    <p>Already have an account? <a href="/login">Login</a></p>
    <p>Go back to <a href="/">Home</a></p>

   </div>
   

  )
 }


export default RegisterPage