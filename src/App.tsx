import Header from "./components/PageNavbar.tsx";
import Main from "./pages/HomePage.tsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}
