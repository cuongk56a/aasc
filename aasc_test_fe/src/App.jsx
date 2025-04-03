import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactList from './components/ContactList';
import AddContact from './pages/AddContact';
import EditContact from './components/EditContact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ContactList />} />
        <Route path="/edit/:id" element={<EditContact />} />
      </Routes>
    </BrowserRouter>
  );
}