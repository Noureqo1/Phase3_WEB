'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CurrencyDollarIcon, BanknotesIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '@/components/ui/SkeletonLoader';

interface Transaction {
  _id: string;
  fromUser: {
    _id: string;
    username: string;
  };
  amount: number;
  netAmount: number;
  status: string;
  type: string;
  metadata: {
    videoId?: {
      _id: string;
      title: string;
    };
    message?: string;
  };
  createdAt: string;
}

interface EarningsData {
  totalEarnings: number;
  totalTips: number;
  recentTransactions: Transaction[];
}

export default function EarningsPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('You must be logged in to view earnings');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/stripe/earnings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEarnings(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch earnings:', err);
      setError(err.response?.data?.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Creator Earnings</h1>
            <button
              onClick={() => window.location.href = '/profile'}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    ${earnings?.totalEarnings.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tips</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {earnings?.totalTips || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Tip</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    ${earnings && earnings.totalTips > 0 
                      ? (earnings.totalEarnings / earnings.totalTips).toFixed(2)
                      : '0.00'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Tips</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {earnings?.recentTransactions && earnings.recentTransactions.length > 0 ? (
              earnings.recentTransactions.map((transaction) => (
                <div key={transaction._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${transaction.amount.toFixed(2)} tip from {transaction.fromUser.username}
                        </p>
                        {transaction.metadata.message && (
                          <p className="text-sm text-gray-500 italic">
                            "{transaction.metadata.message}"
                          </p>
                        )}
                        {transaction.metadata.videoId && (
                          <p className="text-sm text-gray-500">
                            For: {transaction.metadata.videoId.title}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        +${transaction.netAmount.toFixed(2)}
                      </p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-1">No tips yet</p>
                <p className="text-sm">When people tip your videos, they'll appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Creator Earnings
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• Tips are processed securely through Stripe</p>
                <p>• Net amount shows earnings after Stripe fees</p>
                <p>• Payouts can be configured in your Stripe dashboard</p>
                <p>• All transactions are tracked for transparency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
