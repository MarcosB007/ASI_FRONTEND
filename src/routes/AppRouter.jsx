import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";
import { AppShell, LayoutPublico } from "../components/Layout.jsx";
import NotFoundPage from "../components/NotFoundPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import RecuperarPage from "../pages/RecuperarPage.jsx";
import PanelPage from "../pages/PanelPage.jsx";
import FincasPage from "../pages/FincasPage.jsx";
import LotesPage from "../pages/LotesPage.jsx";
import CultivosPage from "../pages/CultivosPage.jsx";
import ProduccionPage from "../pages/ProduccionPage.jsx";
import GastosPage from "../pages/GastosPage.jsx";
import VentasPage from "../pages/VentasPage.jsx";
import RentabilidadPage from "../pages/RentabilidadPage.jsx";
import ClientesPage from "../pages/ClientesPage.jsx";
import ProveedoresPage from "../pages/ProveedoresPage.jsx";
import UsuariosPage from "../pages/UsuariosPage.jsx";

// Solo entra quien tiene sesión; si no, va al login y luego vuelve a donde quería ir
function RutaProtegida() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}

// Restringe una sección a ciertos roles; el resto vuelve al panel
function RutaRol({ roles }) {
    const { rol } = useAuth();
    if (!roles.includes(rol)) return <Navigate to="/panel" replace />;
    return <Outlet />;
}

// Login y registro no tienen sentido si ya hay sesión iniciada
function RutaPublica() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? "/panel"} replace />;
    return <Outlet />;
}

const GESTION = ["ADMIN", "PRODUCTOR"];

function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<LayoutPublico />}>
                        <Route path="/" element={<HomePage />} />
                        <Route element={<RutaPublica />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/recuperar" element={<RecuperarPage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    <Route element={<RutaProtegida />}>
                        <Route element={<AppShell />}>
                            <Route path="/panel" element={<PanelPage />} />
                            <Route path="/fincas" element={<FincasPage />} />
                            <Route path="/lotes" element={<LotesPage />} />
                            <Route path="/cultivos" element={<CultivosPage />} />
                            <Route path="/produccion" element={<ProduccionPage />} />
                            <Route path="/gastos" element={<GastosPage />} />
                            <Route path="/proveedores" element={<ProveedoresPage />} />

                            <Route element={<RutaRol roles={GESTION} />}>
                                <Route path="/ventas" element={<VentasPage />} />
                                <Route path="/rentabilidad" element={<RentabilidadPage />} />
                                <Route path="/clientes" element={<ClientesPage />} />
                            </Route>
                            <Route element={<RutaRol roles={["ADMIN"]} />}>
                                <Route path="/usuarios" element={<UsuariosPage />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRouter;
