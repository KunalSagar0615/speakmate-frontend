import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDifficulty, formatMode } from "../../utils/constants";
import { conversationService } from "../../services/conversationService";
import { sessionService } from "../../services/sessionService";
import { adminService } from "../../services/adminService";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Loader, StatCard, } from "../../components/common/UI";
import PulseGridLoader from "../../components/common/PulseGridLoader";

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

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalConversations: 0,
  });

  const [monthlyData, setMonthlyData] = useState({
    activeUsers: 0,
    newUsers: 0,
    totalSessions: 0,
    totalConversations: 0,
  });

  const [dailyData, setDailyData] = useState({
    activeUsers: 0,
    newUsers: 0,
    totalSessions: 0,
    totalConversations: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);

  // =========================
  // Overall Statistics
  // =========================

  useEffect(() => {
    adminService
      .getOverview()
      .then((data) => {
        setStats({
          totalUsers: data.totalUsers,
          totalSessions: data.totalSessions,
          totalConversations: data.totalConversations,
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // Monthly Statistics
  // =========================

  useEffect(() => {
    setMonthlyLoading(true);

    adminService
      .getMonthlyOverview(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1
      )
      .then((data) => {
        setMonthlyData({
          activeUsers: data.activeUsers,
          newUsers: data.newUsers,
          totalSessions: data.totalSessions,
          totalConversations: data.totalConversations,
        });
      })
      .catch(() => {
        setMonthlyData({
          activeUsers: 0,
          newUsers: 0,
          totalSessions: 0,
          totalConversations: 0,
        });
      })
      .finally(() => setMonthlyLoading(false));
  }, [selectedMonth]);

  // =========================
  // Daily Statistics
  // =========================

  useEffect(() => {
    setDailyLoading(true);

    const date = formatDateForApi(selectedDate);

    adminService
      .getDailyOverview(date)
      .then((data) => {
        setDailyData({
          activeUsers: data.activeUsers,
          newUsers: data.newUsers,
          totalSessions: data.totalSessions,
          totalConversations: data.totalConversations,
        });
      })
      .catch(() => {
        setDailyData({
          activeUsers: 0,
          newUsers: 0,
          totalSessions: 0,
          totalConversations: 0,
        });
      })
      .finally(() => setDailyLoading(false));
  }, [selectedDate]);

  // =========================
  // Month Navigation
  // =========================

  const goToPreviousMonth = () => {
    setSelectedMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1
        )
    );
  };

  const goToNextMonth = () => {
    const now = new Date();

    const nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1
    );

    // Don't allow future months
    if (
      nextMonth.getFullYear() > now.getFullYear() ||
      (nextMonth.getFullYear() === now.getFullYear() &&
        nextMonth.getMonth() > now.getMonth())
    ) {
      return;
    }

    setSelectedMonth(nextMonth);
  };

  // =========================
  // Day Navigation
  // =========================

  const goToPreviousDay = () => {
    setSelectedDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate() - 1
        )
    );
  };

  const goToNextDay = () => {
    const now = new Date();

    const nextDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1
    );

    // Don't allow future dates
    if (nextDay > now) {
      return;
    }

    setSelectedDate(nextDay);
  };

  const isCurrentMonth =
    selectedMonth.getFullYear() === new Date().getFullYear() &&
    selectedMonth.getMonth() === new Date().getMonth();

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PulseGridLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          Overall Statistics
      ========================= */}

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
          />

          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
          />

          <StatCard
            title="Total Conversations"
            value={stats.totalConversations}
          />
        </div>
      </div>

      {/* =========================
          Monthly Overview
      ========================= */}

      <Card>
        <div className="mb-5 flex items-center justify-between">

          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-lg px-3 py-2 text-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">
            {selectedMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            type="button"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="rounded-lg px-3 py-2 text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800"
          >
            →
          </button>

        </div>

        {monthlyLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <PulseGridLoader />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Active Users"
              value={monthlyData.activeUsers}
            />

            <StatCard
              title="New Users"
              value={monthlyData.newUsers}
            />

            <StatCard
              title="Sessions"
              value={monthlyData.totalSessions}
            />

            <StatCard
              title="Conversations"
              value={monthlyData.totalConversations}
            />

          </div>
        )}
      </Card>

      {/* =========================
          Daily Overview
      ========================= */}

      <Card>
        <div className="mb-5 flex items-center justify-between">

          <button
            type="button"
            onClick={goToPreviousDay}
            className="rounded-lg px-3 py-2 text-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">
            {selectedDate.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </h2>

          <button
            type="button"
            onClick={goToNextDay}
            disabled={isToday}
            className="rounded-lg px-3 py-2 text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800"
          >
            →
          </button>

        </div>

        {dailyLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <PulseGridLoader />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Active Users"
              value={dailyData.activeUsers}
            />

            <StatCard
              title="New Users"
              value={dailyData.newUsers}
            />

            <StatCard
              title="Sessions"
              value={dailyData.totalSessions}
            />

            <StatCard
              title="Conversations"
              value={dailyData.totalConversations}
            />

          </div>
        )}
      </Card>

    </div>
  );
};

