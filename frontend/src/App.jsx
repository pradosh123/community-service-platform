import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import PostJob from "./pages/PostJob";
// import BrowseWorkers from "./pages/BrowseWorkers";
// import WorkerRegister from "./pages/WorkerRegister";
// import Admin from "./pages/Admin";
// import Navbar from "./components/layout/Navbar";

export default function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/post-job" element={<PostJob />} />
        <Route path="/browse-workers" element={<BrowseWorkers />} />
        <Route path="/register-worker" element={<WorkerRegister />} />
        <Route path="/admin" element={<Admin />} /> */}
      </Routes>
    </>
  );
}

