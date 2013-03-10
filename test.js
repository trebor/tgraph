var buster = require("buster");
var tg = require("./TGraph.js");

buster.testCase("a", {
  "add to graph": function() {

    var g = new tg.TGraph();
    assert.defined(g);
    g.addLink("a", "b", "l1");
    g.addLink("b", "c", "l2");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 2);

    // by id

    var a = g.getNode("a");
    assert.equals(a.getId(), "a");

    // by node

    var a1 = g.getNode(a);
    assert.equals(a, a1);

    // same id different node, no banana

    var a2 = new tg.TNode("a");
    refute.defined(g.getNode(a2));

    // some other node

    refute.defined(g.getNode("x"));

    // add a node

    var x = g.addNode("x");
    assert(tg.TNode.instanceOf(x));
    assert(g.getNode("x") == x);

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 2);

    g.addNode("x");

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 2);

    g.addNode(x);

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 2);

    var x2 = new tg.TNode("x");
    g.addNode(x2);

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 2);
  },

  "remove to graph": function() {

    var g = new tg.TGraph();
    assert.defined(g);
    g.addLink("a", "b", "l1");
    g.addLink("b", "c", "l2");
    g.addLink("c", "d", "l3");

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 3);

    // by id

    var b = g.removeNode("b");
    assert.equals(b.getId(), "b");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 1);

    // connect a and c

    g.addLink("a", "c");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 2);

    g.addLink("a", "e");

    assert.equals(g.getNodes().length, 4);
    assert.equals(g.getLinks().length, 3);

    g.removeNode("a");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 1);

    g.removeNode("c");

    assert.equals(g.getNodes().length, 2);
    assert.equals(g.getLinks().length, 0);

    g.removeNode("d");

    assert.equals(g.getNodes().length, 1);
    assert.equals(g.getLinks().length, 0);

    g.removeNode("e");

    assert.equals(g.getNodes().length, 0);
    assert.equals(g.getLinks().length, 0);
  },

  "connectedness": function() {

    var g = new tg.TGraph();
    assert.defined(g);
    g.addLink("a", "b");
    g.addLink("a", "c");
    g.addLink("b", "c");
    g.addLink("c", "d");
    g.addLink("a", "e");

    assert.equals(g.getNodes().length, 5);
    assert.equals(g.getLinks().length, 5);

    var conA = g.getConnectedNodes("a");
    var conB = g.getConnectedNodes("b");
    var conC = g.getConnectedNodes("c");
    var conE = g.getConnectedNodes("e");
    var conX = g.getConnectedNodes("x");

    assert.equals(conA.length, 3);
    assert.equals(conB.length, 2);
    assert.equals(conC.length, 3);
    assert.equals(conE.length, 1);
    assert.equals(conX.length, 0);

    var arrA = g.getArrivingLinks("a");
    var arrB = g.getArrivingLinks("b");
    var arrC = g.getArrivingLinks("c");
    var arrE = g.getArrivingLinks("e");
    var arrX = g.getArrivingLinks("x");

    assert.equals(arrA.length, 0);
    assert.equals(arrB.length, 1);
    assert.equals(arrC.length, 2);
    assert.equals(arrE.length, 1);
    assert.equals(arrX.length, 0);

    var depA = g.getDepartingLinks("a");
    var depB = g.getDepartingLinks("b");
    var depC = g.getDepartingLinks("c");
    var depE = g.getDepartingLinks("e");
    var depX = g.getDepartingLinks("x");

    assert.equals(depA.length, 3);
    assert.equals(depB.length, 1);
    assert.equals(depC.length, 1);
    assert.equals(depE.length, 0);
    assert.equals(depX.length, 0);

    var allA = g.getAllLinks("a");
    var allB = g.getAllLinks("b");
    var allC = g.getAllLinks("c");
    var allE = g.getAllLinks("e");
    var allX = g.getAllLinks("x");

    assert.equals(allA.length, 3);
    assert.equals(allB.length, 2);
    assert.equals(allC.length, 3);
    assert.equals(allE.length, 1);
    assert.equals(allX.length, 0);
  },

  "join": function() {

    var g1 = new tg.TGraph();
    assert.defined(g1);
    g1.addLink("a", "b");
    g1.addLink("b", "c");
    g1.addNode("m");
    g1.addNode("o");

    assert.equals(g1.getNodes().length, 5);
    assert.equals(g1.getLinks().length, 2);

    var g2 = new tg.TGraph();
    assert.defined(g1);
    g2.addLink("c", "x");
    g2.addLink("x", "y");
    g2.addLink("x", "z");
    g2.addNode("n");
    g2.addNode("o");

    assert.equals(g2.getNodes().length, 6);
    assert.equals(g2.getLinks().length, 3);

    var g3 = tg.TGraph.union(g1, g2);

    assert.equals(g3.getNodes().length, 9);
    assert.equals(g3.getLinks().length, 5);
  },

  "link idemopentent": function() {

    var g = new tg.TGraph();
    assert.defined(g);
    g.addLink("a", "b", "l1");
    g.addLink("b", "c", "l2");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 2);

    g.addLink("a", "b", "l1");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 2);

    g.addLink("b", "c", "l2");

    assert.equals(g.getNodes().length, 3);
    assert.equals(g.getLinks().length, 2);
  }
});
