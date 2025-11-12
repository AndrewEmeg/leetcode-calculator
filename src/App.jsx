import React, { useState } from "react";
import { DollarSign, Users, Calculator, TrendingDown } from "lucide-react";

export default function LeetCodeCalculator() {
    const [participants, setParticipants] = useState([
        { name: "Andrew Emeghebo", missedDays: 9 },
        { name: "Favour Umejesi", missedDays: 6 },
        { name: "Eniola Irinoye", missedDays: 0 },
        { name: "Careen Mwenisongole", missedDays: 3 },
    ]);

    const addParticipant = () => {
        setParticipants([...participants, { name: "", missedDays: 0 }]);
    };

    const removeParticipant = (index) => {
        if (participants.length > 2) {
            setParticipants(participants.filter((_, i) => i !== index));
        }
    };

    const updateParticipant = (index, field, value) => {
        const updated = [...participants];
        updated[index][field] =
            field === "missedDays" ? parseInt(value) || 0 : value;
        setParticipants(updated);
    };

    const calculateBalances = () => {
        const n = participants.length;
        const balances = participants.map((p) => ({
            name: p.name || "Unnamed",
            missedDays: p.missedDays,
            owes: p.missedDays * 10,
            receives: 0,
            netBalance: 0,
        }));

        // Calculate how much each person receives from others' missed days
        participants.forEach((person, i) => {
            if (person.missedDays > 0) {
                const amountOwed = person.missedDays * 10;
                const perPersonShare = amountOwed / (n - 1);

                balances.forEach((balance, j) => {
                    if (i !== j) {
                        balance.receives += perPersonShare;
                    }
                });
            }
        });

        // Calculate net balances
        balances.forEach((balance) => {
            balance.receives = Math.round(balance.receives * 100) / 100;
            balance.netBalance =
                Math.round((balance.receives - balance.owes) * 100) / 100;
        });

        return balances;
    };

    const simplifyTransactions = (balances) => {
        // Create arrays of creditors (positive balance) and debtors (negative balance)
        const creditors = balances
            .filter((b) => b.netBalance > 0.01)
            .map((b) => ({ name: b.name, amount: b.netBalance }))
            .sort((a, b) => b.amount - a.amount);

        const debtors = balances
            .filter((b) => b.netBalance < -0.01)
            .map((b) => ({ name: b.name, amount: Math.abs(b.netBalance) }))
            .sort((a, b) => b.amount - a.amount);

        const transactions = [];
        let i = 0,
            j = 0;

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            const transferAmount = Math.min(creditor.amount, debtor.amount);

            if (transferAmount > 0.01) {
                transactions.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: Math.round(transferAmount * 100) / 100,
                });
            }

            creditor.amount -= transferAmount;
            debtor.amount -= transferAmount;

            if (creditor.amount < 0.01) i++;
            if (debtor.amount < 0.01) j++;
        }

        return transactions;
    };

    const balances = calculateBalances();
    const transactions = simplifyTransactions(balances);
    const totalPool = participants.reduce(
        (sum, p) => sum + p.missedDays * 10,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-600 rounded-xl">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                LeetCode AccountAndrewability Calculator
                            </h1>
                            <p className="text-gray-600">
                                Automated debt settlement for your coding
                                challenge
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    Participants
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {participants.length}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                    Total Pool
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                ${totalPool}
                            </p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                    Transactions
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Enter Missed Days
                        </h2>
                        {participants.map((p, i) => (
                            <div
                                key={i}
                                className="flex gap-3 items-center bg-gray-50 p-4 rounded-xl"
                            >
                                <input
                                    type="text"
                                    value={p.name}
                                    onChange={(e) =>
                                        updateParticipant(
                                            i,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Participant name"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    value={p.missedDays}
                                    onChange={(e) =>
                                        updateParticipant(
                                            i,
                                            "missedDays",
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    max="30"
                                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-600 w-24">
                                    missed days
                                </span>
                                {participants.length > 2 && (
                                    <button
                                        onClick={() => removeParticipant(i)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addParticipant}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                            + Add Participant
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Individual Balances
                        </h2>
                        <div className="space-y-3">
                            {balances.map((b, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-200 rounded-xl p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-gray-900">
                                            {b.name}
                                        </span>
                                        <span
                                            className={`text-lg font-bold ${
                                                b.netBalance > 0
                                                    ? "text-green-600"
                                                    : b.netBalance < 0
                                                    ? "text-red-600"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {b.netBalance > 0 ? "+" : ""}$
                                            {b.netBalance}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>
                                                Missed {b.missedDays} days
                                            </span>
                                            <span className="text-red-600">
                                                -${b.owes}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Receives from others</span>
                                            <span className="text-green-600">
                                                +${b.receives}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Simplified Transactions
                        </h2>
                        {transactions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>
                                    Everyone is settled! No transactions needed.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((t, i) => (
                                    <div
                                        key={i}
                                        className="border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {t.from}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    pays to
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {t.to}
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                ${t.amount}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {transactions.length > 0 && (
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <p className="text-sm text-yellow-900">
                                    <strong>Note:</strong> These{" "}
                                    {transactions.length} transaction
                                    {transactions.length !== 1 ? "s" : ""}{" "}
                                    settle all debts. Much simpler than{" "}
                                    {participants.length *
                                        (participants.length - 1)}{" "}
                                    potential individual payments!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        How It Works
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="font-medium text-blue-900 mb-2">
                                1. Calculate Gross
                            </div>
                            <p>
                                Each person who missed days owes $10 per day.
                                That money is split equally among all other
                                participants.
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <div className="font-medium text-green-900 mb-2">
                                2. Net Balances
                            </div>
                            <p>
                                Calculate net position: money received from
                                others minus money owed. Positive = receive,
                                negative = pay.
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <div className="font-medium text-purple-900 mb-2">
                                3. Simplify
                            </div>
                            <p>
                                Match debtors with creditors to minimize
                                transactions using a greedy algorithm. Debts
                                cancel out automatically!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
