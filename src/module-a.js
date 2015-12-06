'use strict';

export default class A {
    
    constructor() {
        this.A = 'A';
    }
    
    doit() {
        console.log(this.A);
    }
    
    static doit() {
        console.log("Static method, invoke with A.doit()")
    }
}