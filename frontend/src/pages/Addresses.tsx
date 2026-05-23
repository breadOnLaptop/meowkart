import React, { useEffect, useState } from 'react';
import { useAddressStore } from '../store/useAddressStore';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const Addresses: React.FC = () => {
  const { addresses, fetchAddresses, addAddress, deleteAddress, updateAddress, loading } = useAddressStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    addressLine: '',
    city: '',
    state: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (address: any) => {
    setEditingId(address.id);
    setFormData(address);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAddress(editingId, formData);
    } else {
      await addAddress(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', pincode: '', locality: '', addressLine: '', city: '', state: '', isDefault: false });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 max-w-[1248px]">
      <div className="bg-white shadow-sm border rounded-sm">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            Manage Addresses
          </h1>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase border p-2 rounded-sm hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} />
              Add a new address
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 bg-blue-50/30 border-b">
            <h2 className="font-bold text-blue-600 uppercase text-xs mb-6">
              {editingId ? 'Edit Address' : 'Add a New Address'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Name" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="10-digit mobile number" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              <input type="text" placeholder="Pincode" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
              <input type="text" placeholder="Locality" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.locality} onChange={e => setFormData({...formData, locality: e.target.value})} required />
            </div>
            <textarea placeholder="Address (Area and Street)" className="w-full border p-3 rounded-sm text-sm focus:outline-blue-600 mb-4 h-24" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="text" placeholder="City/District/Town" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <input type="text" placeholder="State" className="border p-3 rounded-sm text-sm focus:outline-blue-600" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
            </div>
            <div className="mb-6 flex items-center gap-2">
              <input type="checkbox" id="default" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
              <label htmlFor="default" className="text-sm cursor-pointer">Set as default address</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-10 py-3 font-bold rounded-sm shadow-md uppercase text-sm">Save</button>
              <button type="button" onClick={resetForm} className="text-gray-600 font-bold uppercase text-sm px-6">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="p-10 text-center animate-pulse">Loading addresses...</div>
        ) : (
          <div className="flex flex-col">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between group">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Home</span>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                        <CheckCircle2 size={12} /> Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold text-sm">{addr.name}</span>
                    <span className="font-bold text-sm ml-4">{addr.phone}</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                  </p>
                </div>
                <div className="flex items-start gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(addr)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit2 size={18} /></button>
                  <button onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && !showForm && (
              <div className="p-20 text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-4 text-gray-200" />
                <p>No addresses saved yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
