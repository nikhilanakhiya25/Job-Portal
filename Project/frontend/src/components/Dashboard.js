import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Briefcase, Users, BarChart3, Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === 'admin') {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = res.data;
          setStats([
            {
              title: "Total Users",
              value: data.totalUsers,
              icon: <Users className="w-6 h-6" />,
            },
            {
              title: "Total Jobs",
              value: data.totalJobs,
              icon: <Briefcase className="w-6 h-6" />,
            },
            {
              title: "Total Applications",
              value: data.totalApplications,
              icon: <BarChart3 className="w-6 h-6" />,
            },
            {
              title: "Active Jobs",
              value: data.activeJobs,
              icon: <Bell className="w-6 h-6" />,
            },
          ]);
        } else {
          // For regular users, fetch personal data
          const token = localStorage.getItem('token');
          const [appsRes, wishRes, recRes] = await Promise.all([
            axios.get('http://localhost:5000/api/dashboard/my-applications', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:5000/api/dashboard/wishlist', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:5000/api/dashboard/recommendations', {
              headers: { Authorization: `Bearer ${token}` }
            }),
          ]);
          const apps = appsRes.data;
          const wishlist = wishRes.data;
          const recommendations = recRes.data;
          setStats([
            {
              title: "My Applications",
              value: apps.length,
              icon: <Briefcase className="w-6 h-6" />,
            },
            {
              title: "Wishlist Jobs",
              value: wishlist.length,
              icon: <Users className="w-6 h-6" />,
            },
            {
              title: "Recommended Jobs",
              value: recommendations.length,
              icon: <BarChart3 className="w-6 h-6" />,
            },
            {
              title: "Notifications",
              value: "12 New",
              icon: <Bell className="w-6 h-6" />,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {user.role === 'admin' ? 'Admin Dashboard' : `Welcome, ${user.name || 'User'}`}
        </h1>
        {user.role !== 'admin' && (
          <Button className="rounded-2xl">Browse Jobs</Button>
        )}
        {user.role === 'admin' && (
          <Button className="rounded-2xl">Post New Job</Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-2xl shadow-sm hover:shadow-lg transition">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="text-2xl font-semibold mt-1">{item.value}</h2>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl">{item.icon}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Jobs Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          {user.role === 'admin' ? 'Recent Job Posts' : 'Recommended Jobs'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((job) => (
            <Card key={job} className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Frontend Developer</h3>
                <p className="text-sm text-gray-500 mt-1">React• Remote</p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">Applicants: 120</span>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
