import { useState, useRef, useEffect } from "react";
import './ViewPicker.css';

import { useDateView } from '../../contexts/DateViewContext';

const ViewPicker = () => {
  const { setViewType, setActiveView } = useDateView();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Handle changing views
  const handleViewChange = (view: string) => {
    setDropdownOpen(false);
    setViewType(view);
    setActiveView(`/view${view}`);
  };
  
  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <div className="view-picker" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        title="Choose a period"
        className="view-picker-button"
        aria-label="View options">
        <img src="./src/assets/choice_icon.png" width="24px" alt="View Picker" />
      </button>

      {isDropdownOpen && (
        <div className="view-picker-dropdown">
          <button 
            onClick={() => handleViewChange('Day')} 
            title="Daily"
            className="view-picker-item" 
            aria-label="Day view"
          >
            <img src="./src/assets/day_icon.png" width="32px" alt="Day View" />
          </button>
          <button 
            onClick={() => handleViewChange('Week')} 
            title="Weekly"
            className="view-picker-item" 
            aria-label="Week view"
          >
            <img src="./src/assets/week_icon.png" width="32px" alt="Week View" />
          </button>
          <button 
            onClick={() => handleViewChange('Month')} 
            title="Monthly"
            className="view-picker-item" 
            aria-label="Month view"
          >
            <img src="./src/assets/month_icon.png" width="32px" alt="Month View" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ViewPicker