import {BrowserRouter, Routes, Route} from "react-router-dom"



function AppRouter() {
  return (
    <AuthProvider>
      <AppLR/>
    </AuthProvider>
  );
}

function AppLR() {
    const auth = useAuth(); // hook useAuth para obtener la información del usuario
    return (
        
            <BrowserRouter>

                <Routes>

                    <Route path="/" element={<HomePage/>}/>

                </Routes>

            </BrowserRouter>
        
    );
}

export default AppRouter;