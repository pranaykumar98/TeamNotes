import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NotesList from "./pages/NotesList";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* public route*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* protected route */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <NotesList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute>
            <Layout>
              <NotesList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
