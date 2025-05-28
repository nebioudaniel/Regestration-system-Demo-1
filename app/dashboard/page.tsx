import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const users = await prisma.user.findMany();

  return <DashboardClient users={users} />;
}
