import { Outlet } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import CartDrawer from '../common/CartDrawer'
import { Toaster } from 'react-hot-toast'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'Jost, sans-serif',
            fontSize: '13px',
            borderRadius: 0,
            background: '#2C2C2C',
            color: '#fff',
          },
        }}
      />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
