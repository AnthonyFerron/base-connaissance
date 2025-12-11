"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash, FaUserShield, FaUser, FaSearch } from "react-icons/fa";
import NavBar from "@/app/components/NavBar";
import ConfirmModal from "@/app/components/ConfirmModal";
import AlertModal from "@/app/components/AlertModal";
import { authClient } from "@/lib/auth-client";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      router.push("/login");
      return;
    }

    if (data.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    loadUsers();
  }, [data, isPending, router]);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const data = await response.json();
        setAlertModal({
          isOpen: true,
          message: data.error || "Erreur lors de la modification du rôle",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAlertModal({
        isOpen: true,
        message: "Erreur lors de la modification du rôle",
        type: "error",
      });
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.userId) return;

    try {
      const response = await fetch(`/api/admin/users/${deleteModal.userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const data = await response.json();
        setAlertModal({
          isOpen: true,
          message: data.error || "Erreur lors de la suppression",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAlertModal({
        isOpen: true,
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!data?.user || data.user.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h3 className="font-semibold text-lg mb-4">Recherche</h3>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Rôle</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={filterRole === "ALL"}
                      onChange={() => setFilterRole("ALL")}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">Tous</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={filterRole === "USER"}
                      onChange={() => setFilterRole("USER")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Utilisateurs</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={filterRole === "ADMIN"}
                      onChange={() => setFilterRole("ADMIN")}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-3 text-gray-700">Administrateurs</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total</p>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <FaUser className="text-4xl text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Admins</p>
                      <p className="text-3xl font-bold">
                        {users.filter((u) => u.role === "ADMIN").length}
                      </p>
                    </div>
                    <FaUserShield className="text-4xl text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Users</p>
                      <p className="text-3xl font-bold">
                        {users.filter((u) => u.role === "USER").length}
                      </p>
                    </div>
                    <FaUser className="text-4xl text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Liste des utilisateurs */}
              {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
                  Aucun utilisateur ne correspond aux filtres sélectionnés
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6 flex items-center gap-6">
                        {/* User Icon */}
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {user.role === "ADMIN" ? (
                            <FaUserShield className="text-green-600 text-xl" />
                          ) : (
                            <FaUser className="text-gray-600 text-xl" />
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {user.name || "Sans nom"}
                          </h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Inscrit le{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>

                        {/* Role Selector */}
                        <div className="flex-shrink-0">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className={`px-6 py-2 pr-10 rounded-lg text-sm font-semibold border-2 transition-colors min-w-[180px] ${
                              user.role === "ADMIN"
                                ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                : "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                            }`}
                          >
                            <option value="USER">Utilisateur</option>
                            <option value="ADMIN">Administrateur</option>
                          </select>
                        </div>

                        {/* Delete Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.name || user.email)
                            }
                            className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={confirmDeleteUser}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deleteModal.userName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />

      {/* Modal d'alerte */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() =>
          setAlertModal({ isOpen: false, message: "", type: "error" })
        }
        title="Erreur"
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}
