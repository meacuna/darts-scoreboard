/*
Copyright (c) 2017, Martín Acuña Werner.
This source code is subject to the terms of the Mozilla Public License.
You can obtain a copy of the MPLv2 at https://www.mozilla.org/MPL/2.0/.
*/

(function () {

  /*
    Returns current nth throw
    Input: 0, 1, 2
    Output: score of nth throw
  */
  function nthThrow(playerDiv, index) {
    return parseInt(
      $(playerDiv).find('input:nth-of-type(' + (index + 1) + ')').val()
    ) || 0;
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
      return true;
    }

    return false;
  }

  /*
    Prints current turn under player's div and sets different color if busted
    Input: player's div element, validTurn
    Output: none
  */
  function drawTurn(playerDiv, validTurn) {
    var playerTurn = $('#player-turn').clone();
    playerTurn.attr('id', '');
    playerTurn.children('span').each(function (i, turnThrow) {
      if (i === 3) {
        $(turnThrow).html(currentTurnScore(playerDiv));
      } else {
        $(turnThrow).html(nthThrow(playerDiv, i));
      }
    });

    if (!validTurn) {
      playerTurn.css('color', 'red');
    }

    $(playerDiv).find('.turns').append(playerTurn);
  }

  $('.save-btn').click(function () {
    var playerDiv = $(this).parent();
    var validTurn = substractScore(playerDiv);
    drawTurn(playerDiv, validTurn);
    playerDiv.find('input').val('');
  });
}());
