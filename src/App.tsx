import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Bot, Key, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const tabs = [
    { name: 'Tổng quan', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Jarvis Format', path: '/format', icon: <FileText size={20} /> },
    { name: 'Jarvis Platform', path: '/platform', icon: <Bot size={20} /> },
    { name: 'API Keys', path: '/keys', icon: <Key size={20} /> },
  ];

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col h-screen p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-primary flex items-center justify-center font-bold text-white shadow-lg">
          J
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Jarvis Center
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-teal-400 border border-primary/30 shadow-[0_0_15px_rgba(15,118,110,0.15)]'
                  : 'text-dark-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="font-medium text-sm">{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-dark-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-text-muted hover:bg-red-500/10 hover:text-red-400 w-full transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [sys, setSys] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://146.235.20.33:3008/system')
      .then(res => res.json())
      .then(data => {
        setSys(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6">Tổng quan hệ thống VPS</h2>
      {loading ? (
        <div className="text-dark-text-muted">Đang phân tích tài nguyên hệ thống...</div>
      ) : !sys ? (
        <div className="text-red-400">Không thể kết nối đến máy chủ giám sát.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-dark-text-muted font-medium mb-2">CPU Usage</p>
              <h3 className="text-3xl font-bold text-blue-400">{sys.cpu}%</h3>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-dark-text-muted font-medium mb-2">RAM ({sys.memTotal})</p>
              <h3 className="text-3xl font-bold text-emerald-400">{sys.memUsed}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-dark-text-muted font-medium mb-2">Ổ cứng ({sys.diskTotal})</p>
              <h3 className="text-3xl font-bold text-purple-400">{sys.diskUsed}</h3>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Các dự án đang chạy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sys.containers.map((c: any, i: number) => (
              <div key={i} className="bg-dark-surface border border-dark-border p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="font-semibold text-white truncate max-w-[150px]" title={c.name}>{c.name}</h4>
                  <p className="text-xs text-dark-text-muted mt-1 font-mono">{c.mem}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${c.status.includes('Up') ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-medium text-dark-text-muted">{c.status.includes('Up') ? 'LIVE' : 'OFF'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const JarvisFormat = () => {
  const [keys, setKeys] = React.useState<any[]>([]);
  const [duration, setDuration] = React.useState('1 Tháng');
  const [amount, setAmount] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const API_URL = 'http://146.235.20.33:3005/jarvis-format/api';

  const fetchKeys = async () => {
    try {
      const res = await fetch(`${API_URL}/keys`);
      const data = await res.json();
      setKeys(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    try {
      await fetch(`${API_URL}/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, amount })
      });
      fetchKeys(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm('Bạn có chắc chắn muốn xóa key này?')) return;
    try {
      await fetch(`${API_URL}/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Quản lý Jarvis Format</h2>
        <div className="flex gap-4">
          <select 
            value={duration} 
            onChange={e => setDuration(e.target.value)}
            className="bg-dark-surface border border-dark-border text-sm rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
          >
            <option>1 Tháng</option>
            <option>3 Tháng</option>
            <option>6 Tháng</option>
            <option>1 Năm</option>
            <option>Trọn đời</option>
          </select>
          <input 
            type="number" 
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-20 bg-dark-surface border border-dark-border text-sm rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors text-center" 
          />
          <button 
            onClick={handleCreateKey}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium shadow-[0_0_15px_rgba(15,118,110,0.4)] transition-all"
          >
            + Tạo Key Mới
          </button>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-dark-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-dark-text-muted">Key (Khóa)</th>
              <th className="px-6 py-4 font-semibold text-dark-text-muted">Thời hạn</th>
              <th className="px-6 py-4 font-semibold text-dark-text-muted">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-dark-text-muted">HWID</th>
              <th className="px-6 py-4 font-semibold text-dark-text-muted">Ngày tạo</th>
              <th className="px-6 py-4 font-semibold text-dark-text-muted text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {loading ? (
               <tr><td colSpan={6} className="px-6 py-4 text-center text-dark-text-muted">Đang tải dữ liệu...</td></tr>
            ) : keys.length === 0 ? (
               <tr><td colSpan={6} className="px-6 py-4 text-center text-dark-text-muted">Chưa có key nào được tạo.</td></tr>
            ) : keys.map((k, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-teal-400">{k.license_key}</td>
                <td className="px-6 py-4">{k.duration}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    k.status === 'Đã kích hoạt' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    k.status === 'Chưa sử dụng' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {k.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-dark-text-muted">{k.hwid || '---'}</td>
                <td className="px-6 py-4 text-dark-text-muted">{new Date(k.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(k.id)} className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 flex items-center justify-center h-full text-dark-text-muted animate-in fade-in duration-500">
    <div className="text-center">
      <Bot size={48} className="mx-auto mb-4 opacity-50" />
      <h2 className="text-xl font-medium">{title} - Coming Soon</h2>
      <p className="mt-2 opacity-60">Phần quản lý này đang được xây dựng...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-dark-bg text-dark-text overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/format" element={<JarvisFormat />} />
            <Route path="/platform" element={<Placeholder title="Jarvis Platform" />} />
            <Route path="/keys" element={<Placeholder title="API Keys" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
