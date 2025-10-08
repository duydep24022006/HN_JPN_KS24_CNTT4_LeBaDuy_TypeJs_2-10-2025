// ---------------- USER ----------------
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  boards?: Board[];
}

// ---------------- BOARD ----------------
export interface Board {
  id?: number;
  userId?: number;
  title: string;
  description?: string;
  type: "image" | "color";
  backdrop: string;
  is_starred?: boolean;
  is_close?: boolean;
  created_at?: string;
  lists?: List[];
}

// ---------------- LIST ----------------
export interface List {
  id: number;
  boardId: number;
  title: string;
  created_at: string;
  tasks?: Task[];
}

// ---------------- TASK ----------------
export interface Task {
  id: number;
  listId: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  due_date: string;
  created_at: string;
  tags?: Tag[];
}

// ---------------- TAG ----------------
export interface Tag {
  id: number;
  taskId: number;
  content: string;
  color: string;
}
