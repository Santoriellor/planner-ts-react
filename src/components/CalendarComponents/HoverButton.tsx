import { useState } from 'react';
import './HoverButton.css';
import { useModalContext } from '../../contexts/ModalContext';

type HoverButtonProps = {
    day: Date,
    hour?: number
  }

const HoverButton = ({ day, hour }: HoverButtonProps) => {
  const { openModal } = useModalContext();

  const [buttonText, setButtonText] = useState('');

  const handleAddEvent = () => {
    // Create a new Date object based on the formattedDate and the clicked hour
    const eventDateTime = new Date(day);
    if (hour) {
      eventDateTime.setHours(hour, 0, 0, 0); // Set the hour, and reset minutes, seconds, and milliseconds
    }
    openModal(eventDateTime);
  };

  return (
    <button
        type='button'
        className='hover-button' 
        onMouseOver={() => setButtonText('+')} 
        onMouseOut={() => setButtonText('')}
        onClick={handleAddEvent}
    >
      {buttonText}
    </button>
  );
};

export default HoverButton;