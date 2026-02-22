import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/home";
import Login from "../src/pages/Login";
import HeaderWrapper from "./components/Header/HeaderWrapper";
import Produto from "./pages/Produto";
import Carrinho from "./pages/Carrinho";
import Footer from "./components/Footer";
import Categoria from "./pages/Categoria";
import Conta from "../src/pages/Conta";
import PrivateRoute from "../src/routes/PrivateRoutes";
import RecuperarSenha from "./pages/RecuperarSenha";
import Pagamento from "./pages/Pagamento";

function App() {
  return (
    <>
      <HeaderWrapper />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/categoria/:slug" element={<Categoria />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route path="/conta" element={
          <PrivateRoute>
            <Conta />
          </PrivateRoute>
        }
        />
        <Route path="/pagamento" element={
          <PrivateRoute>
            <Pagamento />
          </PrivateRoute>
        }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
