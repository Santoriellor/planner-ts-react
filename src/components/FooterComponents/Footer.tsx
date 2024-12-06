import './Footer.css';

const Footer = () => {
  const date = new Date();

  return (
    <footer>&copy; {date.getFullYear()} Family Planner App</footer>
  )
}

export default Footer