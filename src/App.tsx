import React, { useState, useEffect } from "react";

// Credenciales de Supabase usando API REST directa (sin librerías externas)
const SUPABASE_URL = "https://jjfvmcubktfidntkamue.supabase.co";
const SUPABASE_ANON_KEY = "TU_PUBLISHABLE_KEY_AQUI"; // <-- Pega aquí tu clave publishable completa
const SUPABASE_ANON_KEY = "sb_publishable_E-Pv2tQ7fr...";
const ADMIN_PIN = "Sydney17800";

interface Student {
  id: string;
  name: string;
  course: string;
  balance: number;
}

interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const IconQr = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const IconGift = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconCard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const IconPrinter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

const INITIAL_REWARDS: Reward[] = [
  { id: "r1", title: "Pase para salir 5 min antes", cost: 25, icon: "🔔" },
  { id: "r2", title: "Elegir asiento por un día", cost: 40, icon: "🪑" },
  { id: "r3", title: "Sticker especial coleccionable", cost: 15, icon: "⭐" },
  { id: "r4", title: "Puntos extra en guía", cost: 50, icon: "📝" },
  { id: "r5", title: "Tiempo libre de juegos (15 min)", cost: 60, icon: "🎮" }
];

export default function App() {
  useEffect(() => {
    document.title = "Banco Julius Company";
  }, []);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem("julius_rewards");
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showQrModal, setShowQrModal] = useState<Student | null>(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showManageRewardsModal, setShowManageRewardsModal] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentCourse, setNewStudentCourse] = useState("");

  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardCost, setRewardCost] = useState(20);
  const [rewardIcon, setRewardIcon] = useState("🎁");
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);

  // Petición nativa a Supabase API REST
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/students?select=*&order=name.asc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Error al cargar alumnos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000); // Auto-sincronización cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("studentId");
    if (id) {
      setActiveStudentId(id);
    } else {
      setIsAdminAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("julius_rewards", JSON.stringify(rewards));
  }, [rewards]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdminAuthenticated(true);
      setShowPinModal(false);
      setPinError(false);
      setPinInput("");
      const url = new URL(window.location.href);
      url.searchParams.delete("studentId");
      window.history.pushState({}, "", url.pathname);
      setActiveStudentId(null);
    } else {
      setPinError(true);
    }
  };

  const addJulius = async (id: string, amount: number) => {
    const currentStudent = students.find((s) => s.id === id);
    if (!currentStudent) return;

    const newBalance = Math.max(0, Number(currentStudent.balance) + amount);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, balance: newBalance } : s));

    await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ balance: newBalance })
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    if (editingStudent) {
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${editingStudent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name: newStudentName,
          course: newStudentCourse || "General"
        })
      });
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: newStudentName,
        course: newStudentCourse || "General",
        balance: 0
      };
      await fetch(`${SUPABASE_URL}/rest/v1/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(newStudent)
      });
    }

    setNewStudentName("");
    setNewStudentCourse("");
    setShowAddModal(false);
    fetchStudents();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n");
      const newStudentsToInsert: Student[] = [];

      lines.forEach((line, index) => {
        if (!line.trim()) return;
        const parts = line.split(/[,;\t]/);
        const name = parts[0]?.trim();
        const course = parts[1]?.trim() || "General";
        
        if (name && index > 0) {
          newStudentsToInsert.push({
            id: (Date.now() + index).toString(),
            name,
            course,
            balance: 0
          });
        }
      });

      if (newStudentsToInsert.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=minimal"
          },
          body: JSON.stringify(newStudentsToInsert)
        });
        alert(`¡Se importaron ${newStudentsToInsert.length} estudiantes exitosamente!`);
        fetchStudents();
      }
    };
    reader.readAsText(file);
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;

    if (editingRewardId) {
      setRewards((prev: Reward[]) =>
        prev.map((r: Reward) => (r.id === editingRewardId ? { ...r, title: rewardTitle, cost: Number(rewardCost), icon: rewardIcon } : r))
      );
      setEditingRewardId(null);
    } else {
      const newReward: Reward = {
        id: "r_" + Date.now(),
        title: rewardTitle,
        cost: Number(rewardCost),
        icon: rewardIcon || "🎁"
      };
      setRewards([...rewards, newReward]);
    }

    setRewardTitle("");
    setRewardCost(20);
    setRewardIcon("🎁");
  };

  const deleteReward = (id: string) => {
    setRewards((prev: Reward[]) => prev.filter((r: Reward) => r.id !== id));
  };

  const startEditReward = (reward: Reward) => {
    setEditingRewardId(reward.id);
    setRewardTitle(reward.title);
    setRewardCost(reward.cost);
    setRewardIcon(reward.icon);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setNewStudentName(student.name);
    setNewStudentCourse(student.course);
    setShowAddModal(true);
  };

  const filteredStudents = students.filter(
    (s: Student) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudent = students.find((s: Student) => s.id === activeStudentId);

  if (showPrintView) {
    return (
      <div style={{ backgroundColor: "#fff", padding: "20px", color: "#000", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} className="no-print">
          <button onClick={() => setShowPrintView(false)} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", backgroundColor: "#334155", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>
            ← Volver al Panel
          </button>
          <button onClick={() => window.print()} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#059669", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>
            🖨️ Imprimir Tarjetas (A4)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {filteredStudents.map((st) => (
            <div key={st.id} style={{
              border: "3px solid #d97706",
              borderRadius: "16px",
              padding: "16px",
              background: "linear-gradient(135deg, #fffbe0 0%, #fef3c7 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              pageBreakInside: "avoid"
            }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "1px", color: "#b45309", textTransform: "uppercase" }}>
                  🏛️ Banco Julius VIP
                </span>
                <h2 style={{ fontSize: "18px", fontWeight: "900", margin: "4px 0 2px 0", color: "#78350f" }}>{st.name}</h2>
                <p style={{ fontSize: "12px", margin: 0, color: "#92400e", fontWeight: "bold" }}>{st.course}</p>
              </div>

              <div style={{ textAlign: "center", background: "#fff", padding: "8px", borderRadius: "10px", border: "1px solid #f59e0b" }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                    window.location.origin + window.location.pathname + "?studentId=" + st.id
                  )}`}
                  alt="QR"
                  style={{ width: "85px", height: "85px", display: "block" }}
                />
                <span style={{ fontSize: "9px", color: "#78350f", fontWeight: "bold", display: "block", marginTop: "2px" }}>Escanea tu Saldo</span>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; }
          }
        `}</style>
      </div>
    );
  }

  if (activeStudent) {
    return (
      <div style={styles.studentPage}>
        <div style={styles.studentContainer}>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h1 style={styles.goldTitle}>🏛️ BANCO JULIUS COMPANY</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: "4px 0 0 0" }}>Tarjeta Virtual del Estudiante</p>
          </div>

          <div style={styles.goldCard}>
            <p style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "bold", color: "#451a03", margin: 0 }}>Estudiante VIP</p>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#1e1b4b", margin: "4px 0" }}>{activeStudent.name}</h2>
            <p style={{ fontSize: "14px", color: "#312e81", margin: 0 }}>{activeStudent.course}</p>
            
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "bold", color: "#451a03", margin: 0 }}>Saldo Disponible</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "42px", fontWeight: "900", color: "#0f172a" }}>{activeStudent.balance}</span>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b" }}>Julius</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowRewardsModal(true)} style={styles.btnGreen}>
            <IconGift /> Ver Catálogo de Premios
          </button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button onClick={() => setShowPinModal(true)} style={styles.btnAdminLock}>
              <IconLock /> Acceso Docente
            </button>
          </div>

          {showRewardsModal && (
            <div style={styles.overlay}>
              <div style={styles.modalBox}>
                <div style={styles.modalHeader}>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>Catálogo de Premios</h3>
                  <button onClick={() => setShowRewardsModal(false)} style={styles.closeBtn}>✕</button>
                </div>
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto" }}>
                  {rewards.map((r: Reward) => {
                    const reaches = activeStudent.balance >= r.cost;
                    return (
                      <div key={r.id} style={{ ...styles.rewardItem, border: reaches ? "1px solid #10b981" : "1px solid #334155" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "24px" }}>{r.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: "bold", color: "#fff", fontSize: "14px" }}>{r.title}</p>
                            <p style={{ margin: 0, color: "#fbbf24", fontSize: "13px", fontWeight: "bold" }}>{r.cost} Julius</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "12px", background: reaches ? "#064e3b" : "#1e293b", color: reaches ? "#34d399" : "#94a3b8", fontWeight: "bold" }}>
                          {reaches ? "¡Te alcanza!" : `Faltan ${r.cost - activeStudent.balance}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {showPinModal && (
            <div style={styles.overlay}>
              <div style={{ ...styles.modalBox, maxWidth: "320px", textAlign: "center" }}>
                <h3 style={{ color: "#fff", margin: "0 0 8px 0" }}>Acceso Profesor</h3>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 14px 0" }}>Ingresa tu clave PIN para administrar:</p>
                <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="password"
                    maxLength={30}
                    autoFocus
                    placeholder="Ingresa la clave docente"
                    value={pinInput}
                    onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                    style={{ ...styles.formInput, textAlign: "center", fontSize: "16px", letterSpacing: "2px" }}
                  />
                  {pinError && <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>Clave incorrecta</p>}
                  <button type="submit" style={styles.btnGoldFull}>Ingresar</button>
                  <button type="button" onClick={() => setShowPinModal(false)} style={styles.btnCancelFull}>Cancelar</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div style={{ ...styles.studentPage, justifyContent: "center" }}>
        <div style={{ ...styles.modalBox, maxWidth: "320px", textAlign: "center" }}>
          <h2 style={styles.goldTitle}>🏛️ BANCO JULIUS</h2>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 16px 0" }}>Panel Docente Protegido</p>
          <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ color: "#cbd5e1", fontSize: "12px" }}>Ingresa la clave del Profesor:</label>
            <input
              type="password"
              maxLength={30}
              autoFocus
              placeholder="Ingresa la clave"
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              style={{ ...styles.formInput, textAlign: "center", fontSize: "16px", letterSpacing: "2px" }}
            />
            {pinError && <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>Clave incorrecta</p>}
            <button type="submit" style={styles.btnGoldFull}>Entrar al Panel Docente</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.mainContainer}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.goldTitle}>🏛️ BANCO JULIUS COMPANY</h1>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "2px 0 0 0" }}>Panel de Control Docente (Conectado a la Nube ☁️)</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <label style={styles.btnGreenUpload}>
              <IconUpload /> Cargar CSV/Excel
              <input type="file" accept=".csv, .txt" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
            <button onClick={() => setShowPrintView(true)} style={styles.btnBlue}>
              <IconPrinter /> Imprimir Tarjetas
            </button>
            <button onClick={() => setShowManageRewardsModal(true)} style={styles.btnPurple}>
              <IconGift /> Premios
            </button>
            <button onClick={() => {
              setEditingStudent(null);
              setNewStudentName("");
              setNewStudentCourse("");
              setShowAddModal(true);
            }} style={styles.btnGold}>
              <IconPlus /> Agregar Alumno
            </button>
            <button onClick={() => setIsAdminAuthenticated(false)} style={styles.btnLockHeader} title="Cerrar Sesión">
              <IconLock /> Bloquear
            </button>
          </div>
        </header>

        <div style={styles.searchBox}>
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar por nombre o curso..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading && students.length === 0 ? (
          <p style={{ textAlign: "center", color: "#fbbf24" }}>Cargando lista desde la nube...</p>
        ) : (
          <div style={styles.grid}>
            {filteredStudents.map((student: Student) => (
              <div key={student.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: "bold" }}>{student.name}</h3>
                      <button onClick={() => openEditModal(student)} title="Editar nombre/curso" style={styles.btnIconOnly}>
                        <IconEdit />
                      </button>
                    </div>
                    <span style={styles.badge}>{student.course}</span>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setActiveStudentId(student.id)} title="Ver Tarjeta VIP" style={styles.btnCard}>
                      <IconCard /> Tarjeta
                    </button>
                    <button onClick={() => setShowQrModal(student)} title="Mostrar Código QR" style={styles.btnQr}>
                      <IconQr /> QR
                    </button>
                  </div>
                </div>

                <div style={styles.balanceBox}>
                  <span style={{ color: "#94a3b8", fontSize: "12px" }}>Saldo Actual</span>
                  <span style={{ color: "#fbbf24", fontSize: "22px", fontWeight: "900" }}>
                    {student.balance} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "normal" }}>Julius</span>
                  </span>
                </div>

                <div>
                  <p style={styles.sectionLabel}>SUMAR JULIUS</p>
                  <div style={styles.btnRow}>
                    <button onClick={() => addJulius(student.id, 5)} style={styles.btnPlus}>+5</button>
                    <button onClick={() => addJulius(student.id, 10)} style={styles.btnPlus}>+10</button>
                    <button onClick={() => addJulius(student.id, 25)} style={styles.btnPlus}>+25</button>
                    <button onClick={() => addJulius(student.id, 50)} style={styles.btnPlus}>+50</button>
                  </div>
                </div>

                <div>
                  <p style={styles.sectionLabel}>RESTAR JULIUS</p>
                  <div style={styles.btnRow}>
                    <button onClick={() => addJulius(student.id, -5)} style={styles.btnMinus}>-5</button>
                    <button onClick={() => addJulius(student.id, -10)} style={styles.btnMinus}>-10</button>
                    <button onClick={() => addJulius(student.id, -20)} style={styles.btnMinus}>-20</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showManageRewardsModal && (
          <div style={styles.overlay}>
            <div style={{ ...styles.modalBox, maxWidth: "480px" }}>
              <div style={styles.modalHeader}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>Administrar Catálogo de Premios</h3>
                <button onClick={() => setShowManageRewardsModal(false)} style={styles.closeBtn}>✕</button>
              </div>

              <form onSubmit={handleSaveReward} style={{ marginTop: "16px", padding: "12px", backgroundColor: "#020617", borderRadius: "12px", border: "1px solid #334155" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#fbbf24", fontWeight: "bold" }}>
                  {editingRewardId ? "Editar Premio" : "Agregar Nuevo Premio"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Ícono"
                    value={rewardIcon}
                    onChange={e => setRewardIcon(e.target.value)}
                    style={styles.formInput}
                  />
                  <input
                    type="text"
                    placeholder="Título del premio"
                    required
                    value={rewardTitle}
                    onChange={e => setRewardTitle(e.target.value)}
                    style={styles.formInput}
                  />
                  <input
                    type="number"
                    placeholder="Costo"
                    required
                    value={rewardCost}
                    onChange={e => setRewardCost(Number(e.target.value))}
                    style={styles.formInput}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button type="submit" style={styles.btnGoldFull}>
                    {editingRewardId ? "Guardar Cambios" : "Añadir Premio"}
                  </button>
                  {editingRewardId && (
                    <button type="button" onClick={() => {
                      setEditingRewardId(null);
                      setRewardTitle("");
                      setRewardCost(20);
                      setRewardIcon("🎁");
                    }} style={styles.btnCancel}>Cancelar</button>
                  )}
                </div>
              </form>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
                {rewards.map((r: Reward) => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#020617", borderRadius: "8px", border: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{r.icon}</span>
                      <div>
                        <p style={{ margin: 0, color: "#fff", fontSize: "13px", fontWeight: "bold" }}>{r.title}</p>
                        <p style={{ margin: 0, color: "#fbbf24", fontSize: "12px" }}>{r.cost} Julius</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => startEditReward(r)} style={styles.btnIconOnly} title="Editar premio">
                        <IconEdit />
                      </button>
                      <button onClick={() => deleteReward(r.id)} style={styles.btnIconOnly} title="Eliminar premio">
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div style={styles.overlay}>
            <div style={styles.modalBox}>
              <h3 style={{ color: "#fff", margin: "0 0 16px 0", fontSize: "18px" }}>
                {editingStudent ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
              </h3>
              <form onSubmit={handleAddStudent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={styles.label}>Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    style={styles.formInput}
                  />
                </div>
                <div>
                  <label style={styles.label}>Curso / Sección</label>
                  <input
                    type="text"
                    value={newStudentCourse}
                    onChange={e => setNewStudentCourse(e.target.value)}
                    style={styles.formInput}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={styles.btnCancel}>Cancelar</button>
                  <button type="submit" style={styles.btnGoldFull}>
                    {editingStudent ? "Guardar Cambios" : "Guardar Estudiante"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showQrModal && (
          <div style={styles.overlay}>
            <div style={{ ...styles.modalBox, textAlign: "center", maxWidth: "320px" }}>
              <h3 style={{ color: "#fff", margin: "0 0 4px 0" }}>{showQrModal.name}</h3>
              <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 16px 0" }}>{showQrModal.course}</p>
              
              <div style={{ background: "#fff", padding: "16px", borderRadius: "16px", display: "inline-block" }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    window.location.origin + window.location.pathname + "?studentId=" + showQrModal.id
                  )}`}
                  alt="Código QR del Alumno"
                  style={{ width: "180px", height: "180px", display: "block" }}
                />
              </div>

              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => {
                    setShowQrModal(null);
                    setActiveStudentId(showQrModal.id);
                  }}
                  style={styles.btnCardFull}
                >
                  Probar Tarjeta VIP en Pantalla
                </button>
                <button onClick={() => setShowQrModal(null)} style={styles.btnCancelFull}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { minHeight: "100vh", backgroundColor: "#090d16", color: "#f8fafc", fontFamily: "system-ui, sans-serif", padding: "24px 16px" },
  mainContainer: { maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "16px", flexWrap: "wrap", gap: "12px" },
  goldTitle: { color: "#fbbf24", margin: 0, fontSize: "22px", fontWeight: "900", letterSpacing: "0.5px" },
  btnGold: { backgroundColor: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", padding: "10px 16px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" },
  btnGreenUpload: { backgroundColor: "#10b981", color: "#0f172a", border: "none", borderRadius: "10px", padding: "10px 16px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" },
  btnPurple: { backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" },
  btnBlue: { backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" },
  btnLockHeader: { backgroundColor: "#334155", color: "#94a3b8", border: "none", borderRadius: "10px", padding: "10px 14px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" },
  btnGoldFull: { width: "100%", backgroundColor: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer" },
  searchBox: { display: "flex", alignItems: "center", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "0 12px", gap: "10px" },
  searchInput: { width: "100%", backgroundColor: "transparent", border: "none", color: "#fff", padding: "12px 0", outline: "none", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  card: { backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" },
  badge: { backgroundColor: "#1e293b", color: "#94a3b8", fontSize: "11px", padding: "2px 8px", borderRadius: "6px", marginTop: "4px", display: "inline-block" },
  btnIconOnly: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" },
  btnCard: { backgroundColor: "#1e1b4b", color: "#818cf8", border: "1px solid #3730a3", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" },
  btnCardFull: { width: "100%", backgroundColor: "#3730a3", color: "#fff", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" },
  btnQr: { backgroundColor: "#1e293b", color: "#fbbf24", border: "1px solid #334155", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" },
  balanceBox: { backgroundColor: "#020617", border: "1px solid #1e293b", padding: "12px 16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionLabel: { fontSize: "10px", fontWeight: "bold", color: "#64748b", letterSpacing: "0.5px", margin: "0 0 6px 0" },
  btnRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))", gap: "8px" },
  btnPlus: { backgroundColor: "#064e3b", color: "#34d399", border: "1px solid #047857", padding: "8px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" },
  btnMinus: { backgroundColor: "#4c0519", color: "#fb7185", border: "1px solid #9f1239", padding: "8px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 9999 },
  modalBox: { backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "380px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" },
  label: { fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" },
  formInput: { width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "13px" },
  btnCancel: { width: "100%", backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer" },
  btnCancelFull: { width: "100%", backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", borderRadius: "10px", padding: "10px", fontWeight: "bold", cursor: "pointer" },
  studentPage: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, sans-serif" },
  studentContainer: { maxWidth: "360px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" },
  goldCard: { background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" },
  btnGreen: { backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px" },
  btnAdminLock: { backgroundColor: "transparent", border: "none", color: "#64748b", fontSize: "11px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" },
  rewardItem: { padding: "12px", borderRadius: "12px", backgroundColor: "#020617", display: "flex", justifyContent: "space-between", alignItems: "center" }
};
