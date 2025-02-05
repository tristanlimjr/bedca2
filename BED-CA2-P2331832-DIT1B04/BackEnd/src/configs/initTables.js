const pool = require('../services/db');
const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const hashedPassword1 = hashPassword('2331832'); 
const hashedPassword2 = hashPassword('2331832'); 

const SQLSTATEMENT = `
  DROP TABLE IF EXISTS Quests;
  DROP TABLE IF EXISTS UserCompletion;
  DROP TABLE IF EXISTS Inventory;
  DROP TABLE IF EXISTS Resources;
  DROP TABLE IF EXISTS Colonies;
  DROP TABLE IF EXISTS Party_Members;
  DROP TABLE IF EXISTS Party;
  DROP TABLE IF EXISTS Review;
  DROP TABLE IF EXISTS FitnessChallenge;
  DROP TABLE IF EXISTS Planets;
  DROP TABLE IF EXISTS Items;
  DROP TABLE IF EXISTS User;

  CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    skillpoints INT NOT NULL DEFAULT 0,
    level INT DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    item_type VARCHAR(100) NOT NULL,
    description TEXT,
    rarity VARCHAR(50),
    value INT CHECK (value >= 0)
  );

  CREATE TABLE IF NOT EXISTS FitnessChallenge (
    challenge_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    challenge TEXT NOT NULL,
    skillpoints INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Quests (
    quest_id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    quest_name VARCHAR(255) NOT NULL,
    quest_description TEXT,
    difficulty VARCHAR(50),
    reward_points INT NOT NULL,
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    resource_type TEXT NOT NULL,
    planet_origin TEXT,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Planets (
    planet_id INT AUTO_INCREMENT PRIMARY KEY,
    planet_name TEXT NOT NULL,
    planet_type TEXT NOT NULL,
    resource_richness INT NOT NULL,
    habitable BOOL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Colonies (
    colony_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    colony_name TEXT NOT NULL,
    planet_id INT NOT NULL,
    population INT DEFAULT 0,
    resources_generated TEXT,
    defense_level INT DEFAULT 1,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (planet_id) REFERENCES Planets(planet_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Party (
    party_id INT AUTO_INCREMENT PRIMARY KEY,
    party_name TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leader_id INT,
    FOREIGN KEY (leader_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Party_Members (
    party_id INT NOT NULL,
    user_id INT NOT NULL,  
    PRIMARY KEY (party_id, user_id),
    FOREIGN KEY (party_id) REFERENCES Party(party_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS UserCompletion (
    complete_id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    completed BOOL NOT NULL DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id) ON DELETE CASCADE
  );

  INSERT INTO User (username, email, password, skillpoints, level) VALUES
  ('soctestuser', 'user@soc.com', ?, 100, 1),
  ('owner', 'owner@owner.com', ?, 99999, 99999);

  INSERT INTO Items (item_name, item_type, description, rarity, value) VALUES
  ('Quantum Thruster', 'Equipment', 'Advanced propulsion system for faster-than-light travel.', 'Legendary', 5000),
  ('Shield Generator MK-III', 'Equipment', 'Generates an energy barrier to absorb cosmic radiation.', 'Rare', 3200),
  ('Plasma Blaster', 'Weapon', 'A high-energy weapon capable of melting asteroid fragments.', 'Epic', 4500),
  ('Neutron Rifle', 'Weapon', 'A powerful long-range weapon using neutron particles.', 'Rare', 2800),
  ('Void Saber', 'Weapon', 'A melee weapon infused with dark matter energy.', 'Legendary', 6000),
  ('Nebula Crystal', 'Resource', 'A rare crystalline formation found in deep-space nebulae.', 'Epic', 2000),
  ('Dark Matter Shard', 'Resource', 'A fragment of highly unstable dark matter.', 'Legendary', 8000),
  ('Exotic Ore', 'Resource', 'A rare metal used to craft advanced space technology.', 'Uncommon', 1500),
  ('Nano-Med Injector', 'Utility', 'A compact healing device that repairs biological damage.', 'Rare', 1000),
  ('Oxygen Rebreather', 'Utility', 'Allows extended exploration in low-oxygen planets.', 'Common', 500),
  ('Graviton Boots', 'Utility', 'Enables walking on planets with extreme gravity.', 'Epic', 2500),
  ('Celestial Map', 'Artifact', 'Ancient star chart leading to unknown galaxies.', 'Rare', 3000),
  ('Alien Relic', 'Artifact', 'A mysterious artifact from an extinct alien civilization.', 'Legendary', 7000),
  ('Temporal Beacon', 'Artifact', 'A device rumored to allow limited manipulation of time.', 'Mythic', 10000),
  ('Starforge Blueprint', 'Artifact', 'Schematics for constructing an interstellar warship.', 'Legendary', 12000);

  INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES 
  (1, 'Complete 2.4km within 15 minutes', 50),
  (2, 'Hold a plank for 5 minutes', 50);

  INSERT INTO Quests (challenge_id, quest_name, quest_description, difficulty, reward_points)
  VALUES 
  (2, 'Mine ores of Moonicus', 'Harvest the depths of Moonicus', 'Easy', 100),
  (1, 'Explore the Lost Sector', 'Navigate through unknown territories and uncover hidden relics.', 'Medium', 150),
  (2, 'Construct a Space Colony', 'Establish a sustainable colony on an uncharted planet.', 'Hard', 300),
  (1, 'Defend the Outpost', 'Repel an invasion and secure the base.', 'Hard', 250),
  (2, 'Retrieve the Ancient Artifact', 'Recover a lost alien artifact from an abandoned spaceship.', 'Legendary', 500);

  INSERT INTO UserCompletion (challenge_id, user_id, completed, notes)
  VALUES (1, 1, TRUE, 'Tough challenge but I made it!')
  ON DUPLICATE KEY UPDATE notes = VALUES(notes);

  INSERT INTO Review (user_id, challenge_id, rating, comment)
  VALUES (1, 1, 5, 'Great challenge!')
  ON DUPLICATE KEY UPDATE comment = VALUES(comment);

  INSERT INTO Planets (planet_name, planet_type, resource_richness, habitable)
  VALUES ('Earth-Like Planet', 'Terrestrial', 80, TRUE)
  ON DUPLICATE KEY UPDATE planet_id = LAST_INSERT_ID(planet_id);

  INSERT INTO Colonies (user_id, colony_name, planet_id, population, resources_generated, defense_level)
  SELECT user_id, CONCAT(username, "'s Colony"), 1, 100, 'Basic Materials', 1 FROM User
  ON DUPLICATE KEY UPDATE resources_generated = VALUES(resources_generated);
`;

pool.query(SQLSTATEMENT, [hashedPassword1, hashedPassword2], (error, results, fields) => {
  if (error) {
    console.error("Error creating tables and inserting default data:", error.message);
  } else {
    console.log("Tables and initial data inserted successfully:", results);
  }
  process.exit();
});