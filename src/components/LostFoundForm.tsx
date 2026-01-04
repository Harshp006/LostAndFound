import { useState, FormEvent } from 'react';

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbwPrGHO6XLvdcK9iWsJOSJGjjpfJCqxXods7ur-XHXLXJiYYA0aEGFrjtdKqjOXzkSh/exec";

const CATEGORIES = [
  "Electronics",
  "Wallet / ID",
  "Keys",
  "Clothing",
  "Jewelry",
  "Bag / Luggage",
  "Documents",
  "Other"
];

export default function LostFoundForm() {
  const [formType, setFormType] = useState<'lost' | 'found'>('lost');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('type', formType);

    // HTML form submission fallback for CORS compatibility
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = API_ENDPOINT;
    tempForm.target = 'hidden-iframe';

    formData.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      tempForm.appendChild(input);
    });

    document.body.appendChild(tempForm);
    tempForm.submit();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      form.reset();
      document.body.removeChild(tempForm);
      document.body.removeChild(iframe);

      setTimeout(() => setIsSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Lost & Found
          </h1>
          <p className="text-muted-foreground text-sm">
            Report a lost or found item
          </p>
        </div>

        <div className="flex gap-2 p-1 rounded-xl mb-8" style={{ background: 'hsl(var(--glass-bg))' }}>
          <button
            type="button"
            onClick={() => setFormType('lost')}
            className={`toggle-option ${formType === 'lost' ? 'toggle-option-active' : ''}`}
          >
            Lost Item
          </button>
          <button
            type="button"
            onClick={() => setFormType('found')}
            className={`toggle-option ${formType === 'found' ? 'toggle-option-active' : ''}`}
          >
            Found Item
          </button>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-lg animate-fade-in" style={{ background: 'hsl(150 60% 40% / 0.2)', border: '1px solid hsl(150 60% 50% / 0.3)' }}>
            <p className="text-center text-sm" style={{ color: 'hsl(150 60% 70%)' }}>
              Your report has been submitted successfully.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">Item Name</label>
            <input
              type="text"
              name="itemName"
              required
              placeholder="e.g., Black leather wallet"
              className="input-glass"
            />
          </div>

          <div>
            <label className="label-text">Category</label>
            <select name="category" required className="input-glass cursor-pointer">
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Date</label>
              <input
                type="date"
                name="date"
                required
                className="input-glass"
              />
            </div>
            <div>
              <label className="label-text">Location</label>
              <input
                type="text"
                name="location"
                required
                placeholder="Where?"
                className="input-glass"
              />
            </div>
          </div>

          <div>
            <label className="label-text">Your Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Full name"
              className="input-glass"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className="input-glass"
              />
            </div>
            <div>
              <label className="label-text">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Optional"
                className="input-glass"
              />
            </div>
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Additional details about the item..."
              className="input-glass resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Submitting...
              </>
            ) : (
              `Report ${formType === 'lost' ? 'Lost' : 'Found'} Item`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
