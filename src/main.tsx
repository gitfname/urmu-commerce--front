import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './pages/SingleProduct_v2/hooks/useShoppingCart.tsx'
// import { initializeAxiosObfuscation } from './lib/api/setupAxiosObfuscation.ts'

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
