import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className='bg-blue-700'>
        <h1 className='text-2xl'>Test Template</h1>
      </section>
    </>
  )
}

export default App
