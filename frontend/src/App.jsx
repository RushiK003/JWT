import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom"

import LoginPage from "./components/Login"
import ProfilePage from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App(){
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link className="border border-1-solid p-2 m-2" to="/login">Login</Link>
        </nav>
        <Routes>
          <Route
              path="/login"
              element={<LoginPage/>}
            />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}