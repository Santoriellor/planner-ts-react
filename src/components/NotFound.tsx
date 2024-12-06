import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }
  return (
    <div>
        <h3>Page not found</h3>
        <p onClick={goToHome} style={{ cursor: "Pointer" }}>Click here to go back Home</p>
    </div>
  )
}

export default NotFound