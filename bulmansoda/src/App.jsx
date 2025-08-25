import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import MapPage from "./pages/MapPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [user, setUser] = useState(null);

  // 앱 시작 시 localStorage 에 저장된 유저 불러오기
  useEffect(() => {
    const raw = localStorage.getItem("bulmansoda_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("bulmansoda_user");
      }
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("bulmansoda_user");
  //   setUser(null);
  // };

  return (
    <div className="w-screen h-[100dvh]">
      {user ? (
        <div className="w-full h-full">
          {/* 필요 시 상단에 간단한 유저 표시/로그아웃 버튼 */}
          {/* <div className="absolute right-3 top-3 z-50 text-sm bg-white/90 px-3 py-1 rounded-full shadow">
            {user.name} · <button onClick={handleLogout}>로그아웃</button>
          </div> */}
          <MapPage userId={user.id} onLoginSuccess={setUser} />
        </div>
      ) : (
        <LoginPage onSuccess={(u) => setUser(u)} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

