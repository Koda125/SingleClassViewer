import React, { useState } from 'react';
import './DiceRoller.css';

export type DieType = 2 | 4 | 6 | 8 | 12 | 20;

export interface RecentRoll {
  notation: string;
  total: number;
  label?: string;
  timestamp: number;
}

interface DiceRollerProps {
  onRoll?: (results: number[], total: number) => void;
  recentRolls?: RecentRoll[];
  addRecentRoll?: (roll: RecentRoll) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, recentRolls, addRecentRoll }) => {
  const [quantity, setQuantity] = useState(1);
  const [dieType, setDieType] = useState<DieType>(20);
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [localRecentRolls, setLocalRecentRolls] = useState<RecentRoll[]>([]);

  const dieTypes: DieType[] = [2, 4, 6, 8, 12, 20];

  const rollDice = () => {
    setIsRolling(true);

    // Simulate rolling animation delay
    setTimeout(() => {
      const newResults: number[] = [];
      let sum = 0;

      for (let i = 0; i < quantity; i++) {
        const roll = Math.floor(Math.random() * dieType) + 1;
        newResults.push(roll);
        sum += roll;
      }

      setResults(newResults);
      const modifiedTotal = sum + modifier;
      setTotal(modifiedTotal);
      setIsRolling(false);

      // Build the recent roll record and send it to the parent if provided
      const modifierText = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : '';
      const rollValue = quantity === 1 ? newResults[0] : sum;
      const diceNotation = `${quantity}d${dieType}${modifierText}`;
      const rollBreakdown = quantity === 1 && modifier !== 0 ? `${rollValue}${modifierText}` : diceNotation;
      
      const newRecentRoll: RecentRoll = {
        notation: rollBreakdown,
        total: modifiedTotal,
        label: diceNotation,
        timestamp: Date.now()
      };

      if (addRecentRoll) {
        addRecentRoll(newRecentRoll);
      } else {
        setLocalRecentRolls(prev => [newRecentRoll, ...prev.slice(0, 2)]);
      }

      if (onRoll) {
        onRoll(newResults, sum);
      }
    }, 500);
  };

  const getDieIcon = (type: DieType): string => {
    const icons: Record<DieType, string> = {
      2: '⚀',
      4: '⚁',
      6: '⚂',
      8: '⚃',
      12: '⚄',
      20: '⚅'
    };
    return icons[type];
  };

  const recentRollsToShow = recentRolls ?? localRecentRolls;

  return (
    <div className="dice-roller">
      <h3>Dice Roller</h3>

      <div className="dice-controls">
        <div className="control-group">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="quantity-btn"
            >
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
              className="quantity-btn"
            >
              +
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Die Type:</label>
          <div className="die-type-buttons">
            {dieTypes.map(type => (
              <button
                key={type}
                onClick={() => setDieType(type)}
                className={`die-btn ${dieType === type ? 'active' : ''}`}
              >
                <span className="die-icon">{getDieIcon(type)}</span>
                <span className="die-label">d{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Modifier:</label>
          <div className="modifier-controls">
            <button
              onClick={() => setModifier(modifier - 1)}
              className="modifier-btn"
            >
              −
            </button>
            <span className="modifier-display">{modifier >= 0 ? '+' : ''}{modifier}</span>
            <button
              onClick={() => setModifier(modifier + 1)}
              className="modifier-btn"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`roll-btn ${isRolling ? 'rolling' : ''}`}
        >
          {isRolling ? 'Rolling...' : `Roll ${quantity}d${dieType}${modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : ''}`}
        </button>
      </div>

      {results.length > 0 && (
        <div className="dice-results">
          <div className="results-header">
            <h4>Results</h4>
            <div className="total-display">
              Total: <span className="total-value">{total}</span>
            </div>
          </div>

          <div className="individual-rolls">
            {results.map((roll, index) => (
              <div key={index} className="roll-result">
                <span className="roll-number">{roll}</span>
                <span className="roll-label">d{dieType}</span>
              </div>
            ))}
          </div>

          {results.length > 1 && (
            <div className="roll-summary">
              <span className="summary-text">
                {quantity}d{dieType}: {results.join(' + ')} = {results.reduce((a, b) => a + b, 0)}{modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : ''} = {total}
              </span>
            </div>
          )}

          {results.length === 1 && modifier !== 0 && (
            <div className="roll-summary">
              <span className="summary-text">
                {results[0]}{modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`} = {total}
              </span>
            </div>
          )}
        </div>
      )}

      {(recentRollsToShow.length > 0) && (
        <div className="recent-rolls">
          <h4>Recent Rolls</h4>
          <div className="recent-rolls-list">
            {recentRollsToShow.map((roll) => (
              <div key={roll.timestamp} className="recent-roll-item">
                <div className="recent-roll-info">
                  <span className="recent-roll-label">{roll.label ?? roll.notation}</span>
                  <span className="recent-roll-breakdown">{roll.notation}</span>
                </div>
                <span className="recent-roll-total">{roll.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};