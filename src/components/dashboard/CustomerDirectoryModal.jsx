import React from 'react';
import { Mail, Phone, MapPin, Package, ShieldCheck } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const CustomerDirectoryModal = ({ isOpen, onClose, customers = [] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registered Customers Directory" maxWidth="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-xs text-slate-500">
          Showing all <span className="font-bold text-slate-800">{customers.length}</span> registered foodie accounts and saved delivery profiles.
        </p>

        <div className="divide-y divide-slate-100">
          {customers.map((cust) => {
            const defaultAddress = cust.addresses?.find((a) => a.isDefault) || cust.addresses?.[0];
            return (
              <div key={cust.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={cust.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{cust.name}</h4>
                      <Badge variant="primary" size="xs">
                        {cust.role || 'Customer'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {cust.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {cust.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  {defaultAddress && (
                    <div className="text-slate-600 flex items-center sm:justify-end gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate max-w-xs">{defaultAddress.city}, {defaultAddress.state}</span>
                    </div>
                  )}
                  <div className="text-slate-400 mt-0.5">
                    Total Orders: <span className="font-bold text-slate-700">{cust.totalOrders || 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDirectoryModal;
