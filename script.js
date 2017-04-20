/*
Copyright (c) 2017, Martín Acuña Werner.
This source code is subject to the terms of the Mozilla Public License.
You can obtain a copy of the MPLv2 at https://www.mozilla.org/MPL/2.0/.
*/

(function () {

  /*
    Returns current nth throw's score
    Input: 0, 1, 2
    Output: score of nth throw
  */
  function nthThrow(playerDiv, index) {
    var score = $(playerDiv).find('input:nth-of-type(' + (index + 1) + ')').val() || '0';
    switch (score.charAt(0).toUpperCase()) {
      case 'D':
        return 2 * parseInt(score.substring(1));
      case 'T':
        return 3 * parseInt(score.substring(1));
      default:
        return parseInt(score);
    }
  }

  /*
    Returns current nth throw's score
    Input: 0, 1, 2
    Output: true/false depending if throw was a double
  */
  function isThrowDouble(playerDiv, index) {
    return $(playerDiv).find('input:nth-of-type(' + (index + 1) + ')')
                       .val().charAt(0).toUpperCase() === 'D';
  }

  /*
    Calculates currents turn score of a given player
    Input: player's div element
    Output: total score on current turn
  */
  function currentTurnScore(playerDiv) {
    return nthThrow(playerDiv, 0) + nthThrow(playerDiv, 1) + nthThrow(playerDiv, 2);
  }

  /*
    Checks if last throw was a double
    Input: player's div element
    Output: true or false, depending if last throw was a double or not
  */
  function finishedWithDouble(playerDiv) {
    var first = nthThrow(playerDiv, 2) === 0 &&
                nthThrow(playerDiv, 1) === 0 &&
                isThrowDouble(playerDiv, 0);
    var second = nthThrow(playerDiv, 2) === 0 &&
                 isThrowDouble(playerDiv, 1);
    var third = isThrowDouble(playerDiv, 2);
    return first || second || third;
  }

  /*
    Substract current turn score from given player's remaining score
    Input: player's div element
    Output: false or true, depending if player busts or not (respectively)
  */
  function substractScore(playerDiv) {
    var remainingScoreContainer = $(playerDiv).children('.remaining-score');
    var remainingScore = remainingScoreContainer.html();
    var turnScore = currentTurnScore(playerDiv);
    if (remainingScore - turnScore > 1) {
      remainingScoreContainer.html(remainingScore - turnScore);
      return 'accepted';
    } else if (remainingScore - turnScore === 0 && finishedWithDouble(playerDiv)) {
      remainingScoreContainer.html(remainingScore - turnScore);
      return 'winner';
    }

    return 'busted';
  }

  /*
    Prints current turn under player's div and sets different color if busted
    Input: player's div element, validTurn
    Output: none
  */
  function drawTurn(playerDiv, playerState) {
    var playerTurn = $('#player-turn').clone();
    playerTurn.attr('id', '');
    playerTurn.children('span').each(function (i, turnThrow) {
      if (i === 3) {
        $(turnThrow).html(currentTurnScore(playerDiv));
      } else {
        $(turnThrow).html(nthThrow(playerDiv, i));
      }
    });

    switch (playerState) {
      case 'winner':
        playerTurn.css('color', 'green');
        break;
      case 'busted':
        playerTurn.css('color', 'red');
        break;
    }

    $(playerDiv).find('.turns').append(playerTurn);
  }

  $('.save-btn').click(function () {
    var playerDiv = $(this).parent();
    var playerState = substractScore(playerDiv);
    drawTurn(playerDiv, playerState);
    playerDiv.find('input').val('');
  });
}());