export const AdminUsersPage = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    adminService
      .getAllUsers()
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return rows;
    }

    return rows.filter(
      (user) =>
        String(user.id).includes(q) ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.mobileNumber?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Card>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Users
          </h2>

          <p className="text-sm text-slate-500">
            {filtered.length} users
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <PulseGridLoader />
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">

                  <th className="px-3 py-3">
                    ID
                  </th>

                  <th className="px-3 py-3">
                    Name
                  </th>

                  <th className="px-3 py-3">
                    Email
                  </th>

                  <th className="px-3 py-3">
                    Mobile
                  </th>

                </tr>
              </thead>

              <tbody>

                {paginated.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() =>
                      navigate(`/admin/users/${user.id}`)
                    }
                    className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >

                    <td className="px-3 py-3 font-medium">
                      {user.id}
                    </td>

                    <td className="px-3 py-3">
                      {user.name || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {user.email || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {user.mobileNumber || "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {/* No users */}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No users found.
            </p>
          )}

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="mt-5 flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">

                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="secondary"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                >
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

export const AdminUserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getUser(userId)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PulseGridLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-slate-500">
            User not found.
          </p>

          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate("/admin/users")}
          >
            ← Back to Users
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">

      {/* Back */}
      <Button
        variant="secondary"
        onClick={() => navigate("/admin/users")}
      >
        ← Back to Users
      </Button>

      {/* User Information */}
      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          User Details
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs text-slate-500">
              ID
            </p>
            <p className="mt-1 font-medium">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Name
            </p>
            <p className="mt-1 font-medium">
              {user.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Username
            </p>
            <p className="mt-1 font-medium">
              {user.username || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Email
            </p>
            <p className="mt-1 break-all font-medium">
              {user.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Mobile Number
            </p>
            <p className="mt-1 font-medium">
              {user.mobileNumber || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Country
            </p>
            <p className="mt-1 font-medium">
              {user.country || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Highest Education
            </p>
            <p className="mt-1 font-medium">
              {user.highestEducation || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Current Occupation
            </p>
            <p className="mt-1 font-medium">
              {user.currentOccupation || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Role
            </p>
            <p className="mt-1 font-medium">
              {user.role || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Email Verified
            </p>
            <p className="mt-1 font-medium">
              {user.emailVerified ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Created At
            </p>
            <p className="mt-1 font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>

        </div>
      </Card>

      {/* Sessions */}
      <Card>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              User Sessions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user.sessions?.length || 0} sessions
            </p>
          </div>
        </div>

        {user.sessions?.length > 0 ? (
          <div className="overflow-auto">

            <table className="w-full text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">

                  <th className="px-3 py-3">
                    ID
                  </th>

                  <th className="px-3 py-3">
                    Topic
                  </th>

                  <th className="px-3 py-3">
                    Mode
                  </th>

                  <th className="px-3 py-3">
                    Difficulty
                  </th>

                  <th className="px-3 py-3">
                    Status
                  </th>

                  <th className="px-3 py-3">
                    Started At
                  </th>

                </tr>
              </thead>

              <tbody>

                {user.sessions.map((session) => (
                  <tr
                    key={session.sessionId}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >

                    <td className="px-3 py-3">
                      {session.sessionId}
                    </td>

                    <td className="px-3 py-3 font-medium">
                      {session.topic || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {formatMode(session.mode)}
                    </td>

                    <td className="px-3 py-3">
                      {formatDifficulty(session.difficulty)}
                    </td>

                    <td className="px-3 py-3">
                      <StatusBadge status={session.status} />
                    </td>

                    <td className="px-3 py-3">
                      {session.startedAt
                        ? new Date(
                          session.startedAt
                        ).toLocaleString()
                        : "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            This user has not completed any sessions yet.
          </p>
        )}

      </Card>

    </div>
  );
};

export const AdminSessionsPage = () => {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService
      .getAll()
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") {
      return rows;
    }

    return rows.filter(
      (session) => session.status === filter
    );
  }, [rows, filter]);

  return (
    <Card>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Session Management
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {filtered.length} sessions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          "ALL",
          "ACTIVE",
          "COMPLETED",
          "CANCELLED",
        ].map((status) => (
          <Button
            key={status}
            variant={
              filter === status
                ? "primary"
                : "secondary"
            }
            className="px-3 py-1 text-xs"
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <PulseGridLoader />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No sessions found.
        </p>
      ) : (
        <div className="overflow-auto">

          <table className="w-full text-left text-sm">

            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">

                <th className="px-3 py-3">
                  ID
                </th>

                <th className="px-3 py-3">
                  Topic
                </th>

                <th className="px-3 py-3">
                  Mode
                </th>

                <th className="px-3 py-3">
                  Difficulty
                </th>

                <th className="px-3 py-3">
                  Status
                </th>

                <th className="px-3 py-3">
                  Date
                </th>

              </tr>
            </thead>

            <tbody>

              {filtered.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >

                  <td className="px-3 py-3">
                    {session.id}
                  </td>

                  <td className="px-3 py-3 font-medium">
                    {session.topic || "-"}
                  </td>

                  <td className="px-3 py-3">
                    {formatMode(session.mode)}
                  </td>

                  <td className="px-3 py-3">
                    {formatDifficulty(
                      session.difficultyLevel
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <StatusBadge
                      status={session.status}
                    />
                  </td>

                  <td className="px-3 py-3">
                    {session.startTime
                      ? new Date(
                        session.startTime
                      ).toLocaleDateString()
                      : "-"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

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
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Card>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Conversations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {rows.length} conversations
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <PulseGridLoader />
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No conversations found.
        </p>
      ) : (
        <div className="overflow-auto">

          <table className="w-full text-left text-sm">

            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">

                <th className="px-3 py-3">
                  ID
                </th>

                <th className="px-3 py-3">
                  AI Question
                </th>

                <th className="px-3 py-3">
                  User Answer
                </th>

                <th className="px-3 py-3">
                  Score
                </th>

              </tr>
            </thead>

            <tbody>

              {rows.map((conversation) => (
                <tr
                  key={conversation.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >

                  <td className="px-3 py-3">
                    {conversation.id}
                  </td>

                  <td className="max-w-md px-3 py-3">
                    <p className="line-clamp-2">
                      {conversation.aiQuestion || "-"}
                    </p>
                  </td>

                  <td className="max-w-md px-3 py-3">
                    <p className="line-clamp-2">
                      {conversation.userAnswer || "-"}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    {conversation.score ?? "-"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </Card>
  );
};
