import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';

export default function RejectModal({ isOpen, onCancel, onConfirm }) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) setReason('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Reject Guide</h3>

                <label className="mb-2 block text-sm font-medium text-gray-700">Reason for rejection</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mb-4 h-28 w-full rounded border border-gray-300 p-2 focus:outline-none"
                    placeholder="Enter rejection reason..."
                />

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="danger" onClick={() => onConfirm(reason)}>Reject</Button>
                </div>
            </div>
        </div>
    );
}
