'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ListFilter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

type TodoStatus = 'not_started' | 'in_progress' | 'finished';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  status: TodoStatus;
}

const statusColors = {
  not_started: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  finished: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  finished: 'Finished',
};

function SortableTodoItem({ todo, onToggle, onDelete, onStatusChange }: { 
  todo: Todo; 
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        <span
          className={`flex-1 ${todo.status === 'finished' ? 'line-through text-muted-foreground' : ''}`}
        >
          {todo.text}
        </span>
        <Select
          value={todo.status}
          onValueChange={(value: TodoStatus) => onStatusChange(todo._id, value)}
        >
          <SelectTrigger className={`w-[140px] ${statusColors[todo.status]}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo._id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<TodoStatus[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // TODO: Implement proper loading states and error boundaries
  // TODO: Implement filtering logic, in the endpoint
  useEffect(() => {
    const fetchTodos = async () => {
      const url = selectedStatuses.length > 0
        ? `/api/todos?statuses=${selectedStatuses.join(',')}`
        : '/api/todos';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setTodos(data.data);
      }
    };
    fetchTodos();
  }, [selectedStatuses]);

  // TODO: Implement proper state updates
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: newTodo,
          status: 'not_started' as TodoStatus 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        // TODO: Implement proper state updates here
        toast.success('Todo added successfully');
      } else {
        toast.error('Failed to add todo');
      }
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  // TODO: Implement proper state management for todo status updates
  const updateStatus = async (_id: string, status: TodoStatus) => {
    try {
      // TODO: Call the update endpoint
      // TODO: Implement proper state updates here
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteTodo = async (_id: string) => {
    try {
      // TODO: Call the delete endpoint
      // TODO: Implement proper state updates
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((item) => item._id === active.id);
      const newIndex = todos.findIndex((item) => item._id === over.id);
      
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);

      const orders = newTodos.reduce((acc, todo, index) => ({
        ...acc,
        [todo._id]: index + 1
      }), {});

      try {
        const response = await fetch('/api/todos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orders }),
        });

        const data = await response.json();
        if (!data.success) {
          toast.error('Failed to save new order');
        }
      } catch (error) {
        toast.error('Failed to save new order');
      }
    }
  };

  // TODO: Implement backend filtering logic
  const filteredTodos = selectedStatuses.length > 0
    ? todos.filter(todo => selectedStatuses.includes(todo.status))
    : todos;

  return (
    <main className="container max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Title of new todo"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <Button onClick={addTodo}>
                Add
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                  >
                    <ListFilter className="h-4 w-4" />
                    {selectedStatuses.length > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <CommandItem
                          key={value}
                          onSelect={() => {
                            setSelectedStatuses(current =>
                              current.includes(value as TodoStatus)
                                ? current.filter(status => status !== value)
                                : [...current, value as TodoStatus]
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              statusColors[value as TodoStatus]
                            )} />
                            {label}
                            {selectedStatuses.includes(value as TodoStatus) && (
                              <X className="ml-auto h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedStatuses.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStatuses([])}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading todos...</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTodos.map(t => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTodos.map((todo) => (
                    <SortableTodoItem
                      key={todo._id}
                      todo={todo}
                      onToggle={() => {}}
                      onDelete={deleteTodo}
                      onStatusChange={updateStatus}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 