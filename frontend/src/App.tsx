import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { DocumentViewer } from './pages/DocumentViewer';
import { Matches } from './pages/Matches';
import { SimilarityMap } from './pages/SimilarityMap';
import { CodeAnalysis } from './pages/CodeAnalysis'; // Import the new component

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentViewer />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/sources" element={<div className="p-8 text-secondary">Sources Viewer Placeholder</div>} />
          <Route path="/corpus" element={<div className="p-8 text-secondary">Corpus Manager Placeholder</div>} />
          <Route path="/map" element={<SimilarityMap />} />
          <Route path="/code" element={<CodeAnalysis />} />
          <Route path="/reports" element={<div className="p-8 text-secondary">Reports Placeholder</div>} />
          <Route path="/settings" element={<div className="p-8 text-secondary">Settings Placeholder</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;