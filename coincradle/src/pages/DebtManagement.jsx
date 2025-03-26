import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const DebtManagement = () => {
  const [debt, setDebt] = useState(0);
  const [income, setIncome] = useState(0);
  const [plan, setPlan] = useState(null);

  const calculatePlan = () => {
    if (income <= 0) {
      setPlan("Please enter a valid income to generate a plan.");
      return;
    }
    
    const percentage = (debt / income) * 100;
    let strategy = "";
    
    if (percentage < 20) {
      strategy = "Low risk: Focus on regular payments and savings.";
    } else if (percentage < 40) {
      strategy = "Moderate risk: Consider refinancing or consolidating your debt.";
    } else {
      strategy = "High risk: Prioritize paying off high-interest debt first and cut unnecessary expenses.";
    }
    
    setPlan(strategy);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Debt Management Plan</h2>
        <div className="mb-4">
          <Label htmlFor="debt" className="mb-2 block">Debt Amount ($)</Label>
          <Input 
            id="debt"
            type="number" 
            value={debt} 
            onChange={(e) => setDebt(Number(e.target.value))} 
            placeholder="Enter your total debt" 
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="income" className="mb-2 block">Monthly Income ($)</Label>
          <Input 
            id="income"
            type="number" 
            value={income} 
            onChange={(e) => setIncome(Number(e.target.value))} 
            placeholder="Enter your monthly income" 
          />
        </div>
        <Button onClick={calculatePlan} className="w-full mt-4">Generate Plan</Button>
        {plan && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Suggested Strategy:</h3>
            <p>{plan}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtManagement;