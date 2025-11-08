import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const stats = [
  {
    title: "Total Revenue",
    value: "$24,580",
    icon: DollarSign,
    trend: "+12% this month",
    color: "text-green-600",
  },
  {
    title: "Growth Rate",
    value: "28%",
    icon: TrendingUp,
    trend: "vs last month",
    color: "text-purple-600",
  },
];

const statusData = [
  { name: "Paid", value: 15, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 8, color: "hsl(var(--chart-2))" },
  { name: "Overdue", value: 3, color: "hsl(var(--chart-3))" },
];

const monthlyData = [
  { month: "Jan", quotes: 12, invoices: 8 },
  { month: "Feb", quotes: 15, invoices: 11 },
  { month: "Mar", quotes: 18, invoices: 14 },
  { month: "Apr", quotes: 20, invoices: 16 },
  { month: "May", quotes: 16, invoices: 13 },
  { month: "Jun", quotes: 22, invoices: 18 },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Manage your quotes and invoices with AI assistance
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/quotes/new">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              New Quote
            </Button>
          </Link>
          <Link to="/dashboard/invoices/new">
            <Button className="gap-2">
              <Receipt className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Bar dataKey="quotes" fill="hsl(var(--primary))" name="Quotes" />
                <Bar dataKey="invoices" fill="hsl(var(--chart-2))" name="Invoices" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium">Website Redesign</p>
                  <p className="text-sm text-muted-foreground">ABC Corp • $5,200</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium">Mobile App Development</p>
                  <p className="text-sm text-muted-foreground">XYZ Inc • $12,500</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Accepted
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium">INV-2024-001</p>
                  <p className="text-sm text-muted-foreground">Tech Solutions • $3,450</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Due Soon
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium">INV-2024-002</p>
                  <p className="text-sm text-muted-foreground">Design Studio • $8,200</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Paid
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
