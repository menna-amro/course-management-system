import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Student"
  });
  const [showUsernameTooltip, setShowUsernameTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [submitError, setSubmitError] = useState(""); 
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) errors.push('lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('UPPERCASE letter');
    if (!/\d/.test(password)) errors.push('number');
    if (!/[@$!%*?&]/.test(password)) errors.push('special character');
    if (password.length < 8) errors.push('at least 8 characters');
    return errors;
  };

  const usernameValid = formData.username.length >= 3;
  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_])[A-Za-z\d!@#$%^&*?_]{8,}$/.test(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const response = await register(formData);
      setSubmitError("User registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      // Backend error handling
      // Smart error categorization
      let usernameError = "";
      let passwordError = "";
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          if (data.toLowerCase().includes('user') || data.toLowerCase().includes('username')) {
            usernameError = "Username already exists";
          } else {
            passwordError = data;
          }
        } else if (Array.isArray(data)) {
          const errors = data.map(e => e.description || String(e)).filter(Boolean);
          usernameError = errors.find(e => e.toLowerCase().includes('user') || e.toLowerCase().includes('name')) || "";
          passwordError = errors.find(e => e.toLowerCase().includes('password') || e.toLowerCase().includes('validat')) || errors.join('. ');
        } else if (data.message) {
          const msg = data.message.toLowerCase();
          if (msg.includes('user') || msg.includes('username')) {
            usernameError = "Username already exists";
          } else {
            passwordError = data.message;
          }
        }
      }
      
      let errorMsg = "";
      if (usernameError && passwordError) {
        errorMsg = `Username: ${usernameError}. Password must contain uppercase letter, lowercase letter, number, special character (@$!%*?&), at least 8 chars.`;
      } else if (usernameError) {
        errorMsg = `Username: ${usernameError}`;
      } else if (passwordError) {
        errorMsg = passwordError || "Password must contain uppercase letter, lowercase letter, number, special character (@$!%*?&), at least 8 chars.";
      } else {
        errorMsg = "Registration failed. Check username and password requirements.";
      }
      setSubmitError(errorMsg);
      setTimeout(() => setSubmitError(""), 6000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <label className="field-label">
            <span className="label-text">
              Username 
              <button 
                type="button"
                className="info-icon"
                onMouseEnter={() => setShowUsernameTooltip(true)}
                onMouseLeave={() => setShowUsernameTooltip(false)}
                onClick={() => setShowUsernameTooltip(!showUsernameTooltip)}
                onBlur={() => setTimeout(() => setShowUsernameTooltip(false), 200)}
                aria-label="Username requirements"
              >
                ℹ️
              </button>
            </span>
            {showUsernameTooltip && (
              <div className="validation-tooltip">
                <div>USERNAME REQUIREMENTS:</div>
                <div>• At least 3 characters</div>
                <div className={`req-badge ${usernameValid ? 'valid' : 'invalid'}`}>
                  {usernameValid ? '✅ Length OK' : `❌ Length ${formData.username.length}/3`}
                </div>
              </div>
            )}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={usernameValid ? 'valid' : 'invalid'}
              required
            />
          </label>

          <label className="field-label">
            <span className="label-text">
              Password 
              <button 
                type="button"
                className="info-icon"
                onMouseEnter={() => setShowPasswordTooltip(true)}
                onMouseLeave={() => setShowPasswordTooltip(false)}
                onClick={() => setShowPasswordTooltip(!showPasswordTooltip)}
                onBlur={() => setTimeout(() => setShowPasswordTooltip(false), 200)}
                aria-label="Password requirements"
              >
                ℹ️
              </button>
            </span>
            {showPasswordTooltip && (
              <div className="validation-tooltip">
                <div>PASSWORD REQUIREMENTS:</div>
                <div>• At least 8 characters</div>
                <div>• Uppercase letter</div>
                <div>• Lowercase letter</div>
                <div>• Number</div>
                <div>• Special char (!@#$%^&*_)</div>
                <div className={`req-badge ${passwordValid ? 'valid' : 'invalid'}`}>
                  {passwordValid ? '✅ All requirements met' : '❌ Missing requirements'}
                </div>
              </div>
            )}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={passwordValid ? 'valid' : 'invalid'}
              required
            />
          </label>

          <label>
            Role
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </label>

          <button 
            className="button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

{submitError && <p className={submitError.includes("successfully") ? "success error" : "error"}>{submitError}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;