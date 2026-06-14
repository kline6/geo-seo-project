import React, { useState } from "react";
import { Bot, Lock, User, Eye, EyeOff } from "lucide-react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!username || !password) { setError("请输入用户名和密码"); return; }
    
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, display_name: displayName || username })
    }).then(r => {
      if (!r.ok) throw new Error("登录失败");
      return r.json();
    }).then(user => {
      localStorage.setItem("geo_user", JSON.stringify(user));
      onLogin(user);
    }).catch(err => setError(err.message || "登录失败"));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, padding: 40, background: "#141414", borderRadius: 16, border: "1px solid #2a2a2a" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: "var(--accent-yellow)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, fontWeight: 700, color: "#000" }}>G</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>GEO Platform</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>AI搜索优化工作台</p>
        </div>

        {error && <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.15)", borderRadius: 8, color: "var(--accent-red)", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div className="form-group">
          <label>用户名</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="请输入用户名" style={{ paddingLeft: 36 }} />
            <User size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-secondary)" }} />
          </div>
        </div>

        <div className="form-group">
          <label>密码</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" style={{ paddingLeft: 36, paddingRight: 36 }} />
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-secondary)" }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>

        {isRegister && (
          <div className="form-group">
            <label>显示名称</label>
            <input className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="可选" />
          </div>
        )}

        <button className="btn btn-primary" style={{ width: "100%", height: 44, marginTop: 8 }} onClick={handleSubmit}>{isRegister ? "注册" : "登录"}</button>
        
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ background: "none", border: "none", color: "var(--accent-yellow)", cursor: "pointer", fontSize: 13 }}>{isRegister ? "已有账号？去登录" : "没有账号？注册"}</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
          默认账号: admin / admin123
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
