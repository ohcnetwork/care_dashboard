import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./router";

function App() {
  return (
    <Routes>
      {routes.map((props, i) => (
        <Route {...props} key={i} />
      ))}
    </Routes>
  );
}

export default () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};
