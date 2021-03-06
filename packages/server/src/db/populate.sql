INSERT INTO types (id, name)
VALUES
(1, 'Equipment'),
(2, 'Cosmetic'),
(3, 'Consumable'),
(4, 'Misc');

INSERT INTO slots (id, name)
VALUES
(1, 'Head'),
(2, 'Body'),
(3, 'Main Hand'),
(4, 'Off Hand'),
(5, 'Mask'),
(6, 'Outfit'),
(7, 'Clothes Dye'),
(8, 'Hair Dye');

INSERT INTO items (name, description, level, slot, type, consumable, usable_by, strength,
                   intelligence, agility, defense, wisdom, luck, can_sell, sell_price)
VALUES
('Cypress Stick', NULL, 1, 3, 1, false, (true, true, true), 1, 0, 0, 0, 0, 0, true, 1),
('Oaken Club', NULL, 2, 3, 1, false, (true, false, true), 2, 0, 0, 0, 0, 0, true, 2),
('Leather Cap', NULL, 1, 1, 1, false, (true, true, true), 0, 0, 0, 1, 0, 0, true, 1),
('Training Sword', NULL, 4, 3, 1, false, (true, false, false), 5, 0, 0, 0, 0, 0, true, 45),
('Training Wand', NULL, 4, 3, 1, false, (false, true, true), 1, 3, 0, 0, 0, 0, true, 52),
('Leather Armor', NULL, 3, 2, 1, false, (true, false, false), 0, 0, 0, 3, 0, 0, true, 24),
('Padded Garb', NULL, 3, 2, 1, false, (false, false, true), 0, 0, 0, 2, 1, 0, true, 18),
('Tattered Cloak', NULL, 2, 2, 1, false, (false, false, true), 0, 0, 0, 1, 1, 0, true, 12),
('Wooden Shield', NULL, 2, 4, 1, false, (true, false, false), 0, 0, 0, 2, 0, 0, true, 1),
('Simple Bracelet', NULL, 2, 4, 1, false, (false, true, true), 0, 0, 0, 1, 1, 0, true, 1),

('Health Potion', 'Restores 30 HP to an ally.', NULL, NULL, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 3),
('Mana Potion', 'Restores 20 MP to an ally.', NULL, 3, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 7),
('Teleport Scroll', 'Return the party to the last visited town.', NULL, NULL, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 10),

('Pet Rock', 'It literally does nothing.', NULL, NULL, 4, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Sunglasses', 'Deal with it.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Pink Hair Dye', 'Valentine''s Day hair dye.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Princess Crown', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Devil Horns', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Rockstar Hair', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Messy Hair', 'Just the right amount of messy.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1)
;
