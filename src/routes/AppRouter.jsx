import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { AdministracionPage } from "../pages/AdministracionPage.jsx";
import { ClientesPage } from "../pages/ClientesPage.jsx";
import { ProveedoresPage } from "../pages/ProveedoresPage.jsx";
import { EmpleadosPage } from "../pages/EmpleadosPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { Header } from "../pages/Header.jsx";
import { Footer } from "../pages/Footer.jsx";

// Solo entra quien tiene sesión; si no, va al login y luego vuelve a donde quería ir
function RutaProtegida() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}

// Login y registro no tienen sentido si ya hay sesión iniciada: al iniciarla se
// redirige acá (a la página que se quería visitar, o al panel)
function RutaPublica() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? "/panel"} replace />;
    return <Outlet />;
}

function AppRouter() {
  return (
    <AuthProvider>
      <AppLR />
    </AuthProvider>
  );
}

function AppLR() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <main className="app-contenido">
                    <Routes>
                        <Route path="/" element={<HomePage />} />

                        <Route element={<RutaPublica />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Route>

                        <Route element={<RutaProtegida />}>
                            <Route path="/panel" element={<AdministracionPage />} />
                            <Route path="/clientes" element={<ClientesPage />} />
                            <Route path="/proveedores" element={<ProveedoresPage />} />
                            <Route path="/empleados" element={<EmpleadosPage />} />
                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default AppRouter;
