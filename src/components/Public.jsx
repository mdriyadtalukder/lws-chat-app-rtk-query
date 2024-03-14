import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const Public = ({ children }) => {
    const isLoggin = useAuth();
    return !isLoggin ? children : <Navigate to='/inbox'></Navigate>
};

export default Public;