import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://127.0.0.1:8000'

const tierColors = {
  Safe:      { bg: '#f0fdf4', border: '#86efac', badge: '#16a34a', text: '#15803d' },
  Target:    { bg: '#eff6ff', border: '#93c5fd', badge: '#1a56db', text: '#1d4ed8' },
  Ambitious: { bg: '#fff7ed', border: '#fdba74', badge: '#ea580c', text: '#c2410c' }
}

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { results, profile } = state || {}
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [aiAdvice, setAiAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [selectedUni, setSelectedUni] = useState(null)
  const [uniAdvice, setUniAdvice] = useState('')
  const [uniLoading, setUniLoading] = useState(false)

  if (!results || !profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>No results found.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 20px', background: '#1a56db', color: '#fff', borderRadius: '8px' }}>
          Go Back
        </button>
      </div>
    )
  }

  const totalUnis = results.safe.length + results.target.length + results.ambitious.length

  const handleAnalyze = async () => {
    setAdviceLoading(true)
    try {
      const res = await axios.post(`${API}/analyze`, {
        student: profile,
        matched_universities: results
      })
      setAiAdvice(res.data.advice)
    } catch {
      setAiAdvice('Failed to get AI advice. Please try again.')
    }
    setAdviceLoading(false)
  }

  const handleUniAdvice = async (uniName) => {
    setSelectedUni(uniName)
    setUniAdvice('')
    setUniLoading(true)
    try {
      const res = await axios.post(`${API}/university-advice`, {
        university_name: uniName,
        student: profile
      })
      setUniAdvice(res.data.advice)
    } catch {
      setUniAdvice('Failed to get advice. Please try again.')
    }
    setUniLoading(false)
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    const question = chatInput
    setChatInput('')
    setChatHistory(prev => [...prev, { role: 'user', text: question }])
    setChatLoading(true)
    try {
      const res = await axios.post(`${API}/chat`, {
        question,
        student_context: {
          gpa: profile.gpa,
          ielts: profile.ielts,
          field: profile.field,
          background: profile.background
        }
      })
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.answer }])
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Try again.' }])
    }
    setChatLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div style={{ background: '#1a56db', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>MastersDE</h1>
            <p style={{ color: '#bfdbfe', fontSize: '13px' }}>Your results are ready</p>
          </div>
          <button onClick={() => navigate('/')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}>
            New Search
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 60px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Safe', count: results.safe.length, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Target', count: results.target.length, color: '#1a56db', bg: '#eff6ff' },
            { label: 'Ambitious', count: results.ambitious.length, color: '#ea580c', bg: '#fff7ed' }
          ].map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: item.color }}>{item.count}</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{item.label} universities</div>
            </div>
          ))}
        </div>

        {['safe', 'target', 'ambitious'].map(tier => {
          const unis = results[tier]
          if (unis.length === 0) return null
          const colors = tierColors[tier.charAt(0).toUpperCase() + tier.slice(1)]
          return (
            <div key={tier} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', textTransform: 'capitalize' }}>
                {tier} Universities
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {unis.map(uni => (
                  <div key={uni.name} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.badge}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{uni.name}</h3>
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: colors.bg, color: colors.text, borderRadius: '20px', fontWeight: '500' }}>
                            {uni.tier}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                          {uni.city} · Rank #{uni.ranking} · {uni.tuition === 0 ? 'No tuition fee' : `${uni.tuition.toLocaleString()} EUR/year`}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Winter: {uni.winter_deadline} · Summer: {uni.summer_deadline}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                          {uni.specializations.map(s => (
                            <span key={s} style={{ fontSize: '11px', padding: '2px 8px', background: '#f3f4f6', color: '#374151', borderRadius: '20px' }}>{s}</span>
                          ))}
                        </div>
                        {uni.notes && (
                          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>{uni.notes}</p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: colors.badge }}>{uni.match_score}%</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>match</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                          <a href={uni.application_portal} target="_blank" rel="noreferrer"
                            style={{ fontSize: '12px', padding: '6px 12px', background: '#1a56db', color: '#fff', borderRadius: '6px', textDecoration: 'none', textAlign: 'center' }}>
                            Apply
                          </a>
                          <button onClick={() => handleUniAdvice(uni.name)}
                            style={{ fontSize: '12px', padding: '6px 12px', background: '#f3f4f6', color: '#374151', borderRadius: '6px' }}>
                            AI Advice
                          </button>
                        </div>
                      </div>
                    </div>
                    {selectedUni === uni.name && (
                      <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {uniLoading ? 'Getting AI advice...' : uniAdvice}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>AI Profile Analysis</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Get personalized advice on your profile strengths, weaknesses and what to do next
          </p>
          {!aiAdvice ? (
            <button onClick={handleAnalyze} disabled={adviceLoading}
              style={{ padding: '12px 24px', background: adviceLoading ? '#93c5fd' : '#1a56db', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
              {adviceLoading ? 'Analyzing your profile...' : 'Analyze My Profile'}
            </button>
          ) : (
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {aiAdvice}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Ask MastersDE AI</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Ask anything about studying in Germany — visa, APS, scholarships, deadlines
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto', marginBottom: '16px' }}>
            {chatHistory.length === 0 && (
              <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
                Try asking: "What is the APS certificate?" or "How much money do I need for a blocked account?"
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                lineHeight: '1.6',
                background: msg.role === 'user' ? '#eff6ff' : '#f9fafb',
                color: msg.role === 'user' ? '#1d4ed8' : '#374151',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div style={{ padding: '12px 16px', background: '#f9fafb', borderRadius: '10px', fontSize: '14px', color: '#9ca3af' }}>
                Thinking...
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChat()}
              placeholder="Ask anything about Germany MS admissions..."
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
            />
            <button onClick={handleChat} disabled={chatLoading}
              style={{ padding: '10px 20px', background: '#1a56db', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
