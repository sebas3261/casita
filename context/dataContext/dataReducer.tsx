export interface dataState{
    name?: any,
    email?: any,
}

type ActionsProps = {type:"LOGIN",payload: any} | {type:"LOGOUT"}

export const dataReducer = (state:any, actions:any)=> {
    switch(actions.type){
        case "LOGIN":
            return {
                ...state,
                name: actions.payload.name,
                email: actions.payload.email,
            }
        case "LOGOUT":
            return{
                ...state,
                name: undefined,
                email: undefined,
            }
        default:
            return state
    }
}