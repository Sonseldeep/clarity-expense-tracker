export interface User {
    id: number;
    email:string;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: number; 
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface TransactionDTO {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: string;  // Backend sends it as a string
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}