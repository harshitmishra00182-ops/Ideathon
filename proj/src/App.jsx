import React, { useState } from 'react'
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Menu from './components/Menu'
import Preorder from './components/Preorder'
import Grouporder from './components/Grouporder'
import Nutrition from './components/Nutrition'
import Reward from './components/Reward'
import Wallet from './components/Wallet'
import './App.css'

const App = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const [activePage, setActivePage] = useState('menu')

  const renderPage = () => {
    switch (activePage) {
      case 'preorder':  return <Preorder />
      case 'group':     return <Grouporder />
      case 'nutrition': return <Nutrition />
      case 'rewards':   return <Reward />
      case 'wallet':    return <Wallet />
      default:          return <Menu />
    }
  }

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <RedirectToSignIn />

  return (
    <div>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      {renderPage()}
    </div>
  )
}

export default App