import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import './index.css'
import App from './App.jsx'
import { useIsDarkMode } from './lib/useIsDarkMode'

// Keeps antd components (Image preview, Modal, etc.) visually consistent
// with the app's own palette and follows the same dark mode toggle instead
// of antd's default blue/light-only look.
function ThemedApp() {
  const isDark = useIsDarkMode()
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#8C7AE6',
          borderRadius: 12,
          fontFamily: "'Nunito', sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  </StrictMode>,
)
