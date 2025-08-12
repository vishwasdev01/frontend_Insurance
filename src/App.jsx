import { useState } from "react";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({
    age: "",
    income: "",
    dependents: "",
    risk: "Low",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { age, income, dependents, risk } = form;
    if (!age || !income || !dependents || !risk) {
      alert("Please fill in all fields.");
      return false;
    }
    if (age <= 0 || age >= 100) {
      alert("Age must be between 1 and 99.");
      return false;
    }
    if (income < 100) {
      alert("Income must be at least 100.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setResult(null);

   try {
  console.log("Sending data:", form);
  const res = await axios.post(
    "http://localhost:5102/api/recommendation",
    form,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  setResult(res.data);
} catch (error) {
  console.log(error);
  alert("Error fetching recommendation");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Insurance Recommendation
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Income
            </label>
            <input
              type="number"
              name="income"
              value={form.income}
              onChange={handleChange}
              placeholder="Enter your income"
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Number of Dependents
            </label>
            <input
              type="number"
              name="dependents"
              value={form.dependents}
              onChange={handleChange}
              placeholder="Enter dependents count"
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Risk Level
            </label>
            <select
              name="risk"
              value={form.risk}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Get Recommendation"
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 p-5 border rounded-lg bg-blue-50 shadow-inner">
            <h2 className="text-xl font-bold text-blue-800">
              {result.recommendation}
            </h2>
            <p className="text-gray-700 mt-2">{result.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
