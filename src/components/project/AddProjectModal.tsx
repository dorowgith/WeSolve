import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: '#3B82F6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      color: formData.color,
    });
    
    setFormData({
      name: '',
      description: '',
      category: '',
      color: '#3B82F6',
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Color
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Choose a color for your project
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProjectModal;