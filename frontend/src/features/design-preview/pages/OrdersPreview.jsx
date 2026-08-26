import React, { useState } from 'react';
import PreviewBadge from '../components/PreviewBadge';
import PreviewButton from '../components/PreviewButton';
import PreviewModal from '../components/PreviewModal';
import { MOCK_ORDERS } from '../data/previewData';

export const OrdersPreview = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'All') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-serif font-normal text-[#30251F]">
              My Orders & History
            </h1>
            <p className="text-xs text-[#76675D] mt-1">
              Track delivery progress and review past purchase invoices.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('listing')}
            className="text-xs font-semibold text-[#8B634B] hover:underline"
          >
            Explore Catalog →
          </button>
        </div>

        {/* Tabbed Filter */}
        <div className="flex border-b border-[#DED4CB] space-x-6">
          {["All", "Processing", "Delivered", "Cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === tab ? 'text-[#30251F]' : 'text-[#76675D] hover:text-[#30251F]'
              }`}
            >
              {tab} Orders
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B634B] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] overflow-hidden shadow-xs"
            >
              {/* Header Row */}
              <div className="bg-[#F5EFE8] border-b border-[#DED4CB] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center space-x-6 text-xs text-[#76675D]">
                  <div>
                    <span className="font-bold text-[#30251F] block">{order.id}</span>
                    <span>Placed: {order.date}</span>
                  </div>
                  <div>
                    <span className="block text-[#76675D]/80">Payment</span>
                    <span className="font-semibold text-[#30251F]">{order.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="block text-[#76675D]/80">Total Amount</span>
                    <span className="font-bold text-[#8B634B]">{order.totalFormatted}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PreviewBadge status={order.statusType}>
                    {order.status}
                  </PreviewBadge>
                  <PreviewButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedOrderModal(order)}
                  >
                    View Invoice & Details
                  </PreviewButton>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 divide-y divide-[#DED4CB]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-16 rounded-[6px] overflow-hidden bg-[#F5EFE8] border border-[#DED4CB] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#30251F]">{item.name}</h4>
                        <p className="text-[11px] text-[#76675D]">
                          Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#30251F]">
                      {item.priceFormatted}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Invoice Modal */}
        <PreviewModal
          isOpen={!!selectedOrderModal}
          onClose={() => setSelectedOrderModal(null)}
          title={`Order Invoice Details (${selectedOrderModal?.id})`}
          footer={(
            <>
              <PreviewButton variant="secondary" size="sm" onClick={() => setSelectedOrderModal(null)}>
                Close
              </PreviewButton>
              <PreviewButton variant="primary" size="sm" onClick={() => alert("Simulated PDF Export of Invoice")}>
                Download PDF Invoice
              </PreviewButton>
            </>
          )}
        >
          {selectedOrderModal && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F5EFE8] border border-[#DED4CB] rounded-[6px] text-xs space-y-1">
                <p className="font-bold text-[#30251F]">Shipping Destination:</p>
                <p className="text-[#76675D]">{selectedOrderModal.shippingAddress.fullName}</p>
                <p className="text-[#76675D]">{selectedOrderModal.shippingAddress.street}, {selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} {selectedOrderModal.shippingAddress.zip}</p>
              </div>
            </div>
          )}
        </PreviewModal>

      </div>
    </div>
  );
};

export default OrdersPreview;
