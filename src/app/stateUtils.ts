import * as R from 'ramda';

export class StateUtils {
    constructor() {

    }

    updateStates(states, newState): Array<any> {
        const [head, ...tail] =  R.append(newState, states);
        return tail;
    }
}

