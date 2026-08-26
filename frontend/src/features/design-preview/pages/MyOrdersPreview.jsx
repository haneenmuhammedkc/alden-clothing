import React, { useState } from 'react';
import PrototypeBadge from '../components/PrototypeBadge';
import PrototypeButton from '../components/PrototypeButton';
import { PrototypeModal } from '../components/PrototypeModal';
import { MOCK_ORDERS } from '../data/mockData';

export const MyOrdersPreview = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'All') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="bg-white min-h-screen text-[#0F172A] py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="border-b border-[#E2E8F0] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] font-sans">
              My Orders & History
            </h1>
            <p className="text-xs text-[#475569] mt-1">
              Track delivery progress, review past purchase invoices, and request returns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('listing')}
            className="text-xs font-semibold text-[#00412E] hover:underline"
          >
            Explore New Arrivals →
          </button>
        </div>

        {/* TABBED FILTER BAR */}
        <div className="flex border-b border-[#E2E8F0] space-x-6">
          {["All", "Processing", "Delivered", "Cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab ? 'text-[#00412E]' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab} Orders
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00412E] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ORDER CARDS LIST */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center border border-[#E2E8F0] rounded-md bg-[#F8FAFC] space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">No orders found for selected filter.</p>
              <PrototypeButton variant="secondary" size="sm" onClick={() => setActiveTab('All')}>
                View All Orders
              </PrototypeButton>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden transition-all hover:border-[#CBD5E1] shadow-xs"
              >
                {/* Order Header */}
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center space-x-6 text-xs text-[#475569]">
                    <div>
                      <span className="font-bold text-[#0F172A] block">{order.id}</span>
                      <span>Order Placed: {order.date}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block">Payment Method</span>
                      <span className="font-semibold text-[#0F172A]">{order.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block">Total Amount</span>
                      <span className="font-bold text-[#00412E]">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <PrototypeBadge status={order.statusType}>
                      {order.status}
                    </PrototypeBadge>
                    <PrototypeButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedOrderModal(order)}
                    >
                      View Invoice & Details
                    </PrototypeButton>
                  </div>
                </div>

                {/* Order Items Stack */}
                <div className="p-6 divide-y divide-[#E2E8F0]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-16 rounded-md overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-[#0F172A]">{item.name}</h4>
                          <p className="text-xs text-[#475569]">
                            Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#0F172A]">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

        {/* ORDER DETAILS MODAL PREVIEW */}
        <PrototypeModal
          isOpen={!!selectedOrderModal}
          onClose={() => setSelectedOrderModal(null)}
          title={`Order Details & PDF Export (${selectedOrderModal?.id})`}
          footer={(
            <>
              <PrototypeButton variant="secondary" size="sm" onClick={() => setSelectedOrderModal(null)}>
                Close
              </PrototypeButton>
              <PrototypeButton variant="primary" size="sm" onClick={() => alert("Simulated PDF Export of Invoice")}>
                Download PDF Invoice
              </PrototypeButton>
            </>
          )}
        >
          {selectedOrderModal && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-1 text-xs">
                <p className="font-bold text-[#0F172A]">Shipping Destination:</p>
                <p className="text-[#475569]">{selectedOrderModal.shippingAddress.fullName}</p>
                <p className="text-[#475569]">{selectedOrderModal.shippingAddress.street}, {selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} {selectedOrderModal.shippingAddress.zip}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">Delivery Progress Tracking</h4>
                <div className="space-y-2">
                  {selectedOrderModal.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${step.completed ? 'bg-[#00412E]' : 'bg-slate-300'}`} />
                      <span className={step.completed ? 'font-bold text-[#0F172A]' : 'text-[#94A3B8]'}>{step.title}</span>
                      <span className="text-[#94A3B8] ml-auto">{step.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PrototypeModal>

      </div>
    </div>
  );
};

export default MyOrdersPreview;
