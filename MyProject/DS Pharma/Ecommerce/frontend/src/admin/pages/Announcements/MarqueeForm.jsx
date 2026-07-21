import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import marqueeService from '@/services/marqueeService';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Label } from '@/admin/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/admin/components/ui/Card';
import { Switch } from '@/admin/components/ui/Switch';

const MarqueeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: '',
    isVisible: true,
    color: '#e94242',
    speed: 'medium'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchMessage = async () => {
        try {
          setIsFetching(true);
          const messages = await marqueeService.getMessages();
          const message = messages.find(m => (m._id || m.id) === id);
          if (message) {
            setFormData({
              title: message.title || message.message || message.heading || '',
              isVisible: message.isVisible !== false,
              color: message.color || '#e94242',
              speed: message.speed || 'medium'
            });
          } else {
            toastUtil.error('Message not found');
            navigate('/admin/announcements');
          }
        } catch (error) {
          console.error('Failed to fetch message:', error);
          toastUtil.error('Failed to load message details');
          navigate('/admin/announcements');
        } finally {
          setIsFetching(false);
        }
      };
      fetchMessage();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      isVisible: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastUtil.error('Announcement text is required');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        title: formData.title.trim(),
        color: formData.color,
        speed: formData.speed,
        isVisible: formData.isVisible
      };

      if (isEditMode) {
        await marqueeService.updateMessage(id, payload);
        toastUtil.success('Announcement updated successfully');
      } else {
        await marqueeService.addMessage(payload);
        toastUtil.success('Announcement created successfully');
      }
      navigate('/admin/announcements');
    } catch (error) {
      console.error('Failed to save announcement:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save announcement';
      toastUtil.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto h-full space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2 sm:p-4 lg:p-6 custom-scrollbar" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)', padding:' 0px 1rem' }}>
      <Button
        variant="ghost"
        className="pl-0 text-gray-500 hover:text-gray-900"
        onClick={() => navigate('/admin/announcements')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Announcements</span>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
          {isEditMode ? 'Edit Message' : 'Add New Message'}
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Announcement Message</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. ✓ 100% Genuine Medicines | Express Delivery"
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="color">Text Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    required
                    value={formData.color}
                    onChange={handleChange}
                    className="w-12 h-10 p-1 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={handleChange}
                    name="color"
                    className="font-mono"
                    placeholder="#000000"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="speed">Scroll Speed</Label>
                <select
                  id="speed"
                  name="speed"
                  value={formData.speed}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isLoading}
                >
                  <option value="slow">Slow</option>
                  <option value="medium">Medium</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <Label className="text-base">Show on Website</Label>
              <Switch
                checked={formData.isVisible}
                onCheckedChange={handleToggleChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            disabled={isLoading || !formData.title.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MarqueeForm;
