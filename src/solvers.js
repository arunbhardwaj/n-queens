/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


// I: a number n, indicating size of board and number of rooks
// O: a matrix representation of the solution, 0's for no piece, 1 otherwise
//    [[0,0,0],
//     [0,0,0],
//     [0,0,0]]
// C:
// E:

// Specific
// Justification = create a matrix of n rooks where they don't conflict
// Explanation =
window.findNRooksSolution = function(n) {
  // make the n x n matrix
  var solution = new Board({n: n});

  // recurse
  var innerFunction = (solution, row) => {
    // return once row reaches the end
    if (row === n) {
      return;
    }
    // iterate over the row from 0 -> n
    for (var col = 0; col < n; col++) {
      // change the value to rook
      solution.togglePiece(row, col);

      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(row, col);
        continue;
      }
      innerFunction(solution, row + 1);
    }
  };
  innerFunction(solution, 0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // make the n x n matrix
  var solutionCount = 0;
  var solution = new Board({n: n});

  // we should store column indices where new rooks can't be placed
  // var forbiddenColIndices = [];

  // recurse
  var innerFunction = (solution, row) => {
    // return once row reaches the end
    if (row === n) {
      solutionCount++;
      return;
    }
    // iterate over the row from 0 -> n
    for (var col = 0; col < n; col++) {
      // change the value to rook
      solution.togglePiece(row, col);

      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(row, col);
        continue;
      }
      innerFunction(solution, row + 1);
      solution.togglePiece(row, col);
    }
  };
  innerFunction(solution, 0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// E: n can be
// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  // Failing on n = 4
  /*
  0: (4) [1, 0, 0, 0]
  1: (4) [0, 0, 1, 0]
  2: (4) [0, 0, 0, 0]
  3: (4) [0, 0, 0, 0]
*/

  if (n === 0) {
    return [];
  }

  // make the n x n matrix
  var solution = new Board({n: n});
  var found = false;

  // recurse
  var innerFunction = (solution, row) => {

    if (row === n) {
      found = true;
      return;
    }
    // iterate over the row from 0 -> n
    for (var col = 0; col < n; col++) {
      // change the value to rook
      solution.togglePiece(row, col);

      if (solution.hasAnyQueensConflicts()) {
        solution.togglePiece(row, col);
        continue;
      }

      innerFunction(solution, row + 1);
      if (found) {
        return solution;
      }
      if (n > 1) {
        // We have to toggle off even for a single solution bc queens
        // can't find a solution during a first pass (unlike rooks);
        solution.togglePiece(row, col);
      }
    }
  };
  innerFunction(solution, 0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};




//   console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
//   return solution;
// };

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other

/*
    n = 3
    row = 2
    col = 2
  [
    [1,0,0],
    [0,0,1],
    [0,0,0]
  ]
  */
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var solution = new Board({n: n});

  if (n === 0) {
    return 0;
  }

  var found = false;

  // recurse
  var innerFunction = (solution, row) => {
    // return once row reaches the end
    if (row === n) {
      found = true;
      return;
      solutionCount++;
    }
    // iterate over the row from 0 -> n
    for (var col = 0; col < n; col++) {
      // change the value to rook
      solution.togglePiece(row, col);

      if (solution.hasAnyQueensConflicts()) {
        solution.togglePiece(row, col);
        continue;
      }

      innerFunction(solution, row + 1);
      if (found) { return solution; }
      if (n > 1) {
        solution.togglePiece(row, col);
      }
    }
  };
  innerFunction(solution, 0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};


