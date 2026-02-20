import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import PostDetails from './pages/PostDetails';
import JobCategoryPage from './pages/JobCategoryPage';
import PostJob from './pages/PostJob';
import Inbox from './pages/Inbox';
import About from './pages/About';
import Contact from './pages/Contact';

import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import AuthModal from './components/auth/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';


function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListing />} />
            <Route path="/jobs/:type" element={<JobCategoryPage />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/jobs/id/:id" element={<JobDetails />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/messages" element={<Inbox />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Layout>
        <AuthModal />
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
