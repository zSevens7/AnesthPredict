import { useState } from "react";

export default function Login({ onLogin }: { onLogin: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Por favor, preencha usuário e senha");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username }));
    onLogin(username);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-80 animate-fadeIn">
        <h1 className="text-xl font-bold text-center mb-6 text-gray-700">
          AnesthPredict
        </h1>

        <input
          type="text"
          placeholder="Usuário"
          className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta? <span className="text-blue-600 cursor-pointer hover:underline">Registrar</span>
        </p>
      </div>
    </div>
  );
}
