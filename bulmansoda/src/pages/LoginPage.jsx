import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Logo from "../assets/logo.svg";
import LoginButton from "../assets/loginbutton.svg";


export default function LoginPage({ onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 간단한 휴대폰 번호(숫자만) 검사
  const validPhone = (v) => /^01[016789]\d{7,8}$/.test(v.replaceAll("-", ""));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!validPhone(phone)) {
      toast.error("휴대폰 번호 형식을 확인해주세요.");
      return;
    }

    // 아주 단순한 로그인 처리(실서비스에선 API 호출/토큰 필요)
    const profile = { name: name.trim(), phone: phone.replaceAll("-", "") };
    localStorage.setItem("bulmansoda_user", JSON.stringify(profile));
    toast.success("로그인 완료!");
    onSuccess?.(profile);
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
          <img
            src={Logo}
            alt="불만소다 로고"
            className="mx-auto w-60 h-50"
          />
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
          <input
            className="w-full h-12 rounded-full border border-neutral-200 px-5 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="전화번호를 입력하세요."
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="w-full">
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
