Ci dessous voici le script SQL pour la table Goals ,  je veux 
que tu enrichisse les données de table avec des UPDATE et des INSERT
pour que la table Goals soit remplie avec des données cohérentes donc 
il faut au moins 5 lignes de données dans la table Goals.

Donne moi le script SQL complet pour la table Goals avec les données enrichies.

Goal_Id|Level_Id|Goal_Name        |Description|Image|Duration|Improvement|Followers|Impact|Streak|
-------+--------+-----------------+-----------+-----+--------+-----------+---------+------+------+
      1|       1|Perte de poids   |           |     |        |           |         |      |      |
      2|       2|Gain musculaire  |           |     |        |           |         |      |      |
      3|       3|Maintien de forme|           |     |        |           |         |      |      |
      4|       4|Endurance cardio |           |     |        |           |         |      |      |
      5|       4|Force maximale   |           |     |        |           |         |      |      |


INSERT INTO Goals (Goal_Id, Level_Id, Goal_Name, Description, Image, Duration, Improvement, Followers, Impact, Streak) VALUES
(1, 1, 'Perte de poids', 'Programme conçu pour perte de poids de manière efficace et durable', 'https://example.com/images/perte_de_poids.jpg', '4 months', '-3.7%', 1500, '-3.7%', '3 months'),
(2, 2, 'Gain musculaire', 'Programme conçu pour gain musculaire de manière efficace et durable', 'https://example.com/images/gain_musculaire.jpg', '4 months', '+2.5%', 2200, '+2.5%', '4 months'),
(3, 3, 'Maintien de forme', 'Programme conçu pour maintien de forme de manière efficace et durable', 'https://example.com/images/maintien_de_forme.jpg', '4 months', '-2.5%', 1800, '-2.5%', '2 months'),
(4, 4, 'Endurance cardio', 'Programme conçu pour endurance cardio de manière efficace et durable', 'https://example.com/images/endurance_cardio.jpg', '4 months', '+15%', 2000, '+15%', '5 months'),
(5, 4, 'Force maximale', 'Programme conçu pour force maximale de manière efficace et durable', 'https://example.com/images/force_maximale.jpg', '4 months', '+25%', 1700, '+25%', '6 months');