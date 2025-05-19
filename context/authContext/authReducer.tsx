export interface AuthState {
    user?: any;
    isLogged: boolean;
  }

    export const defaultValues: AuthState = {
        user: undefined,
        isLogged: false,
    };
  
  type ActionsProps = 
    | { type: "LOGIN"; payload: any }
    | { type: "LOGOUT" };
  
  export const authReducer = (state: AuthState, action: ActionsProps): AuthState => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...state,
          user: action.payload,
          isLogged: true,
        };
      case "LOGOUT":
        return {
          ...state,
          user: undefined,
          isLogged: false,
        };
      default:
        return state;
    }
  };
  