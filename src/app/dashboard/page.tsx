'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { neonClient } from '@/lib/neon/client';
import type { Todo } from '@/lib/neon/schema';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = neonClient.auth.useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  // Fetch todos when component mounts
  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session]);

  const fetchTodos = async () => {
    try {
      // Using Neon JS SDK PostgREST-style API
      const { data, error } = await neonClient
        .from('todos')
        .select('*')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setTodos(data as Todo[]);
      }
      if (error) {
        console.error('Failed to fetch todos:', error);
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !session) return;

    setIsLoading(true);
    setError('');

    try {
      // Create todo using Neon JS SDK
      const { data, error } = await neonClient
        .from('todos')
        .insert({
          user_id: session.user.id,
          title: newTodoTitle,
          description: newTodoDescription,
          completed: false,
        })
        .select()
        .single();

      const newTodo = data as Todo;

      if (newTodo) {
        setTodos([newTodo, ...todos]);
        setNewTodoTitle('');
        setNewTodoDescription('');
      }
      if (error) {
        setError('Failed to create todo');
        console.error(error);
      }
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    if (!session) return;

    try {
      // Update todo using Neon JS SDK
      const { data, error } = await neonClient
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      const updatedTodo = data as Todo;

      if (updatedTodo) {
        setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
      }
      if (error) {
        console.error('Failed to update todo:', error);
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!session) return;

    try {
      // Delete todo using Neon JS SDK
      const { error } = await neonClient
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (!error) {
        setTodos(todos.filter(t => t.id !== id));
      } else {
        console.error('Failed to delete todo:', error);
      }
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleLogout = async () => {
    await neonClient.auth.signOut();
    router.push('/login');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Create Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Todo</h2>
          <form onSubmit={handleCreateTodo} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Todo'}
            </button>
          </form>
        </div>

        {/* Todos List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Todos</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No todos yet. Create your first todo above!
            </p>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-sm mt-1 ${
                        todo.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}