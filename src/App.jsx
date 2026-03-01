import { AppRoutes } from './routes/AppRoutes'
import { Layout } from './components/Layout/Layout'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <>
      <Layout>
        <AppRoutes />
      </Layout>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App