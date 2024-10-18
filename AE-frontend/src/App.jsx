import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import PrivateRoute from "./PrivateRoute";
import AllRoutes from "./AllRoutes";
import Signup from "./Pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <AllRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
