import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { addTenantAdmin } from '../lib/db';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: { id: number; tenant: string };
  onAdminAdded: () => void;
}

export function AddAdminModal({ isOpen, onClose, tenant, onAdminAdded }: AddAdminModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await addTenantAdmin(email, password, tenant.id);
      onAdminAdded();
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to add administrator. The email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add Administrator to {tenant.tenant}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter administrator email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Enter password"
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Administrator'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}