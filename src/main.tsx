import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './pages/SingleProduct_v2/hooks/useShoppingCart.tsx'
import axios from 'axios'
import { Env } from './env'
// import { initializeAxiosObfuscation } from './lib/api/setupAxiosObfuscation.ts'

// Configure axios base URL
axios.defaults.baseURL = Env.api_base_url

const queryClient = new QueryClient()

// initializeAxiosObfuscation()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
      </CartProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
