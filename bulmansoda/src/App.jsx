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

  // ✅ 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("bulmansoda_user"); // 저장된 유저 삭제
    setUser(null); // 상태 초기화 → LoginPage 로 이동
  };

  return (
    <div className="w-screen h-[100dvh]">
      {user ? (
        <div className="w-full h-full">
          {/* ✅ 상단에 유저 이름 + 로그아웃 버튼 */}
          <div className="absolute left-3 top-15 z-50 text-md bg-white/60 px-3 py-1 rounded-xl shadow">
            {/* {user.name}: {" "} */}
            <button
              onClick={handleLogout}
              className="text-black-400 font-semibold hover:underline"
            >
              🔚로그아웃
            </button>
          </div>

          <MapPage userId={user.id} onLoginSuccess={setUser} />
        </div>
      ) : (
        <LoginPage onSuccess={(u) => setUser(u)} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
