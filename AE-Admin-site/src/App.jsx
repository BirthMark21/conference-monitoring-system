import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Events from "./Events";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="*"
          element={
             <PrivateRoute>
              <Home />
             </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// return (
//   <Router>
//     <Routes>
//       <Route path="/login" element={<Login />} /> {/* Public route */}
//       <PrivateRoute path="*">
//         {" "}
//         {/* Private route */}
//         <Home /> {/* Component rendered for authenticated users */}
//       </PrivateRoute>
//     </Routes>
//   </Router>
// );
// }
