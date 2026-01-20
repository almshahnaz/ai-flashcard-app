import {Routes, Route} from "react-router-dom";
import Home from './pages/Home.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import Study from "./pages/Study.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/study/:id" element={<Study />} />
        </Routes>
    )
}

