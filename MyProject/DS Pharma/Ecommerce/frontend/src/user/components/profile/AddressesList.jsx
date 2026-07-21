import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Edit2, 
    Plus, 
    Trash2, 
    CheckCircle, 
    X, 
    Home, 
    Briefcase,
    Loader2 
} from 'lucide-react';
import AddressForm from '@/shared/components/common/AddressForm';
import useIsMobile from '@/shared/hooks/useIsMobile';

const AddressesList = ({ 
    addressesData,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const isMobile = useIsMobile(768);
    
    const displayAddresses = addressesData?.data || [];
    const isSaving = isAddingAddress || isUpdatingAddress;
    const isLoading = !addressesData;

    const handleSave = (data) => {
        if (editingId) {
             updateAddress({ id: editingId, data }, {
                 onSuccess: () => {
                     setEditingId(null);
                 }
             });
        } else {
             addAddress(data, {
                 onSuccess: () => {
                     setIsAdding(false);
                 }
             });
        }
    };
    
    const handleSetDefault = (id) => {
         const address = displayAddresses.find(a => a.id === id);
         if (address) {
             updateAddress({ id, data: { ...address, isDefault: true } });
         }
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this address?')) {
            deleteAddress(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ marginTop: isMobile ? '0' : '30px', padding: isMobile ? '5px' : '10px', marginBottom: '10px' }}
        >
             <div className={`border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-emerald-50/50 to-white ${isMobile ? 'p-4' : 'p-6'}`} style={{ marginBottom: isMobile ? '8px' : '15px' }}>
                <div>
                     <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>Saved Addresses</h2>
                     <p className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} text-gray-500 mt-0.5`}>Manage delivery locations</p>
                </div>
                {!isAdding && !editingId && (
                     <button
                        style={{ padding: isMobile ? '6px 14px' : '8px 16px' }}
                        onClick={() => setIsAdding(true)}
                        className={`flex items-center gap-1 ${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm`}
                     >
                        <Plus className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                        <span className='hidden sm:inline-block' style={{ marginTop: isMobile ? '1px' : '3px' }}>Add New Address</span>
                     </button>
                )}
             </div>

             <div className="p-6">
                <AnimatePresence>
                    {(isAdding || editingId) && (
                         <AddressForm 
                            initialData={editingId ? displayAddresses.find(a => a.id === editingId) : null}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsAdding(false);
                                setEditingId(null);
                            }}
                            isSaving={isSaving}
                         />
                    )}
                </AnimatePresence>

                {displayAddresses.length === 0 && !isAdding ? (
                     <div className="text-center flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200" style={{ padding: '10px' }}>
                        <div className='text-center'> <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" /></div>
                        <h3 className="text-gray-900 font-medium mb-1">No addresses found</h3>
                        <p className="text-gray-500 text-sm mb-4">Add an address to speed up checkout</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
                        >
                            Add your first address
                        </button>
                        
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ padding: '5px' }}>
                        {displayAddresses.map((addr) => (
                            <Motion.div
                                style={{ padding: isMobile ? '5px' : '10px' }}
                                key={addr.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`group relative ${isMobile ? 'p-4' : 'p-5'} rounded-xl border-2 transition-all hover:shadow-md ${
                                    addr.isDefault 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-gray-100 bg-white hover:border-emerald-200'
                                }`}
                            >
                                {addr.isDefault && (
                                     <div className="absolute top-4 right-2 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                                        style={{ padding:'2px 5px' }}
                                        >
                                         <CheckCircle className="w-3 h-3" />
                                         <span style={{ marginTop: '3px' }}>Default</span>
                                     </div>
                                )}

                                {!addr.isDefault && (
                                         <button 
                                            style={{ padding: '2px 5px' }}
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="absolute top-4 right-2 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-400"
                                         >
                                             <span style={{ marginTop: '3px' }}>Set as Default</span>
                                         </button>
                                     )}
                                
                                <div className="flex items-start gap-2 mb-3">
                                     <div className={`rounded-lg ${isMobile ? 'p-2' : 'p-2.5'} ${
                                         addr.type === 'Home' ? 'bg-blue-100 text-blue-600' : 
                                         addr.type === 'Work' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                     }`}>
                                         {addr.type === 'Home' && <Home className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                         {addr.type === 'Work' && <Briefcase className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                         {['Home', 'Work'].indexOf(addr.type) === -1 && <MapPin className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                     </div>
                                     <div>
                                         <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-900`}>{addr.type}</h4>
                                         <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium text-gray-600`}>{addr.name}</p>
                                     </div>
                                </div>
                                
                                <div className="space-y-1 mb-4" style={{ paddingLeft: isMobile ? '32px' : '33px' }}>
                                     <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 leading-relaxed`}>
                                         {addr.address}<br />
                                         {addr.landmark && <span className={`block text-emerald-600 font-medium ${isMobile ? 'text-[10px]' : 'text-[10px]'} mt-0.5 mb-0.5`}>Landmark: {addr.landmark}</span>}
                                         {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span>
                                     </p>
                                     <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-2 space-y-0.5`}>
                                         <p className="text-[10px] ms:text-xs font-medium text-gray-700">Mobile: <span className="text-[10px] font-medium text-gray-700">{addr.phone}</span></p>
                                         {addr.altPhone && <p className="text-[10px] sm:text-xs font-medium text-gray-700">Alt Phone: <span className="text-[10px] font-medium text-gray-700">{addr.altPhone}</span></p>}
                                     </div>
                                </div>
                                
                                <div className={`flex items-end justify-end gap-2 pt-3 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity ${isMobile ? 'pl-8' : 'pl-10'}`}>
                                     <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => setEditingId(addr.id)}
                                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                     >
                                         <Edit2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Edit</span>
                                     </button>
                                     <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={isDeletingAddress}
                                        className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                     >
                                         <Trash2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Delete</span>
                                     </button>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
             </div>
        </Motion.div>
    );
};

export default AddressesList;
