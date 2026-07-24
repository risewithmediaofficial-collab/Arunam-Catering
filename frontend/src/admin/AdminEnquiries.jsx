import { useEffect, useState } from 'react';
import { Inbox, Trash2, Phone, Mail, Calendar, Users, MessageSquare, CheckCircle, Clock, XCircle, RefreshCw, Utensils } from 'lucide-react';
import './admin.css';

import { API_BASE_URL as API } from '../config/api';

const STATUS_CONFIG = {
  New:       { color: '#FF5C2B', bg: '#FFF3EF', icon: Clock },
  Contacted: { color: '#2563eb', bg: '#EFF6FF', icon: CheckCircle },
  Closed:    { color: '#6b7280', bg: '#F3F4F6', icon: XCircle },
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/enquiries`);
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch {
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await fetch(`${API}/api/enquiries/${id}`, { method: 'DELETE' });
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } catch {
      alert('Failed to delete enquiry');
    }
  };

  const counts = {
    All: enquiries.length,
    New: enquiries.filter(e => e.status === 'New').length,
    Contacted: enquiries.filter(e => e.status === 'Contacted').length,
    Closed: enquiries.filter(e => e.status === 'Closed').length,
  };

  const filtered = filter === 'All' ? enquiries : enquiries.filter(e => e.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Booking enquiries from the contact form</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition-all"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'New', 'Contacted', 'Closed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
              filter === tab
                ? 'bg-[#FF5C2B] text-white border-[#FF5C2B] shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === tab ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw size={20} className="animate-spin mr-3" /> Loading enquiries…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Inbox size={44} className="mb-4 opacity-30" />
          <p className="text-sm font-medium">No enquiries found</p>
          <p className="text-xs mt-1 text-gray-400">Enquiries submitted from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(enq => {
            const cfg = STATUS_CONFIG[enq.status] || STATUS_CONFIG.New;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={enq._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left accent bar */}
                  <div className="w-full md:w-1 md:h-auto h-1 shrink-0" style={{ background: cfg.color }} />

                  {/* Body */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-gray-900">{enq.name}</h3>
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            <StatusIcon size={9} /> {enq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500">
                          {enq.phone && (
                            <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-[#FF5C2B] transition-colors">
                              <Phone size={11} /> {enq.phone}
                            </a>
                          )}
                          {enq.email && (
                            <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-[#FF5C2B] transition-colors">
                              <Mail size={11} /> {enq.email}
                            </a>
                          )}
                          {enq.eventType && (
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} /> {enq.eventType}
                            </span>
                          )}
                          {enq.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} /> {new Date(enq.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          {enq.guests && (
                            <span className="flex items-center gap-1.5">
                              <Users size={11} /> {enq.guests} guests
                            </span>
                          )}
                        </div>

                        {(enq.menuCategory || enq.menuPackage) && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded bg-orange-50 text-[#FF5C2B] border border-orange-200">
                              <Utensils size={10} />
                              {enq.menuCategory || 'Menu'}: <strong className="font-bold ml-1">{enq.menuPackage || 'Custom'}</strong>
                            </span>
                          </div>
                        )}

                        {enq.message && (
                          <p className="text-xs text-gray-500 flex items-start gap-1.5 mt-1 max-w-xl">
                            <MessageSquare size={11} className="mt-0.5 shrink-0" />
                            <span className="italic">{enq.message}</span>
                          </p>
                        )}

                        <p className="text-[10px] text-gray-400">
                          Received: {new Date(enq.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        {/* Status change */}
                        <select
                          value={enq.status}
                          onChange={e => updateStatus(enq._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-[#FF5C2B]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>

                        {/* Quick call */}
                        {enq.phone && (
                          <a
                            href={`tel:${enq.phone}`}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#FF5C2B] hover:text-[#FF5C2B] transition-all"
                          >
                            <Phone size={11} /> Call
                          </a>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => deleteEnquiry(enq._id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 text-red-400 hover:border-red-300 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
