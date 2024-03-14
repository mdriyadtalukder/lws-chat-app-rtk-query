import useAuth from '../hook/useAuth';
import { Navigate } from 'react-router-dom';

const Private = ({ children }) => {
    const isLoggin = useAuth();
    return isLoggin ? children : <Navigate to='/'></Navigate>
};

export default Private;