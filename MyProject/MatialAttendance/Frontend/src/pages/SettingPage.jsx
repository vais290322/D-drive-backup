import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Clock, GraduationCap, Users, Settings, Save, Trash2, Loader2 } from 'lucide-react';
import api from '../common/api';

const SettingPage = () => {
  const [studentLateTime, setStudentLateTime] = useState({ _id: '', lateTime: '00:00:00' });
  const [teacherLateTime, setTeacherLateTime] = useState({ _id: '', lateTime: '00:00:00' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchLateTimes();
  }, []);

  const fetchLateTimes = async () => {
    try {
      setInitialLoading(true);
      const [studentResponse, teacherResponse] = await Promise.all([
        api.get('/api/v1/students-lateTime/get'),
        api.get('/api/v1/teachers-lateTime/get')
      ]);

      if (studentResponse.data.data.length > 0) {
        setStudentLateTime(studentResponse.data.data[0]);
      }
      if (teacherResponse.data.data.length > 0) {
        setTeacherLateTime(teacherResponse.data.data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch late times');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleStudentTimeChange = (e) => {
    setStudentLateTime(prev => ({ ...prev, lateTime: e.target.value }));
  };

  const handleTeacherTimeChange = (e) => {
    setTeacherLateTime(prev => ({ ...prev, lateTime: e.target.value }));
  };

  const handleStudentSubmit = async () => {
    try {
      setLoading(true);
      if (studentLateTime._id) {
        await api.put(`/api/v1/students-lateTime/${studentLateTime._id}`, {
          lateTime: studentLateTime.lateTime
        });
        toast.success('Student late time updated successfully');
      } else {
        await api.post('/api/v1/students-lateTime', {
          lateTime: studentLateTime.lateTime
        });
        toast.success('Student late time created successfully');
      }
      fetchLateTimes();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update student late time');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async () => {
    try {
      setLoading(true);
      if (teacherLateTime._id) {
        await api.put(`/api/v1/teachers-lateTime/${teacherLateTime._id}`, {
          lateTime: teacherLateTime.lateTime
        });
        toast.success('Teacher late time updated successfully');
      } else {
        await api.post('/api/v1/teachers-lateTime', {
          lateTime: teacherLateTime.lateTime
        });
        toast.success('Teacher late time created successfully');
      }
      fetchLateTimes();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update teacher late time');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudentTime = async () => {
    if (!studentLateTime._id) return;
    
    if (!window.confirm('Are you sure you want to delete the student late time setting?')) return;
    
    try {
      setLoading(true);
      await api.delete(`/api/v1/students-lateTime/${studentLateTime._id}`);
      toast.success('Student late time deleted successfully');
      setStudentLateTime({ _id: '', lateTime: '00:00:00' });
    } catch (error) {
      toast.error('Failed to delete student late time');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacherTime = async () => {
    if (!teacherLateTime._id) return;
    
    if (!window.confirm('Are you sure you want to delete the teacher late time setting?')) return;
    
    try {
      setLoading(true);
      await api.delete(`/api/v1/teachers-lateTime/${teacherLateTime._id}`);
      toast.success('Teacher late time deleted successfully');
      setTeacherLateTime({ _id: '', lateTime: '00:00:00' });
    } catch (error) {
      toast.error('Failed to delete teacher late time');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Settings className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Configure late time thresholds for students and teachers</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Late Time Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-yellow-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Student Late Time</h2>
                  <p className="text-blue-100 text-sm mt-1">Set threshold for student attendance</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock size={18} className="text-blue-600" />
                  Late Time Threshold
                </label>
                <div className="relative">
                  <input
                    type="time"
                    step="1"
                    value={studentLateTime.lateTime}
                    onChange={handleStudentTimeChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                    disabled={loading}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Students arriving after this time will be marked as late</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleStudentSubmit}
                  disabled={loading}
                  className="flex-1 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {studentLateTime._id ? 'Update' : 'Create'}
                </button>
                {studentLateTime._id && (
                  <button
                    onClick={handleDeleteStudentTime}
                    disabled={loading}
                    className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-200 border-2 border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Teacher Late Time Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 to-green-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Teacher Late Time</h2>
                  <p className="text-purple-100 text-sm mt-1">Set threshold for teacher attendance</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock size={18} className="text-purple-600" />
                  Late Time Threshold
                </label>
                <div className="relative">
                  <input
                    type="time"
                    step="1"
                    value={teacherLateTime.lateTime}
                    onChange={handleTeacherTimeChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                    disabled={loading}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Teachers arriving after this time will be marked as late</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleTeacherSubmit}
                  disabled={loading}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {teacherLateTime._id ? 'Update' : 'Create'}
                </button>
                {teacherLateTime._id && (
                  <button
                    onClick={handleDeleteTeacherTime}
                    disabled={loading}
                    className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-200 border-2 border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Late Time Settings</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                These settings determine when students and teachers are marked as late. Any attendance recorded after the specified time threshold will be flagged as late in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;