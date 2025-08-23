
import { Toaster } from "react-hot-toast";
import MapPage from "./pages/MapPage";

export default function App() {

  return (
    <div className="w-screen h-[100dvh]">
      <MapPage />
      <Toaster position="top-center" reverseOrder={false} />

    </div>
  );
}
