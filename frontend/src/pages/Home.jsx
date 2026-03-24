import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://mastersde-api.onrender.com'

const FIELDS = [
  'AI', 'ML', 'Data Science', 'Computer Science',
  'Mechanical Engineering', 'Electrical Engineering',
  'Automotive Engineering', 'Robotics', 'Aerospace Engineering',
  'Chemical Engineering', 'Civil Engineering', 'Biomedical Engineering',
  'Environmental Engineering', 'Materials Science', 'Energy Engineering',
  'Industrial Engineering', 'Mathematics', 'Physics', 'Chemistry',
  'Bioinformatics', 'Photonics', 'Maritime Technology', 'Petroleum Engineering'
]

const BACKGROUNDS = [
  'Computer Science', 'Electrical', 'Mechanical', 'Mathematics',
  'Physics', 'Statistics', 'Automotive', 'Electronics',
  'Aerospace', 'Chemical', 'Civil', 'Biomedical',
  'Environmental', 'Materials', 'Industrial', 'Biology',
  'Chemistry', 'Agricultural', 'Maritime', 'Petroleum'
]
const SOP_OPTIONS = ['weak', 'average', 'strong']

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    gpa: '',
    ielts: '',
    has_research: false,
    work_ex_years: 0,
    backlogs: 0,
    field: 'AI',
    background: 'Computer Science',
    sop_strength: 'average',
    blocked_account: false,
    has_health_insurance: false
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.gpa || !form.ielts) {
      setError('Please enter your GPA and IELTS score.')
      return
    }
    if (form.gpa < 0 || form.gpa > 10) {
      setError('GPA must be between 0 and 10.')
      return
    }
    if (form.ielts < 0 || form.ielts > 9) {
      setError('IELTS must be between 0 and 9.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        gpa: parseFloat(form.gpa),
        ielts: parseFloat(form.ielts),
        work_ex_years: parseInt(form.work_ex_years),
        backlogs: parseInt(form.backlogs)
      }
      const res = await axios.post(`${API}/predict`, payload)
      navigate('/results', { state: { results: res.data, profile: payload } })
    } catch (err) {
      setError('Something went wrong. Make sure your backend is running.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div style={{ background: '#1a56db', padding: '20px 0', marginBottom: '40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}>MastersDE</h1>
          <p style={{ color: '#bfdbfe', fontSize: '14px', marginTop: '4px' }}>
            AI-powered MS admission predictor for German universities
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Enter your profile</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>
            Fill in your academic details to get matched with German universities
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>GPA (out of 10)</label>
              <input
                type="number"
                placeholder="e.g. 7.5"
                value={form.gpa}
                onChange={e => update('gpa', e.target.value)}
                style={inputStyle}
                step="0.1" min="0" max="10"
              />
            </div>
            <div>
              <label style={labelStyle}>IELTS Score (out of 9)</label>
              <input
                type="number"
                placeholder="e.g. 6.5"
                value={form.ielts}
                onChange={e => update('ielts', e.target.value)}
                style={inputStyle}
                step="0.5" min="0" max="9"
              />
            </div>
            <div>
              <label style={labelStyle}>Field of Interest</label>
              <select value={form.field} onChange={e => update('field', e.target.value)} style={inputStyle}>
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Academic Background</label>
              <select value={form.background} onChange={e => update('background', e.target.value)} style={inputStyle}>
                {BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Work Experience (years)</label>
              <input
                type="number"
                value={form.work_ex_years}
                onChange={e => update('work_ex_years', e.target.value)}
                style={inputStyle}
                min="0" max="10"
              />
            </div>
            <div>
              <label style={labelStyle}>Number of Backlogs</label>
              <input
                type="number"
                value={form.backlogs}
                onChange={e => update('backlogs', e.target.value)}
                style={inputStyle}
                min="0" max="20"
              />
            </div>
            <div>
              <label style={labelStyle}>SOP Strength</label>
              <select value={form.sop_strength} onChange={e => update('sop_strength', e.target.value)} style={inputStyle}>
                {SOP_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={checkboxStyle}>
              <input type="checkbox" checked={form.has_research} onChange={e => update('has_research', e.target.checked)} />
              <span>I have research experience</span>
            </label>
            <label style={checkboxStyle}>
              <input type="checkbox" checked={form.blocked_account} onChange={e => update('blocked_account', e.target.checked)} />
              <span>Blocked account ready (11,208 EUR)</span>
            </label>
            <label style={checkboxStyle}>
              <input type="checkbox" checked={form.has_health_insurance} onChange={e => update('has_health_insurance', e.target.checked)} />
              <span>Health insurance arranged</span>
            </label>
          </div>

          {error && (
            <div style={{ marginTop: '20px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '14px',
              background: loading ? '#93c5fd' : '#1a56db',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '10px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Finding your universities...' : 'Find My Universities'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px'
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#1a202c',
  background: '#fff'
}

const checkboxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  color: '#374151',
  cursor: 'pointer'
}