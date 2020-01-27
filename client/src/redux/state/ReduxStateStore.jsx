
// import dependencies
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// import root reducer
import rootReducer from "../reducers/index";

const middleWare = [thunk];

const reduxStateStore = createStore(rootReducer, 
                                    {}, 
                                    compose(
                                        applyMiddleware(...middleWare),
                                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                                        )
                                    );

export { reduxStateStore };