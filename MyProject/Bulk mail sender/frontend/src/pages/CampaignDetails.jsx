import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:6085/api';
// const API_URL = 'https://collage.vaisacademy.com/bulkmail/api';


const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/campaigns/${id}`);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      toast.error('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="card text-center py-8">
        <h2 className="text-xl font-medium text-gray-500">Campaign not found</h2>
        <Link to="/campaigns" className="btn btn-primary inline-block mt-4">
          Back to Campaign History
        </Link>
      </div>
    );
  }

  const sentCount = campaign.recipients.filter(r => r.status === 'sent').length;
  const failedCount = campaign.recipients.filter(r => r.status === 'failed').length;
  const pendingCount = campaign.recipients.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campaign Details</h1>
        <Link to="/campaigns" className="btn btn-secondary">
          Back to Campaign History
        </Link>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Campaign Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium">{campaign.subject}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(campaign.createdAt)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Email Body</p>
          <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-wrap">
            {campaign.body}
          </div>
        </div>
        
        {campaign.footer && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Footer</p>
            <div className="p-3 border rounded-md">
              {campaign.footer.name && <p><strong>Name:</strong> {campaign.footer.name}</p>}
              {campaign.footer.phone && <p><strong>Phone:</strong> {campaign.footer.phone}</p>}
              {campaign.footer.address && <p><strong>Address:</strong> {campaign.footer.address}</p>}
              {campaign.footer.logo && (
                <div className="mt-2">
                  <p><strong>Logo:</strong></p>
                  <img 
                    src={`http://localhost:5000/${campaign.footer.logo}`} 
                    alt="Company Logo" 
                    className="mt-1 max-h-16"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        {campaign.attachments && campaign.attachments.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Attachments</p>
            <div className="p-3 border rounded-md">
              <ul className="list-disc list-inside">
                {campaign.attachments.map((attachment, index) => (
                  <li key={index}>{attachment.originalname}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-2xl font-bold text-green-600">{sentCount}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </div>
        
        <h3 className="font-medium mb-2">Recipients ({campaign.recipients.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error (if any)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaign.recipients.map((recipient, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {recipient.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recipient.status === 'sent' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Sent
                      </span>
                    )}
                    {recipient.status === 'failed' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                    {recipient.status === 'pending' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipient.error || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;