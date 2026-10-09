'use client';

import { useState } from 'react';
import { FileText, Copy, Download, Loader2, Scale } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    docType: 'Non-Disclosure Agreement (NDA)',
    jurisdiction: 'California, USA',
    partyA: '',
    partyB: '',
    details: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      alert('Failed to generate document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.docType.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Legal<span className="text-blue-500">Ease</span>
          </h1>
        </div>
        <p className="text-sm text-slate-400">AI-Powered Legal Drafting Assistant</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Document Configuration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Document Type</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
              >
                <option>Non-Disclosure Agreement (NDA)</option>
                <option>Independent Contractor Agreement</option>
                <option>Residential Lease Agreement</option>
                <option>Service Level Agreement (SLA)</option>
                <option>Cease and Desist Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Jurisdiction / Location</label>
              <input
                type="text"
                placeholder="e.g. California, USA or United Kingdom"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Party A (Disclosing/Landlord)</label>
                <input
                  type="text"
                  required
                  placeholder="Full name or company"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.partyA}
                  onChange={(e) => setFormData({ ...formData, partyA: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Party B (Receiving/Tenant)</label>
                <input
                  type="text"
                  required
                  placeholder="Full name or company"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.partyB}
                  onChange={(e) => setFormData({ ...formData, partyB: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Key Terms & Details</label>
              <textarea
                rows={4}
                required
                placeholder="Provide details: payment terms, duration, effective date, specific obligations, etc."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating Document...
                </>
              ) : (
                'Generate Legal Document'
              )}
            </button>
          </form>
        </section>

        {/* Output Section */}
        <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Generated Draft</h2>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                  title="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadTxt}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg p-4 overflow-y-auto max-h-[500px] whitespace-pre-wrap text-sm text-slate-300 font-mono">
            {result ? (
              result
            ) : (
              <p className="text-slate-500 italic text-center my-auto">
                Fill out the configuration form and click "Generate" to see the document here.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}