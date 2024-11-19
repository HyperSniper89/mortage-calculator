import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

function App() {
  // Loan related state
  const [totalLoanAmount, setTotalLoanAmount] = React.useState(5500000);
  const [downPayment, setDownPayment] = React.useState(630000);
  const [interestRate, setInterestRate] = React.useState(4.6);
  const [loanTermYears, setLoanTermYears] = React.useState(30);
  const [yearlyIncomeGrowth, setYearlyIncomeGrowth] = React.useState(3.5);
  
  // Personal income state
  const [personAIncome, setPersonAIncome] = React.useState(20000);
  const [personBIncome, setPersonBIncome] = React.useState(20000);
  const [rentalIncome, setRentalIncome] = React.useState(8300);
  const [governmentHelp, setGovernmentHelp] = React.useState(2917);

  // Derived values
  const loanAmountAfterDownPayment = totalLoanAmount - downPayment;
  const monthlyIncomeAfterTax = personAIncome + personBIncome;

  // Expenses state
  const [expenses, setExpenses] = React.useState([
    { id: 1, name: "Benzin", amount: 700 },
    { id: 2, name: "Bilur", amount: 1300 },
    { id: 3, name: "Matur", amount: 4000 },
    { id: 4, name: "Tryggingar", amount: 850 },
    { id: 5, name: "Olja og El", amount: 1300 },
    { id: 6, name: "Húsa kontu", amount: 2000 },
    { id: 7, name: "Feriu kontu", amount: 2000 },
    { id: 8, name: "Emergency fund", amount: 1000 },
    { id: 9, name: "Íløgu kontu", amount: 1200 },
    { id: 10, name: "Online services", amount: 200 },
    { id: 11, name: "Venjing x 2", amount: 700 },
    { id: 12, name: "Telefon", amount: 150 }
  ]);
  
  const [newExpenseName, setNewExpenseName] = React.useState("");
  const [newExpenseAmount, setNewExpenseAmount] = React.useState("");

  const calculateMortgage = () => {
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTermYears * 12;
    const powerTerm = Math.pow(1 + monthlyRate, numberOfPayments);
    const mortgage = loanAmountAfterDownPayment * monthlyRate * (powerTerm / (powerTerm - 1));
    return Math.round(mortgage);
  };

  const calculateBudgetProjection = () => {
    const monthlyMortgage = calculateMortgage();
    const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const years = 5;
    const projectionData = [];

    for (let year = 0; year <= years; year++) {
      const growthFactor = Math.pow(1 + yearlyIncomeGrowth / 100, year);
      const projectedPersonAIncome = personAIncome * growthFactor;
      const projectedPersonBIncome = personBIncome * growthFactor;
      const projectedRentalIncome = rentalIncome * growthFactor;
      
      const monthlyBudget = (projectedPersonAIncome + projectedPersonBIncome + 
                            projectedRentalIncome + governmentHelp) -
                           (monthlyMortgage + totalMonthlyExpenses);
      
      projectionData.push({
        year,
        budget: Math.round(monthlyBudget),
        income: Math.round(projectedPersonAIncome + projectedPersonBIncome + projectedRentalIncome)
      });
    }
    return projectionData;
  };

  const monthlyMortgage = calculateMortgage();
  const netMortgage = monthlyMortgage - governmentHelp;
  const projectionData = calculateBudgetProjection();

  const addExpense = () => {
    if (newExpenseName && newExpenseAmount) {
      setExpenses([
        ...expenses,
        {
          id: expenses.length + 1,
          name: newExpenseName,
          amount: parseFloat(newExpenseAmount)
        }
      ]);
      setNewExpenseName("");
      setNewExpenseAmount("");
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0) + monthlyMortgage;
  const totalIncome = monthlyIncomeAfterTax + rentalIncome;
  const totalIncomeWithGovernmentHelp = monthlyIncomeAfterTax + rentalIncome + governmentHelp;
  const netAfterExpenses = totalIncome + governmentHelp - totalExpenses;
  const netPerPerson = Math.round(netAfterExpenses / 2);

  const InputField = ({ label, value, onChange, type = "number", suffix = "kr", readOnly = false }) => (
    <div className="flex items-center justify-between border-b py-2">
      <label className="text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
          className={`border rounded p-1 w-32 text-right ${readOnly ? 'bg-gray-100' : ''}`}
          readOnly={readOnly}
        />
        <span className="w-8">{suffix}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Einfalt Frælsið</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Loan Parameters</h2>
          <InputField label="Lán upphædd" value={totalLoanAmount} onChange={setTotalLoanAmount} />
          <InputField label="Eginfýgging" value={downPayment} onChange={setDownPayment} />
          <InputField 
            label="Lán aftaná eginfýgging" 
            value={loanAmountAfterDownPayment} 
            onChange={() => {}} 
            readOnly={true}
          />
          <InputField label="Renta" value={interestRate} onChange={setInterestRate} suffix="%" />
          <InputField label="Lán tíðarskeið" value={loanTermYears} onChange={setLoanTermYears} suffix="y" />
          <InputField label="árlig inntøku vøkstur %" value={yearlyIncomeGrowth} onChange={setYearlyIncomeGrowth} suffix="%" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inntøka & Rentustuðul</h2>
          <InputField label="Persónur A Inntøka" value={personAIncome} onChange={setPersonAIncome} />
          <InputField label="Persónur B Inntøka" value={personBIncome} onChange={setPersonBIncome} />
          <InputField 
            label="Mánarlig inntøka eftir skat" 
            value={monthlyIncomeAfterTax} 
            onChange={() => {}} 
            readOnly={true}
          />
          <InputField label="Inntøku frá íbúð" value={rentalIncome} onChange={setRentalIncome} />
          <InputField label="Rentustuðul" value={governmentHelp} onChange={setGovernmentHelp} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">5-Year Budget Projection</h2>
        <div className="h-80">
          <LineChart 
            width={800} 
            height={300} 
            data={projectionData}
            margin={{ top: 5, right: 20, left: 18, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Ár', position: 'bottom', offset: -10 }} 
            />
            <YAxis 
              label={{ value: 'Upphædd (kr)', angle: -90, position: 'insideLeft', offset: -5 }} 
            />
            <Tooltip formatter={(value) => `${value.toLocaleString()} kr`} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#82ca9d" 
              name="Mánarligt avlop eftir allar útreiðslur"
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#8884d8" 
              name="Mánarlig inntøka eftir skat samanlagt"
            />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lán Yvirlit</h2>
          <div className="space-y-2">
            <p>Mánarligt lán: {monthlyMortgage.toLocaleString()} kr</p>
            <p>Rentustuðul: {governmentHelp.toLocaleString()} kr</p>
            <p className="font-bold">Net Lán Kostnaður: {netMortgage.toLocaleString()} kr</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fíggjarligt Yvirlit</h2>
          <div className="space-y-2">
            <p>Total Inntøka: {totalIncomeWithGovernmentHelp.toLocaleString()} kr</p>
            <p>Total útreiðsla: {totalExpenses.toLocaleString()} kr</p>
            <div className="border-t pt-2">
              <p className="font-bold text-lg">Net eftir aftaná útreiðslur: {netAfterExpenses.toLocaleString()} kr</p>
              <p className="font-bold text-lg">Pr.Persón: {netPerPerson.toLocaleString()} kr</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Legg útreiðslu aftrat</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            placeholder="Navn á útreiðslu"
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            placeholder="Uphædd"
            className="border p-2 rounded w-32"
          />
          <button
            onClick={addExpense}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Útreiðslur</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b py-2 font-semibold">
            <span>Lán</span>
            <span>{monthlyMortgage.toLocaleString()} kr</span>
          </div>
          {expenses.map(expense => (
            <div key={expense.id} className="flex justify-between items-center border-b py-2">
              <span>{expense.name}</span>
              <div className="flex items-center gap-4">
                <span>{expense.amount.toLocaleString()} kr</span>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;