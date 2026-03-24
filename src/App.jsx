import { Routes, Route } from "react-router-dom";
import StripeProvider from "./providers/StripeProvider";
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
import PagamentoSucesso from "./pages/PagamentoSucesso";
import Pedidos from "./pages/Pedidos";

function App() {
  return (
    <>
      <HeaderWrapper />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/categoria/:slug" element={<Categoria />} />

        <Route
          path="/carrinho"
          element={
            <StripeProvider>
              <Carrinho />
            </StripeProvider>
          }
        />

        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route
          path="/conta"
          element={
            <PrivateRoute>
              <StripeProvider>
                <Conta />
              </StripeProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/pagamento"
          element={
            <PrivateRoute>
              <StripeProvider>
                <Pagamento />
              </StripeProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/pagamento-sucesso"
          element={<PagamentoSucesso />}
        />
        
        <Route
          path="/pedidos"
          element={<Pedidos />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;