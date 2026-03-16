import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.router.jsx'
import { AuthProvider } from './features/auth/services/auth.context.jsx'
import { InterviewProvider } from './features/interview/Interview.context.jsx'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router}/>
        </InterviewProvider>
      </AuthProvider>
    </div>
  )
}

export default App
