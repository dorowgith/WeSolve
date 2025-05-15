import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose }) => {
  const { addProject, addTask } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    if (file.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());

      // Validate required columns
      const requiredColumns = ['Project Name', 'Project Description', 'Task Title', 'Task Description', 'Task Status', 'Task Priority'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        setError(`Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      // Group tasks by project
      const projectsMap = new Map();

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(value => value.trim());
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));

        const projectName = row['Project Name'];
        if (!projectsMap.has(projectName)) {
          projectsMap.set(projectName, {
            name: projectName,
            description: row['Project Description'],
            category: row['Project Category'] || '',
            color: row['Project Color'] || '#3B82F6',
            tasks: [],
          });
        }

        const project = projectsMap.get(projectName);
        project.tasks.push({
          title: row['Task Title'],
          description: row['Task Description'],
          status: row['Task Status'].toLowerCase(),
          priority: row['Task Priority'].toLowerCase(),
          dueDate: row['Due Date'],
        });
      }

      // Create projects and tasks
      for (const [_, projectData] of projectsMap) {
        const project = await addProject({
          name: projectData.name,
          description: projectData.description,
          category: projectData.category,
          color: projectData.color,
        });

        for (const taskData of projectData.tasks) {
          await addTask(project.id, taskData);
        }
      }

      setSuccess('Projects and tasks imported successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Error processing CSV file. Please check the format and try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Projects from CSV">
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2">CSV Format Requirements:</h3>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Required columns: Project Name, Project Description, Task Title, Task Description, Task Status, Task Priority</li>
            <li>• Optional columns: Project Category, Project Color, Due Date</li>
            <li>• Task Status should be: todo, in-progress, review, or completed</li>
            <li>• Task Priority should be: low, medium, or high</li>
          </ul>
        </div>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
            <CheckCircle size={16} />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CSVImportModal;