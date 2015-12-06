// A class to store di-graphs where the vertices and edges are arbitrary
// objects.
class Graph {
  constructor(vertices) {
    this._graph = new Map();

    for (var i=0; i<vertices.length; i++) {
      this.add_vertex(vertices[i]);
    }
  }

  get_vertices() {
    return this._graph.keys();
  }

  add_vertex(vertex) {
    this._graph.set(vertex, new Map());
  }

  remove_vertex(vertex) {
    this._graph.delete(vertex);
  }

  add_edge(vertex1, vertex2, edge) {
    this._graph.get(vertex1).set(vertex2, edge);
  }

  adjacent(vertex1, vertex2) {
    if (!this._graph.has(vertex1) || !this._graph.has(vertex2)) {
      return null;
    }
    if (this._graph.get(vertex1).has(vertex2)) {
      return true;
    }else{
      return false;
    }
  }

  neighbors(vertex) {
    return this._graph.get(vertex).keys();
  }

  remove_edge(vertex1, vertex2) {
    this._graph.get(vertex1).delete(vertex2);
  }

  get_edge(vertex1, vertex2) {
    if (this.adjacent(vertex1, vertex2) === false) {
      return null;
    }
    return this._graph.get(vertex1).get(vertex2);
  }
}

function random_exponential(rate) {
  return -Math.log(Math.random()) / rate; 
}

function poisson(mean_occurrances) {
  var L = Math.exp(-mean_occurrances);
  var p = 1.0;
  var k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

class SocialNetwork extends Graph {
  print() {
    console.log('digraph G {');
    for (var person1 of this.get_vertices()) {
      for (var person2 of this.neighbors(person1)) {
        var weight = this.get_edge(person1, person2);
        if (Math.abs(weight) > 0.5) {
          console.log('  ' + person1.name + ' -> ' + person2.name + ' [weight=' + weight.toFixed() + '];');
        }
      }
    }
    console.log('}');
  }

  step() {
    // Loop over all the people.
    for (var person1 of this.get_vertices()) {
      // Loop over all the other people.
      for (var person2 of this.get_vertices()) {
        // Ignore self.
        if (person1 === person2) {
          continue;
        }

        // Check to see if these two meet.
        if (this.meet(person1, person2)) {
          // Model their interaction.
          this.interact(person1, person2);
        }
      }
    }
  }

  interact(person1, person2) {
    // If we are already friends, we might become better friends (or worse).
    if (this.adjacent(person1, person2)) {
      // Most of the time things go okay, but somtimes friends get in big fights!
      if (Math.random() < 0.01) {
        this.add_edge(person1, person2, -20);
        this.add_edge(person2, person1, -20);
      }else{
        this.add_edge(
          person1, 
          person2, 
          this.get_edge(person1, person2) + person2.charisma*(Math.random() - 0.2)
        );
        this.add_edge(
          person2, 
          person1, 
          this.get_edge(person2, person1) + person1.charisma*(Math.random() - 0.2)
        );
      }
    // If we aren't friends there is a small chance we may become friends.
    }else if (Math.random() < 0.05) {
      this.add_edge(person1, person2, 1.0);
      this.add_edge(person2, person1, 1.0);
    }
  }

  meet(person1, person2) {
    // People meet each other with randomly a certain rate (i.e. a Poisson
    // process) so the times between meetings are exponentially distributed.

    // People who do not know each other meet every 1000 time steps.
    var mean = 1000.0;

    // People that know each other meet more often as a function of their
    // friendship score.
    if (this.adjacent(person1, person2)) {
      mean = 100.0 - 2.0*this.get_edge(person1, person2);
    }

    // People do not meet more often than every 50 time steps.
    mean = Math.max(mean, 50.0);

    if (poisson(1.0/mean) >= 1) {
      return true;
    }else{
      return false;
    }
  }
}

class Person {
  constructor(name, charisma) {
    this.name = name;
    this.charisma = charisma;
  }
}

var social_network = new SocialNetwork([
  new Person('Rodger', 0.1),
  new Person('Sally', 0.5),
  new Person('Sam', 2.0), 
  new Person('Rye', 1.0), 
  new Person('Tara', 1.5), 
  new Person('Steven', 3.0), 
  new Person('Dave', 4.0),
]);

for (var i=0; i<10000; i++) {
  social_network.step();
  social_network.print();
}
