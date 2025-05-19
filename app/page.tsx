'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      if (data.success) {
        setTodos(data.data);
      }
    } catch (err) {
      console.error('Error fetching todos', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => [...prev, data.data]);
        setNewTodo('');
      }
    } catch (err) {
      console.error('Error adding todo', err);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? data.data : todo))
        );
      }
    } catch (err) {
      console.error('Error updating todo', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      }
    } catch (err) {
      console.error('Error deleting todo', err);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => updateTodo(todo._id, !todo.completed)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
