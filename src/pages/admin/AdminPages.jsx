import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDifficulty, formatMode } from "../../utils/constants";
import { ContactSupport } from "../../components/common/ContactSupport";
import { Button, Card, Input, Loader, StatCard } from "../../components/common/UI";
import { conversationService } from "../../services/conversationService";
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";

const PAGE_SIZE = 10;

const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    ACTIVE: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.ACTIVE}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalConversations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userService.getAllUsers(), sessionService.getAll(), conversationService.getAll()])
      .then(([users, sessions, conversations]) => {
        setStats({
          totalUsers: users.length,
          verifiedUsers: users.filter((u) => u.emailVerified).length,
          totalSessions: sessions.length,
          activeSessions: sessions.filter((s) => s.status === "ACTIVE").length,
          totalConversations: conversations.length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Verified Users" value={stats.verifiedUsers} />
        <StatCard title="Total Sessions" value={stats.totalSessions} />
        <StatCard title="Active Sessions" value={stats.activeSessions} />
        <StatCard title="Total Conversations" value={stats.totalConversations} />
      </div>
      <ContactSupport />
    </div>
  );
};

export const AdminUsersPage = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getAllUsers()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (u) =>
        String(u.id).includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobileNumber?.includes(q)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2">ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2">{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.mobileNumber || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No users found.</p>
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages} ({filtered.length} users)
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export const AdminSessionsPage = () => {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService
      .getAll()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return rows;
    return rows.filter((s) => s.status === filter);
  }, [rows, filter]);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Session Management</h2>
        <div className="flex flex-wrap gap-2">
          {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "primary" : "secondary"}
              className="px-3 py-1 text-xs"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-2">ID</th>
                <th>Topic</th>
                <th>Mode</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">{s.id}</td>
                  <td>{s.topic}</td>
                  <td>{formatMode(s.mode)}</td>
                  <td>{formatDifficulty(s.difficultyLevel)}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No sessions found.</p>
          )}
        </div>
      )}
    </Card>
  );
};

export const AdminConversationsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conversationService
      .getAll()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Conversations</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        rows.map((c) => (
          <div key={c.id} className="mb-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
            {c.question || c.aiQuestion}
          </div>
        ))
      )}
    </Card>
  );
};
