window.onload = function() {
  var article = document.getElementById('article');
  var nodes = [];
  traverse(article, function(n) {
    var match = /^H([1-6])$/.exec(n.tagName);
    if(match != null) {
      var node = {
        level: match[1],
        anchor: n.id,
        title: n.textContent
      }
      nodes.push(node);
    }
  });

  var ele = document.getElementById('autoIndexer');
  var root = new Node({level: 0}), parent = root, last = root;
  root.fromArray(nodes, function(cur, last) {
    return last.data.level < cur.data.level;
  });
  root.traverse(function(data) {
    if(this.isRoot()) {
      var ul = domUl();
      ele.appendChild(ul);
      ele = ul;
    }
    else {
      if(this.isSibling(last.parent)) ele = ele.parentNode.parentNode;

      var li = domLi(), newl;
      li.textContent = data.title;

      if(this.hasChildren()) {
        var newl = domUl();
        li.appendChild(newl);
      }

      ele.appendChild(li);
      if(newl) ele = newl;

      last = this;
    }
  });

  function findParent(node, start, filter) {
    if(node == null || start == null) return;
    if(filter(start)) {
      start.append(node);
    }
    else {
      findParent(node, start.parent, filter);
    }
  }

  function traverse(node, action, filter) {
    if(typeof action != 'function') throw 'action should be a function.';
    if(typeof filter != 'function' || filter(node)) action.call(null, node);

    var children = Array.prototype.slice.call(node.children), l = children.length;
    if(l > 0) {
      for(var i = 0; i < l; i++) {
        traverse(children[i], action, filter);
      }
    }
  }

  function domUl() {
    return document.createElement('ul');
  }

  function domLi() {
    return document.createElement('li');
  }
}


function Node(data) {
  this.data = data;
  this.children = [];
  this.parent = null;
}

Node.prototype.isRoot = function () {
  return this.parent == null;
};

Node.prototype.isSibling = function (node) {
  return !!node && this.parent == node.parent;
};

Node.prototype.hasChildren = function () {
  return this.children.length > 0;
};

Node.prototype.isLastChildren = function () {
  return this.parent.children.indexOf(this) == this.parent.children.length - 1;
};

//
// append node to the parent node
//
Node.prototype.appendTo = function (parent) {
  if(parent instanceof Node) {
    this.parent = parent;
    parent.children.push(this);
  }
};

//
// append a child node
//
Node.prototype.append = function (child) {
  if(child instanceof Node) {
    this.children.push(child);
    child.parent = this;
  }
};

//
// traverse, return an array of node
//
Node.prototype.traverse = function traverse(action) {
  if(typeof action != 'function') throw 'action should be a function.';

  action.call(this, this.data);
  if(this.children.length > 0) { // not leaf
    for(var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].traverse(action);
    }
  }
};

/**
 * Get tree structure from array.
 * @param  {[type]} arr - Array source
 * @param  {Function} filter - Decide current node to be last node's child or not
 * @return {Node} return itself
 */
Node.prototype.fromArray = function (arr, filter) {
  var last = this;
  for(var i = 0, l = arr.length; i < l; i++) {
    var node = arr[i], treeNode = new Node(node);
    findParent(treeNode, last, filter);
    last = treeNode;
  }

  function findParent(node, start, filter) {
    if(node == null || start == null) return;
    if(filter(node, start)) {
      start.append(node);
    }
    else {
      findParent(node, start.parent, filter);
    }
  }

  return this;
};
