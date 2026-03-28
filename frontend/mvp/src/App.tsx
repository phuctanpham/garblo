import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import UploadModelPage from './pages/UploadModelPage'
import WardrobePage from './pages/WardrobePage'
import PostbuildRunner from './components/PostbuildRunner'
import type { IModel } from './types'

const postbuildUrl = new URLSearchParams(window.location.search).get('postbuild')

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentModel, setCurrentModel] = useState<IModel | null>(null)

  if (postbuildUrl) {
    return <PostbuildRunner apiUrl={postbuildUrl} />
  }

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
