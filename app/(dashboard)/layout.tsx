export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        {/* Your dashboard-specific layout wrapper */}
        {children}
      </div>
    )
  }