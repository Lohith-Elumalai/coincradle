import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import ProgressBar from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatters';

const GoalSetting = () => {
  const { financialGoals, addGoal, updateGoal, deleteGoal, userFinancialData } = useFinanceData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings', // default category
    priority: 'medium', // default priority
    description: '',
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!showAddModal) {
      setNewGoal({
        title: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'savings',
        priority: 'medium',
        description: '',
      });
      setEditingGoal(null);
    }
  }, [showAddModal]);

  // Set form when editing goal
  useEffect(() => {
    if (editingGoal) {
      setNewGoal({
        ...editingGoal,
        targetAmount: editingGoal.targetAmount.toString(),
        currentAmount: editingGoal.currentAmount.toString(),
        targetDate: new Date(editingGoal.targetDate).toISOString().split('T')[0],
      });
      setShowAddModal(true);
    }
  }, [editingGoal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedGoal = {
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount),
      targetDate: new Date(newGoal.targetDate).toISOString(),
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString(),
      id: editingGoal ? editingGoal.id : Date.now().toString(),
    };

    if (editingGoal) {
      updateGoal(formattedGoal);
    } else {
      addGoal(formattedGoal);
    }
    
    setShowAddModal(false);
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const calculateTimeRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
  };

  const calculateMonthlyContribution = (goal) => {
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.abs(targetDate - now);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths <= 0) return 0;
    
    const remaining = goal.targetAmount - goal.currentAmount;
    return remaining / diffMonths;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'savings': return '💰';
      case 'investment': return '📈';
      case 'property': return '🏠';
      case 'education': return '🎓';
      case 'retirement': return '🌴';
      case 'travel': return '✈️';
      case 'vehicle': return '🚗';
      default: return '🎯';
    }
  };

  const sortByPriority = (a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Goals</h2>
        <Button onClick={() => setShowAddModal(true)}>Add New Goal</Button>
      </div>

      {financialGoals.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No financial goals yet</h3>
            <p className="text-gray-500 mb-4">Set your first financial goal to start tracking your progress.</p>
            <Button onClick={() => setShowAddModal(true)}>Create Goal</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...financialGoals].sort(sortByPriority).map((goal) => (
            <Card key={goal.id} className="h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(goal.category)}</span>
                  <h3 className="text-lg font-medium text-gray-800">{goal.title}</h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                </div>
                <ProgressBar 
                  value={goal.currentAmount} 
                  max={goal.targetAmount}
                  colorClass={goal.currentAmount >= goal.targetAmount ? "bg-green-500" : "bg-blue-500"}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Current</p>
                  <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Target</p>
                  <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Need</p>
                  <p className="font-medium">{formatCurrency(calculateMonthlyContribution(goal))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time Left</p>
                  <p className="font-medium">{calculateTimeRemaining(goal.targetDate)}</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline"
                  onClick={() => setEditingGoal(goal)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingGoal ? "Edit Financial Goal" : "Add New Financial Goal"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Title"
            id="title"
            name="title"
            value={newGoal.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., Emergency Fund, Down Payment, Vacation"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Target Amount"
              id="targetAmount"
              name="targetAmount"
              type="number"
              value={newGoal.targetAmount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              prefix="$"
            />
            
            <Input
              label="Current Amount"
              id="currentAmount"
              name="currentAmount"
              type="number"
              value={newGoal.currentAmount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              prefix="$"
            />
          </div>
          
          <Input
            label="Target Date"
            id="targetDate"
            name="targetDate"
            type="date"
            value={newGoal.targetDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              id="category"
              name="category"
              value={newGoal.category}
              onChange={handleInputChange}
              required
              options={[
                { value: 'savings', label: '💰 Savings' },
                { value: 'investment', label: '📈 Investment' },
                { value: 'property', label: '🏠 Property' },
                { value: 'education', label: '🎓 Education' },
                { value: 'retirement', label: '🌴 Retirement' },
                { value: 'travel', label: '✈️ Travel' },
                { value: 'vehicle', label: '🚗 Vehicle' },
                { value: 'other', label: '🎯 Other' },
              ]}
            />
            
            <Select
              label="Priority"
              id="priority"
              name="priority"
              value={newGoal.priority}
              onChange={handleInputChange}
              required
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>
          
          <Input
            label="Description"
            id="description"
            name="description"
            type="textarea"
            value={newGoal.description}
            onChange={handleInputChange}
            placeholder="Why is this goal important to you?"
            rows={3}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalSetting;