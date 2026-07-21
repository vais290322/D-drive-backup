const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: "1,284" },
          { label: "Revenue", value: "$48,295" },
          { label: "Orders", value: "342" },
          { label: "Active Now", value: "87" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">
          Charts and tables will appear here once connected to real data.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;