import React from 'react';
import PreviewBadge from '../components/PreviewBadge';
import PreviewButton from '../components/PreviewButton';
import { MOCK_ADMIN_STATS } from '../data/previewData';

export const AdminDashboardPreview = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row font-sans">
      
      {/* FIXED LEFT SIDEBAR (bg-slate-900 #0F172A text-white) */}
      <aside className="w-full lg:w-64 bg-[#0F172A] text-white shrink-0 p-6 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-8">
          
          {/* Admin Brand Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight font-sans">
              ALDEN
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#8B634B] text-white rounded-[4px]">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { label: 'Overview Dashboard', active: true, icon: '📊' },
              { label: 'Products Inventory', active: false, icon: '👕' },
              { label: 'Orders & Dispatch', active: false, icon: '📦' },
              { label: 'Customer Directory', active: false, icon: '👥' },
              { label: 'Promo Engine', active: false, icon: '🎟️' },
              { label: 'Sales Reports', active: false, icon: '📈' }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-full text-left px-3.5 py-2.5 rounded-[6px] text-xs font-semibold flex items-center space-x-3 transition-colors ${
                  item.active 
                    ? 'bg-[#8B634B] text-white font-bold' 
                    : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="text-xs text-[#94A3B8]">
            Admin: <span className="text-white font-bold block">admin@alden.com</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full text-left text-xs text-[#D8C4B4] hover:underline font-semibold"
          >
            ← Return to Customer Storefront
          </button>
        </div>

      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-screen-2xl">
        
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Administrative Portal Overview
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Real-time operational summary for store inventory, sales, and fulfillment dispatch.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-[#475569] font-medium">Auto-sync: <span className="text-[#2D5A27] font-bold">● Active</span></span>
            <PreviewButton variant="primary" size="sm">+ Add Product</PreviewButton>
          </div>
        </div>

        {/* 4-COLUMN KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {MOCK_ADMIN_STATS.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">{kpi.title}</span>
                <span className="text-xs font-bold text-[#2D5A27] bg-[#E8F2E6] px-2 py-0.5 rounded-[4px]">
                  {kpi.change}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">{kpi.value}</h2>
              <p className="text-[11px] text-[#94A3B8]">{kpi.subtitle}</p>
            </div>
          ))}
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Recent Store Orders</h3>
              <p className="text-xs text-[#475569]">High-density view of customer purchases requiring fulfillment</p>
            </div>
            <button type="button" className="text-xs font-semibold text-[#8B634B] hover:underline">
              View All Orders →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#475569] uppercase font-semibold border-b border-[#E2E8F0] h-11">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {MOCK_ADMIN_STATS.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8FAFC]/80 transition-colors h-14">
                    <td className="px-4 py-3 font-bold text-[#8B634B]">{order.id}</td>
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">{order.customer}</td>
                    <td className="px-4 py-3 text-[#475569]">{order.date}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#0F172A]">{order.total}</td>
                    <td className="px-4 py-3 text-center">
                      <PreviewBadge status={order.statusType}>
                        {order.status}
                      </PreviewBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminDashboardPreview;
