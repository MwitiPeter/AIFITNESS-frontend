import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../utils/api';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: { value: '', unit: 'cm' },
    weight: { value: '', unit: 'kg' },
    fitnessLevel: '',
    fitnessGoals: [],
    injuries: '',
    medicalConditions: '',
    workoutDuration: 30,
    workoutsPerWeek: 3,
    equipment: []
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(value)) {
        return {
          ...prev,
          [field]: array.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...array, value]
        };
      }
    });
  };

  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      if (!formData.age || !formData.gender || !formData.height.value || !formData.weight.value) {
        setError('Please fill in all fields');
        return;
      }
    }
    if (step === 2) {
      if (!formData.fitnessLevel || formData.fitnessGoals.length === 0) {
        setError('Please select your fitness level and at least one goal');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.equipment.length === 0) {
      setError('Please select at least one equipment option');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        ...formData,
        age: parseInt(formData.age),
        height: {
          value: parseFloat(formData.height.value),
          unit: formData.height.unit
        },
        weight: {
          value: parseFloat(formData.weight.value),
          unit: formData.weight.unit
        },
        workoutDuration: parseInt(formData.workoutDuration),
        workoutsPerWeek: parseInt(formData.workoutsPerWeek)
      };

      await profileAPI.createProfile(profileData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.progress}>
          <div style={{...styles.progressBar, width: `${(step / 3) * 100}%`}}></div>
        </div>

        <h2 style={styles.title}>Let's Get to Know You</h2>
        <p style={styles.subtitle}>Step {step} of 3</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>📋 Basic Information</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Height</label>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    value={formData.height.value}
                    onChange={(e) => handleNestedChange('height', 'value', e.target.value)}
                    style={{...styles.input, width: '70%'}}
                    placeholder="170"
                  />
                  <select
                    value={formData.height.unit}
                    onChange={(e) => handleNestedChange('height', 'unit', e.target.value)}
                    style={{...styles.select, width: '28%'}}
                  >
                    <option value="cm">cm</option>
                    <option value="inches">inches</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Weight</label>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    value={formData.weight.value}
                    onChange={(e) => handleNestedChange('weight', 'value', e.target.value)}
                    style={{...styles.input, width: '70%'}}
                    placeholder="70"
                  />
                  <select
                    value={formData.weight.unit}
                    onChange={(e) => handleNestedChange('weight', 'unit', e.target.value)}
                    style={{...styles.select, width: '28%'}}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <button type="button" onClick={nextStep} style={styles.nextBtn}>
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Fitness Details */}
          {step === 2 && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>💪 Fitness Details</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fitness Level</label>
                <div style={styles.radioGroup}>
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="fitnessLevel"
                        value={level}
                        checked={formData.fitnessLevel === level}
                        onChange={handleChange}
                        style={styles.radio}
                      />
                      <span style={styles.radioText}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fitness Goals (select all that apply)</label>
                <div style={styles.checkboxGroup}>
                  {[
                    { value: 'weight_loss', label: 'Weight Loss' },
                    { value: 'muscle_gain', label: 'Muscle Gain' },
                    { value: 'general_fitness', label: 'General Fitness' },
                    { value: 'endurance', label: 'Endurance' },
                    { value: 'flexibility', label: 'Flexibility' },
                    { value: 'strength', label: 'Strength' }
                  ].map(goal => (
                    <label key={goal.value} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.fitnessGoals.includes(goal.value)}
                        onChange={() => handleCheckboxChange('fitnessGoals', goal.value)}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkboxText}>{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Workout Duration (minutes)</label>
                <input
                  type="range"
                  name="workoutDuration"
                  value={formData.workoutDuration}
                  onChange={handleChange}
                  min="15"
                  max="90"
                  step="15"
                  style={styles.slider}
                />
                <div style={styles.sliderValue}>{formData.workoutDuration} minutes</div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Workouts Per Week</label>
                <input
                  type="range"
                  name="workoutsPerWeek"
                  value={formData.workoutsPerWeek}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  step="1"
                  style={styles.slider}
                />
                <div style={styles.sliderValue}>{formData.workoutsPerWeek} days/week</div>
              </div>

              <div style={styles.buttonGroup}>
                <button type="button" onClick={prevStep} style={styles.backBtn}>
                  ← Back
                </button>
                <button type="button" onClick={nextStep} style={styles.nextBtn}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Equipment & Medical */}
          {step === 3 && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>🏋️ Equipment & Health</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available Equipment</label>
                <div style={styles.checkboxGroup}>
                  {[
                    { value: 'none', label: 'No Equipment (Bodyweight)' },
                    { value: 'dumbbells', label: 'Dumbbells' },
                    { value: 'barbell', label: 'Barbell' },
                    { value: 'resistance_bands', label: 'Resistance Bands' },
                    { value: 'pull_up_bar', label: 'Pull-up Bar' },
                    { value: 'gym_access', label: 'Full Gym Access' }
                  ].map(equip => (
                    <label key={equip.value} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(equip.value)}
                        onChange={() => handleCheckboxChange('equipment', equip.value)}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkboxText}>{equip.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Any Injuries or Limitations? (Optional)</label>
                <textarea
                  name="injuries"
                  value={formData.injuries}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="e.g., Lower back pain, knee injury..."
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Medical Conditions? (Optional)</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="e.g., Asthma, diabetes..."
                  rows="3"
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="button" onClick={prevStep} style={styles.backBtn}>
                  ← Back
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Creating Profile...' : 'Complete Setup ✓'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7a5f 50%, #1a5f4a 75%, #0f4c3a 100%)',
    padding: 'clamp(1rem, 4vw, 2rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    maxWidth: '650px',
    width: '100%',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  progress: {
    width: '100%',
    height: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
    transition: 'width 0.3s ease',
    borderRadius: '10px'
  },
  title: {
    textAlign: 'center',
    color: '#1a5f4a',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    marginBottom: '0.5rem',
    wordWrap: 'break-word',
    fontWeight: '700'
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
    fontSize: '0.9rem'
  },
  stepContent: {
    minHeight: 'auto'
  },
  stepTitle: {
    color: '#1a5f4a',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
    wordWrap: 'break-word',
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    minHeight: '44px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease'
  },
  select: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    minHeight: '44px',
    transition: 'border-color 0.3s ease'
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem'
  },
  radioGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '150px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease'
  },
  radio: {
    marginRight: '0.5rem'
  },
  radioText: {
    fontSize: '1rem',
    color: '#2c3e50'
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
    gap: 'clamp(0.5rem, 1.5vw, 0.75rem)'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease'
  },
  checkbox: {
    marginRight: '0.5rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxText: {
    fontSize: '0.95rem',
    color: '#2c3e50'
  },
  slider: {
    width: '100%',
    height: '10px',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#e0e0e0'
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#4caf50'
  },
  textarea: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    minHeight: '80px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  backBtn: {
    flex: '1',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#757575',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  nextBtn: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 'clamp(1.5rem, 4vw, 2rem)',
    minHeight: '44px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  },
  submitBtn: {
    flex: '1',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  }
};

export default Onboarding;