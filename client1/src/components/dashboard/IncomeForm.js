import React, { useState, useEffect } from 'react';
import { createIncome, getUserProfile } from '../../services/api';
import '../../styles/TransactionForm.css';

const IncomeForm = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tags, setTags] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(null);
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
  const incomeTags = ['Salary', 'Bonus', 'Investment', 'Gift', 'Others'];

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await getUserProfile(); // Fetch user profile
        setUserId(response.data.user); // Set user ID from response
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    const formData = {
      amount: parseFloat(amount),
      currency,
      tags: tags || customTag,
      date,
      note,
      user: userId // Include user ID in the form data
    };

    try {
      const response = await createIncome(formData);
      console.log('Income form submitted:', response.data);
      setSuccess('Income added successfully!');
      resetForm();
    } catch (err) {
      console.error('Error submitting income:', err);
      setError(err.response?.data?.message || 'Failed to add income. Please try again.');
    }
  };

  const resetForm = () => {
    setAmount('');
    setCurrency('USD');
    setTags('');
    setCustomTag('');
    setDate(new Date().toISOString().slice(0, 10));
    setNote('');
  };

  const handleTagChange = (e) => {
    if (e.target.value === 'custom') {
      setTags('');
    } else {
      setTags(e.target.value);
      setCustomTag('');
    }
  };

  return (
    <div className="transaction-form-container">
      <h2 className="form-title">NEW INCOME</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tags-container">
            <select id="tags" value={tags} onChange={handleTagChange} className="tags-select">
              <option value="">Select a tag</option>
              {incomeTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {tags === '' && (
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Enter custom tag"
                className="custom-tag-input"
              />
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            placeholder="Add a note for this income"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="2"
          />
        </div>
        <button type="submit" className="submit-button">
          Add Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;