# Modèle Logique des Données

list(id, name, position)                           types: int, text, int
card(id, title, position, color, #list(id))        types: int, text, int, text
tag(id, name, color)                               types: int, text, text

card_has_tag(#card(id), #tag(id))

# Un petit exemple d'une table d'association

|card|tag|
|---|---|
|1|1|
|1|2|
|2|1|