import './App.css'
import Contact from './components/Contact'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <Contact />
    </GoogleReCaptchaProvider>
  )
}

export default App;