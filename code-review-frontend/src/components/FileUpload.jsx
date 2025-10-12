import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import './FileUpload.css';
import AdvancedLoader from './AdvancedLoader';
import ComplexityGraph from './ComplexityGraph';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define the steps and their timings for the loader
const analysisSteps = [
  "Parsing your code...",
  "Calculating complexity...",
  "Checking for vulnerabilities...",
  "Generating summary...",
  "Finalizing report..."
];
const TOTAL_COSMETIC_DURATION = 3000; // 3 seconds total
const cosmeticStepsCount = analysisSteps.length - 1; // The first 4 steps are cosmetic
const STEP_INTERVAL = TOTAL_COSMETIC_DURATION / cosmeticStepsCount; // e.g., 3000ms / 4 steps = 750ms per step

const MIN_FINAL_STEP_DURATION = 1500; // Final step shows for at least 1.5 seconds

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const { getToken } = useAuth();

  // The useEffect hook has been removed to prevent timing conflicts.
  // handleSubmit now controls the entire animation.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    
    setLoadingStep(0);
    setIsLoading(true);
    setResult(null);

    try {
      // 1. Start the API fetch promise immediately so it runs in the background.
      const apiPromise = fetch(`${backendUrl}/review-code`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
        body: new FormData(e.target),
      });

      // 2. Animate the cosmetic steps over exactly 3 seconds.
      const cosmeticAnimation = async () => {
        for (let i = 1; i < cosmeticStepsCount; i++) {
          await new Promise(resolve => setTimeout(resolve, STEP_INTERVAL));
          setLoadingStep(i);
        }
      };
      
      // We start the animation but also create a promise that waits the full 3 seconds.
      const animationPromise = cosmeticAnimation();
      const totalCosmeticWaitPromise = new Promise(resolve => setTimeout(resolve, TOTAL_COSMETIC_DURATION));
      await Promise.all([animationPromise, totalCosmeticWaitPromise]);


      // 3. Manually advance to the final "Finalizing report..." step.
      setLoadingStep(analysisSteps.length - 1);
      
      // 4. Create a promise that enforces a minimum display time for this final step.
      const minFinalStepTimePromise = new Promise(resolve => setTimeout(resolve, MIN_FINAL_STEP_DURATION));

      // 5. Wait for BOTH the API call to finish AND the minimum display time to pass.
      const [apiResponse] = await Promise.all([apiPromise, minFinalStepTimePromise]);

      if (!apiResponse.ok) {
        throw new Error(`Server responded with ${apiResponse.status}`);
      }
      const data = await apiResponse.json();
      setResult(data);

    } catch (err){
      console.error(err);
      alert("Error uploading file. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (All other functions: getComplexityClass, factorial, generatePlotData, useMemo remain the same)
  const getComplexityClass = (str) => { if (!str) return "O(1)"; if (/(n!)/i.test(str)) return "O(n!)"; if (/(2\^n)/i.test(str)) return "O(2^n)"; if (/(n\^2)/i.test(str)) return "O(n^2)"; if (/n\s*\*?\s*log\s*\*?\s*n/i.test(str)) return "O(n log n)"; if (/n\s*\*?\s*l/i.test(str)) return "O(N * L)"; if (/(n)/i.test(str)) return "O(n)"; if (/(log\s*\*?\s*n)/i.test(str)) return "O(log n)"; if (/(1)/.test(str)) return "O(1)"; return "O(1)"; };
  const factorial = (num) => { if (num < 0) return Infinity; if (num === 0) return 1; let result = 1; for (let i = 2; i <= num; i++) result *= i; return result; };
  const generatePlotData = (complexityClass) => { const data = []; const L = 10; for (let n = 0; n <= 100; n += 5) { let operations = 0; switch (complexityClass) { case "O(n!)": operations = n <= 15 ? factorial(n / 2) : Infinity; break; case "O(2^n)": operations = Math.pow(2, n / 10); break; case "O(n^2)": operations = n * n; break; case "O(n log n)": operations = n > 0 ? n * Math.log2(n) : 0; break; case "O(N * L)": operations = n * L; break; case "O(n)": operations = n; break; case "O(log n)": operations = n > 0 ? Math.log2(n) : 0; break; default: operations = 1; } data.push({ "Input Size (N)": n, "Operations": operations }); } return data; };
  const { timeData, spaceData, timeClass, spaceClass } = useMemo(() => { if (!result) return { timeData: [], spaceData: [], timeClass: '', spaceClass: '' }; const tc = getComplexityClass(result["Time Complexity"]); const sc = getComplexityClass(result["Space Complexity"]); return { timeData: generatePlotData(tc), spaceData: generatePlotData(sc), timeClass: tc, spaceClass: sc }; }, [result]);

  return (
    <div className="file-upload-container card">
      <div style={{ position: 'relative' }}> 
        {isLoading && <AdvancedLoader steps={analysisSteps} currentStep={loadingStep} />}

        <div className="upload-header">
          <h2>Upload Your Code for Review</h2>
          <p>Get instant feedback, complexity analysis, and suggestions for improvement.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="upload-form">
            <label className="custom-file-input">
              {file ? file.name : "Choose File"}
              <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} required />
            </label>
            <button type="submit" className="btn" disabled={isLoading}>Review Code</button>
          </div>
        </form>

        {result && (
          <div className="results-container">
            <div className="result-section">
              <h3>Code Review Summary</h3>
              <p><strong>Language Detected:</strong> {result["Language Detected"]}</p>
              <p>{result["Summary"]}</p>
            </div>
            <div className="result-section">
              <h3>Corrected Code</h3>
              <pre className="code-block">{result["Correct Code"]}</pre>
            </div>
            <div className="feedback-grid">
              <div className="result-section">
                <h3 className="feedback-title positive">Positive Feedback</h3>
                <ul className="feedback-list positive">
                  {result["Positive Feedback"]?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div className="result-section">
                <h3 className="feedback-title critical">Critical Issues</h3>
                {result["Critical issues"]?.length > 0 ? (
                  <ul className="feedback-list critical">
                    {result["Critical issues"].map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                ) : (
                  <div className="empty-feedback">
                    <span className="empty-feedback-icon">✅</span>
                    <p>Great job! No critical issues were detected.</p>
                  </div>
                )}
              </div>
              <div className="result-section">
                <h3 className="feedback-title suggestions">Suggestions for Improvement</h3>
                <ul className="feedback-list suggestions">
                  {result["Suggestions for improvement"]?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div className="result-section">
                <h3 className="feedback-title security">Security Vulnerabilities</h3>
                {result["Security Vulnerabilities"]?.length > 0 ? (
                  <ul className="feedback-list security">
                    {result["Security Vulnerabilities"].map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                ) : (
                  <div className="empty-feedback">
                    <span className="empty-feedback-icon">🛡️</span>
                    <p>Excellent! No security vulnerabilities were found.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="result-section">
              <h3>Complexity Analysis 📈</h3>
              <p>An illustrative graph showing the growth rate based on the detected worst-case complexity.</p>
              <ComplexityGraph
                data={timeData}
                dataKey="Operations"
                yAxisLabel="Time Complexity"
                strokeColor="var(--primary-color)"
                gradientId="timeGradient"
                gradientColor="var(--primary-color)"
                name={timeClass}
              />
              <ComplexityGraph
                data={spaceData}
                dataKey="Operations"
                yAxisLabel="Space Complexity"
                strokeColor="var(--secondary-color)"
                gradientId="spaceGradient"
                gradientColor="var(--secondary-color)"
                name={spaceClass}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}