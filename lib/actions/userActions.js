export const FETCH_USERS = 'FETCH_USERS';

export const fetchUsers = () => {
    return async (dispatch) => {
        const response = await fetch('/api/users'); 
        const data = await response.json();
        dispatch({ type: FETCH_USERS, payload: data });
    };
}; 