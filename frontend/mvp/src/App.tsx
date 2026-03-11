import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import UploadModelPage from './pages/UploadModelPage'
import WardrobePage from './pages/WardrobePage'
import type { IModel } from './types'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentModel, setCurrentModel] = useState<IModel | null>(null)

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  if (!currentModel) {
    return <UploadModelPage onModelReady={setCurrentModel} />
  }

  return (
    <WardrobePage
      model={currentModel}
      onChangeModel={() => setCurrentModel(null)}
      onLogout={() => {
        setIsLoggedIn(false)
        setCurrentModel(null)
      }}
    />
  )
}
