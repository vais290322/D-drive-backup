import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Sparkles, MessageSquare, Loader2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/admin/components/ui/Button';
import { Card, CardContent } from '@/admin/components/ui/Card';
import { Switch } from '@/admin/components/ui/Switch';
import { Badge } from '@/admin/components/ui/Badge';
import marqueeService from '@/services/marqueeService';
import toastUtil from '@/shared/utils/toast';

const AnnouncementsList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async (signal) => {
    try {
      setLoading(true);
      const data = await marqueeService.getMessages({ signal });
      setMessages(data);
    } catch (error) {
      if (error.name === 'CanceledError') return;
      console.error('Failed to fetch messages:', error);
      toastUtil.error('Failed to load marquee messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMessages(controller.signal);
    return () => controller.abort();
  }, [fetchMessages]);

  const handleToggleVisibility = async (id) => {
    const messageToUpdate = messages.find(m => (m._id || m.id) === id);
    if (!messageToUpdate) return;

    try {
      await marqueeService.toggleVisibility(id, messageToUpdate);
      setMessages(prev => prev.map(msg => 
        (msg._id || msg.id) === id ? { ...msg, isVisible: !msg.isVisible } : msg
      ));
      toastUtil.success('Visibility updated');
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update visibility';
      toastUtil.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await marqueeService.deleteMessage(id);
      setMessages(prev => prev.filter(msg => (msg._id || msg.id) !== id));
      toastUtil.success('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to delete message';
      toastUtil.error(msg);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto h-full space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2 sm:p-4 lg:p-6 custom-scrollbar" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)', padding:' 0px 1rem' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
            Announcements
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
          </h1>
        </div>
        
        <Button 
          onClick={() => navigate('/admin/announcements/marquee/new')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>New Announcement</span>
        </Button>
      </div>

      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="grid gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-xl border border-dashed border-emerald-200">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-xl border border-dashed border-emerald-200">
              <MessageSquare className="h-12 w-12 text-emerald-300 mb-4" />
              <p className="text-gray-500 font-medium text-center">No messages yet.<br/>Add your first message above!</p>
            </div>
          ) : (
            messages.map((item) => {
              const id = item._id || item.id;
              const content = item.title || item.heading || item.message;
              return (
                <Card key={id} className={`transition-all duration-300 hover:shadow-md border-l-4 ${item.isVisible !== false ? 'border-l-emerald-500' : 'border-l-gray-300'}`}>
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-medium transition-colors ${item.isVisible !== false ? 'text-gray-900' : 'text-gray-400'}`}>
                        {content}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {item.createdAt && (
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Added on {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        )}
                        {item.isVisible === false && (
                          <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-400 border-gray-200 uppercase">Hidden</Badge>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-mono text-gray-500 uppercase">{item.color}</span>
                          </div>
                        )}
                        {item.speed && (
                          <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-tighter">
                            {item.speed} speed
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${item.isVisible !== false ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {item.isVisible !== false ? 'active' : 'inactive'}
                        </span>
                        <Switch
                          checked={item.isVisible !== false}
                          onCheckedChange={() => handleToggleVisibility(id)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/announcements/marquee/${id}/edit`)}
                          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsList;
