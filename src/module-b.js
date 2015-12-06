'use strict';

export class B {
    
    constructor() {
        this.B = 'B';
    }
    
    doit() {
        console.log(this.B);
    }
    
}

export class B2 {
    
    constructor(thingy) {
        this.B2 = thingy;
    }
    
    doit() {
        console.log(this.B2);
    }
    
}