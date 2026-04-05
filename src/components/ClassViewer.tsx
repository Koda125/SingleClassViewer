import React, { useState } from 'react';
import { Attributes, DndClass, InfusionElement } from '../types/index';
import { DiceRoller, RecentRoll } from './DiceRoller';
import './ClassViewer.css';

interface ClassViewerProps {
  dndClass: DndClass;
}

export const ClassViewer: React.FC<ClassViewerProps> = ({ dndClass }) => {
  const [playerLevel, setPlayerLevel] = useState(1);
  const [selectedElements, setSelectedElements] = useState<InfusionElement[]>([]);
  const [primaryAttribute, setPrimaryAttribute] = useState<keyof DndClass['attributes']>(dndClass.primaryAttribute);
  const [attributes, setAttributes] = useState<Attributes>(dndClass.attributes);
  const [selectedSubclassId, setSelectedSubclassId] = useState<string | null>(
    dndClass.subclasses && dndClass.subclasses.length > 0 ? dndClass.subclasses[0].id : null
  );
  const [burn, setBurn] = useState(0);
  const [recentRolls, setRecentRolls] = useState<RecentRoll[]>([]);

  const selectedSubclass = dndClass.subclasses?.find(s => s.id === selectedSubclassId);

  const skillAbilityMap: Record<string, keyof Attributes> = {
    Acrobatics: 'dexterity',
    Arcana: 'intelligence',
    Athletics: 'strength',
    Deception: 'charisma',
    History: 'intelligence',
    Insight: 'wisdom',
    Intimidation: 'charisma',
    Investigation: 'intelligence',
    Medicine: 'wisdom',
    Nature: 'intelligence',
    Perception: 'wisdom',
    Performance: 'charisma',
    Persuasion: 'charisma',
    Religion: 'intelligence',
    'Sleight of Hand': 'dexterity',
    Stealth: 'dexterity',
    Survival: 'wisdom'
  };

  const skillNames = Object.keys(skillAbilityMap);

  type SkillStatus = 'none' | 'proficient' | 'expertise';
  const [skillStatus, setSkillStatus] = useState<Record<string, SkillStatus>>(
    skillNames.reduce((acc, skill) => {
      acc[skill] = 'none';
      return acc;
    }, {} as Record<string, SkillStatus>)
  );

  const getProficiencyBonus = (level: number) => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  };

  const proficiencyBonus = getProficiencyBonus(playerLevel);

  const addRecentRoll = (roll: RecentRoll) => {
    setRecentRolls(prev => [roll, ...prev].slice(0, 3));
  };

  const [activeSection, setActiveSection] = useState<'all' | 'skills' | 'abilities' | 'infusions'>('all');

  const getSkillAbility = (skill: string): keyof Attributes => {
    return skillAbilityMap[skill] || 'strength';
  };

  const getSkillModifier = (skill: string): number => {
    const ability = getSkillAbility(skill);
    const base = calculateModifier(attributes[ability]);
    const status = skillStatus[skill] || 'none';
    const bonus = status === 'proficient' ? proficiencyBonus : status === 'expertise' ? proficiencyBonus * 2 : 0;
    return base + bonus;
  };

  const cycleSkillStatus = (skill: string) => {
    setSkillStatus(prev => {
      const current = prev[skill] || 'none';
      const next: SkillStatus = current === 'none' ? 'proficient' : current === 'proficient' ? 'expertise' : 'none';
      return { ...prev, [skill]: next };
    });
  };

  const rollSkillCheck = (skill: string) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const modifier = getSkillModifier(skill);
    const total = roll + modifier;
    const ability = getSkillAbility(skill);
    addRecentRoll({
      notation: `${roll} + ${modifier}`,
      total,
      label: `${skill} (${ability.charAt(0).toUpperCase() + ability.slice(1)})`,
      timestamp: Date.now()
    });
  };

  const rollKineticAttack = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const modifier = calculateModifier(attributes.constitution);
    const total = roll + modifier;
    addRecentRoll({
      notation: `${roll} + ${modifier}`,
      total,
      label: `Kinetic Blast Attack`,
      timestamp: Date.now()
    });
  };

  const getKineticBlastDamageDice = (level: number): string => {
    if (level >= 15) return '1d12';
    if (level >= 10) return '1d10';
    if (level >= 7) return '1d8';
    if (level >= 3) return '1d6';
    return '1d4';
  };

  const rollKineticDamage = () => {
    const conMod = calculateModifier(attributes.constitution);
    const damageDice = getKineticBlastDamageDice(playerLevel);
    
    let diceValue = 0;
    const diceSides = parseInt(damageDice.split('d')[1]);
    diceValue = Math.floor(Math.random() * diceSides) + 1;
    
    const total = diceValue + conMod;
    addRecentRoll({
      notation: `${diceValue} + ${conMod}`,
      total,
      label: `Kinetic Blast Damage (${damageDice})`,
      timestamp: Date.now()
    });
  };

  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const constitutionModifier = calculateModifier(attributes.constitution);
  const baseMaxHP = (playerLevel * dndClass.hitDice) + (constitutionModifier * playerLevel);
  const maxHP = Math.max(1, baseMaxHP - burn);
  const [currentHP, setCurrentHP] = useState(maxHP);
  const currentFillPercent = Math.min(100, Math.max(0, (currentHP / Math.max(1, baseMaxHP)) * 100));
  const burnPercent = Math.min(100, Math.max(0, (burn / Math.max(1, baseMaxHP)) * 100));

  const getHPBarColor = (): string => {
    const healthyColor = currentHP > maxHP * 0.5 ? '#27ae60' : currentHP > maxHP * 0.25 ? '#f39c12' : '#e74c3c';
    if (burn <= 0) {
      return healthyColor;
    }

    const burnRatio = Math.min(1, burn / Math.max(1, baseMaxHP));
    const redOverlay = `rgba(231, 76, 60, ${0.25 + 0.55 * burnRatio})`;
    return `linear-gradient(90deg, ${healthyColor} 0%, ${redOverlay} 100%)`;
  };

  const availableAbilities = dndClass.abilities?.filter(ability =>
    ability.minLevel <= playerLevel &&
    (!ability.maxLevel || ability.maxLevel >= playerLevel)
  ) || [];

  const availableSubclassAbilities = selectedSubclass?.abilities?.filter(ability =>
    ability.minLevel <= playerLevel &&
    (!ability.maxLevel || ability.maxLevel >= playerLevel)
  ) || [];

  const availableInfusions = dndClass.infusions?.filter(infusion => {
    const levelMatch = infusion.minLevel <= playerLevel &&
      (!infusion.maxLevel || infusion.maxLevel >= playerLevel);

    const elementMatch = selectedElements.length === 0 ||
      selectedElements.includes(infusion.element);

    return levelMatch && elementMatch;
  }) || [];

  const allElements: InfusionElement[] = [
    'fire', 'ice', 'lightning', 'acid', 'poison',
    'necrotic', 'radiant', 'force', 'psychic', 'thunder',
    'air', 'earth', 'water', 'shadow', 'nature', 'universal'
  ];

  const toggleElement = (element: InfusionElement) => {
    setSelectedElements(prev =>
      prev.includes(element)
        ? prev.filter(e => e !== element)
        : [...prev, element]
    );
  };

  const getElementColor = (element: InfusionElement): string => {
    const colors: Record<InfusionElement, string> = {
      fire: '#e74c3c',
      ice: '#3498db',
      lightning: '#f1c40f',
      acid: '#27ae60',
      poison: '#9b59b6',
      necrotic: '#34495e',
      radiant: '#f39c12',
      force: '#e67e22',
      psychic: '#8e44ad',
      thunder: '#95a5a6',
      air: '#5dade2',
      earth: '#7d6608',
      water: '#1f618d',
      shadow: '#2c3e50',
      nature: '#27ae60',
      universal: '#95a5a6'
    };
    return colors[element] || '#666';
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ {dndClass.name}</h1>
        <p>{dndClass.description}</p>
      </header>

      <div className="hp-header">
        <div className="hp-display">
          <div className="hp-info">
            <span className="hp-label">Health Points</span>
            <div className="hp-values">
              <input
                type="number"
                min="0"
                max={maxHP}
                value={currentHP}
                onChange={e => setCurrentHP(Math.min(maxHP, Math.max(0, parseInt(e.target.value) || 0)))}
                className="hp-input"
              />
              <span className="hp-divider">/</span>
              <span className="hp-max">{maxHP}</span>
            </div>
          </div>
          <div className="hp-bar">
            <div
              className="hp-bar-fill"
              style={{
                width: `${currentFillPercent}%`,
                background: getHPBarColor()
              }}
            ></div>
            {burn > 0 && (
              <div
                className="hp-bar-burn"
                style={{
                  left: `${currentFillPercent}%`,
                  width: `${burnPercent}%`
                }}
              />
            )}
          </div>
        </div>
        <div className="burn-display">
          <span className="burn-label">Burn</span>
          <div className="burn-controls">
            <button
              className="burn-btn burn-decrease"
              onClick={() => setBurn(Math.max(0, burn - 1))}
              title="Decrease burn"
            >
              −
            </button>
            <span className="burn-value">{burn}</span>
            <button
              className="burn-btn burn-increase"
              onClick={() => setBurn(burn + 1)}
              title="Increase burn"
            >
              +
            </button>
            <button
              className="burn-btn burn-reset"
              onClick={() => {
                setBurn(0);
                setCurrentHP(maxHP);
              }}
              title="Long rest (reset burn and restore HP)"
            >
              Long Rest
            </button>
          </div>
        </div>

        <div className="section-nav-area">
          <div className="section-nav">
            <button
              type="button"
              className={`section-nav-link ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveSection('skills')}
            >
              Skills
            </button>
            <button
              type="button"
              className={`section-nav-link ${activeSection === 'abilities' ? 'active' : ''}`}
              onClick={() => setActiveSection('abilities')}
            >
              Abilities
            </button>
            <button
              type="button"
              className={`section-nav-link ${activeSection === 'infusions' ? 'active' : ''}`}
              onClick={() => setActiveSection('infusions')}
            >
              Infusions
            </button>
            <button
              type="button"
              className={`section-nav-link ${activeSection === 'all' ? 'active' : ''}`}
              onClick={() => setActiveSection('all')}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className="app-container">
        <aside className="sidebar">
          <DiceRoller recentRolls={recentRolls} addRecentRoll={addRecentRoll} />
        </aside>

        <main className="content">
          <div className="class-viewer">
            <div className="class-header">
              <div className="class-meta">
                <span className="hit-dice">Hit Dice: d{dndClass.hitDice}</span>
                <span className="primary-attr">Primary: {primaryAttribute}</span>
            </div>
            <div className="primary-attribute-select">
              <label htmlFor="primary-attribute">Primary Attribute:</label>
              <select
                id="primary-attribute"
                value={primaryAttribute}
                onChange={e => setPrimaryAttribute(e.target.value as keyof DndClass['attributes'])}
              >
                {Object.keys(dndClass.attributes).map(attr => (
                  <option key={attr} value={attr}>
                    {attr.charAt(0).toUpperCase() + attr.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            </div>

            <div className="attributes-section">
              <h2>Attributes</h2>
              <div className="attributes-grid">
                {Object.entries(attributes).map(([attr, value]) => (
                  <div key={attr} className={`attribute-card ${attr === primaryAttribute ? 'primary-attribute-card' : ''}`}>
                    <div className="attribute-name">
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={value}
                      onChange={e => {
                        const newValue = Math.max(1, Math.min(30, parseInt(e.target.value) || 0));
                        setAttributes(prev => ({
                          ...prev,
                          [attr]: newValue,
                        }));
                      }}
                      className="attribute-input"
                    />
                    <div className="modifier">
                      {calculateModifier(value) > 0 ? '+' : ''}
                      {calculateModifier(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-section" id="skills" style={{ display: activeSection === 'all' || activeSection === 'skills' ? undefined : 'none' }}>
              <div className="skills-header">
                <h2>Skills</h2>
                <div className="level-filter">
                  <span>Proficiency Bonus: +{proficiencyBonus}</span>
                </div>
              </div>
              <div className="skills-grid">
                {skillNames.map(skill => {
                  const ability = getSkillAbility(skill);
                  const status = skillStatus[skill] || 'none';
                  const modifier = getSkillModifier(skill);
                  return (
                    <div key={skill} className="skill-card">
                      <div className="skill-top-row">
                        <div>
                          <div className="skill-name">{skill}</div>
                          <div className="skill-ability">{ability.charAt(0).toUpperCase() + ability.slice(1)}</div>
                        </div>
                        <button
                          type="button"
                          className={`skill-status-btn ${status}`}
                          onClick={() => cycleSkillStatus(skill)}
                        >
                          {status === 'none' ? 'None' : status === 'proficient' ? 'Prof' : 'Expert'}
                        </button>
                      </div>
                      <div className="skill-modifier">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </div>
                      <button
                        type="button"
                        className="skill-roll-btn"
                        onClick={() => rollSkillCheck(skill)}
                      >
                        Roll {skill}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {dndClass.abilities && dndClass.abilities.length > 0 && (
              <div className="abilities-section" id="abilities" style={{ display: activeSection === 'all' || activeSection === 'abilities' ? undefined : 'none' }}>
                {dndClass.subclasses && dndClass.subclasses.length > 0 && (
                  <div className="subclass-selector">
                    <label htmlFor="subclass-select">Subclass:</label>
                    <select
                      id="subclass-select"
                      value={selectedSubclassId || ''}
                      onChange={e => setSelectedSubclassId(e.target.value)}
                    >
                      <option value="">-- Select a Subclass --</option>
                      {dndClass.subclasses.map(subclass => (
                        <option key={subclass.id} value={subclass.id}>
                          {subclass.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="abilities-header">
                  <h2>Abilities</h2>
                  <div className="level-filter">
                    <label htmlFor="player-level">Character Level:</label>
                    <input
                      id="player-level"
                      type="range"
                      min="1"
                      max="20"
                      value={playerLevel}
                      onChange={e => setPlayerLevel(parseInt(e.target.value))}
                    />
                    <span className="level-display">{playerLevel}</span>
                  </div>
                </div>
                <div className="abilities-list">
                  {(availableAbilities.length > 0 || availableSubclassAbilities.length > 0) ? (
                    <>
                      {availableAbilities.map((ability, index) => (
                        <div key={`class-${index}`} className="ability-card">
                          <div className="ability-header">
                            <h3>{ability.name}</h3>
                            <span className="ability-level">
                              Level {ability.minLevel}
                              {ability.maxLevel && ability.maxLevel < 20 ? `-${ability.maxLevel}` : ''}
                            </span>
                          </div>
                          <p className="ability-description">{ability.description}</p>
                          {ability.damageType && (
                            <div className="damage-type">Damage: {ability.damageType}</div>
                          )}
                          {ability.name.toLowerCase().includes('kinetic blast') && (
                            <>
                              <div className="ability-buttons">
                                <button
                                  type="button"
                                  className="skill-roll-btn"
                                  onClick={rollKineticAttack}
                                >
                                  Roll Kinetic Blast Attack
                                </button>
                                <button
                                  type="button"
                                  className="skill-roll-btn"
                                  onClick={rollKineticDamage}
                                >
                                  Roll Kinetic Blast Damage
                                </button>
                              </div>
                              <div className="ability-damage">
                                Damage: {getKineticBlastDamageDice(playerLevel)} + CON modifier
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {availableSubclassAbilities.map((ability, index) => (
                        <div key={`subclass-${index}`} className="ability-card subclass-ability-card">
                          <div className="ability-header">
                            <h3>{ability.name}</h3>
                            <span className="ability-level subclass-badge">
                              {selectedSubclass?.name} • Level {ability.minLevel}
                              {ability.maxLevel && ability.maxLevel < 20 ? `-${ability.maxLevel}` : ''}
                            </span>
                          </div>
                          <p className="ability-description">{ability.description}</p>
                          {ability.damageType && (
                            <div className="damage-type">Damage: {ability.damageType}</div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="no-abilities">No abilities available at level {playerLevel}</div>
                  )}
                </div>
              </div>
            )}

            {dndClass.infusions && dndClass.infusions.length > 0 && (
              <div className="infusions-section" id="infusions" style={{ display: activeSection === 'all' || activeSection === 'infusions' ? undefined : 'none' }}>
                <div className="infusions-header">
                  <h2>Infusions</h2>
                  <div className="filters-container">
                    <div className="level-filter">
                      <label htmlFor="infusion-level">Character Level:</label>
                      <input
                        id="infusion-level"
                        type="range"
                        min="1"
                        max="20"
                        value={playerLevel}
                        onChange={e => setPlayerLevel(parseInt(e.target.value))}
                      />
                      <span className="level-display">{playerLevel}</span>
                    </div>
                    <div className="element-filter">
                      <label>Elements:</label>
                      <div className="element-buttons">
                        {allElements.map(element => (
                          <button
                            key={element}
                            className={`element-btn ${selectedElements.includes(element) ? 'active' : ''}`}
                            style={{
                              backgroundColor: selectedElements.includes(element) ? getElementColor(element) : '#f5f5f5',
                              color: selectedElements.includes(element) ? 'white' : '#333'
                            }}
                            onClick={() => toggleElement(element)}
                          >
                            {element.charAt(0).toUpperCase() + element.slice(1)}
                          </button>
                        ))}
                      </div>
                      {selectedElements.length > 0 && (
                        <button
                          className="clear-elements-btn"
                          onClick={() => setSelectedElements([])}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="infusions-list">
                  {availableInfusions.length > 0 ? (
                    availableInfusions.map((infusion, index) => (
                      <div key={index} className="infusion-card">
                        <div className="infusion-header">
                          <h3>{infusion.name}</h3>
                          <div className="infusion-meta">
                            <span
                              className="infusion-element"
                              style={{ backgroundColor: getElementColor(infusion.element) }}
                            >
                              {infusion.element.charAt(0).toUpperCase() + infusion.element.slice(1)}
                            </span>
                            <span className="infusion-level">
                              Level {infusion.minLevel}
                              {infusion.maxLevel && infusion.maxLevel < 20 ? `-${infusion.maxLevel}` : ''}
                            </span>
                          </div>
                        </div>
                        <p className="infusion-description">{infusion.description}</p>
                        <div className="infusion-burn-cost">
                          <strong>Burn Cost:</strong> {infusion.burnCost}
                        </div>
                        {infusion.blastType && (
                          <div className="infusion-blast-type">
                            <strong>Blast Type:</strong> {infusion.blastType}
                          </div>
                        )}
                        {infusion.prerequisites && (
                          <div className="infusion-prerequisites">
                            <strong>Prerequisites:</strong> {infusion.prerequisites}
                          </div>
                        )}
                        {infusion.duration && (
                          <div className="infusion-duration">
                            <strong>Duration:</strong> {infusion.duration}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-infusions">
                      No infusions available at level {playerLevel}
                      {selectedElements.length > 0 && ` with selected elements`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {dndClass.skills && dndClass.skills.length > 0 && (
              <div className="skills-section class-skill-tags">
                <h2>Skills</h2>
                <div className="skills-list">
                  {dndClass.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">{skill}</div>
                  ))}
                </div>
              </div>
            )}

            {dndClass.armor && dndClass.armor.length > 0 && (
              <div className="equipment-section">
                <h3>Armor</h3>
                <div className="equipment-list">
                  {dndClass.armor.map((armor, index) => (
                    <div key={index} className="equipment-item">{armor}</div>
                  ))}
                </div>
              </div>
            )}

            {dndClass.weapons && dndClass.weapons.length > 0 && (
              <div className="equipment-section">
                <h3>Weapons</h3>
                <div className="equipment-list">
                  {dndClass.weapons.map((weapon, index) => (
                    <div key={index} className="equipment-item">{weapon}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};