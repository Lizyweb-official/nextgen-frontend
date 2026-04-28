import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext"

function DeliveryPanel(){
    const { user } = useAuth();
    const { logout } = useAuth();


    if (user) {
        return (
            <>
                <h1>Logged in as {user.name}</h1>;
                <button onClick={logout}>Logout</button>;
            </>)
    } else {
        return <h1>Please login</h1>;
    }
}

export default DeliveryPanel;