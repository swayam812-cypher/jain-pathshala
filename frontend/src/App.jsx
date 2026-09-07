import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Journey from "./pages/Journey";
import BookDetail from "./pages/BookDetail";
import Study from "./pages/Study";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
          <Route path="/books/:bookId" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/books/:bookId/chapters/:chapterId" element={<ProtectedRoute><Study /></ProtectedRoute>} />
          <Route path="/books/:bookId/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/certificate/:bookId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
