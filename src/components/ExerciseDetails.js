import React, { useState } from 'react';

const ExerciseDetails = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse the instructions to extract detailed sections
  const parseInstructions = (instructions) => {
    if (!instructions) return null;

    const sections = {
      steps: [],
      muscles: '',
      doThis: '',
      avoid: '',
      breathing: '',
      easier: '',
      harder: '',
      safety: ''
    };

    // Extract sections using markers
    if (instructions.includes('📋 STEPS:')) {
      const stepsSection = instructions.split('📋 STEPS:')[1];
      if (stepsSection) {
        // Extract all numbered steps (1), 2), 3), etc. or 1. 2. 3. etc.)
        const stepMatches = stepsSection.match(/\d+[\.)]\s+[^0-9]+/g);
        if (stepMatches && stepMatches.length > 0) {
          sections.steps = stepMatches.map(step => step.replace(/^\d+[\.)]\s+/, '').trim());
        } else {
          // Fallback: split by periods and filter out empty strings
          const allSteps = stepsSection.split(/\.\s*(?=\d+[\.)])|\.\s*(?=💪|🫁|✅|❌|⚡|🔥|⚠)/);
          sections.steps = allSteps
            .filter(step => step.trim() && !step.match(/^(💪|🫁|✅|❌|⚡|🔥|⚠)/))
            .map(step => step.trim())
            .filter(step => step.length > 0);
        }
      }
    }
    if (instructions.includes('💪 MUSCLES:')) {
      sections.muscles = instructions.match(/💪 MUSCLES:([^.]*)/)?.[1] || '';
    }
    if (instructions.includes('🫁 BREATHING:')) {
      sections.breathing = instructions.match(/🫁 BREATHING:([^.]*)/)?.[1] || '';
    }
    if (instructions.includes('✅ DO:')) {
      sections.doThis = instructions.match(/✅ DO:([^.]*)/)?.[1] || '';
    }
    if (instructions.includes('❌ AVOID:')) {
      sections.avoid = instructions.match(/❌ AVOID:([^.]*)/)?.[1] || '';
    }

    return sections;
  };

  // Get step-by-step instructions - prioritize stepByStep array if available
  const getStepByStepInstructions = () => {
    if (exercise.stepByStep && Array.isArray(exercise.stepByStep) && exercise.stepByStep.length > 0) {
      return exercise.stepByStep;
    }
    const sections = parseInstructions(exercise.instructions);
    return sections?.steps || [];
  };

  const stepByStepList = getStepByStepInstructions();
  const sections = parseInstructions(exercise.instructions);

  return (
    <div style={styles.container}>
      {/* Quick Summary - Always Visible */}
      <div style={styles.summary}>
        <div style={styles.basicInfo}>
          <span style={styles.sets}>
            <strong>{exercise.sets}</strong> sets
          </span>
          <span style={styles.reps}>
            <strong>{exercise.reps}</strong> reps
          </span>
          {exercise.restTime && (
            <span style={styles.rest}>
              Rest: <strong>{exercise.restTime}s</strong>
            </span>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.expandBtn}
          title={isExpanded ? "Hide details" : "Show full instructions"}
        >
          {isExpanded ? '▲ Hide Details' : '▼ Show Full Instructions'}
        </button>
      </div>

      {/* Detailed Instructions - Expandable */}
      {isExpanded && sections && (
        <div style={styles.details}>
          {/* Step-by-Step */}
          {stepByStepList.length > 0 && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📋 Step-by-Step Instructions</h4>
              <ol style={styles.stepsList}>
                {stepByStepList.map((step, index) => (
                  <li key={index} style={styles.stepItem}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Muscles Worked */}
          {sections.muscles && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>💪 Primary Muscles Worked</h4>
              <p style={styles.sectionContent}>{sections.muscles.trim()}</p>
            </div>
          )}

          {/* Correct Form */}
          {sections.doThis && (
            <div style={{...styles.section, ...styles.successSection}}>
              <h4 style={styles.sectionTitle}>✅ Do This (Correct Form)</h4>
              <p style={styles.sectionContent}>{sections.doThis.trim()}</p>
            </div>
          )}

          {/* Common Mistakes */}
          {sections.avoid && (
            <div style={{...styles.section, ...styles.warningSection}}>
              <h4 style={styles.sectionTitle}>❌ Avoid This (Common Mistakes)</h4>
              <p style={styles.sectionContent}>{sections.avoid.trim()}</p>
            </div>
          )}

          {/* Breathing */}
          {sections.breathing && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>🫁 Breathing Technique</h4>
              <p style={styles.sectionContent}>{sections.breathing.trim()}</p>
            </div>
          )}

          {/* Modifications */}
          <div style={styles.modificationsGrid}>
            {exercise.easierVersion && (
              <div style={{...styles.modCard, ...styles.easierCard}}>
                <h5 style={styles.modTitle}>⚡ Easier Version</h5>
                <p style={styles.modText}>{exercise.easierVersion}</p>
              </div>
            )}
            {exercise.harderVersion && (
              <div style={{...styles.modCard, ...styles.harderCard}}>
                <h5 style={styles.modTitle}>🔥 Harder Version</h5>
                <p style={styles.modText}>{exercise.harderVersion}</p>
              </div>
            )}
          </div>

          {/* Safety Note */}
          {exercise.safetyNote && (
            <div style={{...styles.section, ...styles.safetySection}}>
              <h4 style={styles.sectionTitle}>⚠️ Safety Note</h4>
              <p style={styles.sectionContent}>{exercise.safetyNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '0.75rem',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '0.75rem'
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  basicInfo: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  sets: {
    color: '#555',
    fontSize: '0.9rem'
  },
  reps: {
    color: '#555',
    fontSize: '0.9rem'
  },
  rest: {
    color: '#555',
    fontSize: '0.9rem'
  },
  expandBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  details: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    animation: 'slideDown 0.3s ease-out'
  },
  section: {
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  },
  successSection: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #4caf50'
  },
  warningSection: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ff9800'
  },
  safetySection: {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336'
  },
  sectionTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  sectionContent: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: '1.6'
  },
  stepsList: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: '1.8'
  },
  stepItem: {
    marginBottom: '0.5rem',
    paddingLeft: '0.5rem'
  },
  modificationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  modCard: {
    padding: '1rem',
    borderRadius: '6px',
    border: '2px solid'
  },
  easierCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3'
  },
  harderCard: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336'
  },
  modTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  modText: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: '1.5'
  }
};

// Add slide down animation
const styleSheet = document.styleSheets[0];
try {
  const keyframes = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animation may already exist
}

export default ExerciseDetails;