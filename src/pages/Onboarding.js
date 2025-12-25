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
    backgroundColor: '#f5f5f5',
    padding: 'clamp(1rem, 4vw, 2rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    maxWidth: '600px',
    width: '100%',
    boxSizing: 'border-box'
  },
  progress: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    transition: 'width 0.3s ease'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    marginBottom: '0.5rem',
    wordWrap: 'break-word'
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  stepContent: {
    minHeight: 'auto'
  },
  stepTitle: {
    color: '#34495e',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
    wordWrap: 'break-word'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px', /* Prevents zoom on iOS */
    boxSizing: 'border-box',
    minHeight: '44px'
  },
  select: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px', /* Prevents zoom on iOS */
    boxSizing: 'border-box',
    backgroundColor: 'white',
    minHeight: '44px'
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
    border: '2px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '150px'
  },
  radio: {
    marginRight: '0.5rem'
  },
  radioText: {
    fontSize: '1rem'
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
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '0.5rem',
    width: '18px',
    height: '18px'
  },
  checkboxText: {
    fontSize: '0.95rem'
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none'
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#3498db'
  },
  textarea: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px', /* Prevents zoom on iOS */
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    minHeight: '80px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  backBtn: {
    flex: '1',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: 'bold',
    cursor: 'pointer',
    minHeight: '44px'
  },
  nextBtn: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 'clamp(1.5rem, 4vw, 2rem)',
    minHeight: '44px'
  },
  submitBtn: {
    flex: '1',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: 'bold',
    cursor: 'pointer',
    minHeight: '44px'
  }
};

export default Onboarding;