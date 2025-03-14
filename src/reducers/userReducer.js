import { FETCH_USERS } from '../actions/userActions';

const initialState = {
    admin: [],
    tutors: [],
    students: [],
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                ...action.payload, // Assuming payload contains admin, tutors, and students
            };
        default:
            return state;
    }
};

export default userReducer; 