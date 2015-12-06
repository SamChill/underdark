'use strict';

import A from './module-a';
import {B, B2} from './module-b';

function main() {
    let a = new A();
    a.doit();
    A.doit();
    
    let b = new B();
    b.doit();
    
    let b2 = new B2("thingy string!");
    b2.doit();
}

main();