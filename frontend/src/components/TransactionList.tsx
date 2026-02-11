/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { transactionsAPI } from '../services/api';
import type { Transaction, TransactionDTO } from '../types';


interface TransactionListProps {
  refresh: number; // Used to trigger refresh when new transaction added
}

export const TransactionList: React.FC<TransactionListProps> = ({ refresh }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  const fetchTransactions = async () => {
  try {
    setLoading(true);
    const response = await transactionsAPI.getAll();

    // Normalize the data here: convert `amount` from string to number
    const normalized: Transaction[] = response.data.map((t: TransactionDTO) => ({
      ...t,
      amount: Number(t.amount),  // Convert `amount` to a number
    }));

    setTransactions(normalized);
    setError('');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Are you sure you want to delete this transaction?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
      });
    });

    if (!confirmed) return;

    const loadingToast = toast.loading('Deleting transaction...');

    try {
      await transactionsAPI.delete(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully!', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete transaction', { id: loadingToast });
    }
  };

  const handleEdit = async (id: number) => {
    const loadingToast = toast.loading('Updating transaction...');

    try {
      await transactionsAPI.update(id, editData);
      await fetchTransactions();
      setEditingId(null);
      setEditData({});
      toast.success('Transaction updated successfully!', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update transaction', { id: loadingToast });
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch =
      filterCategory === 'All' || t.category === filterCategory;
    const typeMatch = filterType === 'all' || t.type === filterType;
    return categoryMatch && typeMatch;
  });

  const categories = ['All', ...new Set(transactions.map((t) => t.category))];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Transactions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 rounded-lg p-2 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-300">Transactions</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-50">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300">
            Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-50">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-lg transition-colors duration-300">No transactions found</p>
          <p className="text-gray-400 text-sm mt-1 transition-colors duration-300">Start adding your first transaction above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 transition-colors duration-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-150">
                  <td className="px-4 py-3">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <input
                        type="text"
                        value={editData.description || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    ) : (
                      transaction.description
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-bold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingId === transaction.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(transaction.id)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                          className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditingId(transaction.id);
                            setEditData(transaction);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};