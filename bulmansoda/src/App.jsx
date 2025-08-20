import TrafficButton from "./components/TrafficButton";
import MapPage from "./pages/MapPage";

export default function App() {
  
  return (
    <div className="w-screen h-[100dvh]">
      <MapPage/>
      <TrafficButton/>
    </div>
  );
}
