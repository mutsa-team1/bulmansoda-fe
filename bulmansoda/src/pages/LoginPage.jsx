import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Logo from "../assets/new-logo.svg";
import LoginButton from "../assets/new-loginbutton.svg";
import { createUser } from "../api/user";

export default function LoginPage({ onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [phoneError, setPhoneError] = useState(""); // 전화번호 에러 메시지

  // 간단한 휴대폰 번호 검사
  const validPhone = (v) => /^01[016789]\d{7,8}$/.test(v.replaceAll("-", ""));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!validPhone(phone)) {
      setPhoneError("휴대폰 번호 형식을 확인해주세요."); // 빨간 글씨 에러 표시
      return;
    }
    setPhoneError(""); // 정상일 경우 에러 제거

    try {
      setLoading(true); // 버튼 비활성화 시작

      const userId = await createUser({
        name: name.trim(),
        phoneNumber: phone.replaceAll("-", ""),
      });

      toast.success("로그인 완료!");
      const profile = { id: userId, name: name.trim(), phone: phone.replaceAll("-", "") };

      localStorage.setItem("bulmansoda_user", JSON.stringify(profile));
      onSuccess?.(profile);
    } catch (err) {
      console.error(err);
      toast.error("로그인 실패: 서버와 통신할 수 없습니다.");
    } finally {
      setLoading(false); // 버튼 다시 활성화
    }
  };

  // Enter로 제출
  useEffect(() => {
    const onEnter = (e) => e.key === "Enter" && handleSubmit(e);
    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone]);

  return (
    <div className="w-screen h-[100dvh] flex items-start justify-center mt-40">
      <div className="w-[360px] max-w-[87vw]">
        {/* 헤더/로고 영역 */}
        <div className="text-center mb-8 select-none">
          <img src={Logo} alt="불만소다 로고" className="mx-auto w-60 h-50" />
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          autoComplete="off"
          spellCheck={false}
        >
          <input
            className="w-full h-12 rounded-full border border-neutral-200 px-5 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="이름을 입력하세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <input
              className={`w-full h-12 rounded-full border px-5 placeholder-neutral-400 focus:outline-none focus:ring-2 ${
                phoneError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-neutral-200 focus:ring-pink-300"
              }`}
              placeholder="전화번호를 입력하세요."
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} // 로딩 중이면 비활성화
          >
            <img
              src={LoginButton}
              alt="로그인 버튼"
              className="mx-auto w-full h-auto"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
