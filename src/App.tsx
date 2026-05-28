import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Gallery from '@/pages/Gallery';
import Login from '@/pages/Login';
import JerseyDetail from '@/pages/JerseyDetail';
import Admin from '@/pages/Admin';
import { EditJersey } from '@/pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jersey/:id" element={<JerseyDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/edit/:id" element={<EditJersey />} />
          </Routes>
        </main>
        <Toaster position="top-center" richColors closeButton />
      </div>
    </BrowserRouter>
  );
}
