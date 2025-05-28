'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Home, Users, Search, Copy, Menu, LogOut,
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer,
} from 'recharts';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export default function DashboardClient({ users: initialUsers }: { users: User[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [usersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const mockSignInData = useMemo(() => {
    const baseSignIns = initialUsers.length / 10;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const data = monthNames.map((month, index) => {
      const signIns = Math.max(50, Math.floor(baseSignIns * (0.4 + (index * 0.06)))); 
      return { month, signIns };
    });

    data[11].signIns = Math.max(data[11].signIns, initialUsers.length + 50); 

    return data;
  }, [initialUsers.length]);


  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin-auth') !== 'true') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return initialUsers;
    const term = searchTerm.toLowerCase();
    return initialUsers.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term));
  }, [initialUsers, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, usersPerPage]);

  const handleCopy = (user: User) => {
    const userData = `${user.firstName} ${user.lastName}, ${user.email}, ${user.phone}`;
    navigator.clipboard.writeText(userData)
      .then(() => alert('User data copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsSheetOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white font-sans">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <div className="text-2xl font-extrabold mb-10 text-white text-center font-heading">Admin Panel</div>
      <nav className="flex-grow space-y-3">
        <Button
          variant="ghost"
          className={`w-full justify-start text-lg px-6 py-3 rounded-none transition-all duration-200 ease-in-out font-sans 
            ${activeTab === 'dashboard' ? 'bg-gray-800 text-blue-300 shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => handleTabClick('dashboard')}
        >
          <Home className="mr-4 h-5 w-5 text-blue-300" /> Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start text-lg px-6 py-3 rounded-none transition-all duration-200 ease-in-out font-sans 
            ${activeTab === 'users' ? 'bg-gray-800 text-blue-300 shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => handleTabClick('users')}
        >
          <Users className="mr-4 h-5 w-5 text-blue-300" /> Users
        </Button>
      </nav>
      <div className="mt-auto pt-8">
        <Separator orientation="horizontal" className="bg-gray-700 mb-6 w-full" />
        <Link href="/login" passHref>
          <Button
            variant="ghost"
            className="w-full justify-start text-lg px-6 py-3 rounded-none text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all duration-200 ease-in-out font-sans"
          >
            <LogOut className="mr-4 h-5 w-5 text-blue-300" /> Logout
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Mobile Header and Sidebar Trigger */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black border-b border-gray-800 z-50 p-4 flex justify-between items-center shadow-lg">
        <div className="text-2xl font-extrabold text-white font-heading">Admin</div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Menu className="h-7 w-7 text-blue-300" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black text-white border-r border-gray-700 w-72 p-6 flex flex-col shadow-2xl">
            <SheetHeader className="mb-8">
              <SheetTitle className="sr-only">Admin Panel Navigation</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-black p-8 flex-col border-r border-gray-800 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 bg-black md:mt-0 mt-[80px] overflow-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <h1 className="text-2xl font-extrabold mb-8 text-white tracking-tight font-heading">Dashboard Overview</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Total Users Card - Adjusted for smaller size */}
              <Card className="bg-black border border-gray-700 text-white shadow-lg flex flex-col justify-between p-5 h-full min-h-[180px] w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3"> {/* Reduced pb */}
                  <CardTitle className="text-lg font-semibold text-gray-300 font-sans">Total Users</CardTitle>
                  <Users className="h-6 w-6 text-blue-300" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center">
                  <div className="text-6xl font-bold text-white mb-1 font-mono">{initialUsers.length}</div> {/* Slightly reduced font size */}
                  <CardDescription className="text-xl text-gray-400 text-center font-sans">
                    Registered users on the platform.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Sign-in User Graph Card - Adjusted for smaller size */}
              <Card className="bg-black border border-gray-700 text-white shadow-lg p-5 h-full min-h-[180px] w-full">
                <CardHeader className="pb-3"> {/* Reduced pb */}
                  <CardTitle className="text-lg font-semibold text-gray-300 font-sans">Sign-in Activity</CardTitle>
                  <CardDescription className="text-sm text-gray-400 font-sans">
                    Monthly user sign-ins over the last 12 months.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full flex flex-col justify-center">
                  <ChartContainer
                    config={{
                      signIns: {
                        label: "Sign-ins",
                        color: "hsl(200, 80%, 70%)", // Light blue for graph line
                      },
                    }}
                    className="w-full h-[calc(100%-30px)]" // Adjusted height to fill card better, slightly reduced
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockSignInData}
                        margin={{ top: 0, right: 10, left: -10, bottom: 0 }} // Further adjusted margins for compact chart
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" opacity={0.6} />
                        <XAxis dataKey="month" stroke="#cbd5e0" tickLine={false} axisLine={false} className="text-xs font-sans" />
                        <YAxis stroke="#cbd5e0" tickLine={false} axisLine={false} className="text-xs font-sans" />
                        <ChartTooltip content={<ChartTooltipContent className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-xl font-sans" />} />
                        <Legend wrapperStyle={{ color: '#cbd5e0', paddingTop: '5px', fontSize: '11px', fontFamily: 'sans-serif' }} /> {/* Smaller legend font */}
                        <Line
                          type="monotone"
                          dataKey="signIns"
                          stroke="hsl(200, 80%, 70%)" // Light blue line
                          strokeWidth={2}
                          dot={{ stroke: 'hsl(200, 80%, 70%)', strokeWidth: 1, r: 3 }}
                          activeDot={{ stroke: 'hsl(200, 80%, 70%)', strokeWidth: 3, r: 5 }}
                          name="Sign-ins"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-extrabold mb-6 text-white tracking-tight font-heading">Registered Users</h1>

            <Separator orientation="horizontal" className="bg-gray-700 mb-8 w-full" />

            {/* Search Bar */}
            <div className="flex items-center space-x-4 mb-8">
              <Search className="h-6 w-6 text-blue-300" />
              <Input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 rounded-none py-2 px-4 focus:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200 font-sans"
              />
            </div>

            {/* Users Table */}
            <div className="rounded-none border border-gray-700 overflow-hidden shadow-lg">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-900">
                  <TableRow className="border-b border-gray-700">
                    <TableHead className="text-gray-300 py-3 px-6 text-left font-sans">Full Name</TableHead>
                    <TableHead className="text-gray-300 py-3 px-6 text-left font-sans">Email</TableHead>
                    <TableHead className="text-gray-300 py-3 px-6 text-left font-sans">Phone</TableHead>
                    <TableHead className="text-gray-300 py-3 px-6 text-left font-sans">Registered Date</TableHead>
                    <TableHead className="text-right text-gray-300 py-3 px-6 font-sans">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-black divide-y divide-gray-800">
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-gray-500 text-lg py-4 font-sans">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-900 transition-colors duration-200">
                        <TableCell className="font-medium text-white py-3 px-6 font-sans">{user.firstName} {user.lastName}</TableCell>
                        <TableCell className="text-gray-300 py-3 px-6 font-sans">{user.email}</TableCell>
                        <TableCell className="text-gray-300 py-3 px-6 font-sans">{user.phone}</TableCell>
                        <TableCell className="text-gray-300 py-3 px-6 font-sans">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right py-3 px-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(user)}
                            className="text-blue-300 hover:bg-gray-800 border border-gray-700 rounded-none w-9 h-9"
                            title="Copy user data"
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-900 rounded-none border border-gray-700 shadow-inner">
              <p className="text-sm text-gray-300 font-sans">
                Showing {paginatedUsers.length} of {filteredUsers.length} users. Page {currentPage} of {totalPages}.
              </p>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200 px-4 py-2 rounded-none font-sans"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200 px-4 py-2 rounded-none font-sans"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}