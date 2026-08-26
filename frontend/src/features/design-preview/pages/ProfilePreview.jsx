import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import { PreviewInput } from '../components/PreviewInput';
import PreviewBadge from '../components/PreviewBadge';
import { MOCK_USER_PROFILE } from '../data/previewData';

export const ProfilePreview = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-serif font-normal text-[#30251F]">
              Account Workspace
            </h1>
            <p className="text-xs text-[#76675D] mt-1">
              Manage personal identity, delivery addresses, security, and store wallet balance.
            </p>
          </div>
          <PreviewBadge status="active">{MOCK_USER_PROFILE.tier}</PreviewBadge>
        </div>

        {/* 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT TABS (4 Cols) */}
          <div className="lg:col-span-4 bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-4 space-y-1">
            
            <div className="p-3 mb-3 border-b border-[#DED4CB] flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#8B634B] text-white font-bold flex items-center justify-center text-sm">
                AA
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#30251F]">{MOCK_USER_PROFILE.name}</h4>
                <p className="text-[11px] text-[#76675D]">{MOCK_USER_PROFILE.email}</p>
              </div>
            </div>

            {[
              { id: 'personal', label: 'Personal Information' },
              { id: 'addresses', label: 'Saved Address Book' },
              { id: 'wallet', label: 'Alden Digital Wallet (₹8,500)' },
              { id: 'security', label: 'Security & Password' },
              { id: 'preferences', label: 'Preferences' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-[#8B634B] text-white shadow-xs'
                    : 'text-[#76675D] hover:bg-[#F5EFE8] hover:text-[#30251F]'
                }`}
              >
                <span>{tab.label}</span>
                <span>→</span>
              </button>
            ))}

          </div>

          {/* RIGHT FORM PANEL (8 Cols) */}
          <div className="lg:col-span-8 bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 lg:p-8 space-y-6">
            
            {savedSuccess && (
              <div className="p-4 bg-[#E8F2E6] border border-[#A5C69F] rounded-[6px] text-xs font-semibold text-[#2D5A27]">
                ✓ Account profile details successfully updated.
              </div>
            )}

            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-[#DED4CB] pb-4">
                  <h3 className="text-base font-bold text-[#30251F]">Personal Information</h3>
                  <p className="text-xs text-[#76675D]">Update your name and primary contact email.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PreviewInput label="Full Name" defaultValue={MOCK_USER_PROFILE.name} required />
                  <PreviewInput label="Email Address" defaultValue={MOCK_USER_PROFILE.email} required disabled helperText="Email bound to account" />
                  <PreviewInput label="Primary Phone" defaultValue={MOCK_USER_PROFILE.phone} required />
                  <PreviewInput label="Member Tier" defaultValue={MOCK_USER_PROFILE.tier} disabled />
                </div>

                <div className="pt-4 flex justify-end">
                  <PreviewButton type="submit" variant="primary" size="md">
                    Save Changes
                  </PreviewButton>
                </div>
              </form>
            )}

            {/* TAB 2: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="border-b border-[#DED4CB] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#30251F]">Saved Address Book</h3>
                    <p className="text-xs text-[#76675D]">Manage default delivery destinations.</p>
                  </div>
                  <PreviewButton variant="secondary" size="sm">+ Add Address</PreviewButton>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_USER_PROFILE.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-[#DED4CB] rounded-[8px] bg-[#F5EFE8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#30251F]">{addr.title}</span>
                        {addr.isDefault && <PreviewBadge status="active">Default</PreviewBadge>}
                      </div>
                      <p className="text-xs font-semibold text-[#30251F]">{addr.fullName}</p>
                      <p className="text-xs text-[#76675D]">{addr.street}</p>
                      <p className="text-xs text-[#76675D]">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: WALLET */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="bg-[#30251F] text-white rounded-[10px] p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#D8C4B4]">Alden Digital Ledger</span>
                      <h2 className="text-3xl font-bold mt-1">₹{MOCK_USER_PROFILE.walletBalance.toFixed(2)}</h2>
                    </div>
                    <PreviewButton variant="primary" size="sm" onClick={() => alert("Simulated Wallet Top-Up Trigger")}>
                      + Top Up Wallet
                    </PreviewButton>
                  </div>
                  <p className="text-xs text-[#D8C4B4]/80">
                    Use your store wallet for 1-click instant checkout and automated refund credits.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-[#DED4CB] pb-4">
                  <h3 className="text-base font-bold text-[#30251F]">Security & Password</h3>
                  <p className="text-xs text-[#76675D]">Change your login password.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <PreviewInput label="Current Password" type="password" required />
                  <PreviewInput label="New Password" type="password" required />
                  <PreviewInput label="Confirm New Password" type="password" required />
                </div>

                <div className="pt-4 flex justify-end">
                  <PreviewButton type="submit" variant="primary" size="md">
                    Update Password
                  </PreviewButton>
                </div>
              </form>
            )}

            {/* TAB 5: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="border-b border-[#DED4CB] pb-4">
                  <h3 className="text-base font-bold text-[#30251F]">Preferences</h3>
                  <p className="text-xs text-[#76675D]">Manage drop alerts and notification subscriptions.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 text-xs text-[#30251F] cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#8B634B] w-4 h-4" />
                    <span>Receive new seasonal capsule lookbook emails</span>
                  </label>
                  <label className="flex items-center space-x-3 text-xs text-[#30251F] cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#8B634B] w-4 h-4" />
                    <span>Receive SMS shipping tracking updates</span>
                  </label>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePreview;
