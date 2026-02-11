import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { Navbar } from './Navbar';
import { transactionsAPI } from '../services/api';
import type { Transaction, TransactionDTO } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      const transactions: Transaction[] = response.data.map((t: TransactionDTO) => ({
        ...t,
        amount: Number(t.amount),
      }));

      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
      });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [refreshKey]);

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#1a1d29] dark:via-[#1e2233] dark:to-[#1a1d29] transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-[#242837] dark:text-white',
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Track your income and expenses to understand your finances better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Income</h3>
              
            </div>
            {loading ? (
              <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">
                ${summary.totalIncome.toFixed(2)}
              </p>
            )}
          </div>

          <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
             
            </div>
            {loading ? (
              <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">
                ${summary.totalExpenses.toFixed(2)}
              </p>
            )}
          </div>

          <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Balance</h3>
              
            </div>
            {loading ? (
              <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">
                ${summary.balance.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <TransactionForm onSuccess={handleTransactionAdded} />
        <TransactionList refresh={refreshKey} />
      </div>
    </div>
  );
};