'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader, TrendingUp, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface PageView {
  date: string;
  count: number;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export default function AnalyticsDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [chartData, setChartData] = useState<PageView[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const last14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const { data: allViews, error: viewsError } = await supabase
        .from('page_views')
        .select('created_at');

      if (viewsError) throw viewsError;

      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('id, read');

      if (messagesError) throw messagesError;

      const totalViews = allViews?.length || 0;
      const views7d = allViews?.filter((v) => new Date(v.created_at) > last7Days).length || 0;
      const views30d = allViews?.filter((v) => new Date(v.created_at) > last30Days).length || 0;
      const unreadMessages = messages?.filter((m) => !m.read).length || 0;

      setStats([
        {
          label: 'Total Views',
          value: totalViews.toLocaleString(),
          icon: <Eye className="w-6 h-6" />,
          color: 'bg-blue-50 border-blue-200',
        },
        {
          label: 'Views (7d)',
          value: views7d.toLocaleString(),
          icon: <TrendingUp className="w-6 h-6 text-green-500" />,
          color: 'bg-green-50 border-green-200',
        },
        {
          label: 'Views (30d)',
          value: views30d.toLocaleString(),
          icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
          color: 'bg-purple-50 border-purple-200',
        },
        {
          label: 'Total Messages',
          value: (messages?.length || 0).toLocaleString(),
          icon: <MessageSquare className="w-6 h-6 text-orange-500" />,
          color: 'bg-orange-50 border-orange-200',
        },
        {
          label: 'Unread Messages',
          value: unreadMessages.toLocaleString(),
          icon: <MessageSquare className="w-6 h-6 text-red-500" />,
          color: 'bg-red-50 border-red-200',
        },
      ]);

      const viewsByDay: Record<string, number> = {};

      allViews?.forEach((v) => {
        const date = new Date(v.created_at).toISOString().split('T')[0];
        viewsByDay[date] = (viewsByDay[date] || 0) + 1;
      });

      const chart: PageView[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        chart.push({
          date: new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          count: viewsByDay[dateStr] || 0,
        });
      }

      setChartData(chart);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className={`border rounded-lg p-4 ${stat.color}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Page Views - Last 14 Days
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
