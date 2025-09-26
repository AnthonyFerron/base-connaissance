"use client";
import { useEffect, useState } from "react";

// Icônes SVG inline
const icons = {
  EN_ATTENTE: (
    <span style={{ fontSize: 28, color: "#444" }} title="En attente">
      <svg width="28" height="28" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#eee" />
        <text x="12" y="16" textAnchor="middle" fontSize="16" fill="#444">
          i
        </text>
      </svg>
    </span>
  ),
  ACCEPTEE: (
    <span style={{ fontSize: 28, color: "#2ecc40" }} title="Acceptée">
      <svg width="28" height="28" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#eafbe7" />
        <polyline
          points="8 13 11 16 16 9"
          fill="none"
          stroke="#2ecc40"
          strokeWidth="2"
        />
      </svg>
    </span>
  ),
  REFUSEE: (
    <span style={{ fontSize: 28, color: "#ff4136" }} title="Refusée">
      <svg width="28" height="28" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#fdeaea" />
        <line x1="8" y1="8" x2="16" y2="16" stroke="#ff4136" strokeWidth="2" />
        <line x1="16" y1="8" x2="8" y2="16" stroke="#ff4136" strokeWidth="2" />
      </svg>
    </span>
  ),
  COMMENTAIRE: (
    <span style={{ fontSize: 28, color: "#0074D9" }} title="Commentaire">
      <svg width="28" height="28" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#eaf4fd" />
        <text x="12" y="16" textAnchor="middle" fontSize="16" fill="#0074D9">
          💬
        </text>
      </svg>
    </span>
  ),
};

function getRequestText(item) {
  if (item.type === "request") {
    if (item.actionType === "MODIFICATION") {
      return `A fait une modification sur la Fiche ${
        item.pokemon?.name || ""
      } !`;
    }
    if (item.actionType === "AJOUT") {
      return `A créé la Fiche ${item.pokemon?.name || ""} !`;
    }
    return `A fait une demande sur la Fiche ${item.pokemon?.name || ""} !`;
  }
  // Pour les commentaires
  if (item.type === "comment") {
    return `A ajouté un commentaire à la Fiche ${item.pokemon?.name || ""} !`;
  }
  return "";
}

const statusLabels = {
  ACCEPTEE: "Validé",
  REFUSEE: "Rejeté",
  EN_ATTENTE: "demande de validation",
};

const typeLabels = {
  AJOUT: "Création de fiche",
  MODIFICATION: "Modification de fiche",
  COMMENTAIRE: "Ajout de commentaire",
};

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("EN_ATTENTE");
  const [typeFilter, setTypeFilter] = useState({
    AJOUT: true,
    MODIFICATION: true,
    COMMENTAIRE: true,
  });
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    // Récupère requests et commentaires
    Promise.all([
      fetch("/api/request").then((res) => res.json()),
      fetch("/api/comment").then((res) => res.json()),
    ]).then(([requests, comments]) => {
      // Ajoute un champ type pour différencier
      const reqs = requests.map((r) => ({ ...r, type: "request" }));
      const comms = comments.map((c) => ({
        ...c,
        type: "comment",
        status: "COMMENTAIRE", // Pour l'icône et le filtre
        actionType: "COMMENTAIRE",
      }));
      // Fusionne et trie par date (si possible)
      const all = [...reqs, ...comms].sort((a, b) => {
        const da = new Date(a.createdAt || a.proposedDate || 0);
        const db = new Date(b.createdAt || b.proposedDate || 0);
        return db - da;
      });
      setItems(all);
    });
  }, []);

  // Filtrage
  const filteredItems = items.filter(
    (item) =>
      (item.type === "comment" ||
        statusFilter === "" ||
        item.status === statusFilter) &&
      typeFilter[item.actionType]
  );

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setStatusFilter("");
    setTypeFilter({
      AJOUT: true,
      MODIFICATION: true,
      COMMENTAIRE: true,
    });
  };

  return (
    <div
      style={{
        background: 'url("/background-pokemon.jpg") center/cover',
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Boutons Filtre et Réinitialiser */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 20,
          display: "flex",
          gap: 16,
        }}
      >
        <button
          onClick={() => setShowFilter((v) => !v)}
          style={{
            background: "#fff",
            border: "2px solid #ff4136",
            color: "#ff4136",
            borderRadius: 12,
            padding: "10px 26px",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "background 0.2s",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            style={{ marginRight: 4 }}
          >
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="#ff4136"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          Filtre
        </button>
        <button
          onClick={resetFilters}
          style={{
            background: "#fff",
            border: "2px solid #888",
            color: "#888",
            borderRadius: 12,
            padding: "10px 26px",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "background 0.2s",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            style={{ marginRight: 4 }}
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          Réinitialiser
        </button>
      </div>
      {/* Animation sidebar filtre */}
      <div
        style={{
          position: "relative",
          minWidth: showFilter ? 260 : 0,
          maxWidth: showFilter ? 300 : 0,
          transition: "min-width 0.3s, max-width 0.3s",
        }}
      >
        {/* Sidebar filtre */}
        {showFilter && (
          <aside
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              height: "100vh",
              width: 300,
              background: "#fff",
              borderRadius: "0 10px 10px 0",
              borderRight: "1px solid #000000ff",
              boxShadow: "2px 0 12px #0001",
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              zIndex: 10,
              transform: showFilter ? "translateX(0)" : "translateX(-110%)",
              opacity: showFilter ? 1 : 0,
              pointerEvents: showFilter ? "auto" : "none",
              transition: "min-width 0.3s, max-width 0.3s",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                Status
              </div>
              {Object.entries(statusLabels).map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: statusFilter === key ? 600 : 400,
                    transition: "color 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={key}
                    checked={statusFilter === key}
                    onChange={() => setStatusFilter(key)}
                    style={{
                      marginRight: 10,
                      color: "#000000ff",
                      width: 18,
                      height: 18,
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                Type de demande
              </div>
              {Object.entries(typeLabels).map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#000000ff",
                    fontWeight: typeFilter[key] ? 600 : 400,
                    transition: "color 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={typeFilter[key]}
                    onChange={() =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    style={{
                      marginRight: 10,
                      accentColor: "#ff4136",
                      color: "#000000ff",
                      borderRadius: 4,
                      width: 18,
                      height: 18,
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </aside>
        )}
      </div>
      {/* Liste des items (requests + commentaires) */}
      <main
        style={{
          maxWidth: 900,
          flex: 1,
          margin: "0 auto",
          padding: "48px 0 48px 0",
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 2px 8px #0001",
              marginBottom: 24,
              padding: "20px 32px",
              gap: 24,
              border: "1px solid rgba(0, 0, 0, 1)",
            }}
          >
            {icons[item.status]}
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 20 }}>
                {item.author?.name || "Utilisateur"}
              </span>
              <span style={{ marginLeft: 12, fontSize: 17, color: "#444" }}>
                {getRequestText(item)}
              </span>
            </div>
            <button
              style={{
                background: "none",
                border: "2px solid #ff4136",
                color: "#ff4136",
                borderRadius: 12,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 17,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Vérifier
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                style={{ marginLeft: 4 }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#ff4136"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="#ff4136"
                  strokeWidth="2"
                />
                <path
                  d="M2 12c2-5 7-9 10-9s8 4 10 9c-2 5-7 9-10 9s-8-4-10-9z"
                  fill="none"
                  stroke="#ff4136"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
