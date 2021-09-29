// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    // Don't use this to get a single row
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    // DO NOT call this with an invalid rowIndex, colIndex
    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    // This returns the starting column index of the MAJOR diagonal,
    // for a given position in the matrix (rowIndex, colIndex)
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    // This returns the starting column index of the MINOR diagonal,
    // for a given position in the matrix (rowIndex, colIndex)
    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    hasRowConflictAt: function(rowIndex) {
      var row = this.attributes[rowIndex];
      var sum = row.reduce((sum, item) => {
        return sum + item;
      });
      if (sum > 1) {
        return true;
      }
      return false; // fixme
    },

    hasAnyRowConflicts: function() {
      var result = false;
      for (var i = 0; i < this.attributes.n; i++) {
        // result = this.hasRowConflictAt(i) || result;

        result = this.hasRowConflictAt(i);
        if (result) { return result; }
      }
      return result; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    hasColConflictAt: function(colIndex) {
      // Iterate through every row and check the index? no
      var sum = 0;
      for (var row = 0; row < this.attributes.n; row++) {
        sum += this.attributes[row][colIndex];
      }
      return (sum > 1) ? true : false; // fixme
    },

    hasAnyColConflicts: function() {
      var result = false;
      for (var col = 0; col < this.attributes.n; col++) {
        result = this.hasColConflictAt(col);
        if (result) { return result; }
      }
      return result; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var n = this.attributes.n;
      if (majorDiagonalColumnIndexAtFirstRow <= -(n - 1) || majorDiagonalColumnIndexAtFirstRow >= (n - 1)) {
        return false;
      }
      var startRow = (majorDiagonalColumnIndexAtFirstRow < 0) ? -majorDiagonalColumnIndexAtFirstRow : 0;
      var startCol = (majorDiagonalColumnIndexAtFirstRow < 0) ? 0 : majorDiagonalColumnIndexAtFirstRow;
      var sum = 0;
      for (startRow, startCol; startRow < n && startCol < n; startRow++, startCol++) {
        sum += this.attributes[startRow][startCol];
      }
      return (sum > 1) ? true : false;
    },

    hasAnyMajorDiagonalConflicts: function() {
      var n = this.attributes.n;
      var result = false;
      for (var i = -(n - 1); i < n; i++) {
        result = this.hasMajorDiagonalConflictAt(i);
        if (result) { return true; }
      }
      return result; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var n = this.attributes.n;
      if (minorDiagonalColumnIndexAtFirstRow >= 2 * (n - 1) || minorDiagonalColumnIndexAtFirstRow <= 0) {
        return false;
      }

      var startRow = (minorDiagonalColumnIndexAtFirstRow >= n) ? minorDiagonalColumnIndexAtFirstRow - (n - 1) : 0;
      var startCol = (minorDiagonalColumnIndexAtFirstRow >= n) ? n - 1 : minorDiagonalColumnIndexAtFirstRow;
      var sum = 0;
      for (startRow, startCol; startRow < n && startCol >= 0; startRow++, startCol--) {
        sum += this.attributes[startRow][startCol];
      }
      return (sum > 1) ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.attributes.n;
      var result = false;
      for (var i = 2 * n; i >= 0; i--) {
        result = this.hasMinorDiagonalConflictAt(i);
        if (result) { return true; }
      }
      return result;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
