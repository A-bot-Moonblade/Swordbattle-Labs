import CountUp from 'react-countup';
import { useScale } from '../Scale';

import PlayAgainImg from '../../assets/img/play-again.png';
import HomeImg from '../../assets/img/home.png';
import './GameResults.scss';
import { DisconnectTypes } from '../../game/Types';

function GameResults({ onHome, results, game }: any) {
  const onHomeClick = () => {
    onHome();
    game.events.emit('setGameResults', null);
    game.events.emit('startSpectate');
  };
  const onRestartClick = () => {
    game.events.emit('setGameResults', null);
    game.events.emit('restartGame');
  };

  return (
    <div className="results" style={useScale(true).styles}>
      <div className="results-title">
        {results.disconnectReason?.code === DisconnectTypes.Player ? 'You got stabbed' : results.disconnectReason?.code === DisconnectTypes.Mob ? 'You were destroyed' : 'You were disconnected'}
        <br />
      </div>

      <div className="results-container">
        <div className="info">
          <div className="title">{results.disconnectReason?.code === DisconnectTypes.Player ? 'Stabbed by' : results.disconnectReason?.code === DisconnectTypes.Mob ? 'By' : 'Disconnect reason:'}</div>
          {results.disconnectReason?.reason}
        </div>

        <div className="info">
          <div className="title">Coins:</div>
          <CountUp
            duration={3}
            end={results.coins}
          />
        </div>

        <div className="info">
          <div className="title">Kills:</div>
          <CountUp
            duration={3}
            end={results.kills}
          />
        </div>

        <div className="info">
          <div className="title">Survived:</div>
          <CountUp
            end={results.survivalTime}
            duration={3}
            formattingFn={(s) => `${((s % 3600) / 60).toFixed(0)}m ${(s % 60).toFixed(0)}s`}
          />
        </div>
      </div>

      <div className="results-buttons">
        <div
          className="to-home"
          role="button"
          onClick={onHomeClick}
          onKeyDown={event => event.key === 'Enter' && onHomeClick()}
          tabIndex={0}
        >
          <img src={HomeImg} alt="Home" />
        </div>
        { results.disconnectReason?.type !== DisconnectTypes.Server && (
        <div
          className="play-again"
          role="button"
          onClick={onRestartClick}
          onKeyDown={event => event.key === 'Enter' && onRestartClick()}
          tabIndex={0}
        >
          <img src={PlayAgainImg} alt="Play again" />
        </div>
        )}
      </div>
    </div>
  )
}

export default GameResults;
